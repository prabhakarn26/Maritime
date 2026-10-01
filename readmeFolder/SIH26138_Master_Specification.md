# Quantum-Inspired Green Fleet Optimization & Fuel Intelligence Platform

## 1. Product Vision

Build a real-time maritime fleet intelligence platform that continuously receives vessel, voyage, fuel, weather, cargo, and operational data and uses AI/ML plus quantum-inspired optimization to recommend how a fleet should be operated.

The platform should answer questions such as:

* Which vessel should carry which cargo?
* Which vessel capacity should be used?
* What cruising speed minimizes fuel consumption while meeting the arrival deadline?
* Which fuel should the vessel use?
* Should shore power be used at port?
* What is the expected fuel consumption for a voyage?
* What will the estimated operational cost be?
* What are the estimated GHG emissions?
* What happens if fuel prices, cargo demand, weather, or vessel availability changes?
* Which feasible operating strategies exist under the current constraints?

The system should not simply display historical data. It should continuously ingest current operational data, predict future conditions, run optimization, validate constraints, and present actionable recommendations.

---

# 2. High-Level Architecture

The platform should follow a modular architecture:

```
                     ┌─────────────────────────────┐
                     │       Data Sources          │
                     │                             │
                     │ AIS / Vessel Data           │
                     │ Weather / Ocean Data        │
                     │ Fuel & Bunker Data          │
                     │ Cargo / Booking Data        │
                     │ Port Data                   │
                     │ Engine / IoT Data           │
                     └──────────────┬──────────────┘
                                    │
                                    ▼
                     ┌─────────────────────────────┐
                     │      Data Ingestion Layer    │
                     │                             │
                     │ REST APIs                    │
                     │ MQTT / IoT                  │
                     │ WebSocket                   │
                     │ Scheduled ingestion         │
                     └──────────────┬──────────────┘
                                    │
                                    ▼
                     ┌─────────────────────────────┐
                     │     Streaming / Processing   │
                     │                             │
                     │ Validation                   │
                     │ Cleaning                     │
                     │ Normalization                │
                     │ Feature Engineering          │
                     └──────────────┬──────────────┘
                                    │
                   ┌────────────────┴────────────────┐
                   ▼                                 ▼
         ┌──────────────────┐              ┌──────────────────┐
         │ Fuel Prediction  │              │ Digital Models   │
         │ ML Engine        │              │ Cost / Emission  │
         │                  │              │ Models           │
         └────────┬─────────┘              └────────┬─────────┘
                  │                                  │
                  └──────────────┬───────────────────┘
                                 ▼
                   ┌─────────────────────────────┐
                   │   Optimization Engine       │
                   │                             │
                   │ Quantum-Inspired Algorithm  │
                   │ Conventional Baselines      │
                   │ Multi-objective Optimizer   │
                   │ Constraint Solver           │
                   └──────────────┬──────────────┘
                                  │
                                  ▼
                   ┌─────────────────────────────┐
                   │     Scenario Engine         │
                   │                             │
                   │ What-if Analysis            │
                   │ Fuel Switching              │
                   │ Speed Optimization          │
                   │ Vessel Allocation           │
                   │ Shore Power                 │
                   └──────────────┬──────────────┘
                                  │
                                  ▼
                   ┌─────────────────────────────┐
                   │       Backend API            │
                   │                             │
                   │ FastAPI                     │
                   │ WebSocket                   │
                   │ Authentication              │
                   │ Optimization Jobs           │
                   └──────────────┬──────────────┘
                                  │
                                  ▼
                   ┌─────────────────────────────┐
                   │     Operations Dashboard    │
                   │                             │
                   │ Fleet Map                   │
                   │ Live KPIs                   │
                   │ Predictions                 │
                   │ Recommendations             │
                   │ Pareto Solutions            │
                   │ Scenario Simulator           │
                   │ Alerts                      │
                   └─────────────────────────────┘
```

---

# 3. Recommended Technology Stack

## Frontend

Use:

* React.js
* TypeScript
* Next.js
* Tailwind CSS
* Recharts / Plotly
* MapLibre GL JS
* Zustand
* WebSocket client

The frontend should behave like an operational control center rather than a normal analytics website.

## Backend

Use:

* Python
* FastAPI
* Pydantic
* SQLAlchemy
* WebSockets
* Celery or background workers
* Redis

FastAPI will expose REST APIs for normal operations and WebSockets for real-time updates.

## Machine Learning

Use:

* Python
* Scikit-learn
* XGBoost / LightGBM
* Pandas
* NumPy
* MLflow

The initial fuel-consumption model can use gradient-boosting models because maritime fuel consumption is nonlinear and depends on multiple interacting variables.

Possible input features:

* Vessel type
* Vessel size
* Engine characteristics
* Vessel speed
* Cargo/load
* Distance
* Weather
* Wind
* Wave conditions
* Current
* Fuel type
* Draft
* Historical consumption

The prediction service should return:

```text
Predicted fuel consumption
Confidence / uncertainty
Estimated voyage fuel
Estimated cost
Estimated emissions
```

---

# 4. Real-Time Data Architecture

The system should be designed around continuously changing operational data.

Possible real-time sources include:

### Vessel/AIS Data

Receive:

* Latitude
* Longitude
* Speed
* Heading
* Course
* Vessel identity
* Timestamp

### Engine/IoT Data

Where available:

* RPM
* Engine load
* Fuel flow
* Fuel consumption
* Temperature
* Pressure
* Power

### Weather/Ocean Data

Receive:

* Wind speed
* Wind direction
* Wave height
* Wave direction
* Current
* Weather conditions

### Fleet Data

* Vessel availability
* Vessel capacity
* Vessel type
* Fuel capability
* Maintenance status

### Cargo Data

* Cargo quantity
* Origin
* Destination
* Required arrival time
* Priority
* Cargo type

### Fuel Data

* Fuel type
* Fuel price
* Availability
* Emission factors

---

# 5. Data Ingestion Layer

Do not hard-code values into the frontend.

Instead:

```text
External Data
     ↓
Data Collector
     ↓
Validation
     ↓
Message Queue
     ↓
Processing
     ↓
Database
     ↓
ML + Optimization
     ↓
API
     ↓
Dashboard
```

For streaming data, use:

* MQTT for IoT/device data
* WebSocket for live application updates
* Kafka or Redpanda when higher-volume streaming is required
* REST APIs for external services that provide periodic data

For an SIH MVP, the architecture can begin with:

```text
FastAPI
   +
Redis
   +
PostgreSQL
   +
WebSocket
```

and be designed so Kafka can be introduced later.

---

# 6. Database Architecture

Use PostgreSQL as the main operational database.

Important tables:

### vessels

```text
id
imo_number
name
vessel_type
capacity
engine_power
fuel_capabilities
status
```

### voyages

```text
id
vessel_id
origin
destination
departure_time
estimated_arrival
cargo_quantity
status
```

### vessel_telemetry

```text
id
vessel_id
timestamp
latitude
longitude
speed
heading
engine_load
fuel_flow
```

### weather_data

```text
id
timestamp
latitude
longitude
wind_speed
wave_height
current_speed
```

### fuel_prices

```text
id
fuel_type
port
price
timestamp
```

### cargo_orders

```text
id
origin
destination
quantity
deadline
priority
```

### optimization_runs

```text
id
created_at
scenario
status
algorithm
objective_values
```

### optimization_results

```text
id
optimization_run_id
vessel_id
route
speed
fuel_type
fuel_consumption
cost
emissions
arrival_time
constraint_status
```

---

# 7. Fuel Consumption Prediction Engine

The ML engine predicts fuel consumption before optimization.

Example:

```text
Vessel
   +
Cargo
   +
Distance
   +
Speed
   +
Fuel
   +
Weather
   +
Ocean Conditions
        ↓
     ML Model
        ↓
Predicted Fuel Consumption
```

Example API:

```http
POST /api/v1/predictions/fuel
```

Request:

```json
{
  "vessel_id": "VESSEL_102",
  "distance_nm": 820,
  "speed_knots": 14,
  "cargo_tonnes": 18000,
  "fuel_type": "methanol",
  "wind_speed": 12,
  "wave_height": 1.8
}
```

Response:

```json
{
  "predicted_fuel": 82.4,
  "unit": "tonnes",
  "confidence": 0.91,
  "estimated_cost": 47280,
  "estimated_ghg": 126.7
}
```

The actual model should calculate these values from trained models and verified fuel/emission data rather than hard-coded responses.

---

# 8. Optimization Engine

This is the core of the project.

The optimizer should decide:

```text
Vessel
Cargo assignment
Speed
Fuel
Route
Capacity
Shore power
```

while respecting:

```text
Cargo demand
Vessel capacity
Arrival deadlines
Fuel availability
Vessel availability
Operational limits
Fuel compatibility
Port restrictions
Regulations
```

The objective is multi-objective:

```text
Minimize:

Fuel Consumption
+
Operational Cost
+
Lifecycle GHG Emissions

Subject to:

Cargo Demand
Schedule Reliability
Vessel Constraints
Fuel Constraints
Operational Constraints
```

---

# 9. Quantum-Inspired Optimization

The platform should NOT claim to be running on a quantum computer.

Instead, implement a genuine classical optimization algorithm inspired by quantum concepts.

The architecture should support an algorithm such as:

```text
Quantum-Inspired Evolutionary Algorithm
```

or another justified quantum-inspired metaheuristic.

The optimizer can represent a candidate fleet plan as:

```text
[Vessel, Cargo, Speed, Fuel, Route, ShorePower]
```

Example candidate:

```text
Vessel A
Cargo 1
14 knots
Methanol
Route 3
Shore Power = YES
```

The algorithm generates many possible solutions, evaluates them, and iteratively searches for better feasible solutions.

---

# 10. Conventional Benchmarking

This is extremely important.

The system should not only run the quantum-inspired optimizer.

Run conventional algorithms as baselines, for example:

```text
Genetic Algorithm
Particle Swarm Optimization
Simulated Annealing
MILP / OR solver
Greedy heuristic
```

Then compare:

```text
Fuel consumption
Operational cost
GHG emissions
Runtime
Convergence
Constraint violations
Solution quality
Scalability
```

The platform can display the experimental comparison so the claim of improvement is based on measured results.

---

# 11. Pareto Optimization

Because fuel, cost and emissions can conflict with one another, the platform should produce multiple feasible solutions instead of forcing a single objective.

Example:

### Solution A — Fuel Efficient

```text
Fuel:       92 tonnes
Cost:       ₹X
Emissions:  X tonnes
Arrival:    18:30
```

### Solution B — Low Cost

```text
Fuel:       98 tonnes
Cost:       ₹Y
Emissions:  X tonnes
Arrival:    17:45
```

### Solution C — Low Emission

```text
Fuel:       105 tonnes
Cost:       ₹Z
Emissions:  X tonnes
Arrival:    18:10
```

These can form a Pareto frontier.

The operator can select a solution according to operational priorities.

---

# 12. Real-Time Re-Optimization

This is what makes the system a real operational platform.

Suppose a vessel is travelling.

Initially:

```text
Speed = 15 knots
Fuel = LNG
Arrival = 18:00
```

Then the system receives new weather data.

```text
Strong headwind detected
```

The prediction model recalculates fuel consumption.

The optimizer checks whether the existing plan is still optimal.

If necessary:

```text
New speed
New ETA
New fuel requirement
New cost
New emissions
```

are calculated.

The dashboard receives the update through WebSocket.

Therefore:

```text
New Data
   ↓
Detect Change
   ↓
Update Prediction
   ↓
Re-run Optimization
   ↓
Validate Constraints
   ↓
Push New Recommendation
   ↓
Dashboard Updates
```

---

# 13. Event-Driven Architecture

Use events rather than refreshing the entire dashboard repeatedly.

Example:

