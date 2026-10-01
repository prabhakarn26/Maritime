Yes. The important thing is: **these 16 screens are not 16 separate pages. They are different views of the same underlying system and database.**

Think of the platform like this:

```text
                         ┌─────────────────────┐
                         │      LOGIN          │
                         │      Screen 1       │
                         └──────────┬──────────┘
                                    │
                                    ▼
                         ┌─────────────────────┐
                         │   FLEET OVERVIEW    │
                         │      Screen 2       │
                         └──────────┬──────────┘
                                    │
                 ┌──────────────────┼──────────────────┐
                 ▼                  ▼                  ▼
          ┌────────────┐     ┌────────────┐     ┌────────────┐
          │   Vessel   │     │  Voyages   │     │   Alerts   │
          │  Screen 3  │     │  Screen 4  │     │  Screen 8  │
          └─────┬──────┘     └─────┬──────┘     └─────┬──────┘
                │                  │                  │
                ▼                  ▼                  │
          ┌────────────┐     ┌───────────────┐       │
          │   Live     │     │ Optimization  │◄──────┘
          │ Telemetry  │     │    Studio     │
          │ Screen 12  │     │   Screen 5    │
          └─────┬──────┘     └───────┬───────┘
                │                     │
                │                     ▼
                │              ┌───────────────┐
                │              │ Optimization  │
                └─────────────►│    Results    │
                               │   Screen 6    │
                               └───────┬───────┘
                                       │
                     ┌─────────────────┼────────────────┐
                     ▼                 ▼                ▼
              ┌────────────┐   ┌────────────┐   ┌─────────────┐
              │  Scenario  │   │   Run      │   │  Reports &  │
              │ Simulator  │   │  History   │   │  Analytics  │
              │ Screen 7   │   │ Screen 15  │   │  Screen 9   │
              └─────┬──────┘   └────────────┘   └─────────────┘
                    │
                    ▼
             Re-optimization
```

## 1. The most important connection

Your system should actually work like this:

```text
REAL WORLD DATA
      ↓
┌─────────────────────────┐
│ Data & Integrations     │
│ Screen 11               │
└────────────┬────────────┘
             ↓
      PostgreSQL / Redis
             ↓
┌─────────────────────────┐
│ Vessel Live Telemetry   │
│ Screen 12               │
└────────────┬────────────┘
             ↓
      ML Fuel Prediction
             ↓
┌─────────────────────────┐
│ Optimization Engine     │
│                         │
│ Baseline                │
│ Conventional            │
│ Quantum-Inspired        │
└────────────┬────────────┘
             ↓
┌─────────────────────────┐
│ Optimization Results    │
│ Screen 6                │
└────────────┬────────────┘
             ↓
       Operator decision
             ↓
       New operating plan
```

That's the **heart of your SIH26138 project**.

---

# How each screen connects

### 1. Login → Everything

```text
Login
  ↓
Authentication API
  ↓
JWT / Session
  ↓
Dashboard
```

The user logs in and receives a session/token.

The frontend then knows:

> "This is an authenticated Fleet Manager."

---

# 2. Fleet Overview → Vessel Details

On **Fleet Overview**, you see:

```text
MV Ocean Star
MV Horizon
MV Pacific Dawn
...
```

If the user clicks:

> **MV Ocean Star**

the frontend requests:

```http
GET /api/v1/vessels/{vessel_id}
```

and opens **Vessel Details**.

So:

```text
Fleet Overview
      │
      │ click vessel
      ▼
Vessel Details
```

---

# 3. Vessel Details → Live Telemetry

The Vessel Details screen contains a button/tab:

> **Live Data**

Clicking it opens:

```text
Vessel Details
      ↓
Vessel Live Telemetry
```

The telemetry screen uses the same `vessel_id`.

For example:

```text
vessel_id = V001
```

Then the backend retrieves:

```text
position
speed
RPM
fuel flow
engine temperature
draft
power
wind
waves
current
```

---

# 4. Telemetry → ML Fuel Prediction

This is where your project becomes intelligent.

For example:

