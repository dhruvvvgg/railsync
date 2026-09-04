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

DATA_PATH = "/Users/faheem/sih_rail/backend/data/canonical_dataset.json"

def load_canonical_data():
    if not os.path.exists(DATA_PATH):
        raise RuntimeError("Canonical dataset not found! Please run generate_dataset.py first.")
    with open(DATA_PATH, "r") as f:
        return json.load(f)

# Global in-memory audit log
AUDIT_LOGS = []

@app.get("/api/status")
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

@app.get("/api/data/dataset")
def get_dataset():
    return load_canonical_data()

@app.get("/api/gateway/validation")
def get_data_quality_report():
    data = load_canonical_data()
    gateway = DataQualityGateway(data)
    return gateway.validate_all()

@app.get("/api/priority/scored")
def get_scored_defects():
    data = load_canonical_data()
    engine = PriorityAndBundlingEngine(data["defects"], data["corridors"])
    return {
        "total_tasks": len(data["defects"]),
        "scored_tasks": engine.score_and_rank_defects()
    }

@app.get("/api/opportunities")
def get_bundling_opportunities():
    data = load_canonical_data()
    engine = PriorityAndBundlingEngine(data["defects"], data["corridors"])
    opps = engine.detect_lookahead_opportunities()
    return {
        "total_opportunities": len(opps),
        "opportunities": opps
    }

@app.post("/api/optimizer/solve")
def run_optimizer():
    data = load_canonical_data()
    solver = AutomaticBlockPlannerSolver(data)
    results = solver.solve_all_plans()
    return results

class DisruptionPayload(BaseModel):
    incident_type: str = "P0 Emergency Rail Fracture (IMR Defect)"
    corridor_id: str = "COR-001"
    km_location: str = "KM 144.2"

@app.post("/api/disruption/inject")
def inject_emergency_disruption(payload: DisruptionPayload):
    data = load_canonical_data()
    solver = AutomaticBlockPlannerSolver(data)
    result = solver.replan_emergency_disruption({
        "type": payload.incident_type,
        "location": f"{payload.corridor_id} {payload.km_location}"
    })
    
    # Auto-log into audit log
    AUDIT_LOGS.append({
        "timestamp": datetime.now().isoformat(),
        "action": "EMERGENCY_REPLAN",
        "incident": payload.incident_type,
        "location": f"{payload.corridor_id} {payload.km_location}",
        "resolution": result["replan_status"]
    })
    return result

class ApprovalPayload(BaseModel):
    plan_name: str
    approved_by: str = "Section Controller - CNB Division"
    role: str = "Authorized Traffic Controller"
    action: str = "APPROVED"  # APPROVED, OVERRIDDEN, REJECTED
    reason: str = "Complies with night block norms; zero passenger express train detention."

@app.post("/api/plans/approve")
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
    return {
        "status": "RECORDED",
        "approval_record": approval_entry
    }

@app.get("/api/audit/logs")
def get_audit_logs():
    return {
        "total_audit_records": len(AUDIT_LOGS),
        "audit_logs": AUDIT_LOGS
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