```text
VESSEL_POSITION_UPDATED
WEATHER_UPDATED
FUEL_PRICE_UPDATED
CARGO_UPDATED
VESSEL_STATUS_CHANGED
CONSTRAINT_CHANGED
OPTIMIZATION_COMPLETED
ALERT_GENERATED
```

Backend:

```text
Data Source
    ↓
Event
    ↓
Redis/Kafka
    ↓
Processing Worker
    ↓
Prediction
    ↓
Optimization
    ↓
WebSocket
    ↓
Frontend
```

---

# 14. API Architecture

Organize APIs into modules.

### Vessel APIs

```text
GET /api/v1/vessels
GET /api/v1/vessels/{id}
GET /api/v1/vessels/{id}/telemetry
```

### Voyage APIs

```text
GET /api/v1/voyages
POST /api/v1/voyages
GET /api/v1/voyages/{id}
```

### Prediction APIs

```text
POST /api/v1/predictions/fuel
GET /api/v1/predictions/{voyage_id}
```

### Optimization APIs

```text
POST /api/v1/optimization/run
GET /api/v1/optimization/{run_id}
GET /api/v1/optimization/{run_id}/solutions
```

### Scenario APIs

```text
POST /api/v1/scenarios
POST /api/v1/scenarios/simulate
GET /api/v1/scenarios/{id}
```

### Analytics APIs

```text
GET /api/v1/analytics/fuel
GET /api/v1/analytics/emissions
GET /api/v1/analytics/cost
```

### WebSocket

```text
/ws/fleet
/ws/vessels/{id}
/ws/optimization/{run_id}
```

---

# 15. Dashboard UI

The UI should look like a professional maritime operations control center.

## Screen 1 — Fleet Overview

Top KPI cards:

```text
Active Vessels
12

Total Fuel Today
1,284 t

Estimated Cost
₹XX Lakh

GHG Emissions
XXX tCO₂e

Active Voyages
8
```

Main section:

### Live Fleet Map

Display:

* Vessel positions
* Routes
* Destination
* Speed
* Vessel status
* ETA
* Alerts

Clicking a vessel opens its live operational panel.

---

# 16. Vessel Detail Screen

Show:

```text
Vessel Name
Current Position
Current Speed
Current Fuel
Engine Load
ETA
Cargo
```

Charts:

```text
Fuel Consumption
Speed vs Fuel
Engine Load
Historical Consumption
Predicted Consumption
```

And:

### AI Recommendation

```text
Current plan:

Speed: 15 kn
Fuel: LNG
ETA: 18:42
Fuel requirement: XXX t

Recommended:

Speed: 13.8 kn
Fuel: LNG
ETA: 19:05
Fuel saving: X%
Cost change: X%
Emission change: X%
```

---

# 17. Optimization Studio

This should be one of the strongest UI screens.

Operator selects:

```text
Cargo
Origin
Destination
Required Arrival
Available Vessels
Fuel Options
Budget
Emission Target
```

Then clicks:

**RUN OPTIMIZATION**

The backend starts an optimization job.

Show:

```text
Optimization Running...

Generating candidate solutions
        ↓
Fuel prediction
        ↓
Constraint evaluation
        ↓
Quantum-inspired search
        ↓
Pareto optimization
        ↓
Validation
```

When finished, show multiple feasible solutions.

---

# 18. Scenario Simulator

Create a "What If?" interface.

Operator can change:

```text
Fuel Price
Cargo Demand
Weather
Vessel Availability
Cruising Speed
Fuel Type
Emission Target
Arrival Deadline
```

Example:

```text
Scenario:

Methanol price +20%
Wind +15%
Cargo demand +10%

[RUN SCENARIO]
```

System returns:

```text
Fuel consumption
Cost
GHG emissions
ETA
Required vessels
Recommended fleet allocation
```

This feature makes the project much more useful than a normal prediction dashboard.

---

# 19. Alternative Fuel Module

Support scenario analysis for:

```text
Conventional fuel
LNG
Methanol
Hydrogen
Ammonia
```

The system should consider whether a vessel is technically compatible with a particular fuel rather than simply allowing every vessel to select every fuel.

For each option:

```text
Fuel Consumption
Fuel Cost
GHG Impact
Availability
Compatibility
Operational Constraints
```

---

# 20. Shore Power Module

At ports where shore power is available, the optimizer should evaluate:

```text
Engine running at port
VS
Shore power
```

Compare:

```text
Fuel consumption
Cost
Port emissions
GHG emissions
Operational constraints
```

The optimizer can then include shore-power decisions in the overall fleet plan.

---

# 21. Alert System

The platform should automatically generate alerts.

Examples:

### Fuel Alert

```text
Fuel consumption is 13% above predicted level.
```

### Schedule Alert

```text
Current ETA may violate cargo deadline.
```

### Emission Alert

```text
Current voyage plan exceeds configured emission target.
```

### Optimization Alert

```text
A lower-cost feasible operating plan has been identified.
```

### Data Quality Alert

```text
Vessel telemetry has not been received for 4 minutes.
```

---

# 22. Real-Time System Reliability

Because this is intended for operational use, the platform must handle missing or delayed data.

Implement:

### Data validation

Reject impossible values such as:

```text
Negative speed
Impossible coordinates
Invalid vessel ID
Future timestamps
```

### Missing-data handling

If live data disappears:

```text
LIVE
↓
STALE
↓
UNAVAILABLE
```

The UI should clearly show the data freshness.

For example:

```text
Last updated: 14:32:08
Data age: 4 sec
Status: LIVE
```

Never silently replace missing real-time data with fake values.

---

# 23. No-Dummy-Data Principle

The production architecture must never depend on hard-coded values.

For development, synthetic data may be used only when an actual external source is unavailable.

It must be clearly marked:

```text
DATA SOURCE: SIMULATION
```

When real APIs/data sources are connected:

```text
DATA SOURCE: LIVE
```

The frontend should never contain:

```javascript
const fuel = 120;
```

as a fake operational value.

Instead:

```text
Frontend
   ↓
API
   ↓
Database / Live Data Source
```

---

# 24. ML Model Lifecycle

Use an ML pipeline:

```text
Raw Data
   ↓
Validation
   ↓
Cleaning
   ↓
Feature Engineering
   ↓
Train/Validation/Test Split
   ↓
Model Training
   ↓
Evaluation
   ↓
Model Registry
   ↓
Production Model
   ↓
Prediction API
```

Track:

```text
Model Version
Training Date
Dataset Version
Features
Metrics
```

Use MLflow for model tracking.

---

# 25. Optimization Job Architecture

Optimization can be computationally expensive, so it should not block normal API requests.

Instead:

```text
POST /optimization/run
        ↓
Create Job
        ↓
Return Job ID
        ↓
Background Worker
        ↓
Run Optimization
        ↓
Store Results
        ↓
WebSocket Notification
```

Response:

```json
{
  "job_id": "OPT-83921",
  "status": "running"
}
```

Frontend:

```text
Optimization: 64%
```

When completed:

```text
Optimization completed
12 feasible solutions found
```

---

# 26. Security

Implement:

* JWT authentication
* Role-based access control
* API authentication
* HTTPS
* Input validation
* Rate limiting
* Audit logs
* Secure secrets management

Roles:

```text
Admin
Fleet Manager
Operations Manager
Analyst
Viewer
```

---

# 27. Deployment Architecture

Development:

```text
Docker Compose
```

Services:

```text
Frontend
Backend
PostgreSQL
Redis
ML Service
Optimization Worker
```

Production:

```text
Cloud / On-Premise

             Load Balancer
                    |
          ┌─────────┴─────────┐
          ↓                   ↓
     Frontend             FastAPI
                              |
             ┌────────────────┼───────────────┐
             ↓                ↓               ↓
         PostgreSQL         Redis       Optimization
                                             Workers
```

Containerize every service using Docker.

---

# 28. Suggested Project Structure

```text
green-fleet-platform/

├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── features/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── store/
│   │   └── types/
│   └── package.json
│
├── backend/
│   ├── app/
│   │   ├── api/
│   │   ├── models/
│   │   ├── schemas/
│   │   ├── services/
│   │   ├── websocket/
│   │   ├── database/
│   │   └── main.py
│   └── requirements.txt
│
├── ml/
│   ├── training/
│   ├── preprocessing/
│   ├── models/
│   ├── evaluation/
│   └── inference/
│
├── optimization/
│   ├── quantum_inspired/
│   ├── conventional/
│   ├── constraints/
│   ├── objectives/
│   └── benchmarking/
│
├── data/
│   ├── schemas/
│   └── ingestion/
│
├── infrastructure/
│   ├── docker/
│   └── deployment/
│
└── docs/
```

---

# 29. Complete Real-Time Workflow

A complete production workflow should look like:

```text
                    LIVE DATA
                       │
        ┌──────────────┼──────────────┐
        ↓              ↓              ↓
      Vessel         Weather        Cargo
       Data            Data          Data
        │              │              │
        └──────────────┼──────────────┘
                       ↓
                DATA INGESTION
                       ↓
                VALIDATION
                       ↓
             STREAM PROCESSING
                       ↓
              FEATURE ENGINEERING
                       ↓
             ┌─────────┴─────────┐
             ↓                   ↓
       FUEL PREDICTION       COST/EMISSION
             │                   │
             └─────────┬─────────┘
                       ↓
             OPTIMIZATION ENGINE
                       │
          ┌────────────┴────────────┐
          ↓                         ↓
 Quantum-Inspired             Conventional
 Optimizer                    Algorithms
          │                         │
          └────────────┬────────────┘
                       ↓
                CONSTRAINT CHECK
                       ↓
                 PARETO SOLUTIONS
                       ↓
                SCENARIO ANALYSIS
                       ↓
                   REST API
                       +
                  WebSocket
                       ↓
                LIVE DASHBOARD
                       ↓
              OPERATOR DECISION
                       ↓
                 NEW DATA
                       ↓
                 RE-OPTIMIZE
```

---

# 30. Final Product

The final system should feel like a **real maritime fleet operations platform**, combining:

**Live Fleet Monitoring + AI Fuel Prediction + Multi-Objective Optimization + Quantum-Inspired Search + Alternative Fuel Planning + Shore Power + Scenario Simulation + Real-Time Re-Optimization.**

The most important architectural principle is:

> **Data should flow into the system continuously, predictions should update from current conditions, optimization should generate feasible operating strategies, and the dashboard should communicate those changes in real time.**

The project should therefore be demonstrated as a complete operational loop rather than as separate ML and optimization notebooks.

# Measurable Success Metrics

## 1. Fuel Consumption Prediction Accuracy

The platform must accurately predict fuel consumption for a given vessel and voyage.

### Metrics

**MAE — Mean Absolute Error**

Target:

> ≤ 10% of actual fuel consumption on the test dataset.

**MAPE — Mean Absolute Percentage Error**

Target:

> ≤ 10–12%.

**R² Score**

Target:

> ≥ 0.85.

The model should be evaluated on previously unseen voyage data rather than only training data.

### Measurement

```text
Prediction
      ↓
Compare with actual fuel consumption
      ↓
MAE / MAPE / R²
```

---

# 2. Fuel-Saving Potential

The optimized plan should consume less fuel than a baseline operating plan.

Compare:

```text
Current/Baseline Plan
          VS
Optimized Plan
```

### Target

> Demonstrate at least **5–15% reduction in predicted fuel consumption** on representative test scenarios while maintaining all required constraints.

The exact percentage should be reported from measured experiments rather than claimed beforehand.

### Formula

```text
Fuel Saving %
=
(Baseline Fuel - Optimized Fuel)
/
Baseline Fuel × 100
```

---

# 3. Operational Cost Reduction

Measure whether optimization reduces total voyage/fleet operating cost.

Include:

* Fuel cost
* Port/shore-power cost
* Other modeled operational costs

### Target

> Demonstrate measurable cost reduction compared with the baseline plan while maintaining cargo and schedule constraints.

### Formula

```text
Cost Reduction %
=
(Baseline Cost - Optimized Cost)
/
Baseline Cost × 100
```

