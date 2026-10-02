# CAD Annotation Add-on · Command Reference

> Anonymized. Command names illustrative.

## `zeiss`
Label X/Y/Z at a selected point.

| Arg | Type | Default |
|-----|------|---------|
| `pt` | point | — |
| `height` | real | 0.1 |

Error: no point → `*error*` restores OSNAP.

## `coord`
Batch-number points, export to field formats.

| Arg | Values |
|-----|--------|
| `mode` | `"sdr"` \| `"gre"` |

Output: `.sdr` (Sokkia), `.gre` (Leica). Empty set → no file.

## Localization
RU / EN hints toggled via `.lsp` header flag.

---
*Docs style: API-reference prototype (syntax → args → error-cases → examples).*
