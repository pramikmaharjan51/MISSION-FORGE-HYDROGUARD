# Data sources and scientific integrity

## Directly integrated dataset
- **NASA POWER Daily API** — https://power.larc.nasa.gov/docs/services/api/temporal/daily/
- API endpoint: `https://power.larc.nasa.gov/api/temporal/daily/point`
- Parameters used: `PRECTOTCORR` (corrected precipitation, mm/day) and `T2M` (2 m air temperature, °C).
- The browser requests a recent 60-day time series for one selected point and compares adjacent 30-day windows.
- NASA POWER daily data documentation describes the API as analysis-ready daily solar and meteorological time series, with daily data available from 1981 to near real time: https://power.larc.nasa.gov/docs/services/api/temporal/daily/

## Additional reference sources for future development
- NASA Open Data Portal: https://data.nasa.gov/
- NASA SMAP soil moisture: https://smap.jpl.nasa.gov/data/
- NASA GPM precipitation: https://gpm.nasa.gov/data
- NASA Earthdata: https://www.earthdata.nasa.gov/

## Method and limitations
- Rainfall total = sum of valid `PRECTOTCORR` values in each 30-day window.
- Mean temperature = average of valid `T2M` values in each 30-day window.
- Prototype signal score = capped weighted combination of percentage rainfall decline and positive temperature change. It is an explainable demo heuristic, not an official drought index or validated forecast.
- Observation credits are normalized to total 100 and allocated among precipitation mapping, thermal observation and a soil-moisture confirmation request. Soil moisture is not fetched in this build; the third category is a proposed follow-up, not a measured result.
- NASA POWER gridded/model-assisted estimates should not be represented as local rain-gauge observations. Local validation and uncertainty analysis are required before real-world use.

## Simulated spacecraft values
All instrument mass, power, data-volume, subsystem cost, launch capacity and budget-credit values are illustrative. They are not real hardware specifications. Orbit compatibility is simplified game logic and does not calculate trajectories or flight dynamics.

## Originality and invention claims
HydroGuard is presented as a proposed architecture and workflow: adaptive observation prioritization, targeted revisit requests, store-and-forward data handling, and a community-facing information layer. The project does not claim that each component is unprecedented or patentable. A prior-art review and engineering validation would be needed for any stronger novelty claim.

## Attribution / affiliation
NASA POWER is a NASA data service. This independent prototype is not affiliated with, sponsored by, or endorsed by NASA.