---

# 4. GHG Emission Reduction

The platform should calculate emissions for every candidate solution.

Compare:

```text
Baseline Emissions
VS
Optimized Emissions
```

### Target

> Demonstrate measurable lifecycle GHG reduction for scenarios where lower-emission fuels or operating strategies are feasible.

The system should report emissions in a consistent unit such as:

```text
kg CO₂e
or
tonnes CO₂e
```

and document the emission factors used.

---

# 5. Cargo Demand Satisfaction

An optimization result is only successful if it actually satisfies cargo requirements.

### Metric

```text
Cargo Fulfillment Rate
```

Target:

> **100% of mandatory cargo demand** must be assigned to feasible vessels in valid solutions.

Formula:

```text
Cargo Fulfillment =
Assigned Cargo / Required Cargo × 100
```

---

# 6. Schedule Reliability

The optimizer must not reduce fuel consumption by simply making vessels miss their deadlines.

### Metrics

* Percentage of voyages arriving within deadline
* Average ETA deviation
* Number of deadline violations

### Target

> **100% of mandatory schedule constraints satisfied** in the final feasible solution.

For example:

```text
Required Arrival: 18:00
Predicted Arrival: 17:52

Constraint: PASS
```

---

# 7. Constraint Violation Rate

Every generated solution should be checked against operational constraints.

Possible constraints:

* Vessel capacity
* Vessel availability
* Fuel compatibility
* Arrival deadline
* Port restrictions
* Speed limits
* Cargo requirements
* Fuel availability

### Target

For solutions presented as **feasible**:

> **0 critical constraint violations.**

This is one of the most important metrics because an apparently cheap solution is useless if it is operationally impossible.

---

# 8. Quantum-Inspired Algorithm Performance

The SIH problem explicitly requires benchmarking quantum-inspired optimization against conventional methods.

Compare the quantum-inspired optimizer with algorithms such as:

* Genetic Algorithm
* Particle Swarm Optimization
* Simulated Annealing
* MILP/OR solver where applicable
* Greedy baseline

Measure:

### Solution Quality

Compare:

```text
Fuel
Cost
GHG
Constraint violations
```

### Convergence

Measure:

```text
Iterations required
Time required
Objective improvement per iteration
```

### Scalability

Run increasingly large problems:

```text
10 vessels
25 vessels
50 vessels
100 vessels
```

and measure runtime and solution quality.

Do **not** claim the quantum-inspired algorithm is better unless the experiments actually demonstrate it.

---

# 9. Optimization Runtime

Real-time operations require the optimization engine to respond within a useful time.

Define different operating modes.

### Fast Re-Optimization

For small changes such as:

* Speed change
* Weather update
* Fuel price update

Target:

> Produce an updated recommendation within **seconds to a few minutes**, depending on problem size.

### Full Fleet Optimization

For larger fleet-level problems:

> Target completion within an operationally acceptable window, such as **≤ 5 minutes for the defined MVP benchmark scenario**.

The benchmark should explicitly record:

```text
Number of vessels
Number of voyages
Number of variables
Number of constraints
Hardware
Algorithm
Runtime
```

---

# 10. Real-Time Data Freshness

The dashboard must accurately communicate how current its data is.

### Metric

```text
Data Freshness
=
Current Time - Source Timestamp
```

Example target:

> Live telemetry displayed within **5–10 seconds** of ingestion where the source itself provides data at that frequency.

Do not measure the application against a faster rate than the upstream data source supports.

Dashboard should show:

```text
LIVE
Last updated: 14:32:08
Data age: 3 sec
```

If data becomes stale:

```text
STALE
Last updated: 14:28:02
Data age: 4 min
```

---

# 11. Real-Time Dashboard Latency

Measure the time between a backend event and its appearance on the dashboard.

```text
Data Event
    ↓
Backend
    ↓
WebSocket
    ↓
Frontend
```

### Target

> **P95 WebSocket update latency ≤ 2 seconds** under the defined MVP load.

Measure:

* P50 latency
* P95 latency
* P99 latency

---

# 12. System Availability

For a production-oriented platform, measure service availability.

### Target

For the MVP:

> ≥ **99% availability** during controlled testing.

For a production deployment, a stricter SLA can be defined later.

Track:

```text
Uptime
Downtime
API failures
WebSocket disconnections
Database failures
Worker failures
```

---

# 13. API Performance

Measure the backend independently from the optimization engine.

For normal read APIs:

> P95 response time ≤ **500 ms** under the defined test load.

For write operations:

> P95 response time ≤ **1 second** where no heavy computation is performed.

Optimization requests should return a **job ID immediately** rather than keeping the HTTP request open.

Example:

```text
POST /optimization/run
        ↓
HTTP response < 1 sec
        ↓
JOB-83921
        ↓
Background optimization
```

---

# 14. Optimization Recommendation Quality

Every recommendation should contain measurable evidence.

Instead of:

> "Use Vessel A."

Show:

```text
Recommended Vessel: A
Speed: 13.8 kn
Fuel: Methanol
ETA: 17:42
Fuel: 82.4 t
Cost: ₹X
GHG: X tCO₂e

Compared with current plan:

Fuel: -8.2%
Cost: -5.4%
GHG: -12.7%
ETA: +4 min

Constraints:
✓ Capacity
✓ Cargo
✓ Fuel compatibility
✓ Deadline
✓ Port restrictions
```

This makes the recommendation auditable.

---

# 15. Scenario Simulation Performance

For the "What-If" module, measure how quickly scenarios can be evaluated.

Example:

```text
Scenario A
Normal fuel price

Scenario B
Fuel price +20%

Scenario C
Cargo demand +15%

Scenario D
Wind +25%
```

Metrics:

* Scenario execution time
* Feasible/infeasible result
* Fuel difference
* Cost difference
* Emission difference
* ETA difference

Target:

> A predefined MVP scenario should return results within **a few seconds for prediction-only analysis** and within the defined optimization SLA for full re-optimization.

---

# 16. Alternative Fuel Decision Coverage

The system should be capable of evaluating the fuel options specified by the problem:

* LNG
* Methanol
* Hydrogen
* Ammonia
* Conventional fuels
* Shore power where applicable

The important metric is not simply the number of fuels displayed.

Measure:

> Percentage of eligible vessel/fuel combinations correctly evaluated against compatibility, cost, availability, consumption, and emissions constraints.

---

# 17. Data Quality

Real-world systems fail if bad data reaches the optimizer.

Track:

### Completeness

```text
Valid Records / Expected Records × 100
```

### Validity

Percentage of records passing validation.

### Duplicate Rate

Number of duplicate records.

### Missing Telemetry

Percentage of expected telemetry points missing.

Target for the MVP:

> ≥ **95% valid/usable records** in controlled data pipelines.

Real production targets should be based on the actual source systems.

---

# 18. Model Drift Monitoring

Fuel consumption patterns can change because of:

* Vessel maintenance
* Engine degradation
* Hull condition
* Cargo patterns
* Weather
* Fuel changes

Therefore monitor model performance over time.

Track:

```text
Current MAPE
Historical MAPE
Prediction error distribution
Feature distribution
```

If performance crosses a predefined threshold:

```text
MODEL PERFORMANCE DEGRADING
        ↓
Generate Alert
        ↓
Review / Retrain Model
```

---

# 19. Scalability

The platform should be tested with increasing fleet sizes.

Example benchmark:

| Fleet Size | Voyages | Optimization Time | API P95 | Result Quality |
| ---------: | ------: | ----------------: | ------: | -------------- |
|         10 |      20 |           Measure | Measure | Measure        |
|         25 |      50 |           Measure | Measure | Measure        |
|         50 |     100 |           Measure | Measure | Measure        |
|        100 |     200 |           Measure | Measure | Measure        |

The goal is to show how the architecture behaves as fleet complexity increases.

---

# 20. Overall SIH Demonstration Metrics

For the final demonstration, the team should present a measurable scorecard:

| Area                            | Target                                            |
| ------------------------------- | ------------------------------------------------- |
| Fuel prediction MAPE            | ≤ 10–12%                                          |
| Fuel reduction                  | Demonstrate measurable improvement vs baseline    |
| Cost reduction                  | Demonstrate measurable improvement vs baseline    |
| GHG reduction                   | Demonstrate measurable improvement where feasible |
| Cargo fulfillment               | 100% mandatory demand                             |
| Critical constraint violations  | 0                                                 |
| Schedule violations             | 0 for feasible solutions                          |
| Real-time dashboard latency     | P95 ≤ 2 sec                                       |
| Normal API latency              | P95 ≤ 500 ms                                      |
| Optimization runtime            | Within defined MVP SLA                            |
| Data quality                    | ≥ 95% usable records                              |
| System availability during test | ≥ 99%                                             |
| Benchmarking                    | Quantum-inspired + conventional methods           |
| Scalability                     | Tested at multiple fleet sizes                    |

---

# 21. The Most Important Success Definition

The project should ultimately prove this complete chain:

```text
REAL DATA
   ↓
ACCURATE PREDICTION
   ↓
FEASIBLE OPTIMIZATION
   ↓
MEASURABLE IMPROVEMENT
   ↓
REAL-TIME DELIVERY
   ↓
OPERATOR DECISION
```

A successful prototype is therefore **not**:

> "We trained an ML model with 92% accuracy."

It is:

> "Using current operational inputs, the platform predicts fuel consumption, generates multiple constraint-valid fleet strategies, benchmarks the quantum-inspired optimizer against conventional approaches, quantifies fuel/cost/GHG trade-offs, and updates recommendations when operating conditions change."

That is the measurable story the SIH demo should prove.


# Consolidated Measurable Success Metrics

The platform should be evaluated across six measurable dimensions: **prediction, optimization, operational feasibility, real-time performance, system/data reliability, and scalability**.

---

## 1. Prediction & Environmental Performance

### Fuel Consumption Prediction

Measure the accuracy of the ML fuel-consumption model using unseen test data.

**Metrics:**

* MAPE: target ≤ 10–12%
* MAE: report in tonnes of fuel
* R²: target ≥ 0.85

### Fuel, Cost & GHG Improvement

Compare the optimized plan against the baseline operating plan.

Measure:

* Fuel consumption reduction %
* Operational cost reduction %
* GHG emission reduction %

**Target:** Demonstrate measurable improvement over the baseline while maintaining operational constraints.

Formula:

```text
Improvement %
=
(Baseline Value - Optimized Value)
/
Baseline Value × 100
```

The exact improvement percentage should be established experimentally rather than claimed in advance.

---

## 2. Optimization Quality

The optimization engine must produce solutions that are both useful and computationally competitive.

### Solution Quality

Compare:

* Fuel consumption
* Operational cost
* GHG emissions
* Objective-function value

### Quantum-Inspired Benchmark

Compare the quantum-inspired algorithm against conventional methods such as:

* Genetic Algorithm
* Particle Swarm Optimization
* Simulated Annealing
* MILP/OR solver where applicable
* Greedy heuristic

Measure:

* Solution quality
* Runtime
* Convergence speed
* Scalability
* Constraint violations

The system should report which method performed better **for each measured scenario**, rather than assuming the quantum-inspired method is superior.

### Pareto Quality

Measure the number and quality of feasible trade-off solutions across:

```text
Fuel ↔ Cost ↔ GHG
```

The system should generate a meaningful Pareto frontier rather than only one solution.

---

## 3. Operational Feasibility

An optimization result is successful only when it can actually satisfy the operational requirements.

### Constraint Satisfaction

Track:

* Cargo capacity
* Vessel availability
* Fuel compatibility
* Fuel availability
* Arrival deadlines
* Port restrictions
* Speed/operational limits
* Regulatory constraints

**Target:**

> 0 critical constraint violations in solutions presented as feasible.

### Cargo Fulfillment

```text
Cargo Fulfillment %
=
Assigned Cargo / Required Cargo × 100
```

**Target:** 100% of mandatory cargo demand.

### Schedule Reliability

