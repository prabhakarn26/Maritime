# SIH26138 — Screen Connectivity & Application Flow

## 1. Overview

The 16 screens of the Maritime Optimizer platform are not independent pages. They are different interfaces connected to the same backend services, databases, ML models, optimization engine, real-time event system, and external data sources.

The platform follows this overall flow:

```text
External Data Sources
        ↓
Data Integration
        ↓
Validation & Storage
        ↓
ML / Prediction
        ↓
Baseline & Optimization
        ↓
Real-Time Event Processing
        ↓
API / WebSocket
        ↓
Frontend Screens
        ↓
Operator Decisions
        ↓
New Data / Events
        ↓
Re-optimization
```

The goal is to make the entire application behave as **one connected decision-support platform**, rather than a collection of independent dashboard pages.

---

# 2. Complete Screen Map

```text
                              ┌─────────────────┐
                              │   1. LOGIN      │
                              └────────┬────────┘
                                       ↓
                              ┌─────────────────┐
                              │ 2. FLEET        │
                              │    OVERVIEW     │
                              └────────┬────────┘
                                       │
             ┌─────────────────────────┼─────────────────────────┐
             ↓                         ↓                         ↓
     ┌───────────────┐         ┌───────────────┐        ┌───────────────┐
     │ 3. VESSEL     │         │ 4. VOYAGES    │        │ 8. ALERTS     │
     │    DETAILS    │         │    & CARGO    │        │               │
     └───────┬───────┘         └───────┬───────┘        └───────┬───────┘
             ↓                         ↓                         │
     ┌───────────────┐         ┌───────────────┐                 │
     │ 12. VESSEL    │         │ 5. OPTIMIZATION│◄────────────────┘
     │ LIVE TELEMETRY│         │    STUDIO      │
     └───────┬───────┘         └───────┬────────┘
             │                         ↓
             │                 ┌───────────────┐
             └────────────────►│ 6. OPTIMIZATION│
                               │    RESULTS     │
                               └───────┬────────┘
                                       │
                 ┌─────────────────────┼─────────────────────┐
                 ↓                     ↓                     ↓
         ┌───────────────┐     ┌───────────────┐     ┌───────────────┐
         │ 7. SCENARIO   │     │ 15. OPTIMIZATION│    │ 9. REPORTS &  │
         │   SIMULATOR   │     │    HISTORY     │     │   ANALYTICS   │
         └───────┬───────┘     └───────────────┘     └───────────────┘
                 │
                 ↓
           RE-OPTIMIZATION


Supporting / Administration Screens:

10. Settings
11. Live Data & Integrations
13. Maintenance & Predictive Maintenance
14. User Management
16. System Health & Monitoring
```

---

# 3. Screen 1 — Login

### Purpose

Authenticate the user before accessing the platform.

### Flow

```text
Login Screen
     ↓
Authentication API
     ↓
JWT / Session
     ↓
Role & Permission Check
     ↓
Fleet Overview
```

The authenticated user's role determines which modules and actions they can access.

---

# 4. Screen 2 — Fleet Overview

The Fleet Overview is the main operational dashboard.

It provides access to:

```text
Fleet
Voyages
Optimization
Alerts
Reports
Scenarios
```

It also provides a high-level view of:

* Total vessels
* Active voyages
* Fuel consumption
* Operating cost
* GHG emissions
* Vessel status
* Live fleet map
* Weather
* Alerts

### Connection

```text
Fleet Overview
      │
      ├── Click Vessel ──────→ Vessel Details
      │
      ├── Click Voyage ──────→ Voyages & Cargo
      │
      ├── Click Alert ───────→ Alerts
      │
      └── View Metrics ──────→ Reports & Analytics
```

---

# 5. Screen 3 — Vessel Details

This screen contains detailed information about a specific vessel.

Example:

```text
vessel_id = V001
```

The backend retrieves:

* Vessel information
* Current position
* Current voyage
* Cargo
* Speed
* Fuel consumption
* Cost
* Emissions
* Weather
* Engine status

### Connection

