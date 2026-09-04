from typing import List, Dict, Optional, Any
from pydantic import BaseModel, Field

class AuditFields(BaseModel):
    source_system: str
    source_record_id: str
    ingested_at: str
    last_updated_at: str
    schema_version: str = "1.0"
    data_quality_status: str = "VALID"
    mapping_confidence: float = 1.0

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
    resource_type: str
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
    source_timestamp: str

class TrainSchedule(BaseModel):
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
    line: str
    start_time: str
    end_time: str
    duration_hours: float
    bundled_tasks: List[str]
    departments_involved: List[str]
    isolation_required: bool
    isolation_type: Optional[str] = None
    affected_trains_count: int
    operational_impact_score: int
    explainability_notes: str

class CandidatePlan(BaseModel):
    plan_name: str
    primary_objective: str
    total_blocks: int
    bundled_blocks: int
    tasks_scheduled: int
    unscheduled_tasks: int
    total_block_hours: float
    average_operational_impact: float
    passenger_trains_delayed: int
    freight_trains_delayed: int
    candidate_blocks: List[CandidateBlock]
    trade_off_summary: str

class ApprovalRecord(BaseModel):
    approval_id: str
    plan_name: str
    approved_by: str
    role: str
    timestamp: str
    action: str  # APPROVED, OVERRIDDEN, REJECTED
    reason: str
    version: str = "v1.0"