Track:

* Deadline violations
* ETA deviation
* Percentage of voyages meeting deadlines

**Target:** 100% of mandatory schedule constraints satisfied in the selected feasible solution.

---

## 4. Real-Time Performance

The platform must respond to changing operational conditions rather than functioning only as an offline analytics system.

### Data Freshness

Measure:

```text
Data Age =
Current Time - Source Timestamp
```

Target:

> Live data should appear within approximately 5–10 seconds of ingestion when the upstream source provides data at that frequency.

The UI must display:

```text
LIVE
Last updated: 14:32:08
Data age: 3 sec
```

and clearly transition to:

```text
STALE
```

when data becomes outdated.

### Dashboard Latency

Measure:

```text
Source Event
→ Backend
→ WebSocket
→ Browser
```

**Target:**

> P95 dashboard update latency ≤ 2 seconds under the defined MVP load.

### Re-Optimization Latency

Measure the time from a significant operational change to a new feasible recommendation.

Examples:

* Weather change
* Fuel-price change
* Vessel unavailable
* Cargo-demand change

Define separate SLAs for:

```text
Fast re-optimization
Full fleet optimization
```

For the MVP, a practical target is:

> Small re-optimization: seconds to a few minutes.

> Full fleet optimization: ≤ 5 minutes for the defined benchmark scenario.

The benchmark must record fleet size, problem complexity, hardware, algorithm, and runtime.

---

## 5. System & Data Reliability

### API Performance

For normal APIs:

> P95 response time ≤ 500 ms under the defined test load.

Heavy optimization requests should return a job ID immediately rather than blocking the HTTP request.

### Availability

For the MVP:

> ≥ 99% availability during controlled testing.

Track:

* API failures
* WebSocket disconnections
* Worker failures
* Database failures
* Service downtime

### Data Quality

Measure:

* Data completeness
* Invalid-record percentage
* Duplicate records
* Missing telemetry
* Timestamp validity

**Target:**

> ≥ 95% usable records in controlled test pipelines.

### Model Reliability

Monitor:

* Prediction error over time
* Model drift
* Feature distribution changes
* Production vs validation performance

Trigger retraining/review when predefined error thresholds are exceeded.

---

## 6. Scalability

The platform should demonstrate that its architecture can handle increasingly complex fleet problems.

Test multiple fleet sizes:

| Fleet | Voyages | Optimization Time | API P95 | Solution Quality |
| ----: | ------: | ----------------: | ------: | ---------------: |
|    10 |      20 |           Measure | Measure |          Measure |
|    25 |      50 |           Measure | Measure |          Measure |
|    50 |     100 |           Measure | Measure |          Measure |
|   100 |     200 |           Measure | Measure |          Measure |

The objective is to demonstrate how runtime and solution quality change as the optimization problem grows.

---

# Final Evaluation Scorecard

| Category          | Primary Metric                 | Target / Requirement               |
| ----------------- | ------------------------------ | ---------------------------------- |
| **Prediction**    | Fuel MAPE                      | ≤ 10–12%                           |
| **Prediction**    | R²                             | ≥ 0.85                             |
| **Environmental** | Fuel / cost / GHG improvement  | Measurable vs baseline             |
| **Optimization**  | Solution quality               | Compare against baselines          |
| **Optimization**  | Quantum-inspired performance   | Benchmark experimentally           |
| **Feasibility**   | Critical constraint violations | 0                                  |
| **Feasibility**   | Mandatory cargo fulfillment    | 100%                               |
| **Feasibility**   | Mandatory schedule compliance  | 100%                               |
| **Real-time**     | Data freshness                 | ~5–10 sec where source supports it |
| **Real-time**     | Dashboard P95 latency          | ≤ 2 sec                            |
| **Real-time**     | Re-optimization                | Within defined operational SLA     |
| **Reliability**   | API P95                        | ≤ 500 ms for normal APIs           |
| **Reliability**   | MVP availability               | ≥ 99%                              |
| **Data Quality**  | Usable records                 | ≥ 95%                              |
| **Scalability**   | Fleet-size benchmarks          | 10 → 25 → 50 → 100 vessels         |

## One-line definition of success

> **The platform succeeds when it can ingest current fleet data, accurately predict fuel consumption, generate constraint-valid multi-objective fleet plans, demonstrate measurable fuel/cost/GHG improvements against a baseline, benchmark quantum-inspired optimization against conventional methods, and deliver updated recommendations fast enough for real-time operational decision-making.**


# Baseline Operating Plan

## 1. Definition

The **Baseline Operating Plan (BOP)** is the fleet plan that represents how the same vessels and cargo would normally be operated **without the proposed quantum-inspired optimization engine**.

It provides the reference point for evaluating whether the proposed platform actually improves:

* Fuel consumption
* Operational cost
* GHG emissions
* Schedule performance
* Fleet utilization

The baseline must use the **same fleet, cargo demand, routes, weather conditions, fuel prices, and operational constraints** as the optimized plan.

The only major difference should be the **decision-making method**.

---

# 2. What the Baseline Should Represent

The baseline should represent a conventional operational strategy.

For the MVP, define it as:

> **A rule-based or historical operating strategy that assigns available vessels to cargo, selects feasible routes and speeds using predefined operational rules, and uses currently available fuel choices without the quantum-inspired optimization engine.**

This gives us a reproducible reference instead of comparing the optimizer against an arbitrary or deliberately inefficient plan.

---

# 3. Baseline Decision Rules

The baseline can use deterministic rules such as:

### Vessel Assignment

Assign cargo to the first available vessel that satisfies:

```text
Cargo capacity ≥ Required cargo
Vessel availability = YES
Fuel compatibility = YES
Route compatibility = YES
```

If multiple vessels are feasible, select the vessel with the smallest capacity surplus.

---

### Speed

Use the vessel's predefined normal cruising speed.

For example:

```text
Baseline Speed =
Configured Operational Cruising Speed
```

Do **not** dynamically optimize speed for fuel consumption.

---

### Route

Use the standard operational route between origin and destination.

The baseline should not search alternative routes unless the real operational process normally does so.

---

### Fuel

Use the vessel's normal/default fuel according to its operational configuration.

Do not allow the baseline to optimize fuel switching.

---

### Shore Power

Use the existing/default shore-power operating policy.

For example:

```text
If shore power is part of the vessel's normal operating procedure:
    Use shore power.

Otherwise:
    Keep normal port operation.
```

The exact rule should be documented rather than changed between experiments.

---

### Cargo

The baseline must fulfill all mandatory cargo requirements.

```text
Assigned Cargo = Required Cargo
```

If the baseline cannot satisfy a scenario, that scenario should be marked **infeasible** rather than artificially modified.

---

### Schedule

The baseline must respect mandatory arrival deadlines.

If a predefined normal speed would violate a hard deadline, the baseline needs a documented fallback rule—for example, increase speed to the minimum feasible speed required to meet the deadline.

This prevents the comparison from being unfair.

---

# 4. Baseline Inputs

The baseline and optimized plan must receive exactly the same inputs.

```text
                    SAME INPUTS
                        │
          ┌─────────────┴─────────────┐
          ↓                           ↓
    BASELINE PLAN              OPTIMIZED PLAN
          ↓                           ↓
    Rule-Based Logic          AI + Quantum-Inspired
          ↓                           ↓
          └─────────────┬─────────────┘
                        ↓
                  FAIR COMPARISON
```

Inputs include:

* Fleet availability
* Vessel capacities
* Vessel characteristics
* Cargo demand
* Origin/destination
* Required arrival time
* Routes
* Weather/ocean conditions
* Fuel prices
* Fuel availability
* Fuel compatibility
* Port constraints
* Operational constraints

---

# 5. Baseline Outputs

For every voyage, calculate:

```text
Vessel selected
Route
Speed
Fuel type
Fuel consumption
Fuel cost
GHG emissions
ETA
Cargo fulfilled
Constraint status
```

At fleet level:

```text
Total fuel
Total cost
Total GHG
Total voyages
Average ETA
Fleet utilization
Constraint violations
```

---

# 6. Example

Suppose there are three vessels:

```text
Vessel A → Capacity: 20,000 t
Vessel B → Capacity: 15,000 t
Vessel C → Capacity: 10,000 t
```

Cargo:

```text
Cargo 1 → 9,000 t
Cargo 2 → 14,000 t
Cargo 3 → 18,000 t
```

The baseline assignment might be:

```text
Cargo 1 → Vessel C
Cargo 2 → Vessel B
Cargo 3 → Vessel A
```

Each vessel then follows its standard:

```text
Route
Cruising speed
Fuel configuration
Port procedure
```

The system calculates:

```text
Baseline Fuel = X tonnes
Baseline Cost = ₹Y
Baseline GHG = Z tonnes CO₂e
Baseline ETA = ...
```

The optimizer receives exactly the same scenario.

It might discover:

```text
Cargo 1 → Vessel B
Cargo 2 → Vessel C
Cargo 3 → Vessel A
```

with different feasible speeds/fuels/routes.

Then calculate:

```text
Optimized Fuel
Optimized Cost
Optimized GHG
Optimized ETA
```

and compare them directly.

---

# 7. Baseline Must Not Be Artificially Weak

This is critical for a credible SIH project.

Do **not** create a deliberately inefficient baseline such as:

```text
Maximum speed
Largest possible vessel
Most expensive fuel
No route optimization
```

just to make the proposed algorithm look better.

Instead, the baseline should represent a **reasonable conventional operating strategy**.

---

# 8. Two-Level Baseline

For stronger evaluation, implement two baselines.

## Baseline A — Operational Rule Baseline

The actual simple rule-based strategy described above.

This answers:

> "How much improvement does the intelligent optimizer provide over a conventional operational strategy?"

## Baseline B — Conventional Optimization

Run a conventional optimization method such as:

* Genetic Algorithm
* Particle Swarm Optimization
* Simulated Annealing
* MILP/OR solver where applicable

This answers:

> "How does the quantum-inspired approach compare with established optimization techniques?"

The comparison becomes:

```text
              ┌───────────────────────┐
              │ Operational Baseline  │
              └───────────┬───────────┘
                          │
                          ▼
                 Conventional Optimizer
                          │
                          ▼
              Quantum-Inspired Optimizer
```

This is much stronger than simply comparing:

```text
Old system vs New system
```

because it evaluates both the **business improvement** and the **algorithmic contribution**.

---

# 9. Fair Comparison Rules

Every experiment must keep these variables identical:

| Variable           | Baseline              | Optimized |
| ------------------ | --------------------- | --------- |
| Fleet              | Same                  | Same      |
| Cargo              | Same                  | Same      |
| Weather            | Same                  | Same      |
| Routes             | Same starting network | Same      |
| Fuel prices        | Same                  | Same      |
| Fuel availability  | Same                  | Same      |
| Vessel constraints | Same                  | Same      |
| Port constraints   | Same                  | Same      |
| Arrival deadlines  | Same                  | Same      |
| Emission factors   | Same                  | Same      |
| Evaluation period  | Same                  | Same      |

Only the **decision/optimization method** changes.

---

# 10. Baseline Dataset

For every test scenario, store the baseline result.

Example:

```text
scenario_id
timestamp
vessel_assignment
route
speed
fuel_type
fuel_consumption
fuel_cost
ghg_emissions
eta
cargo_fulfillment
constraint_status
```

Then store the corresponding optimized result.

This makes every improvement traceable.

---

# 11. Improvement Calculation

For metrics where lower is better:

```text
Improvement %
=
(Baseline - Optimized)
/
Baseline × 100
```

For example:

```text
Baseline fuel = 100 tonnes
Optimized fuel = 91 tonnes

Fuel improvement =
(100 - 91) / 100 × 100

= 9%
```

For metrics where higher is better, use the appropriate formula instead.

Never calculate improvement by comparing different datasets or different weather/fuel-price conditions.

---

# 12. Important Exception: Infeasible Baselines

Sometimes the conventional baseline may be unable to satisfy a scenario.

