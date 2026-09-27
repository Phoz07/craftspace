# Decoupled Property Logistics and Area Scale Multipliers

The preliminary cost engine decouples property type ($M_{\text{property}}$: CONDO=1.00, TOWNHOME=1.10, HOUSE=1.20) from usable area scaling ($F_{\text{area}}$: <=40=1.00, 41-80=1.15, 81-150=1.30, >150=1.45) rather than combining them into a single factor.

## Context and Decision
Townhomes and single-detached houses have vertical stair hauling and higher floor-to-ceiling volumes (2.8m-3.2m vs condo 2.4m-2.6m) regardless of floor area. Decoupling ensures accurate baseline margins while preserving a flat ฿120,000 floor price.
