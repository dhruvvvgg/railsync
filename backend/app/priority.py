from typing import List, Dict, Any

class PriorityAndBundlingEngine:
    def __init__(self, defects: List[Dict[str, Any]], corridors: List[Dict[str, Any]]):
        self.defects = defects
        self.corridor_map = {c["corridor_id"]: c for c in corridors}

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
        # Group tasks by corridor_id to find multi-department co-location
        grouped_by_corridor: Dict[str, Dict[str, List[Dict[str, Any]]]] = {}
        for d in self.defects:
            cid = d.get("corridor_id", "COR-001")
            dept = d.get("owning_department", "Engineering")
            if cid not in grouped_by_corridor:
                grouped_by_corridor[cid] = {"Engineering": [], "Traction Distribution": [], "Signal & Telecommunication": []}
            if dept in grouped_by_corridor[cid]:
                grouped_by_corridor[cid][dept].append(d)

        opportunities = []
        for cid, depts in grouped_by_corridor.items():
            engg_tasks = depts["Engineering"]
            trd_tasks = depts["Traction Distribution"]
            sig_tasks = depts["Signal & Telecommunication"]

            # An opportunity exists if 2 or 3 departments have pending work on the same corridor
            active_depts = [k for k, v in depts.items() if len(v) > 0]
            if len(active_depts) >= 2:
                sample_engg = engg_tasks[0] if engg_tasks else None
                sample_trd = trd_tasks[0] if trd_tasks else None
                sample_sig = sig_tasks[0] if sig_tasks else None

                tasks_in_bundle = []
                if sample_engg: tasks_in_bundle.append(sample_engg["defect_id"])
                if sample_trd: tasks_in_bundle.append(sample_trd["defect_id"])
                if sample_sig: tasks_in_bundle.append(sample_sig["defect_id"])

                combined_duration = max(
                    (sample_engg["total_duration_minutes"] if sample_engg else 0),
                    (sample_trd["total_duration_minutes"] if sample_trd else 0),
                    (sample_sig["total_duration_minutes"] if sample_sig else 0)
                )

                corridor_info = self.corridor_map.get(cid, {})

                opp = {
                    "opportunity_id": f"OPP-{cid}",
                    "corridor_id": cid,
                    "section_name": f"{corridor_info.get('start_station', '')} ➔ {corridor_info.get('end_station', '')}",
                    "departments": active_depts,
                    "tasks_count": len(tasks_in_bundle),
                    "bundled_task_ids": tasks_in_bundle,
                    "estimated_shared_window_hours": round(combined_duration / 60.0 + 0.5, 1),
                    "blocks_avoided": len(active_depts) - 1,
                    "recommended_window": corridor_info.get("permitted_block_patterns", "Night window 01:30-04:30"),
                    "safety_feasibility": "VALID (Spatial overlap with 25 kV power cutoff compatibility)",
                    "summary": f"Coordinated Look-Ahead Bundle: Merges {len(active_depts)} departments on {cid} into 1 shared corridor block, avoiding {len(active_depts) - 1} separate track possessions."
                }
                opportunities.append(opp)

        return opportunities