Example:

```text
Baseline:
Cannot meet cargo deadline

Optimizer:
Finds feasible solution
```

Do not simply assign a fake fuel/cost value to the baseline.

Instead report:

```text
Baseline:
INFEASIBLE

Optimized:
FEASIBLE
```

and separately report:

```text
Feasibility Improvement:
Baseline → Infeasible
Optimized → Feasible
```

This is a legitimate and important optimization result.

---

# 13. Final Baseline Definition

For the project documentation, use this concise definition:

> **The Baseline Operating Plan is a deterministic, rule-based representation of conventional fleet operations under the same fleet, cargo, environmental, fuel, route, and operational conditions used by the proposed optimization system. It provides the reference fuel consumption, cost, emissions, schedule, and feasibility metrics against which the AI and quantum-inspired optimization results are evaluated.**

The key principle is:

> **Same scenario + same constraints + different decision-making method = fair measurement of improvement.**

# Clear End-to-End Implementation Workflow

The platform should be implemented as a continuous pipeline:

```text
DATA SOURCES
     ↓
DATA INGESTION
     ↓
DATA VALIDATION & STORAGE
     ↓
FEATURE ENGINEERING
     ↓
FUEL PREDICTION
     ↓
BASELINE PLAN
     ↓
OPTIMIZATION ENGINE
     ↓
CONSTRAINT VALIDATION
     ↓
PARETO SOLUTIONS
     ↓
REAL-TIME SCENARIO CHECK
     ↓
API + WEBSOCKET
     ↓
LIVE DASHBOARD
     ↓
OPERATOR DECISION
     ↓
NEW DATA
     ↓
RE-OPTIMIZATION
```

---

# Phase 1 — Connect Real Data Sources

First, identify which data is actually available.

### Required data

```text
Vessel data
Cargo data
Voyage/route data
Fuel data
Weather/ocean data
Port data
Operational constraints
```

Potential sources:

```text
AIS
IoT/engine telemetry
Weather APIs
Fuel-price APIs
Port systems
Fleet management systems
Cargo/booking systems
```

Every record should contain a timestamp and source identifier.

The system should distinguish:

```text
LIVE
HISTORICAL
SIMULATION
```

Synthetic data can be used during development, but it must never be presented as live operational data.

---

# Phase 2 — Build the Data Ingestion Layer

Create independent connectors for each source.

```text
AIS Connector
Weather Connector
Fuel Connector
Cargo Connector
Port Connector
IoT Connector
```

Each connector converts external data into the platform's internal schema.

Example:

```text
External AIS
     ↓
AIS Adapter
     ↓
Standard VesselTelemetry
     ↓
Validation
     ↓
PostgreSQL / Stream
```

This prevents the ML and optimization systems from becoming dependent on a particular external API.

---

# Phase 3 — Validate and Normalize Data

Before data reaches the ML or optimization layers, validate it.

Examples:

```text
Speed >= 0
Latitude ∈ [-90, 90]
Longitude ∈ [-180, 180]
Cargo >= 0
Fuel price > 0
Timestamp valid
Vessel exists
Fuel compatible with vessel
```

Invalid records should be rejected or quarantined.

Do not silently replace missing live values with dummy values.

---

# Phase 4 — Store Operational Data

Use PostgreSQL as the main operational database.

Store:

```text
Vessels
Voyages
Cargo
Telemetry
Weather
Fuel prices
Routes
Ports
Constraints
Optimization runs
Optimization results
```

For high-frequency telemetry, use an appropriate time-series strategy within the PostgreSQL ecosystem or introduce a dedicated time-series store if required by scale.

---

# Phase 5 — Build the Fuel Prediction Model

Create the ML pipeline separately from the optimization engine.

```text
Historical Data
      ↓
Cleaning
      ↓
Feature Engineering
      ↓
Train / Validation / Test
      ↓
Model Training
      ↓
Evaluation
      ↓
Model Registry
      ↓
Production Model
```

Inputs can include:

```text
Vessel
Speed
Cargo
Distance
Fuel
Weather
Wind
Wave
Current
Draft
Engine characteristics
```

Output:

```text
Predicted fuel consumption
Prediction uncertainty
```

Then derive cost and emissions using the appropriate fuel-price and emission-factor data.

---

# Phase 6 — Validate the ML Model

Do not immediately connect the model to the optimizer.

First verify:

```text
MAPE
MAE
R²
Prediction error distribution
Performance on unseen data
```

Only a validated model should become the production prediction service.

---

# Phase 7 — Implement the Baseline Operating Plan

For every scenario, first generate the conventional baseline.

```text
Scenario
   ↓
Available vessels
   ↓
Rule-based assignment
   ↓
Standard route
   ↓
Normal cruising speed
   ↓
Default fuel policy
   ↓
Constraint validation
   ↓
Baseline metrics
```

Store:

```text
Baseline fuel
Baseline cost
Baseline GHG
Baseline ETA
Baseline feasibility
Cargo fulfillment
```

This becomes the reference for every optimization experiment.

---

# Phase 8 — Create the Optimization Problem

Convert the fleet problem into a formal optimization model.

### Decision variables

```text
Which vessel?
Which cargo?
Which route?
What speed?
Which fuel?
Shore power?
```

### Constraints

```text
Cargo capacity
Vessel availability
Fuel compatibility
Fuel availability
Arrival deadline
Port restrictions
Operational limits
Regulations
```

### Objectives

```text
Minimize fuel
Minimize cost
Minimize GHG
```

Represent these formally so that every algorithm receives exactly the same problem.

---

# Phase 9 — Build the Quantum-Inspired Optimizer

Implement the selected quantum-inspired metaheuristic as an independent optimization module.

Conceptually:

```text
Generate Candidate Solutions
          ↓
Evaluate Fuel
          ↓
Evaluate Cost
          ↓
Evaluate GHG
          ↓
Check Constraints
          ↓
Update Search Population
          ↓
Repeat
          ↓
Return Best/Pareto Solutions
```

The optimizer should return structured results rather than dashboard-specific objects.

Example:

```text
OptimizationResult
 ├── vessel assignments
 ├── routes
 ├── speeds
 ├── fuels
 ├── fuel consumption
 ├── cost
 ├── emissions
 ├── ETA
 └── constraint status
```

---

# Phase 10 — Implement Conventional Algorithms

Use exactly the same:

```text
Inputs
Objectives
Constraints
Evaluation functions
Stopping criteria
```

for the conventional algorithms.

For example:

```text
Problem
   ├── Rule-Based Baseline
   ├── Genetic Algorithm
   ├── Particle Swarm
   └── Quantum-Inspired Algorithm
```

This makes the algorithm comparison scientifically meaningful.

---

# Phase 11 — Add Constraint Validation

Every candidate solution must pass through a common validation layer.

```text
Candidate Solution
       ↓
Cargo Check
       ↓
Capacity Check
       ↓
Fuel Compatibility
       ↓
Schedule Check
       ↓
Port Check
       ↓
Operational Check
       ↓
FEASIBLE / INFEASIBLE
```

Only feasible solutions should be presented as operational recommendations.

---

# Phase 12 — Generate Pareto Solutions

Instead of returning only one answer, calculate the trade-off between:

```text
Fuel
Cost
GHG
```

Return a set of feasible Pareto-optimal solutions.

Example:

```text
Solution 1
Low fuel

Solution 2
Low cost

Solution 3
Low emissions
```

The operator can then select the appropriate operating strategy according to business priorities.

---

# Phase 13 — Expose Everything Through FastAPI

Create service boundaries:

```text
Frontend
    ↓
FastAPI
    ├── Fleet Service
    ├── Voyage Service
    ├── Prediction Service
    ├── Optimization Service
    ├── Scenario Service
    └── Analytics Service
```

Heavy operations should run asynchronously.

Example:

```text
POST /optimization/run
        ↓
Return job_id
        ↓
Optimization Worker
        ↓
Store results
        ↓
WebSocket event
```

---

# Phase 14 — Add Real-Time Event Processing

Create events such as:

```text
VESSEL_POSITION_UPDATED
WEATHER_UPDATED
FUEL_PRICE_UPDATED
CARGO_UPDATED
VESSEL_STATUS_CHANGED
```

When a relevant event occurs:

```text
New Event
    ↓
Determine whether current plan is affected
    ↓
If not affected → update dashboard
    ↓
If affected → recalculate prediction
    ↓
Re-optimize if necessary
    ↓
Validate new plan
    ↓
Push result through WebSocket
```

This prevents unnecessary optimization runs.

---

# Phase 15 — Build the Dashboard

The frontend should consume APIs and WebSocket events.

### Fleet Overview

```text
Live map
Active vessels
Current voyages
Fuel consumption
Cost
GHG
Alerts
```

### Vessel Detail

```text
Position
Speed
Engine state
Fuel consumption
Prediction
ETA
Recommendation
```

### Optimization Studio

```text
Cargo
Vessels
Routes
Fuel
Deadline
Constraints

        ↓

RUN OPTIMIZATION
```

### Scenario Simulator

```text
Change weather
Change fuel price
Change demand
Change vessel availability
Change deadline

        ↓

RUN SCENARIO
```

---

# Phase 16 — Implement Real-Time Recommendation Loop

The complete runtime loop becomes:

```text
                    LIVE DATA
                       ↓
                  DATA UPDATE
                       ↓
              DOES IT MATTER?
                  /        \
                NO          YES
                ↓            ↓
          Update UI      ML Prediction
                              ↓
                       Current Plan Check
                              ↓
                       Re-optimization
                              ↓
                       Constraint Check
                              ↓
                       New Recommendation
                              ↓
                         WebSocket
                              ↓
                       Dashboard Update
```

This is the core feature that differentiates the platform from an offline optimization project.

---

# Phase 17 — Add Alerts

Generate alerts from measurable thresholds.

Examples:

```text
Fuel consumption > prediction threshold
ETA threatens deadline
Telemetry becomes stale
Emission target exceeded
Vessel becomes unavailable
Better feasible plan found
Optimization failed
```

Every alert should contain:

```text
Timestamp
Severity
Source
Reason
Affected vessel/voyage
Recommended action
```

---

# Phase 18 — Run Evaluation

For each test scenario:

```text
Same Scenario
     │
     ├── Baseline
     │
     ├── Conventional Optimizer
     │
     └── Quantum-Inspired Optimizer
```

Record:

```text
Fuel
Cost
GHG
ETA
Cargo fulfillment
Constraint violations
Runtime
Convergence
```

Then calculate:

```text
Baseline → Optimized Improvement
Algorithm → Algorithm Comparison
```

---

# Phase 19 — Test Real-Time Behavior

Create controlled events.

### Test 1 — Weather Change

```text
Normal weather
       ↓
Headwind increases
       ↓
Fuel prediction changes
       ↓
System checks current plan
       ↓
Re-optimization
       ↓
New recommendation
```

### Test 2 — Vessel Failure

```text
Vessel becomes unavailable
       ↓
Affected cargo identified
       ↓
Optimization triggered
       ↓
Cargo reassigned
       ↓
New ETA calculated
```

### Test 3 — Fuel Price Change

```text
Fuel price changes
       ↓
Cost model updates
       ↓
Existing plans reevaluated
       ↓
Alternative fuel strategies evaluated
```

### Test 4 — Deadline Change

```text
Cargo deadline moves earlier
       ↓
Schedule constraints change
       ↓
Re-optimization
       ↓
New feasible plans
```

---

# Phase 20 — Performance & Scalability Testing

Run controlled benchmarks at increasing problem sizes.

```text
10 vessels
     ↓
25 vessels
     ↓
50 vessels
     ↓
100 vessels
```

Measure:

```text
Optimization runtime
API latency
WebSocket latency
Memory/CPU usage
Solution quality
Constraint violations
```

Use these measurements to determine where additional infrastructure such as Kafka, distributed workers, or more powerful optimization hardware becomes necessary.

---