```text
Speed          = 14.2 knots
RPM            = 78
Wind           = 18 knots
Wave height    = 2.1 m
Draft          = 12.4 m
Current        = 1.2 knots
Engine data    = ...
```

goes into:

```text
ML Fuel Prediction Service
```

which produces something like:

```text
Predicted fuel consumption
= 25.8 MT/day
```

The prediction appears on:

* Vessel Telemetry
* Vessel Details
* Optimization Studio
* Reports

---

# 5. Voyages → Optimization

Suppose the operator opens:

**Voyages & Cargo**

and selects:

```text
Vessel: MV Ocean Star
Cargo: 5,000 TEU
Origin: Singapore
Destination: Dubai
Deadline: 3 Nov
```

Then clicks:

> **Optimize**

The system sends that scenario to the Optimization Engine.

```text
Voyages & Cargo
       ↓
Optimization Studio
```

---

# 6. Optimization Studio → Optimization Engine

This is the most important interaction.

The operator selects:

```text
Cargo
Vessels
Route
Deadline
Fuel
Objectives
Constraints
Algorithm
```

Then:

> **Run Optimization**

Frontend sends:

```http
POST /api/v1/optimization/runs
```

Backend creates:

```text
optimization_run_id
```

For example:

```text
OPT-2026-001
```

Then the optimization worker starts.

---

# 7. Optimization Engine → Results

The engine runs:

```text
                    Scenario
                       ↓
                Rule-Based Baseline
                       ↓
              Conventional Algorithm
                       ↓
              Quantum-Inspired Algorithm
                       ↓
               Constraint Validation
                       ↓
                  Pareto Analysis
                       ↓
                    Results
```

Then:

```text
Optimization Results
```

displays:

```text
Fuel
Cost
GHG
ETA
Route
Vessel allocation
Feasibility
Runtime
Pareto frontier
```

---

# 8. Results → Scenario Simulator

Now suppose the operator asks:

> "What if fuel price increases 20%?"

They go to:

**Scenario Simulator**

The simulator takes the existing plan:

```text
Current Plan
     +
Fuel price +20%
     ↓
New scenario
     ↓
Optimization Engine
     ↓
New result
```

So the Scenario Simulator **doesn't calculate everything independently**.

It calls the same prediction and optimization services.

---

# 9. Real-Time Data → Alerts

This is another very important connection.

Imagine AIS/weather data says:

```text
Cyclone approaching route
```

Data pipeline:

```text
Weather API
     ↓
Data Ingestion
     ↓
Event Processor
     ↓
Risk Detection
     ↓
Alert
```

Then:

**Alerts Screen**

shows:

> ⚠ Severe weather detected

But it can go further.

The system can automatically trigger:

```text
Weather event
     ↓
Fuel prediction update
     ↓
Route evaluation
     ↓
Re-optimization
     ↓
New recommended route
```

So your project demonstrates **real-time optimization**, not just static optimization.

---

# 10. Alerts → Optimization

For example:

```text
⚠ Severe weather ahead
```

User clicks:

> **Recalculate Route**

Then:

```text
Alerts
   ↓
Optimization Engine
   ↓
Alternative routes
   ↓
Optimization Results
```

That's a very strong SIH demo interaction.

---

# 11. Optimization → Reports

Every optimization run is stored.

For example:

```text
OPT-001
OPT-002
OPT-003
OPT-004
```

The Reports screen can aggregate them.

It can show:

```text
Total fuel saved
Total cost saved
Total GHG reduction
Average optimization runtime
Number of optimized voyages
```

So:

```text
Optimization Results
        ↓
Database
        ↓
Reports & Analytics
```

---

# 12. Optimization → Run History

Every time you run optimization:

```text
POST /optimization/runs
```

the system stores:

```text
run_id
timestamp
algorithm
scenario
input
output
runtime
fuel
cost
GHG
ETA
status
```

Therefore:

```text
Optimization Studio
        ↓
Optimization Engine
        ↓
Database
        ↓
Optimization Run History
```

You can later open an old run and compare it with a new one.

---

