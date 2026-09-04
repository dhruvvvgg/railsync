from datetime import datetime, timedelta
from typing import Dict, List, Any

class DataQualityGateway:
    def __init__(self, raw_data: Dict[str, Any]):
        self.raw_data = raw_data
        self.validation_report = {
            "total_records_screened": 0,
            "valid_records": 0,
            "anomalies_detected": 0,
            "issues": [],
            "source_system_health": {
                "TMS": {"total": 0, "issues": 0},
                "TDMS": {"total": 0, "issues": 0},
                "SMMS": {"total": 0, "issues": 0},
                "FOIS": {"total": 0, "issues": 0},
                "BDMS-COA": {"total": 0, "issues": 0}
            }
        }

    def validate_all(self) -> Dict[str, Any]:
        defects = self.raw_data.get("defects", [])
        assets = self.raw_data.get("assets", [])
        resources = self.raw_data.get("resources", [])
        
        seen_assets = {}
        valid_defects = []
        flagged_defects = []

        now = datetime(2026, 9, 10, 0, 0, 0)

        # 1. Screen Defects / Maintenance Tasks
        for d in defects:
            sys = d.get("source_system", "TMS")
            if sys in self.validation_report["source_system_health"]:
                self.validation_report["source_system_health"][sys]["total"] += 1
            self.validation_report["total_records_screened"] += 1

            reasons = []

            # Check for duplicate requests
            asset_id = d.get("asset_id")
            if asset_id in seen_assets:
                reasons.append(f"Duplicate task detected for asset {asset_id}. Matches previous defect {seen_assets[asset_id]}.")
            else:
                seen_assets[asset_id] = d.get("defect_id")

            # Check missing location
            if not d.get("km_location"):
                reasons.append("Missing mandatory field: 'km_location' is null.")

            # Check missing deadline
            if not d.get("deadline"):
                reasons.append("Missing mandatory field: 'deadline' SLA is missing.")

            # Check inconsistent severity
            if d.get("severity") not in ["Critical", "Major", "Minor"]:
                reasons.append(f"Inconsistent severity label '{d.get('severity')}'. Canonical values: Critical, Major, Minor.")

            # Check stale timestamp
            source_ts = d.get("source_timestamp") or d.get("ingested_at")
            if source_ts:
                try:
                    dt = datetime.fromisoformat(source_ts)
                    if (now - dt).days > 30:
                        reasons.append(f"Stale record: Last updated {(now - dt).days} days ago (>30 day threshold).")
                except Exception:
                    pass

            # Check infeasible duration
            if d.get("total_duration_minutes", 0) > 300:
                reasons.append(f"Infeasible task duration: Requires {d.get('total_duration_minutes')} mins, exceeding max standard block window (240 mins).")

            if reasons:
                self.validation_report["anomalies_detected"] += 1
                if sys in self.validation_report["source_system_health"]:
                    self.validation_report["source_system_health"][sys]["issues"] += 1
                
                issue_entry = {
                    "record_id": d.get("defect_id"),
                    "source_system": sys,
                    "entity_type": "DefectTask",
                    "status": "FLAGGED_FOR_REVIEW",
                    "reasons": reasons,
                    "recommended_action": "Review source feed before final approval; can be scheduled as DRAFT only."
                }
                self.validation_report["issues"].append(issue_entry)
                flagged_defects.append(d)
            else:
                self.validation_report["valid_records"] += 1
                valid_defects.append(d)

        # 2. Screen Assets for Conflicting Identifiers
        for a in assets:
            self.validation_report["total_records_screened"] += 1
            if "/" in a.get("source_ids", ""):
                self.validation_report["anomalies_detected"] += 1
                self.validation_report["issues"].append({
                    "record_id": a.get("asset_id"),
                    "source_system": a.get("source_system"),
                    "entity_type": "Asset",
                    "status": "CONFLICTING_ID",
                    "reasons": [f"Conflicting legacy source IDs across departments: {a.get('source_ids')}"],
                    "recommended_action": "Verify single source of truth in CRIS canonical master."
                })
            else:
                self.validation_report["valid_records"] += 1

        # 3. Screen Resources for Availability
        for r in resources:
            self.validation_report["total_records_screened"] += 1
            if r.get("current_maintenance_state") != "available":
                self.validation_report["anomalies_detected"] += 1
                self.validation_report["issues"].append({
                    "record_id": r.get("resource_id"),
                    "source_system": r.get("source_system"),
                    "entity_type": "Resource",
                    "status": "UNAVAILABLE_MACHINE",
                    "reasons": [f"Resource {r.get('resource_name')} is currently '{r.get('current_maintenance_state')}'."],
                    "recommended_action": "Do not assign to critical path; allocate alternative work gang or machine."
                })
            else:
                self.validation_report["valid_records"] += 1

        return {
            "summary": self.validation_report,
            "clean_defects_count": len(valid_defects),
            "flagged_defects_count": len(flagged_defects),
            "clean_defects": valid_defects,
            "flagged_defects": flagged_defects
        }