# Phase 21 — Final Production Flow

The final architecture should operate like this:

```text
┌─────────────────────────────────────────────────────┐
│                    LIVE DATA                        │
│ AIS | IoT | Weather | Fuel | Cargo | Port Systems  │
└──────────────────────┬──────────────────────────────┘
                       ↓
              ┌─────────────────┐
              │ Data Ingestion  │
              └────────┬────────┘
                       ↓
              ┌─────────────────┐
              │ Validate/Store  │
              └────────┬────────┘
                       ↓
              ┌─────────────────┐
              │ Feature Engine  │
              └────────┬────────┘
                       ↓
             ┌─────────┴──────────┐
             ↓                    ↓
      Fuel Prediction       Cost/Emission
             │                    │
             └─────────┬──────────┘
                       ↓
              ┌─────────────────┐
              │ Current Scenario│
              └────────┬────────┘
                       ↓
          ┌────────────┴────────────┐
          ↓                         ↓
    BASELINE PLAN            OPTIMIZATION ENGINE
                                  │
                         ┌────────┴────────┐
                         ↓                 ↓
                  Conventional      Quantum-Inspired
                    Methods              Method
                         │                 │
                         └────────┬────────┘
                                  ↓
                         Constraint Validation
                                  ↓
                           Pareto Solutions
                                  ↓
                         Scenario Evaluation
                                  ↓
                         FastAPI + WebSocket
                                  ↓
                         Operations Dashboard
                                  ↓
                           Operator Decision
                                  ↓
                            New Live Data
                                  ↓
                           Re-optimization
```

# Implementation Order

The team should build in this order:

```text
1. Database + data schemas
2. Data ingestion APIs
3. Data validation
4. Baseline operating plan
5. Fuel prediction model
6. Cost + GHG calculation
7. Optimization problem formulation
8. Conventional optimization baseline
9. Quantum-inspired optimizer
10. Constraint validation
11. Pareto optimization
12. FastAPI services
13. Background optimization workers
14. WebSocket real-time layer
15. Dashboard
16. Scenario simulator
17. Alerts
18. Benchmarking
19. Load/scalability testing
20. End-to-end deployment
```

This order is important: **build the data and baseline first, then prediction, then optimization, and only after those are reliable connect the real-time dashboard.** That prevents the project from becoming a UI demo with an unverified optimization engine.

# Concrete Modules & Team Ownership

## Team Structure

For a typical **4–6 member SIH team**, use the following ownership model:

| Module                             | Primary Owner           | Secondary Owner       |
| ---------------------------------- | ----------------------- | --------------------- |
| 1. Data & Integration              | Backend/Data Engineer   | DevOps                |
| 2. Fleet & Operational Model       | Backend/OR Engineer     | Optimization Engineer |
| 3. Fuel Prediction                 | ML Engineer             | Data Engineer         |
| 4. Optimization Engine             | Optimization Engineer   | ML Engineer           |
| 5. Real-Time Engine                | Backend Engineer        | DevOps                |
| 6. Scenario & Analytics            | Optimization Engineer   | Backend Engineer      |
| 7. Frontend & Operations Dashboard | Frontend Engineer       | Backend Engineer      |
| 8. Platform, Testing & Deployment  | DevOps/Backend Engineer | Entire Team           |

If you have only **4 people**, combine:

```text
Person 1 → Backend + Data + Real-Time
Person 2 → ML + Data
Person 3 → Optimization + Scenario Engine
Person 4 → Frontend + Deployment
```

If you have **6 people**, split the responsibilities as shown in the main table.

---

# Module 1 — Data & Integration

### Owner

**Data/Backend Engineer**

### Responsibility

Build the complete data-ingestion layer.

### Components

```text
AIS Connector
Weather Connector
Fuel Data Connector
Cargo Connector
Port Data Connector
IoT/Telemetry Connector
```

### Responsibilities

* External API integration
* Data ingestion
* Data normalization
* Schema validation
* Timestamp handling
* Source tracking
* Live/historical/simulation flags
* Missing-data detection
* Duplicate detection

### Main output

A normalized internal data stream:

```json
{
  "vessel_id": "V001",
  "timestamp": "...",
  "latitude": 12.34,
  "longitude": 56.78,
  "speed": 14.2,
  "engine_load": 72,
  "fuel_flow": 3.8,
  "source": "LIVE"
}
```

### Interface

```text
Data Sources
     ↓
Data Integration Module
     ↓
Validated Internal Data
```

### Definition of Done

* Real data can enter the platform.
* Every record has a timestamp.
* Every record has a source.
* Invalid records are rejected/quarantined.
* Downstream modules never need to understand external API formats.

---

# Module 2 — Fleet & Operational Model

### Owner

**Backend / Operations Engineer**

### Responsibility

Create the digital representation of the fleet and operational constraints.

### Components

```text
Vessel Model
Voyage Model
Cargo Model
Route Model
Port Model
Fuel Model
Constraint Model
```

### Data models

```text
Vessel
 ├── capacity
 ├── engine
 ├── fuel capabilities
 ├── operational limits
 └── availability

Voyage
 ├── origin
 ├── destination
 ├── cargo
 ├── deadline
 └── route

Fuel
 ├── type
 ├── price
 ├── availability
 └── emission factor
```

### Responsibilities

* PostgreSQL schema
* CRUD APIs
* Fleet status
* Cargo requirements
* Vessel availability
* Fuel compatibility
* Route information
* Operational constraints

### Definition of Done

The optimizer can receive a complete machine-readable scenario without accessing the frontend or external APIs.

---

# Module 3 — Fuel Prediction Engine

### Owner

**ML Engineer**

### Secondary

Data Engineer

### Responsibility

Predict fuel consumption for a vessel/voyage under current or simulated conditions.

### Pipeline

```text
Historical Data
      ↓
Preprocessing
      ↓
Feature Engineering
      ↓
Model Training
      ↓
Validation
      ↓
Model Registry
      ↓
Prediction Service
```

### Inputs

```text
Vessel
Speed
Cargo
Distance
Fuel
Weather
Wind
Wave
Current
Draft
Engine characteristics
```

### Outputs

```text
Predicted fuel consumption
Prediction uncertainty
Model version
```

Cost and emissions should then be calculated using the appropriate fuel-price and emission-factor data.

### Responsibilities

* Dataset preparation
* Feature engineering
* Model selection
* Model training
* Evaluation
* Model versioning
* Inference API
* Drift monitoring

### Definition of Done

The model meets the agreed validation metrics on unseen data and can be called through an API.

---

# Module 4 — Optimization Engine

### Owner

**Optimization / OR Engineer**

### Secondary

ML Engineer

This is the **core research module**.

### Responsibility

Find feasible fleet strategies that optimize:

```text
Fuel
Cost
GHG
```

### Decision variables

```text
Vessel assignment
Cargo assignment
Route
Speed
Fuel
Shore power
```

### Constraints

```text
Capacity
Availability
Fuel compatibility
Fuel availability
Schedule
Port restrictions
Operational limits
Regulations
```

### Internal architecture

```text
Optimization Problem
        ↓
Objective Functions
        ↓
Constraint System
        ↓
┌───────────────────────┐
│ Algorithm Interface   │
└───────────┬───────────┘
            ↓
 ┌──────────┴───────────┐
 ↓                      ↓
Conventional       Quantum-Inspired
Algorithms          Algorithm
 └──────────┬───────────┘
            ↓
      Solution Evaluator
            ↓
      Feasible Solutions
```

### Algorithms

At minimum:

```text
Rule-Based Baseline
One conventional optimizer
Quantum-inspired optimizer
```

Additional algorithms can be added if time permits.

### Definition of Done

Given the same scenario, the module can return:

```text
Feasible fleet plan
Fuel consumption
Cost
GHG
ETA
Constraint status
Runtime
Algorithm used
```

---

# Module 5 — Real-Time Event & Re-Optimization Engine

### Owner

**Backend Engineer**

### Secondary

DevOps Engineer

### Responsibility

Connect live changes to prediction and optimization.

### Event types

```text
VESSEL_POSITION_UPDATED
WEATHER_UPDATED
FUEL_PRICE_UPDATED
CARGO_UPDATED
VESSEL_UNAVAILABLE
CONSTRAINT_CHANGED
```

### Workflow

```text
Live Event
    ↓
Event Processor
    ↓
Is current plan affected?
    │
    ├── NO → Update dashboard
    │
    └── YES
          ↓
      Recalculate prediction
          ↓
      Re-optimize
          ↓
      Validate
          ↓
      Push recommendation
```

### Technologies

```text
Redis
WebSockets
Background Workers
FastAPI
```

Kafka/Redpanda can be introduced if the system eventually requires higher-volume streaming.

### Definition of Done

A controlled change in weather, vessel availability, fuel price, or cargo causes the appropriate prediction/optimization workflow and updates the UI without a page refresh.

---

# Module 6 — Scenario & Analytics Engine

### Owner

**Optimization Engineer**

### Secondary

Backend Engineer

### Responsibility

Provide decision-support analysis on top of the optimization engine.

### Scenario types

```text
Fuel price +20%
Cargo demand +10%
Wind +20%
Vessel unavailable
Earlier deadline
Fuel switched
Shore power enabled
```

### Workflow

```text
Current Scenario
      ↓
Modify Parameters
      ↓
Run Prediction
      ↓
Run Optimization
      ↓
Compare with Baseline
      ↓
Generate Results
```

### Outputs

```text
Fuel difference
Cost difference
GHG difference
ETA difference
Fleet allocation
Feasibility
```

### Analytics

Also provide:

```text
Fuel trends
Cost trends
GHG trends
Fleet utilization
Prediction accuracy
Algorithm benchmark
```

### Definition of Done

An operator can modify scenario parameters and receive a reproducible comparison between baseline and optimized strategies.

---

# Module 7 — Frontend & Operations Dashboard

### Owner

**Frontend Engineer**

### Secondary

Backend Engineer

### Responsibility

Build the operator-facing control center.

## Screen A — Fleet Overview

```text
┌───────────────────────────────────────────────┐
│ Active Vessels │ Fuel │ Cost │ GHG │ Alerts │
├───────────────────────────────────────────────┤
│                                               │
│              LIVE FLEET MAP                   │
│                                               │
├───────────────────────────────────────────────┤
│ Active Voyages │ ETAs │ Critical Alerts      │
└───────────────────────────────────────────────┘
```

## Screen B — Vessel Details

Show:

```text
Position
Speed
Engine state
Fuel consumption
Predicted fuel
ETA
Current plan
Recommended plan
```

## Screen C — Optimization Studio

```text
Cargo
Vessels
Deadline
Fuel
Budget
Emission target

        ↓

RUN OPTIMIZATION
```

Then display:

```text
Baseline
Solution 1
Solution 2
Solution 3
```

with:

```text
Fuel
Cost
GHG
ETA
Feasibility
```

## Screen D — Scenario Simulator

```text
Fuel price     [ +20% ]
Weather        [ +15% ]
Cargo demand   [ +10% ]
Deadline       [ -30 min ]

        ↓

RUN SCENARIO
```

## Screen E — Benchmarking

Show:

```text
Rule-Based
GA
Quantum-Inspired
```

and compare:

```text
Runtime
Fuel
Cost
GHG
Convergence
```

### Definition of Done

The complete platform can be operated without developers manually editing database records or running notebooks.

---

# Module 8 — Platform, Testing & Deployment

### Owner

**DevOps / Backend Engineer**

### Secondary

Entire team

### Responsibility

Make every module reproducible and deployable.

### Components

```text
Docker
Docker Compose
CI/CD
Environment configuration
Logging
Monitoring
Health checks
Testing
```

### Services

```text
frontend
backend
postgres
redis
ml-service
optimization-worker
```

### Testing layers

```text
Unit Tests
    ↓
Integration Tests
    ↓
API Tests
    ↓
ML Validation
    ↓
Optimization Tests
    ↓
Real-Time Tests
    ↓
End-to-End Tests
    ↓
Load Tests
```