```text
Fleet Overview
      ↓
Select Vessel
      ↓
GET /api/v1/vessels/{vessel_id}
      ↓
Vessel Details
      ↓
Live Telemetry
```

---

# 6. Screen 4 — Voyages & Cargo

This screen manages:

* Voyages
* Cargo
* Routes
* Departure
* ETA
* Deadlines
* Vessel assignments
* Voyage status

An operator can select a voyage and send it to the optimization system.

### Example

```text
Vessel: MV Ocean Star
Cargo: 5,000 TEU
Origin: Singapore
Destination: Dubai
Deadline: 3 Nov
```

Then:

```text
Voyages & Cargo
       ↓
Select Voyage
       ↓
Optimization Studio
```

---

# 7. Screen 5 — Optimization Studio

This is the primary decision-making interface.

The operator defines:

```text
Cargo
Vessels
Route
Speed
Fuel Type
Deadline
Objectives
Constraints
Algorithm
```

The system supports:

```text
Rule-Based Baseline
Conventional Optimization
Quantum-Inspired Optimization
```

### API Flow

```text
Optimization Studio
        ↓
POST /api/v1/optimization/runs
        ↓
optimization_run_id
        ↓
Background Optimization Worker
```

Example:

```text
OPT-2026-001
```

---

# 8. Optimization Engine

The Optimization Studio communicates with the backend optimization engine.

The engine follows:

```text
Scenario
   ↓
Rule-Based Baseline
   ↓
Fuel Prediction
   ↓
Conventional Optimizer
   ↓
Quantum-Inspired Optimizer
   ↓
Constraint Validation
   ↓
Pareto Analysis
   ↓
Final Solutions
```

The optimization engine does not belong to the frontend.

The frontend only sends inputs and displays the results.

---

# 9. Screen 6 — Optimization Results

After the optimization job finishes, the results are displayed.

The screen compares:

```text
Baseline
vs
Conventional
vs
Quantum-Inspired
```

Metrics include:

* Fuel
* Cost
* GHG emissions
* ETA
* Route
* Vessel allocation
* Feasibility
* Runtime
* Convergence
* Pareto solutions

### Connection

```text
Optimization Studio
       ↓
Optimization Engine
       ↓
Results Database
       ↓
Optimization Results
```

---

# 10. Screen 7 — Scenario Simulator

The Scenario Simulator uses an existing operational scenario and modifies one or more conditions.

Examples:

```text
Fuel price +20%
Cargo demand +10%
Severe weather
Vessel unavailable
Earlier deadline
Alternative fuel
Shore power
```

### Flow

```text
Existing Plan
      +
Scenario Change
      ↓
Scenario Engine
      ↓
Fuel Prediction
      ↓
Optimization
      ↓
Constraint Validation
      ↓
Scenario Result
```

The scenario engine therefore reuses the same ML and optimization services instead of implementing a separate calculation system.

---

# 11. Screen 8 — Alerts & Notifications

Alerts are generated when real-time or operational data indicates a problem.

Examples:

```text
Severe Weather
High Fuel Consumption
Engine Issue
ETA Delay Risk
Port Congestion
Route Deviation
Emissions Alert
```

### Real-Time Flow

```text
Weather / AIS / Telemetry
          ↓
Data Ingestion
          ↓
Event Processor
          ↓
Risk Detection
          ↓
Alert
          ↓
Alerts Screen
```

An alert can also trigger optimization.

### Example

```text
Severe Weather Alert
        ↓
Recalculate Route
        ↓
Optimization Engine
        ↓
Alternative Route
        ↓
Optimization Results
```

---

# 12. Screen 9 — Reports & Analytics

Reports aggregate historical operational and optimization data.

The system can calculate:

```text
Total Fuel
Total Cost
Total GHG
Voyages
Average ETA
Fleet Utilization
Fuel Savings
Cost Savings
Emission Reduction
```

### Connection

```text
Operational Data
      +
Optimization Results
      +
Voyage Data
      +
Historical Data
      ↓
Analytics Service
      ↓
Reports & Analytics
```

---

# 13. Screen 10 — Settings

Settings controls application-wide configuration.

Examples:

