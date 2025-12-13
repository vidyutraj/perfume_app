# Dataset Directory

Place your Kaggle dataset file here.

## Supported Formats

1. **JSON Array** - `fragrances.json`
   ```json
   [
     {
       "name": "Sauvage",
       "brand": "Dior",
       "year": 2015,
       ...
     }
   ]
   ```

2. **JSON Object with fragrances array** - `fragrances.json`
   ```json
   {
     "fragrances": [
       {
         "name": "Sauvage",
         "brand": "Dior",
         ...
       }
     ]
   }
   ```

## File Location

Place your dataset file at: `/public/data/fragrances.json`

## Dataset Fields

The dataset loader will automatically map common field names. Supported fields:

- `name`, `Name`, `fragrance_name` - Fragrance name
- `brand`, `Brand`, `brand_name` - Brand name
- `year`, `Year` - Release year
- `country`, `Country` - Country of origin
- `top`, `Top`, `top_notes`, `topNotes` - Top notes (array or comma-separated)
- `middle`, `Middle`, `middle_notes`, `middleNotes` - Middle notes
- `base`, `Base`, `base_notes`, `baseNotes` - Base notes
- `sillage`, `Sillage`, `sillage_level` - Sillage level
- `longevity`, `Longevity`, `longevity_level` - Longevity level
- `rating`, `Rating`, `user_rating` - User rating
- `price`, `Price` - Price
- `image`, `Image`, `image_url`, `imageUrl`, `Image URL` - Image URL
- `description`, `Description` - Description
- `gender`, `Gender` - Gender
- `oilType`, `oil_type`, `OilType` - Oil type
- `accords`, `Accords`, `main_accords`, `Main Accords Percentage` - Accords object

## Converting CSV to JSON

If your dataset is in CSV format, you can convert it using:

```bash
# Using Python
python -c "import pandas as pd; df = pd.read_csv('fragrances.csv'); df.to_json('fragrances.json', orient='records', indent=2)"

# Or using Node.js
npx csvtojson fragrances.csv > fragrances.json
```

