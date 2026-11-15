# HydroGuard — submission kit

## Short project summary
HydroGuard is an adaptive Earth-observation mission concept embedded in MISSION FORGE, an interactive space mission design simulator. It addresses water insecurity by exploring how satellite observations of rainfall, soil moisture and temperature could help identify where closer monitoring is needed. The prototype directly requests NASA POWER daily precipitation and temperature data, compares adjacent 30-day periods, and uses a transparent heuristic to distribute a limited observation budget among precipitation mapping, thermal observation and a soil-moisture confirmation request. Users can also configure a spacecraft and inspect simplified mass, power, communications, launch and budget trade-offs.

## The problem
Communities need understandable, timely information about changing water conditions. Broad-area satellite observations can complement local monitoring, but raw data alone is not enough: observations must be prioritized, uncertainty must be communicated, and local experts must validate any action.

## Our solution
HydroGuard proposes a small-satellite constellation and a ground-side adaptive observation planner. When a region shows a notable change in rainfall or temperature, the planner shifts limited observation opportunities toward that region, requests complementary measurements, and presents a clear signal with its limitations. The current prototype demonstrates the first prioritization loop using NASA POWER data; it does not operate satellites or issue official warnings.

## What is innovative
- A risk-adaptive observation budget rather than a fixed, uniform schedule.
- A multi-sensor concept that links precipitation, microwave soil-moisture and thermal observations.
- A store-and-forward concept for observations collected outside ground-station contact windows.
- A community-facing layer that turns complex data into cautious, uncertainty-labelled monitoring prompts.
- An interactive mission design game that lets participants test the spacecraft trade-offs behind the proposed solution.

These are proposed design contributions, not a claim of patent-level novelty or that no related systems exist.

## What was actually built
- Browser-based mission design workflow with configurable payload, bus, power, communications, propulsion, launch class, orbit and budget.
- Live NASA POWER Daily API request for `PRECTOTCORR` and `T2M` at four sample study locations.
- Adjacent 30-day comparison and transparent 0–100 prototype signal.
- Adaptive 100-credit observation allocation.
- JSON mission report export.

## What is not yet built
- No deployed satellite constellation, orbital dynamics model, flight software or real satellite command capability.
- No direct SMAP soil-moisture retrieval in this build; the soil-moisture allocation is a proposed confirmation request.
- No validated drought index, forecast or public alert. The prototype score is a simple educational heuristic.
- No local validation against rain gauges, official drought indicators or agricultural impact records.

## Demo sequence (30 seconds)
1. **0–5 s:** Show the mission brief: water insecurity and the HydroGuard mission objective.
2. **5–10 s:** Show the microwave and thermal payload choices, then spacecraft constraints.
3. **10–18 s:** Open the HydroGuard Field Lab, select Kathmandu Valley and load NASA POWER data.
4. **18–24 s:** Point to the two 30-day comparisons and the 100-credit adaptive observation schedule.
5. **24–30 s:** Close on the proposed constellation and the limitation: a prototype signal for research prioritization, not an official warning.

## Seven-slide presentation outline
1. **Title:** MISSION FORGE: HYDROGUARD — Adaptive Earth Observation for Water Security.
2. **Problem:** Water stress is difficult to monitor consistently; satellite data needs to become understandable and actionable.
3. **Mission concept:** A proposed small-satellite constellation combining precipitation, L-band microwave soil-moisture and thermal observations.
4. **How it works:** NASA POWER input → 30-day comparison → transparent prototype signal → adaptive observation credits → expert/community validation.
5. **Live prototype:** Demonstrate the NASA POWER request and observation scheduler.
6. **Engineering & feasibility:** Show payload trade-offs, mass/power/data/budget review, and identify the next engineering validation steps.
7. **Impact, limitations & next steps:** Explain who could benefit, what is not yet validated, and how SMAP/GPM and local data would be integrated next.

## AI-use disclosure draft
AI assistance was used to help develop and refine parts of the code, interface text, project documentation and presentation structure. The project team reviewed and tested the implementation. NASA POWER is the named data source used by the prototype. Any additional AI-generated media or tools used by the team should be disclosed separately according to the current 2026 submission guidance.

## Team-specific details to complete
Add the actual registered team name and members, the exact challenge selected in the official Space Apps portal, the public repository/demo URL, and the actual tools used. Do not claim testing, data validation or team contributions that did not occur.