```text
Fleet defaults
Fuel types
Emission factors
Optimization objectives
Default constraints
Data refresh intervals
Notification preferences
System preferences
```

These settings are stored in the backend and used by the relevant services.

For example:

```text
Settings
   ↓
Default Optimization Objectives
   ↓
Optimization Studio
```

---

# 14. Screen 11 — Live Data & Integrations

This is the foundation of the data-driven platform.

Potential sources include:

```text
AIS
Weather
Fuel Prices
Port Data
Satellite Data
Regulatory Data
IoT / Vessel Telemetry
```

### Data Pipeline

```text
External Source
      ↓
Connector
      ↓
Data Ingestion
      ↓
Validation
      ↓
Normalization
      ↓
PostgreSQL / Redis
      ↓
Application Services
```

The screen allows operators to monitor:

* Connection status
* Last update
* Data latency
* Data quality
* Data volume
* Source health

---

# 15. Screen 12 — Vessel Live Telemetry

This screen displays real-time vessel data.

Example:

```text
Position
Speed
Course
Engine RPM
Fuel Flow
Draft
Power
Engine Temperature
Wind
Wave Height
Current
Emissions
```

### Connection

```text
AIS / IoT / Sensors
       ↓
Data Integration
       ↓
Real-Time Event Processor
       ↓
WebSocket
       ↓
Vessel Live Telemetry
```

The same telemetry can also be sent to the ML system.

```text
Telemetry
    ↓
Feature Engineering
    ↓
Fuel Prediction
```

---

# 16. Screen 13 — Maintenance & Predictive Maintenance

Maintenance uses vessel telemetry and historical maintenance data.

### Flow

```text
Telemetry
    +
Historical Maintenance
    +
Sensor Data
       ↓
ML / Anomaly Detection
       ↓
Component Health
       ↓
Failure Prediction
       ↓
Maintenance Alert
```

For example:

```text
Increasing vibration
       ↓
Abnormal pattern detected
       ↓
Failure probability increases
       ↓
Maintenance recommendation
```

This connects the telemetry system with the maintenance module.

---

# 17. Screen 14 — User Management

User Management controls who can access each part of the platform.

Example roles:

```text
Administrator
Operations Manager
Fleet Analyst
Maintenance Engineer
Viewer
```

Permissions may control:

```text
View Fleet
View Vessels
Manage Voyages
Run Optimization
View Reports
Manage Scenarios
View Alerts
Access Live Data
Manage Maintenance
Manage Settings
```

### Backend Flow

```text
Login
  ↓
User
  ↓
Role
  ↓
Permissions
  ↓
API Authorization
  ↓
Allowed Screens / Actions
```

---

# 18. Screen 15 — Optimization Run History

Every optimization run should be stored.

Example record:

```text
Run ID
Timestamp
Scenario
Vessels
Route
Algorithm
Objective
Status
Runtime
Fuel
Cost
GHG
ETA
```

### Flow

```text
Optimization Studio
       ↓
Optimization Engine
       ↓
Optimization Run
       ↓
PostgreSQL
       ↓
Optimization Run History
```

The operator can then:

```text
View Run
Compare Runs
Export Results
Re-run
Modify Scenario
```

---

# 19. Screen 16 — System Health & Monitoring

This screen monitors the health of the software platform itself.

It monitors:

```text
Frontend
API Gateway
ML Service
Optimization Engine
PostgreSQL
Redis
WebSocket
Data Connectors
Notification Service
Background Workers
```

### Example

```text
Optimization Worker
       ↓
CPU / Memory / Runtime
       ↓
Monitoring Service
       ↓
System Health
       ↓
Warning / Alert
```

This is different from the operational Alerts screen.

**Operational Alerts** are about vessels and maritime operations.

**System Monitoring** is about whether the software infrastructure is working correctly.

---

# 20. Core Data Architecture

All screens should communicate through shared backend services.

