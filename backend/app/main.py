import json
import os
from datetime import datetime
from typing import Dict, List, Any
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from app.gateway import DataQualityGateway
from app.priority import PriorityAndBundlingEngine
from app.safety_rules import DeterministicSafetyValidator
from app.solver import AutomaticBlockPlannerSolver
from app.models import (
    SystemStatusResponse,
    CanonicalDatasetResponse,
    DataQualityValidationResponse,
    ScoredDefectsResponse,
    OpportunitiesResponse,
    OptimizerSolveResponse,
    EmergencyReplanResponse,
    ApprovalActionResponse,
    AuditLogsResponse,
)

app = FastAPI(
    title="RAILSYNC-ABP Backend API",
    description="Explainable AI-Assisted Automatic Block Planning for Coordinated Railway Maintenance",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_PATH = os.path.join(BASE_DIR, "data", "canonical_dataset.json")
AUDIT_LOG_PATH = os.path.join(BASE_DIR, "data", "audit_log.json")

def load_canonical_data():
    if not os.path.exists(DATA_PATH):
        raise RuntimeError("Canonical dataset not found! Please run generate_dataset.py first.")
    with open(DATA_PATH, "r") as f:
        return json.load(f)

# Persistent audit log handling
def load_persisted_audit_logs() -> List[Dict[str, Any]]:
    if os.path.exists(AUDIT_LOG_PATH):
        try:
            with open(AUDIT_LOG_PATH, "r") as f:
                data = json.load(f)
                if isinstance(data, list):
                    return data
        except Exception:
            pass
    return []

def persist_audit_logs():
    try:
        os.makedirs(os.path.dirname(AUDIT_LOG_PATH), exist_ok=True)
        with open(AUDIT_LOG_PATH, "w") as f:
            json.dump(AUDIT_LOGS, f, indent=2)
    except Exception as e:
        print(f"Warning: Failed to persist audit logs: {e}")

AUDIT_LOGS: List[Dict[str, Any]] = load_persisted_audit_logs()

@app.get("/api/status", response_model=SystemStatusResponse)
def get_system_status():
    data = load_canonical_data()
    return {
        "status": "OPERATIONAL",
        "system": "RAILSYNC-ABP v1.0",
        "tagline": "One corridor. One coordinated plan. Maximum maintenance with minimum disruption.",
        "section": data["metadata"]["section"],
        "statistics": data["metadata"],
        "timestamp": datetime.now().isoformat()
    }

@app.get("/api/data/dataset", response_model=CanonicalDatasetResponse)
def get_dataset():
    return load_canonical_data()

@app.get("/api/gateway/validation", response_model=DataQualityValidationResponse)
def get_data_quality_report():
    data = load_canonical_data()
    gateway = DataQualityGateway(data)
    return gateway.validate_all()

@app.get("/api/priority/scored", response_model=ScoredDefectsResponse)
def get_scored_defects():
    data = load_canonical_data()
    gateway = DataQualityGateway(data)
    clean_data = gateway.get_sanitized_dataset()
    engine = PriorityAndBundlingEngine(clean_data["defects"], clean_data["corridors"], clean_data.get("diversion_pairs", []), clean_data.get("assets", []))
    return {
        "total_tasks": len(clean_data["defects"]),
        "quarantined_tasks_count": len(clean_data.get("quarantined_defects", [])),
        "scored_tasks": engine.score_and_rank_defects()
    }

@app.get("/api/opportunities", response_model=OpportunitiesResponse)
def get_bundling_opportunities():
    data = load_canonical_data()
    gateway = DataQualityGateway(data)
    clean_data = gateway.get_sanitized_dataset()
    engine = PriorityAndBundlingEngine(clean_data["defects"], clean_data["corridors"], clean_data.get("diversion_pairs", []), clean_data.get("assets", []))
    opps = engine.detect_lookahead_opportunities()
    return {
        "total_opportunities": len(opps),
        "opportunities": opps
    }

@app.post("/api/optimizer/solve", response_model=OptimizerSolveResponse)
def run_optimizer():
    data = load_canonical_data()
    solver = AutomaticBlockPlannerSolver(data)
    results = solver.solve_all_plans()
    return results

class DisruptionPayload(BaseModel):
    incident_type: str = "P0 Emergency Rail Fracture (IMR Defect)"
    corridor_id: str = "COR-001"
    km_location: str = "KM 144.2"

@app.post("/api/disruption/inject", response_model=EmergencyReplanResponse)
def inject_emergency_disruption(payload: DisruptionPayload):
    data = load_canonical_data()
    solver = AutomaticBlockPlannerSolver(data)
    result = solver.replan_emergency_disruption({
        "type": payload.incident_type,
        "location": f"{payload.corridor_id} {payload.km_location}"
    })
    
    # Auto-log into audit log and persist to disk
    AUDIT_LOGS.append({
        "timestamp": datetime.now().isoformat(),
        "action": "EMERGENCY_REPLAN",
        "incident": payload.incident_type,
        "location": f"{payload.corridor_id} {payload.km_location}",
        "resolution": result["replan_status"]
    })
    persist_audit_logs()
    return result

class ApprovalPayload(BaseModel):
    plan_name: str
    approved_by: str = "Section Controller - CNB Division"
    role: str = "Authorized Traffic Controller"
    action: str = "APPROVED"  # APPROVED, OVERRIDDEN, REJECTED
    reason: str = "Complies with night block norms; zero passenger express train detention."

@app.post("/api/plans/approve", response_model=ApprovalActionResponse)
def approve_candidate_plan(payload: ApprovalPayload):
    approval_entry = {
        "approval_id": f"AUTH-REC-{len(AUDIT_LOGS) + 101}",
        "plan_name": payload.plan_name,
        "approved_by": payload.approved_by,
        "role": payload.role,
        "timestamp": datetime.now().isoformat(),
        "action": payload.action,
        "reason": payload.reason,
        "authority_disclaimer": "Recorded under Indian Railways General & Subsidiary Rules. Does not replace physical track handback / line fitness memo."
    }
    AUDIT_LOGS.append(approval_entry)
    persist_audit_logs()
    return {
        "status": "RECORDED",
        "approval_record": approval_entry
    }

@app.get("/api/audit/logs", response_model=AuditLogsResponse)
def get_audit_logs():
    return {
        "total_audit_records": len(AUDIT_LOGS),
        "audit_logs": AUDIT_LOGS
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
