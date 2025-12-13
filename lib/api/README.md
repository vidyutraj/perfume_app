# API Directory (Deprecated)

This directory previously contained API integration code for the Fragella API.

## Migration to Local Dataset

The app has been migrated to use a local Kaggle dataset instead of external APIs.

### Old Files (Can be removed)
- `fragella.ts` - Fragella API integration (no longer used)

### Current Data Source
- See `/lib/data/` for dataset loading and search functionality
- Dataset should be placed in `/public/data/fragrances.json`

### Vision API
- `vision.ts` - Still used for CLIP-based image recognition
- Vision API routes in `/app/api/vision/` are still active

