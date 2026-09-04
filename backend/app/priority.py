from typing import List, Dict, Any, Optional
from app.safety_rules import DeterministicSafetyValidator, parse_km

class PriorityAndBundlingEngine:
    def __init__(
        self,
        defects: List[Dict[str, Any]],
        corridors: List[Dict[str, Any]],
        diversion_pairs: Optional[List[Dict[str, Any]]] = None
    ):
        self.defects = defects
        self.corridors = corridors
        self.corridor_map = {c["corridor_id"]: c for c in corridors}
        self.safety_validator = DeterministicSafetyValidator(corridors, diversion_pairs or [])

    def score_and_rank_defects(self) -> List[Dict[str, Any]]:
        scored = []
        for d in self.defects:
            tier = d.get("priority_tier", "P2")
            severity = d.get("severity", "Major")
            is_overdue = (d.get("status") == "overdue")
            recurrence = d.get("recurrence_indicator", False)
            duration = d.get("total_duration_minutes", 120)

            # Base score by tier
            tier_weights = {"P0": 95, "P1": 75, "P2": 50, "P3": 25}
            score = tier_weights.get(tier, 50)

            factors = []
            if tier == "P0":
                factors.append("Immediate safety or operational threat")
            elif tier == "P1":
                factors.append("High-risk or severely overdue task")

            if severity == "Critical":
                score += 10
                factors.append("Severe defect classification")
            elif severity == "Major":
                score += 5

            if is_overdue:
                score += 12
                factors.append("Overdue beyond statutory SLA")

            if recurrence:
                score += 8
                factors.append("Recurrence flag present (historical fatigue)")

            corridor = self.corridor_map.get(d.get("corridor_id"), {})
            cap = corridor.get("capacity_assumption", 5)
            if cap >= 7:
                score += 6
                factors.append("High-traffic trunk corridor")

            final_score = min(100, score)

            explanation = f"{tier} — Priority Score: {final_score}/100. Factors: {', '.join(factors)}."
            item = dict(d)
            item["criticality_score"] = final_score
            item["explanation"] = explanation
            scored.append(item)

        # Sort: P0 first, then highest criticality score, then earliest deadline
        scored.sort(key=lambda x: (
            0 if x["priority_tier"] == "P0" else (1 if x["priority_tier"] == "P1" else (2 if x["priority_tier"] == "P2" else 3)),
            -x["criticality_score"]
        ))
        return scored

    def detect_lookahead_opportunities(self, horizon_days: int = 14) -> List[Dict[str, Any]]:
        """
        Detects multi-department bundling opportunities using spatial proximity clustering
        (KM delta <= 15 km) and deterministic safety rule validation.
        """
        # Group tasks by corridor
        by_corridor: Dict[str, List[Dict[str, Any]]] = {}
        for d in self.defects:
            cid = d.get("corridor_id", "COR-001")
            by_corridor.setdefault(cid, []).append(d)

        opportunities = []
        opp_counter = 1

        for cid, tasks in by_corridor.items():
            corridor_info = self.corridor_map.get(cid, {})

            # Filter tasks with parseable KM
            tasks_with_km = []
            for t in tasks:
                km = parse_km(t.get("km_location"))
                if km is not None:
                    tasks_with_km.append((km, t))

            # Sort spatially along track
            tasks_with_km.sort(key=lambda x: x[0])

            # Cluster tasks along corridor within 15 km sliding windows
            clusters: List[List[Dict[str, Any]]] = []
            current_cluster: List[Dict[str, Any]] = []

            for km, task in tasks_with_km:
                if not current_cluster:
                    current_cluster.append(task)
                else:
                    cluster_kms = [parse_km(ct.get("km_location")) for ct in current_cluster]
                    if max(cluster_kms) - km <= 15.0 and km - min(cluster_kms) <= 15.0:
                        current_cluster.append(task)
                    else:
                        if len(current_cluster) >= 2:
                            clusters.append(current_cluster)
                        current_cluster = [task]

            if len(current_cluster) >= 2:
                clusters.append(current_cluster)

            # Evaluate each cluster
            for cluster in clusters:
                depts = sorted(list({t.get("owning_department") for t in cluster if t.get("owning_department")}))
                if len(depts) >= 2:
                    # Validate deterministic safety rules
                    is_safe, safety_msg = self.safety_validator.validate_bundle_compatibility(cluster)
                    if is_safe:
                        kms = [parse_km(t.get("km_location")) for t in cluster if parse_km(t.get("km_location")) is not None]
                        min_km = min(kms) if kms else 0.0
                        max_km = max(kms) if kms else 0.0
                        max_duration = max(t.get("total_duration_minutes", 120) for t in cluster)
                        # Add 30 min safety / handback / testing buffer
                        bundled_window_mins = max_duration + 30

                        opp = {
                            "opportunity_id": f"OPP-{cid}-{opp_counter:02d}",
                            "corridor_id": cid,
                            "section_name": f"{corridor_info.get('start_station', '')} ➔ {corridor_info.get('end_station', '')}",
                            "km_span": f"KM {min_km:.1f} - KM {max_km:.1f}",
                            "departments": depts,
                            "tasks_count": len(cluster),
                            "bundled_task_ids": [t["defect_id"] for t in cluster],
                            "tasks": cluster,
                            "estimated_shared_window_hours": round(bundled_window_mins / 60.0, 2),
                            "blocks_avoided": len(cluster) - 1,
                            "recommended_window": corridor_info.get("permitted_block_patterns", "Night window 01:00-04:30"),
                            "safety_feasibility": safety_msg,
                            "summary": (
                                f"Coordinated Look-Ahead Bundle: Merges {len(cluster)} tasks across {len(depts)} departments "
                                f"({', '.join(depts)}) between KM {min_km:.1f} and KM {max_km:.1f} on {cid}. "
                                f"Avoids {len(cluster) - 1} separate corridor possessions under unified 25 kV AC isolation."
                            )
                        }
                        opportunities.append(opp)
                        opp_counter += 1

        return opportunities
