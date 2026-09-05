from typing import List, Dict, Optional, Any
from pydantic import BaseModel, Field

class AuditFields(BaseModel):
    source_system: Optional[str] = "TMS"
    source_record_id: Optional[str] = None
    ingested_at: Optional[str] = None
    last_updated_at: Optional[str] = None
    schema_version: Optional[str] = "1.0"
    data_quality_status: Optional[str] = "VALID"
    mapping_confidence: Optional[float] = 1.0

class Corridor(BaseModel):
    corridor_id: str
    start_station: str
    end_station: str
    line_type: str
    direction: str
    capacity_assumption: int
    adjacent_corridors: List[str]
    permitted_block_patterns: str

class DiversionPair(BaseModel):
    primary_corridor: str
    alternate_corridor: str
    capacity_penalty_pct: int

class Asset(AuditFields):
    asset_id: str
    source_ids: str
    type: str
    owning_department: str
    corridor_id: str
    km_location: Optional[str] = None
    line: str
    direction: str
    criticality: str

class Resource(AuditFields):
    resource_id: str
    resource_name: str
    department: str
    resource_type: Optional[str] = None
    skill_or_equipment_type: str
    base_location: str
    travel_time_to_corridor: Dict[str, int]
    availability_window: str
    setup_time_minutes: int
    removal_time_minutes: int
    current_maintenance_state: str

class DefectTask(AuditFields):
    defect_id: str
    asset_id: str
    asset_type: str
    owning_department: str
    corridor_id: str
    km_location: Optional[str] = None
    defect_category: str
    severity: str
    priority_tier: str
    reported_date: str
    deadline: Optional[str] = None
    recurrence_indicator: bool
    status: str
    preparation_time_minutes: int
    work_time_minutes: int
    testing_time_minutes: int
    clearance_time_minutes: int
    total_duration_minutes: int
    required_skills_or_equipment: str
    criticality_score: Optional[int] = None
    explanation: Optional[str] = None

class BlockWindow(AuditFields):
    block_id: str
    corridor_id: str
    line: str
    direction: str
    start_datetime: str
    end_datetime: str
    duration_hours: float
    block_type: str
    reservation_status: str
    source_timestamp: Optional[str] = None

class TrainSchedule(BaseModel):
    model_config = {"populate_by_name": True}
    train_id: str
    train_name: str
    class_: str = Field(alias="class")
    priority: str
    route: List[str]
    departure_time: str
    arrival_time: str
    speed_kmh: int

class CandidateBlock(BaseModel):
    block_id: str
    corridor_id: str
    section: Optional[str] = None
    km_span: Optional[str] = None
    line: Optional[str] = None
    start_time: str
    end_time: str
    start_minutes: Optional[int] = None
    end_minutes: Optional[int] = None
    duration_hours: float
    bundled_tasks: Optional[List[str]] = None
    task_id: Optional[str] = None
    department: Optional[str] = None
    departments_involved: Optional[List[str]] = None
    isolation_required: Optional[bool] = None
    isolation_type: Optional[str] = None
    resource_constrained: Optional[bool] = None
    resource_status: Optional[str] = None
    resource_diagnostics: Optional[str] = None
    allocated_resources: Optional[List[str]] = None
    affected_trains_count: Optional[int] = None
    passenger_trains_delayed: Optional[int] = None
    freight_trains_delayed: Optional[int] = None
    operational_impact_score: Optional[float] = None
    explainability_notes: Optional[str] = None
    bundled: Optional[bool] = None

class CandidatePlan(BaseModel):
    plan_name: str
    primary_objective: str
    solver_status: Optional[str] = None
    total_candidate_blocks: Optional[int] = None
    total_separate_blocks: Optional[int] = None
    bundled_blocks_ratio: Optional[str] = None
    bundled_blocks: Optional[int] = None
    tasks_scheduled: Optional[int] = None
    unscheduled_tasks: Optional[int] = None
    total_block_hours: float
    average_operational_impact: float
    passenger_trains_delayed: int
    freight_trains_delayed: int
    candidate_blocks: List[CandidateBlock]
    trade_off_summary: Optional[str] = None
    summary: Optional[str] = None

class ApprovalRecord(BaseModel):
    approval_id: str
    plan_name: str
    approved_by: str
    role: str
    timestamp: str
    action: str  # APPROVED, OVERRIDDEN, REJECTED
    reason: str
    version: Optional[str] = "v1.0"
    authority_disclaimer: Optional[str] = None

class LookAheadOpportunity(BaseModel):
    opportunity_id: str
    corridor_id: str
    section_name: str
    km_span: Optional[str] = None
    departments: List[str]
    tasks_count: int
    bundled_task_ids: List[str]
    tasks: Optional[List[Dict[str, Any]]] = None
    estimated_shared_window_hours: float
    blocks_avoided: int
    recommended_window: str
    safety_feasibility: str
    summary: str

# API Response Models
class SystemStatusResponse(BaseModel):
    status: str
    system: str
    tagline: str
    section: str
    statistics: Dict[str, Any]
    timestamp: str

class CanonicalDatasetResponse(BaseModel):
    metadata: Dict[str, Any]
    corridors: List[Corridor]
    diversion_pairs: List[DiversionPair]
    assets: List[Asset]
    resources: List[Resource]
    defects: List[DefectTask]
    block_windows: List[BlockWindow]
    goods_forecasts: List[Dict[str, Any]]
    isolations: List[Dict[str, Any]]
    train_schedules: List[TrainSchedule]
    dirty_audit_log: List[Dict[str, Any]]

class DataQualitySummary(BaseModel):
    total_records_screened: int
    valid_records: int
    anomalies_detected: int
    issues: List[Dict[str, Any]]
    source_system_health: Dict[str, Dict[str, int]]

class DataQualityValidationResponse(BaseModel):
    summary: DataQualitySummary
    clean_defects_count: int
    flagged_defects_count: int
    clean_defects: List[Dict[str, Any]]
    flagged_defects: List[Dict[str, Any]]

class ScoredDefectsResponse(BaseModel):
    total_tasks: int
    quarantined_tasks_count: int
    scored_tasks: List[DefectTask]

class OpportunitiesResponse(BaseModel):
    total_opportunities: int
    opportunities: List[LookAheadOpportunity]

class OptimizerSolveResponse(BaseModel):
    solver_engine: str
    solve_runtime_seconds: float
    status: str
    data_quality_screening: Dict[str, Any]
    candidate_plans: Dict[str, CandidatePlan]
    lookahead_opportunities_count: Optional[int] = None
    lookahead_opportunities: Optional[List[LookAheadOpportunity]] = None
    train_schedules: Optional[List[TrainSchedule]] = None

class EmergencyReplanResponse(BaseModel):
    incident_type: str
    location: str
    replan_status: str
    solver_latency_seconds: float
    operational_impact: Dict[str, Any]
    audit_trail: str

class ApprovalActionResponse(BaseModel):
    status: str
    approval_record: Dict[str, Any]

class AuditLogsResponse(BaseModel):
    total_audit_records: int
    audit_logs: List[Dict[str, Any]]
