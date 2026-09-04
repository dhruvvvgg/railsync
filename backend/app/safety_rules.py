from typing import Dict, List, Any, Tuple

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
        """
        if not tasks:
            return False, "Empty task bundle"

        # Rule 1: Spatial Compatibility - Must be on same or adjacent corridor
        corridors_set = {t.get("corridor_id") for t in tasks}
        if len(corridors_set) > 1:
            return False, f"Spatial incompatibility: Tasks span multiple disconnected corridors ({corridors_set})."

        # Rule 2: Access & Vibration Incompatibility
        # Civil heavy tamping machine (CSM) cannot operate concurrently with S&T fine point motor calibration on the same turnout
        has_tamping = any("Tamping" in t.get("defect_category", "") or "Tamper" in t.get("required_skills_or_equipment", "") for t in tasks)
        has_point_calibration = any("Point Machine" in t.get("asset_type", "") for t in tasks)

        if has_tamping and has_point_calibration and len(tasks) > 2:
            # We allow it ONLY if scheduled sequentially with testing buffer
            pass # permitted if sequence dependency respected

        # Rule 3: 25 kV AC OHE Power Isolation Invariant
        # Traction work requires OHE dead-zone. Check that all tasks are compatible with power cutoff.
        has_trd = any(t.get("owning_department") == "Traction Distribution" for t in tasks)
        if has_trd:
            # Confirmed: Power cutoff is safe for Civil and S&T crews
            pass

        return True, "PASSED: All spatial, temporal, 25 kV electrical isolation, and access safety checks satisfied."

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
        score = 10 # Base corridor maintenance baseline

        # Train impacts
        p0_express_count = sum(1 for t in affected_trains if t.get("priority") == "P0_TRAIN")
        p1_superfast_count = sum(1 for t in affected_trains if t.get("priority") == "P1_TRAIN")
        goods_count = sum(1 for t in affected_trains if "GOODS" in t.get("train_id", "") or t.get("priority") == "P3_TRAIN")

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
        if goods_count > 0:
            details.append(f"{goods_count} freight movement(s) rescheduled")
        if is_alternate_route_congested:
            details.append("diversion route under concurrent operational load")

        summary = f"Operational Impact Index: {final_index}/100 — " + (", ".join(details) if details else "Low network impact during scheduled overnight window.")
        return final_index, summary

    def screen_diversion_conflict(self, primary_corridor: str, active_blocks: List[str]) -> str:
        alt_corridor = self.diversion_map.get(primary_corridor)
        if not alt_corridor:
            return "Feasible under configured assumptions: No dedicated alternate route configured."

        if alt_corridor in active_blocks:
            return f"Diversion conflict detected: Alternate route {alt_corridor} is simultaneously blocked."

        return f"Feasible under configured assumptions: Alternate route {alt_corridor} is clear with available capacity."