### Definition of Done

A fresh machine should be able to start the entire platform using the documented deployment process.

---

# Module Interfaces

The most important rule is that modules communicate through **defined interfaces**, not by directly modifying each other's code.

```text
                 ┌───────────────┐
                 │ Data Module   │
                 └───────┬───────┘
                         ↓
                 ┌───────────────┐
                 │ Fleet Model   │
                 └───────┬───────┘
                         ↓
              ┌──────────┴──────────┐
              ↓                     ↓
      ┌───────────────┐     ┌────────────────┐
      │ Fuel ML       │     │ Baseline       │
      └───────┬───────┘     └───────┬────────┘
              │                     │
              └──────────┬──────────┘
                         ↓
                ┌────────────────┐
                │ Optimization   │
                └───────┬────────┘
                        ↓
                ┌────────────────┐
                │ Scenario       │
                └───────┬────────┘
                        ↓
                ┌────────────────┐
                │ Backend API    │
                └───────┬────────┘
                        ↓
                ┌────────────────┐
                │ Dashboard      │
                └────────────────┘
```

---

# Ownership Rules

## 1. One Owner Per Module

There should be exactly **one primary owner**.

The secondary owner can review code and help with integration, but the primary owner is responsible for completion.

## 2. Shared Interfaces Are Team Contracts

Before implementation, agree on:

```text
Database schema
API schemas
Optimization input/output schema
ML prediction schema
WebSocket event schema
```

After that, teams can work in parallel.

## 3. No Direct Cross-Module Hacks

For example, the frontend should never:

```text
directly query PostgreSQL
```

and the optimizer should never:

```text
directly modify React state
```

Instead:

```text
Frontend → API
Optimizer → Service Interface
Data → Ingestion Interface
```

---

# Suggested 6-Person Ownership

### Member 1 — Backend & Data

Own:

```text
Module 1
Module 2
```

### Member 2 — ML Engineer

Own:

```text
Module 3
```

### Member 3 — Optimization Engineer

Own:

```text
Module 4
```

### Member 4 — Real-Time + Backend

Own:

```text
Module 5
```

### Member 5 — Frontend

Own:

```text
Module 7
```

### Member 6 — Scenario + DevOps

Own:

```text
Module 6
Module 8
```

Everyone contributes to integration, testing, documentation, and the final SIH demonstration.

---

# Critical Integration Milestones

## Milestone 1 — Data Ready

```text
Real/supported data
       ↓
Database
       ↓
API
```

## Milestone 2 — Prediction Ready

```text
API
 ↓
Fuel Model
 ↓
Prediction
```

## Milestone 3 — Baseline Ready

```text
Scenario
 ↓
Baseline Plan
 ↓
Metrics
```

## Milestone 4 — Optimization Ready

```text
Scenario
 ↓
Baseline
 ↓
Quantum-Inspired
 ↓
Feasible Solutions
```

## Milestone 5 — Real-Time Ready

```text
Live Event
 ↓
Prediction
 ↓
Re-optimization
 ↓
WebSocket
 ↓
Dashboard
```

## Milestone 6 — Evaluation Ready

```text
Baseline
   VS
Conventional
   VS
Quantum-Inspired

        ↓

Fuel
Cost
GHG
Feasibility
Runtime
Scalability
```

---

# Final Ownership Principle

The team should think of the project as **one product with independent engineering modules**, not as six separate mini-projects.

The core dependency chain is:

> **Data → Operational Model → Prediction → Baseline → Optimization → Validation → Real-Time Engine → Dashboard → Evaluation**

The **Optimization Engineer owns the algorithmic novelty**, the **ML Engineer owns prediction quality**, the **Backend/Data Engineer owns data correctness**, the **Frontend Engineer owns operator usability**, and **DevOps owns reproducibility and deployment**.

That division gives every team member a concrete deliverable while keeping the final system integrated.

# Final SIH Demo Workflow

The final demonstration should be one continuous story.

### Step 1 — Start with live fleet

```text
5–10 vessels
Multiple voyages
Cargo assignments
Current positions
```

### Step 2 — Show current operating plan

```text
Baseline:

Fuel = X
Cost = Y
GHG = Z
ETA = ...
```

### Step 3 — Run optimization

```text
Quantum-Inspired Optimization
        ↓
Candidate solutions
        ↓
Constraint validation
        ↓
Pareto frontier
```

### Step 4 — Show comparison

```text
                 Baseline    Optimized
Fuel               X            Y
Cost               X            Y
GHG                X            Y
ETA                X            Y
Feasible           YES          YES
```

### Step 5 — Introduce a real-time event

For example:

```text
⚠ Strong headwind detected
```

### Step 6 — Show automatic response

```text
Weather Update
      ↓
Fuel Prediction Changes
      ↓
Current Plan Re-evaluated
      ↓
Optimization Triggered
      ↓
New Feasible Plan
      ↓
Dashboard Updates
```

### Step 7 — Show algorithm benchmark

```text
Algorithm             Runtime    Objective
------------------------------------------------
Rule-Based             ...
Genetic Algorithm      ...
Quantum-Inspired       ...
```

### Step 8 — Show scenario simulation

Change:

```text
Fuel price +20%
```

and demonstrate how the recommended strategy changes.

---

# Recommended Development Timeline

If the team has approximately **8–10 weeks**, use:

| Week | Focus            | Main Deliverable                         |
| ---: | ---------------- | ---------------------------------------- |
|    1 | Architecture     | Schemas, APIs, repo, Docker              |
|    2 | Data             | Ingestion + PostgreSQL                   |
|    3 | Baseline + ML    | BOP + fuel prediction                    |
|    4 | Optimization     | Formal model + conventional algorithm    |
|    5 | Quantum-Inspired | Main optimizer + constraints             |
|    6 | Real-Time        | Redis + workers + WebSockets             |
|    7 | Dashboard        | Fleet + optimization UI                  |
|    8 | Scenarios        | What-if + alerts                         |
|    9 | Benchmarking     | Accuracy + algorithm + scalability tests |
|   10 | Hardening        | Deployment + testing + final demo        |

If time is shorter, **do not reduce the core data → baseline → prediction → optimization pipeline**. Reduce secondary features such as advanced analytics, large-scale infrastructure, or additional algorithms instead.

---

# Phase Gates

Each phase should have a hard acceptance test.

```text
PHASE 0
Architecture works
       ↓
PHASE 1
Data flows correctly
       ↓
PHASE 2
Baseline + prediction work
       ↓
PHASE 3
Optimization produces feasible solutions
       ↓
PHASE 4
System reacts to live events
       ↓
PHASE 5
Operator can use dashboard
       ↓
PHASE 6
Scenarios produce explainable changes
       ↓
PHASE 7
Claims are experimentally validated
       ↓
PHASE 8
Complete system deploys and demos
```

## Critical Principle

**Do not build the frontend first.**

The recommended order is:

> **Data → Baseline → Prediction → Optimization → Real-Time → UI → Benchmarking → Deployment**

That gives the team a working technical core early and prevents the final project from becoming a visually impressive dashboard backed by unvalidated ML or optimization logic.

# 31. Screen Connectivity & Application Flow

The 16 UI screens are views of one connected platform. They must not be implemented as isolated mockups. All screens consume shared backend APIs, PostgreSQL operational data, Redis/event infrastructure, ML services, optimization workers, and WebSocket updates.

## 31.1 Complete Screen Map

```text
LOGIN
  ↓
FLEET OVERVIEW
  ├──→ VESSEL DETAILS ──→ LIVE TELEMETRY ──→ ML PREDICTION
  ├──→ VOYAGES & CARGO ──→ OPTIMIZATION STUDIO
  └──→ ALERTS ────────────→ RE-OPTIMIZATION
                                  ↓
                         OPTIMIZATION RESULTS
                           ├──→ SCENARIO SIMULATOR
                           ├──→ OPTIMIZATION HISTORY
                           └──→ REPORTS & ANALYTICS

Supporting screens:
SETTINGS
LIVE DATA & INTEGRATIONS
MAINTENANCE
USER MANAGEMENT
SYSTEM HEALTH & MONITORING
```

## 31.2 Screen Inventory

| # | Screen | Main responsibility | Primary data/services |
|---|---|---|---|
| 1 | Login | Authentication | Auth/RBAC |
| 2 | Fleet Overview | Fleet-wide operational view | Vessels, voyages, telemetry, alerts |
| 3 | Vessel Details | Single-vessel operational state | Vessel, voyage, prediction |
| 4 | Voyages & Cargo | Cargo/voyage planning | Voyages, cargo, ports, routes |
| 5 | Optimization Studio | Define and launch optimization | Scenario, constraints, optimizer |
| 6 | Optimization Results | Compare feasible solutions | Baseline, conventional, quantum-inspired |
| 7 | Scenario Simulator | What-if analysis | Scenario engine, ML, optimizer |
| 8 | Alerts & Notifications | Operational risk/action | Event processor, rules, optimizer |
| 9 | Reports & Analytics | Historical performance | Analytics service, stored results |
| 10 | Settings | System/business configuration | Configuration service |
| 11 | Live Data & Integrations | Source health and freshness | Connectors, ingestion logs |
| 12 | Vessel Live Telemetry | Real-time vessel measurements | AIS/IoT/WebSocket |
| 13 | Maintenance & Predictive Maintenance | Asset health | Telemetry, maintenance, ML/rules |
| 14 | User Management | Users, roles, permissions | Auth/RBAC |
| 15 | Optimization Run History | Historical optimization runs | Optimization run/result tables |
| 16 | System Health & Monitoring | Platform/infrastructure health | API, workers, DB, Redis, connectors |

## 31.3 Core UI Flow

```text
Operator Login
      ↓
Fleet Overview
      ↓
Select Vessel / Voyage
      ↓
View Live State
      ↓
Open Optimization Studio
      ↓
Define Objectives + Constraints
      ↓
Run Optimization Job
      ↓
Baseline vs Conventional vs Quantum-Inspired
      ↓
Constraint Validation
      ↓
Pareto Solutions
      ↓
Operator Selects Feasible Plan
      ↓
Plan Stored
      ↓
Live Monitoring
      ↓
New Data / Event
      ↓
Re-prediction + Re-optimization
      ↓
Updated Recommendation
```

## 31.4 Backend Connectivity Rule

The frontend must never directly read or modify PostgreSQL. Every operational interaction follows:

```text
Screen
  ↓
REST API / WebSocket
  ↓
Service Layer
  ↓
Database / Redis / ML / Optimization Worker
```

This keeps business logic out of the UI and makes every screen testable independently.

---

# 32. Expanded Data Model

The original operational tables remain the foundation. The following additional entities are required to support the full 16-screen platform.

## 32.1 Identity and Access

### users

```text
id
email
name
password_hash / identity_provider_id
role_id
status
created_at
last_login_at
```

### roles

```text
id
name
permissions
```

### audit_logs

```text
id
user_id
action
resource_type
resource_id
timestamp
metadata
```

## 32.2 Maritime Network

### ports

```text
id
name
unlocode
latitude
longitude
country
shore_power_available
operating_constraints
```

### routes

```text
id
origin_port_id
destination_port_id
name
distance_nm
estimated_duration
status
```

### route_segments

```text
id
route_id
sequence
start_latitude
start_longitude
end_latitude
end_longitude
distance_nm
speed_limit
restricted
```

## 32.3 Fuel and Vessel Compatibility

### fuel_types

```text
id
name
energy_density
emission_factor
price_unit
availability_status
```

### vessel_fuel_compatibility

```text
id
vessel_id
fuel_type_id
compatible
maximum_usage
notes
```

### shore_power_records

```text
id
port_id
available
connection_capacity
price
emission_factor
timestamp
```

## 32.4 Scenarios and Optimization

### scenarios

```text
id
name
base_scenario_id
created_by
parameters
created_at
status
```

### optimization_runs