# 13. Data & Integrations → Everything

This is the **foundation**.

Your external sources might look like:

```text
AIS
Weather
Fuel Prices
Port Data
Satellite
Regulatory Data
        │
        ▼
┌──────────────────────┐
│ Data Integration     │
│ Layer                │
└──────────┬───────────┘
           ↓
     Data Validation
           ↓
       PostgreSQL
           +
         Redis
           ↓
      All Services
```

So Screen 11 isn't just another page.

It's where the **input data feeding the entire application is monitored**.

---

# 14. Maintenance connects to Telemetry

Your Maintenance screen can use telemetry:

```text
Engine RPM
Temperature
Vibration
Oil pressure
Fuel injection
       ↓
ML / Rules
       ↓
Component Health
       ↓
Maintenance Prediction
```

For example:

```text
Vibration increasing
       ↓
ML detects abnormal pattern
       ↓
Failure probability increases
       ↓
Maintenance alert
```

So:

```text
Vessel Telemetry
       ↓
Maintenance & Predictive Maintenance
```

---

# 15. User Management controls all screens

User Management determines **who can access what**.

For example:

```text
Administrator
    ↓
Everything

Fleet Analyst
    ↓
Fleet
Voyages
Reports
Optimization

Viewer
    ↓
Dashboard
Reports
```

The backend checks permissions before allowing API calls.

---

# 16. System Monitoring watches the entire backend

Screen 16 is different.

It doesn't provide operational data to the optimizer.

Instead, it watches whether the **software itself is working**:

```text
Frontend
Backend API
PostgreSQL
Redis
ML Service
Optimization Worker
WebSocket
Data Connectors
```

For example:

```text
Optimization Worker
        ↓
CPU = 82%
        ↓
System Monitoring
        ↓
⚠ Warning
```

---

# The complete architecture

Put everything together and your system becomes:

```text
                    ┌───────────────┐
                    │     LOGIN     │
                    └───────┬───────┘
                            ↓
                 ┌────────────────────┐
                 │   WEB APPLICATION  │
                 └─────────┬──────────┘
                           │
          ┌────────────────┼─────────────────┐
          ↓                ↓                 ↓
       FLEET             VOYAGES          ALERTS
          ↓                ↓                 ↑
       VESSEL              │                 │
          ↓                │                 │
     TELEMETRY ────────────┼─────────────────┘
          │                │
          ↓                ↓
    ML PREDICTION → OPTIMIZATION STUDIO
          │                    │
          │                    ↓
          │              OPTIMIZATION ENGINE
          │               /      |       \
          │              /       |        \
          │        BASELINE  CONVENTIONAL  QUANTUM
          │                       │
          │                       ↓
          └──────────────→ OPTIMIZATION RESULTS
                                  │
                    ┌─────────────┼──────────────┐
                    ↓             ↓              ↓
                SCENARIOS     RUN HISTORY     REPORTS
                    │
                    ↓
              RE-OPTIMIZATION
```

And underneath **all of it**:

```text
                 EXTERNAL DATA
                      ↓
              DATA INTEGRATION
                      ↓
             VALIDATION / ETL
                      ↓
          ┌─────────────────────┐
          │     PostgreSQL      │
          │ Operational Data    │
          └─────────────────────┘
                      +
          ┌─────────────────────┐
          │        Redis        │
          │ Cache / Events /    │
          │ Job Queue           │
          └─────────────────────┘
```

### The key idea

Don't build **16 independent frontend pages**.

Build **one application with shared backend services**:

```text
                    FRONTEND
                       │
                 React / Next.js
                       │
                    REST API
                       │
              ┌────────┴────────┐
              │                 │
           WebSocket          FastAPI
              │                 │
              └────────┬────────┘
                       │
       ┌───────────────┼────────────────┐
       ↓               ↓                ↓
   ML Service    Optimization       Event Engine
                     Engine              │
       │               │                 │
       └───────────────┼─────────────────┘
                       ↓
                  PostgreSQL
                       +
                     Redis
```

**That's how all 16 screens become one actual product rather than a collection of UI mockups.**
