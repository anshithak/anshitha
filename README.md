# Hyper-Local Food Rescue Network (Demo)

A beginner-friendly front-end demo website for a food rescue platform where:
- Donors post leftover food.
- Receivers/NGOs claim listings.
- Volunteers complete pickups and deliveries.
- Route recommendation and social-credit gamification are showcased.

## Quick Start (recommended)

From this folder, run:

```bash
python3 -m http.server 8000
```

Then open:

- http://localhost:8000

## If the page is not visible

- Ensure you opened `http://localhost:8000` (not a different port).
- Ensure the command was run from this same folder (`/workspace/anshitha`).
- If port 8000 is busy, run:

```bash
python3 -m http.server 8080
```

and open http://localhost:8080.

## Demo features

- Donor listing form
- Live listing feed with status timeline
- Preloaded sample listings so the UI is immediately visible
- Simple route suggestion algorithm
- Social credits and badge milestones
- Build plan section for MERN, Django+React, Firebase+Flutter
