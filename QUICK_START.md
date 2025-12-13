# Quick Start Guide - Adding Your CSV Dataset

## Step 1: Place Your CSV File

You can put your CSV file **anywhere** in your project. Common locations:

- **Project root**: `/Users/vidyutrajagopal/perfume_project/perfume_app/your-dataset.csv`
- **Data folder**: `/Users/vidyutrajagopal/perfume_project/perfume_app/data/your-dataset.csv` (create this folder if needed)
- **Downloads**: `/Users/vidyutrajagopal/Downloads/your-dataset.csv`

**It doesn't matter where you put it** - the conversion script will find it!

## Step 2: Convert CSV to JSON

Run this command in your terminal (from the project root):

```bash
node scripts/convert-dataset.js path/to/your-dataset.csv
```

**Examples:**

If your CSV is in the project root:
```bash
node scripts/convert-dataset.js your-dataset.csv
```

If your CSV is in Downloads:
```bash
node scripts/convert-dataset.js ~/Downloads/your-dataset.csv
```

If your CSV is in a data folder:
```bash
node scripts/convert-dataset.js data/your-dataset.csv
```

The script will automatically:
- ✅ Parse your CSV with all the headers (url, Perfume, Brand, etc.)
- ✅ Convert it to JSON format
- ✅ Place it in `public/data/fragrances.json` (the correct location)

## Step 3: Verify the Output

After running the script, you should see:
```
✅ Converted X records from your-dataset.csv to public/data/fragrances.json
```

Check that the file exists:
```bash
ls -lh public/data/fragrances.json
```

## Step 4: Start Your App

```bash
npm run dev
```

The app will automatically load your dataset from `public/data/fragrances.json`!

## Troubleshooting

**"Cannot find module" error?**
- Make sure you're in the project root directory
- Run `npm install` if you haven't already

**"Dataset file not found" error in the app?**
- Check that `public/data/fragrances.json` exists
- Verify the file is valid JSON (you can open it in a text editor)
- Make sure you restarted the dev server after conversion

**CSV parsing issues?**
- Make sure your CSV has the headers: url, Perfume, Brand, Country, Gender, Rating Value, Rating Count, Year, Top, Middle, Base, Perfumer1, Perfumer2, mainaccord1-5
- Check that the CSV file is properly formatted (no encoding issues)

## What Happens Next?

Once your dataset is loaded:
- ✅ Search will work with your data
- ✅ Visual search (camera) will compare against your images
- ✅ All fragrances from your CSV will be searchable
- ✅ Images will load from the `url` column

That's it! Your app is now using your Kaggle dataset! 🎉

