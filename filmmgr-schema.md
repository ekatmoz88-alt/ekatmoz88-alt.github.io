# FilmMgr Optical Coating Calculator — Configuration Schema
*Author: Kate Motsar (original engineering notes: 29.03.10, SPbGUAP)*
*Re-documented as Docs-as-Code for portfolio purposes*

```yaml
version: "1.0"
software: "FilmMgr (Delphi, legacy)"
purpose: "Multi-layer optical coating optimization"

endpoints:
  - name: "initialize_session"
    description: "Set substrate and spectral range"
    input:
      substrate: { type: "string", enum: ["CaF2", "BaF2", "Ge", "ZnSe"], default: "CaF2" }
      wavelength_range: { type: "array[float]", range: [2.0, 20.0] } # microns
      angle: { type: "float", default: 45.0 }
      polarization: { type: "enum", values: ["S", "P"] }
      
  - name: "optimize_coating"
    description: "Run multi-dimensional optimization"
    method: "Random search + Powell's method"
    constraints:
      spectrum_points: "≤ 100"
      layers: "Multi-layer supported"
    output:
      - R/T/A (%)
      - Phase characteristics
      - Excel / Image export
    known_issues:
      - "Air layer bug affects final calculation"
      - "Deviation from independent calculations noted"
```