```text
                    FRONTEND
                       │
                 React / Next.js
                       │
              ┌────────┴────────┐
              │                 │
           REST API          WebSocket
              │                 │
              └────────┬────────┘
                       │
                    FastAPI
                       │
        ┌──────────────┼──────────────┐
        ↓              ↓              ↓
   Data Service    ML Service    Optimization
                                      Engine
        │              │              │
        └──────────────┼──────────────┘
                       ↓
                  PostgreSQL
                       +
                     Redis
```

---

# 21. Real-Time Architecture

Real-time data should not require manually refreshing the browser.

```text
AIS / IoT / Weather
       ↓
Data Connector
       ↓
Message / Event Queue
       ↓
Event Processor
       ↓
┌──────┴─────────────┐
↓                    ↓
ML Prediction     Risk Detection
↓                    ↓
Fuel Update        Alert
↓                    ↓
└──────────┬─────────┘
           ↓
    Optimization Engine
           ↓
     New Recommendation
           ↓
        WebSocket
           ↓
       Dashboard
```

---

# 22. Complete End-to-End Example

Consider a vessel traveling from Singapore to Dubai.

### Step 1 — Data arrives

```text
AIS:
Speed = 14.2 knots

Weather:
Wind = 18 knots

Wave:
2.1 m

Current:
1.2 knots
```

Data enters through the Data Integration module.

### Step 2 — Telemetry updates

The Vessel Live Telemetry screen displays the new readings.

### Step 3 — ML prediction

The ML service predicts:

```text
Fuel consumption ≈ X MT/day
```

### Step 4 — Weather changes

A new weather event arrives.

```text
Cyclone detected
```

### Step 5 — Alert generated

The Alerts screen shows:

```text
Critical — Severe Weather
```

### Step 6 — Operator requests recalculation

The operator clicks:

```text
Recalculate Route
```

### Step 7 — Optimization starts

The optimizer evaluates:

```text
Baseline
Conventional
Quantum-Inspired
```

while respecting:

```text
Cargo
Capacity
Deadline
Speed limits
Fuel compatibility
Port restrictions
Environmental constraints
```

### Step 8 — Results appear

The Optimization Results screen displays:

```text
Fuel
Cost
GHG
ETA
Route
Feasibility
```

### Step 9 — Scenario analysis

The operator tests:

```text
Fuel price +20%
```

The Scenario Simulator recalculates the plan.

### Step 10 — Results are stored

The optimization run is saved.

It becomes available in:

```text
Optimization Run History
```

and contributes to:

```text
Reports & Analytics
```

---

# 23. The Central Platform Loop

The most important system loop is:

```text
┌────────────────────────────────────────────┐
│                                            │
│          REAL-WORLD DATA                   │
│                                            │
└──────────────────┬─────────────────────────┘
                   ↓
            DATA INTEGRATION
                   ↓
            DATA VALIDATION
                   ↓
          ┌────────┴────────┐
          ↓                 ↓
      TELEMETRY          HISTORICAL
          ↓                 ↓
          └────────┬────────┘
                   ↓
            FUEL PREDICTION
                   ↓
             BASELINE PLAN
                   ↓
        ┌──────────┴──────────┐
        ↓                     ↓
 CONVENTIONAL            QUANTUM-INSPIRED
 OPTIMIZATION             OPTIMIZATION
        └──────────┬──────────┘
                   ↓
          CONSTRAINT CHECK
                   ↓
           PARETO ANALYSIS
                   ↓
          RECOMMENDED PLAN
                   ↓
             DASHBOARD
                   ↓
             OPERATOR
                   ↓
          NEW REAL-WORLD DATA
                   │
                   └───────────────→ RE-OPTIMIZATION
```

---

# 24. Important Implementation Principle

The team should **not build 16 disconnected frontend screens**.

Instead, build:

```text
ONE FRONTEND
      +
ONE BACKEND
      +
SHARED DATABASE
      +
ML SERVICE
      +
OPTIMIZATION ENGINE
      +
REAL-TIME EVENT SYSTEM
```

The screens are simply different views of the same underlying data and services.

The core architecture is:

> **Data → Prediction → Baseline → Optimization → Validation → Recommendation → Real-Time Update → Re-optimization**

This is what turns the project from a dashboard prototype into an actual **Green Fleet Optimization and Decision Support Platform**.
