import re
from typing import Dict, List, Any, Tuple, Optional

def parse_km(km_val: Any) -> Optional[float]:
    if km_val is None:
        return None
    if isinstance(km_val, (int, float)):
        return float(km_val)
    match = re.search(r"(\d+(?:\.\d+)?)", str(km_val))
    return float(match.group(1)) if match else None

class DeterministicSafetyValidator:
    def __init__(self, corridors: List[Dict[str, Any]], diversion_pairs: List[Dict[str, Any]]):
        self.corridor_map = {c["corridor_id"]: c for c in corridors}
        self.diversion_map = {}
        for dp in diversion_pairs:
            self.diversion_map[dp["primary_corridor"]] = dp["alternate_corridor"]

    def validate_bundle_compatibility(self, tasks: List[Dict[str, Any]]) -> Tuple[bool, str]:
        """
        Deterministic Hard Rules for multi-department bundling.
        Never delegates safety permissions to machine learning.
        Strictly adheres to Indian Railways General & Subsidiary Rules (G&SR).
        """
        if not tasks:
            return False, "Empty task bundle: At least one maintenance task is required."

        # Rule 1: Spatial Compatibility & Worksite Protection Limit (Max 15 km)
        corridors_set = {t.get("corridor_id") for t in tasks if t.get("corridor_id")}
        if len(corridors_set) > 1:
            return False, f"Spatial incompatibility: Tasks span multiple disconnected corridors ({sorted(list(corridors_set))})."

        km_positions = [parse_km(t.get("km_location")) for t in tasks]
        valid_kms = [km for km in km_positions if km is not None]
        if len(valid_kms) >= 2:
            span = max(valid_kms) - min(valid_kms)
            if span > 15.0:
                return False, f"Spatial incompatibility: Task cluster spans {span:.1f} km (exceeds maximum 15.0 km single worksite protection limit under Section Controller jurisdiction)."

        # Rule 2: Access & Vibration Incompatibility (Tamping vs Point Calibration)
        # CSM heavy continuous tamping creates ballast vibration that damages/decalibrates
        # delicate S&T point machine stroke motors (143mm) if conducted concurrently on the same turnout.
        tamping_tasks = [
            t for t in tasks
            if "Tamping" in t.get("defect_category", "")
            or "Tamper" in t.get("required_skills_or_equipment", "")
            or "CSM" in t.get("required_skills_or_equipment", "")
        ]
        point_tasks = [
            t for t in tasks
            if "Point Machine" in t.get("asset_type", "")
            or "Point Switch" in t.get("asset_type", "")
            or "Turnout" in t.get("asset_type", "")
        ]

        if tamping_tasks and point_tasks:
            # Check proximity of tamping to point machine
            tamp_kms = [parse_km(t.get("km_location")) for t in tamping_tasks if parse_km(t.get("km_location")) is not None]
            point_kms = [parse_km(t.get("km_location")) for t in point_tasks if parse_km(t.get("km_location")) is not None]
            
            for tk in tamp_kms:
                for pk in point_kms:
                    if abs(tk - pk) <= 1.0:
                        return False, (
                            f"Vibration & Access Conflict: Heavy continuous tamping (KM {tk:.1f}) and S&T point machine calibration "
                            f"(KM {pk:.1f}) are within 1.0 km. Concurrent execution risks decalibration. "
                            f"Must be scheduled sequentially with mandatory 30-min ballast consolidation buffer."
                        )

        # Rule 3: 25 kV AC OHE Power Isolation & Safety Earthing Invariant
        # Traction work requires 25 kV de-energization (TPC Power Block).
        has_trd = any(t.get("owning_department") == "Traction Distribution" for t in tasks)
        if has_trd:
            # Civil or S&T tasks that require electric locomotive movement are prohibited
            for t in tasks:
                req_eq = t.get("required_skills_or_equipment", "")
                if "Electric Locomotive" in req_eq or "EMU" in req_eq:
                    return False, (
                        f"Traction Power Conflict: Task {t.get('defect_id')} requires electric traction, "
                        f"which is incompatible with concurrent 25 kV OHE power block."
                    )

        min_km_str = f"KM {min(valid_kms):.1f}" if valid_kms else "corridor limits"
        max_km_str = f"KM {max(valid_kms):.1f}" if valid_kms else "corridor limits"
        return True, (
            f"PASSED: All physical spacing ({min_km_str} - {max_km_str}), 25 kV AC traction isolation, "
            f"and ballast vibration safety checks fully satisfied."
        )

    def calculate_operational_impact_index(
        self,
        corridor_id: str,
        affected_trains: List[Dict[str, Any]],
        duration_hours: float,
        is_alternate_route_congested: bool
    ) -> Tuple[int, str]:
        """
        Calculates a transparent 0-100 planning score based on operational variables.
        """
        score = 10  # Base corridor maintenance baseline

        # Train impacts
        p0_express_count = sum(1 for t in affected_trains if t.get("priority") in ["P0_TRAIN", "P0 Premium", "P0"])
        p1_superfast_count = sum(1 for t in affected_trains if t.get("priority") in ["P1_TRAIN", "P1 Superfast", "P1"])
        goods_count = sum(1 for t in affected_trains if "GOODS" in t.get("train_id", "") or t.get("priority") in ["P3_TRAIN", "Goods Rake", "P3"])

        score += p0_express_count * 25
        score += p1_superfast_count * 12
        score += goods_count * 4

        # Duration impact
        if duration_hours > 3.5:
            score += 15
        elif duration_hours > 2.5:
            score += 8

        # Diversion / Alternate Route Penalty
        if is_alternate_route_congested:
            score += 20

        final_index = min(100, score)

        details = []
        if p0_express_count > 0:
            details.append(f"{p0_express_count} premium passenger express train path(s) affected")
        if p1_superfast_count > 0:
            details.append(f"{p1_superfast_count} superfast passenger train(s) regulated")
        if goods_count > 0:
            details.append(f"{goods_count} freight movement(s) rescheduled")
        if is_alternate_route_congested:
            details.append("diversion route under concurrent operational load")

        summary = f"Operational Impact Index: {final_index}/100 — " + (", ".join(details) if details else "Low network impact during scheduled overnight window.")
        return final_index, summary

    def screen_diversion_conflict(self, primary_corridor: str, active_blocks: List[str]) -> Tuple[bool, str]:
        alt_corridor = self.diversion_map.get(primary_corridor)
        if not alt_corridor:
            return True, "Feasible: No dedicated alternate diversion route configured."

        if alt_corridor in active_blocks:
            return False, f"CRITICAL DIVERSION CONFLICT: Alternate route {alt_corridor} is simultaneously blocked! Total corridor closure prohibited."

        return True, f"Feasible: Alternate diversion route {alt_corridor} is clear with available throughput capacity."
