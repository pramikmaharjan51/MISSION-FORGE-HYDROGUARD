[README.md](https://github.com/user-attachments/files/34867084/README.md)
# MISSION FORGE: HYDROGUARD
**Adaptive Earth-observation mission design simulator**  
NASA Space Apps Challenge 2026 — independent educational prototype

## The problem
Water insecurity is intensified by changing rainfall and temperature patterns. Local decision-makers can struggle to turn large-scale Earth observations into timely, understandable signals. HydroGuard explores how a purpose-built satellite mission and a transparent data-to-action workflow could help identify where closer monitoring may be useful.

## The proposed invention / mission concept
**HydroGuard** is a proposed cooperative, adaptive Earth-observation mission concept. A future small-satellite constellation would combine precipitation, soil-moisture and thermal observations. A ground-side scheduler would reallocate a limited observation budget toward regions showing stronger changes, request targeted revisits, and present uncertainty-labelled information to local water managers.

The prototype demonstrates three parts of that concept:
1. **Mission Forge:** configure science instruments, spacecraft subsystems, orbit, launch class and budget; review simplified mass, power, data and cost constraints.
2. **NASA Earth-data lab:** request daily precipitation (`PRECTOTCORR`) and 2 m air temperature (`T2M`) for four sample study areas through the NASA POWER Daily API.
3. **Adaptive observation scheduler:** compare two adjacent 30-day windows and allocate 100 illustrative observation credits among precipitation mapping, thermal observation and a soil-moisture confirmation request.

This is an original project concept, not a claim that the constellation or scheduler is already deployed or that no similar system exists. A novelty search and expert review would be needed before claiming patent-level uniqueness.

## Run it
1. Download and unzip the project.
2. Open `index.html` in a modern browser.
3. For best results, run a local static server from this folder:
   - `python -m http.server 8000`
   - Visit `http://localhost:8000`
4. Select a study area and press **LOAD NASA EARTH DATA**. An internet connection is required for the NASA POWER API request.

No build step or API key is required. Google Fonts are optional; the project falls back to system fonts.

## NASA data and calculations
- Provider: NASA POWER (Prediction Of Worldwide Energy Resources)
- API: https://power.larc.nasa.gov/api/temporal/daily/point
- Documentation: https://power.larc.nasa.gov/docs/services/api/temporal/daily/
- Parameters: `PRECTOTCORR` (corrected precipitation, mm/day) and `T2M` (2 m air temperature, °C)
- Data request: one location at a time; recent 60-day period with a short end-date buffer to accommodate data latency.
- The application sums precipitation and averages temperature for the latest 30 valid daily records, then compares those values with the preceding 30 valid records.
- The displayed prototype signal is a transparent heuristic: rainfall decline and temperature increase contribute to a 0–100 triage score. The scheduler distributes 100 illustrative observation credits using those same signals.

**Important:** this score is not a recognized drought index, validated forecast, public warning, or operational decision tool. NASA POWER values are gridded/model-assisted estimates and are not equivalent to a local rain gauge. The soil-moisture allocation is a proposed follow-up observation request; this version does not fetch soil-moisture data. The prototype should be validated against local gauges, official drought indicators, agricultural data and domain experts before any real-world use.

## What is simulated
- Instrument mass, power, data volume and cost credits are illustrative teaching parameters.
- Launcher capacities and subsystem costs are not real vendor specifications.
- Orbit compatibility is a simplified scenario rule, not a trajectory solver.
- The animated orbital graphic is illustrative and not a physical orbit simulation.
- HydroGuard's constellation, revisit policy, store-and-forward workflow and community action layer are proposed design concepts, not deployed hardware or an operational warning service.

## Why space data matters
Satellite observations provide broad-area coverage that can complement local measurements. HydroGuard's long-term concept is to fuse multiple observation types and direct limited revisit opportunities toward places where conditions are changing. This prototype only demonstrates the first data-to-priority step using NASA POWER precipitation and temperature.

## Submission / judging preparation
- Demonstrate a successful live NASA POWER data request in the browser.
- Explain the challenge, mission concept, data source, calculation and limitations.
- Include screenshots and a short demo within the current official submission limits.
- Disclose all AI tools used and follow the current 2026 rules for AI-generated content and assets.
- Ensure the project link is public and accessible without login.
- Use the actual selected challenge from the team's Space Apps registration; do not submit under a self-created challenge if global judging eligibility is the goal.

## Attribution and affiliation
NASA POWER is a NASA data service. NASA does not endorse this independent student project. This project is not affiliated with, sponsored by, or endorsed by NASA or any Space Agency Partner. Follow the data provider's current attribution and usage guidance.
