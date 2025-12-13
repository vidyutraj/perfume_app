# Dataset Field Mapping

Your CSV headers are mapped to the Fragrance interface as follows:

## CSV Headers → Fragrance Fields

| CSV Header | Fragrance Field | Notes |
|------------|----------------|-------|
| `url` | `image` | Image URL for the fragrance |
| `Perfume` | `name` | Fragrance name |
| `Brand` | `brand` | Brand name |
| `Country` | `country` | Country of origin |
| `Gender` | `gender` | Target gender (men/women/unisex) |
| `Rating Value` | `rating` | User rating value |
| `Rating Count` | - | Available but not mapped (can be added if needed) |
| `Year` | `year` | Release year |
| `Top` | `top` | Top notes (array) |
| `Middle` | `middle` | Middle notes (array) |
| `Base` | `base` | Base notes (array) |
| `Perfumer1` | - | Available but not mapped (can be added if needed) |
| `Perfumer2` | - | Available but not mapped (can be added if needed) |
| `mainaccord1` | `accords` | Main accord 1 (highest weight: 100%) |
| `mainaccord2` | `accords` | Main accord 2 (weight: 80%) |
| `mainaccord3` | `accords` | Main accord 3 (weight: 60%) |
| `mainaccord4` | `accords` | Main accord 4 (weight: 40%) |
| `mainaccord5` | `accords` | Main accord 5 (weight: 20%) |

## Accords Mapping

The `mainaccord1` through `mainaccord5` fields are combined into a single `accords` object with weighted values:
- `mainaccord1`: 100%
- `mainaccord2`: 80%
- `mainaccord3`: 60%
- `mainaccord4`: 40%
- `mainaccord5`: 20%

## Notes Parsing

The `Top`, `Middle`, and `Base` fields are automatically parsed:
- If they're already arrays, they're used as-is
- If they're comma-separated strings, they're split into arrays
- Empty values are filtered out

## Usage

1. Convert your CSV:
   ```bash
   node scripts/convert-dataset.js your-dataset.csv public/data/fragrances.json
   ```

2. The converter handles:
   - Quoted values in CSV
   - Empty cells
   - Multiple accord fields

3. Place the output in:
   ```
   public/data/fragrances.json
   ```

## Example Output

```json
{
  "name": "Sauvage",
  "brand": "Dior",
  "year": 2015,
  "country": "France",
  "gender": "men",
  "rating": 4.5,
  "image": "https://example.com/sauvage.jpg",
  "top": ["Bergamot", "Pepper"],
  "middle": ["Lavender", "Pink Pepper"],
  "base": ["Ambroxan", "Cedar"],
  "accords": {
    "fresh spicy": 100,
    "citrus": 80,
    "woody": 60
  }
}
```