```text
id
scenario_id
algorithm
status
started_at
completed_at
runtime_ms
objective_values
constraint_summary
model_version
```

### optimization_solutions

```text
id
optimization_run_id
rank
vessel_assignments
route_assignments
speed_assignments
fuel_assignments
shore_power_assignments
fuel_consumption
cost
ghg_emissions
eta
feasibility_status
```

## 32.5 Alerts and Maintenance

### alerts

```text
id
alert_type
severity
vessel_id
voyage_id
source
description
status
created_at
acknowledged_by
acknowledged_at
```

### maintenance_records

```text
id
vessel_id
component
maintenance_type
scheduled_at
completed_at
status
notes
```

### maintenance_predictions

```text
id
vessel_id
component
prediction_time
failure_probability
estimated_failure_window
model_version
recommended_action
```

## 32.6 Data Observability

### data_sources

```text
id
name
type
endpoint
status
last_received_at
latency_ms
source_mode
```

### ingestion_logs

```text
id
data_source_id
received_at
processed_at
records_received
records_valid
records_rejected
error_summary
```

### model_versions

```text
id
model_name
version
training_dataset
trained_at
metrics
status
```

---

# 33. Route and Network Model

Route must be a first-class optimization object rather than a text field.

## 33.1 Route Representation

```text
Origin Port
    ↓
Route Segment 1
    ↓
Waypoint / Sea Lane
    ↓
Route Segment 2
    ↓
Destination Port
```

Each route should have:

```text
Distance
Estimated travel time
Segment speed limits
Restricted areas
Port restrictions
Weather exposure
Current/wind conditions
Fuel consumption estimate
```

## 33.2 Route Decision Variables

The optimizer may select:

```text
route_id
segment selection
vessel
speed by segment
fuel type
shore power at destination/origin
```

## 33.3 Route Constraints

```text
Route availability
Geographical validity
Restricted areas
Draft restrictions
Speed limits
Port compatibility
Vessel capability
Weather safety rules
Arrival deadline
```

## 33.4 Route Cost Calculation

For each candidate route, calculate:

```text
Travel Time
Fuel Consumption
Fuel Cost
GHG Emissions
Port/shore-power cost
Operational penalties
```

The optimizer then compares feasible route plans rather than simply comparing vessel speeds.

---

# 34. Quantum-Inspired Algorithm Implementation Specification

The platform must make a technically defensible distinction between a quantum-inspired classical optimizer and an actual quantum computer. The algorithm executes on classical hardware while using a quantum-inspired representation or search mechanism.

## 34.1 Problem Representation

Represent a candidate fleet plan as a structured decision vector:

```text
X = [vessel_assignment,
     cargo_assignment,
     route,
     speed,
     fuel_type,
     shore_power]
```

Discrete and continuous variables must be handled explicitly.

## 34.2 Fitness / Objective Function

Use normalized objective components:

```text
J(X) = w_f * Fuel(X)
     + w_c * Cost(X)
     + w_g * GHG(X)
     + w_t * SchedulePenalty(X)
     + w_v * ConstraintPenalty(X)
```

For strict feasibility, hard constraints should preferably be handled through feasibility-preserving operators or explicit rejection/repair, rather than relying only on penalties.

Weights must be recorded with every optimization run.

## 34.3 Candidate Generation

The optimizer should:

1. Initialize a population of candidate plans.
2. Encode decision variables using the selected quantum-inspired representation.
3. Generate candidate observations/solutions.
4. Evaluate fuel, cost, GHG and feasibility.
5. Preserve elite solutions.
6. Update the population using the selected quantum-inspired search mechanism.
7. Repair or reject infeasible candidates.
8. Repeat until the stopping criterion is met.

## 34.4 Feasibility Handling

Every candidate must be checked against:

```text
Cargo demand
Vessel capacity
Vessel availability
Fuel compatibility
Fuel availability
Route restrictions
Speed limits
Port restrictions
Arrival deadline
Operational constraints
```

The result must explicitly contain:

```text
feasible = true / false
constraint_violations = []
```

## 34.5 Stopping Criteria

Support configurable:

```text
Maximum iterations
Maximum runtime
Target objective improvement
No-improvement patience
```

## 34.6 Reproducibility

Store:

```text
Random seed
Algorithm version
Population size
Iteration limit
Objective weights
Constraint configuration
Model version
Input scenario ID
```

This allows the team to reproduce an optimization result.

## 34.7 Benchmark Protocol

Run all compared methods against identical:

```text
Scenario
Input data
Constraints
Objective definitions
Hardware environment
Stopping budget
```

Record:

```text
Best objective value
Fuel
Cost
GHG
Feasibility
Runtime
Iterations
Convergence history
Scalability
```

Do not claim the quantum-inspired approach is superior unless the experiment demonstrates it.

---

# 35. Unified 8-Phase Implementation Roadmap with Team Ownership

## Team Ownership Model

| Member | Primary ownership |
|---|---|
| M1 | Backend & Data |
| M2 | ML / Fuel Prediction |
| M3 | Optimization / OR / Quantum-Inspired Algorithm |
| M4 | Real-Time Backend |
| M5 | Frontend / Operations Dashboard |
| M6 | Scenario, Testing & DevOps |

All members support integration, testing, documentation and the final SIH demonstration.

## Phase 0 — Architecture & Contracts

**Primary owner:** M1  
**Supporting:** M2, M3, M4, M5, M6

Deliver:

```text
Database schema
API contracts
ML input/output contract
Optimizer input/output contract
WebSocket events
Module boundaries
Repository structure
Docker skeleton
```

**Gate:** all modules can begin against frozen interfaces.

## Phase 1 — Data Foundation

**Primary owner:** M1  
**Supporting:** M6

Build:

```text
Data connectors
Validation
Normalization
Source tracking
PostgreSQL schema
Redis/event foundation
```

**Gate:** a complete vessel/voyage scenario is retrievable through an API.

## Phase 2 — Baseline + Fuel Prediction

**Primary owners:** M3 + M2  
**Supporting:** M1

M3 builds the deterministic baseline. M2 builds and validates the fuel model.

**Gate:** one scenario produces baseline metrics plus a validated fuel prediction.

## Phase 3 — Optimization Engine

**Primary owner:** M3  
**Supporting:** M2

Build:

```text
Formal optimization model
Conventional optimizer
Quantum-inspired optimizer
Constraint validation
Pareto generation
Benchmark harness
```

**Gate:** identical scenarios can be evaluated by baseline, conventional and quantum-inspired methods.

## Phase 4 — Real-Time Intelligence

**Primary owner:** M4  
**Supporting:** M1, M2, M3

Build:

```text
Event processing
Background workers
Redis queues
WebSockets
Real-time prediction update
Re-optimization triggers
```

**Gate:** a controlled weather/vessel/fuel/cargo event causes a new validated recommendation without restarting the application.

## Phase 5 — Operations Dashboard

**Primary owner:** M5  
**Supporting:** M4, M1

Implement all 16 screens incrementally, prioritizing:

```text
Fleet Overview
Vessel Details
Voyages & Cargo
Optimization Studio
Optimization Results
Scenario Simulator
Alerts
```

Then add supporting screens:

```text
Reports
Settings
Data Integrations
Telemetry
Maintenance
User Management
Optimization History
System Monitoring
```

**Gate:** the complete operator workflow can be performed from the UI.

## Phase 6 — Scenario & Decision Support

**Primary owner:** M6  
**Supporting:** M3, M4, M5

Implement:

```text
Fuel-price scenarios
Weather scenarios
Cargo-demand scenarios
Vessel-unavailability scenarios
Deadline scenarios
Alternative-fuel scenarios
Shore-power scenarios
```

**Gate:** each scenario is reproducible and uses the same production prediction/optimization services.

## Phase 7 — Benchmarking & Validation

**Primary owner:** M3  
**Supporting:** M2, M4, M6, M1

Measure:

```text
Prediction accuracy
Fuel/cost/GHG outcomes
Constraint compliance
Algorithm quality
Runtime
Convergence
Real-time latency
API latency
Data quality
Scalability
```

**Gate:** measured experimental results are stored and reproducible.

## Phase 8 — Deployment & SIH Demonstration

**Primary owner:** M6  
**Supporting:** entire team

Finalize:

```text
Docker deployment
Environment configuration
Health checks
Logging
Monitoring
Test suite
Demo dataset/source configuration
Documentation
```

**Gate:** a clean environment can start the full system using the documented deployment process.

---

# 36. Final SIH Acceptance Checklist

Before calling the project complete, verify every item.

## Data

- [ ] Every operational value has a source.
- [ ] Every source has a timestamp/freshness indicator.
- [ ] Simulation data is explicitly labelled SIMULATION.
- [ ] Missing data is never silently replaced with fake live values.
- [ ] Data validation and rejection rules are implemented.

## ML

- [ ] Fuel model is trained on a documented dataset.
- [ ] Test data is separated from training data.
- [ ] MAE/MAPE/R² are recorded.
- [ ] Model version is stored with predictions.
- [ ] Prediction uncertainty is exposed where supported.

## Optimization

- [ ] Baseline is deterministic and reproducible.
- [ ] Conventional optimizer exists.
- [ ] Quantum-inspired optimizer is actually implemented.
- [ ] Objectives are explicitly defined.
- [ ] Constraints are explicitly defined.
- [ ] Infeasible solutions are identified.
- [ ] Pareto solutions can be generated.
- [ ] Algorithm runs are reproducible.
- [ ] Benchmark results are measured rather than assumed.

## Real-Time

- [ ] Events are processed asynchronously.
- [ ] WebSocket updates reach the UI.
- [ ] Re-optimization can be triggered by new data.
- [ ] Stale/unavailable data states are visible.

## Backend

- [ ] APIs are versioned.
- [ ] Authentication is enforced.
- [ ] RBAC is implemented.
- [ ] Long optimization jobs run asynchronously.
- [ ] Audit logs exist for important actions.

## Frontend

- [ ] All 16 screens use real API contracts.
- [ ] No hard-coded operational KPIs remain.
- [ ] Loading, error, stale and empty states are handled.
- [ ] Optimization results are traceable to a run ID.
- [ ] Data source status is visible.

## Deployment

- [ ] Docker Compose starts the MVP.
- [ ] Health checks work.
- [ ] Logs are available.
- [ ] Environment variables/secrets are externalized.
- [ ] A fresh-machine deployment has been tested.

---

# 37. Final Product Definition

The final platform is a connected maritime decision-support system combining:

**Live Fleet Monitoring + AI Fuel Prediction + Baseline Planning + Multi-Objective Optimization + Quantum-Inspired Search + Conventional Benchmarking + Alternative Fuel Planning + Shore Power + Scenario Simulation + Real-Time Re-Optimization + Operational Analytics.**

The complete operational loop is:

```text
REAL-WORLD DATA
      ↓
INGESTION + VALIDATION
      ↓
OPERATIONAL DATABASE / EVENT STREAM
      ↓
FUEL PREDICTION + COST/GHG MODELS
      ↓
BASELINE
      ↓
CONVENTIONAL + QUANTUM-INSPIRED OPTIMIZATION
      ↓
CONSTRAINT VALIDATION
      ↓
PARETO SOLUTIONS
      ↓
OPERATOR DECISION
      ↓
LIVE DASHBOARD
      ↓
NEW EVENT / DATA
      ↓
RE-PREDICTION
      ↓
RE-OPTIMIZATION
```

## Final Engineering Principle

> **Build the data and baseline first, validate prediction second, build and benchmark optimization third, connect real-time processing fourth, and only then finalize the complete operational dashboard.**

The dashboard is the interface to the intelligence system; it is not the intelligence system itself.

## Final Measurement Principle

> **Every claim of improvement must be supported by an experiment using the same scenario, constraints and evaluation budget across the baseline, conventional method and quantum-inspired method.**

## Final Data Principle

> **Every displayed operational value must be traceable to LIVE, HISTORICAL, or SIMULATION data with a source and timestamp.**
