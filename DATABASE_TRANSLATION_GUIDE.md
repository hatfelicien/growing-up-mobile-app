# Database Content Translation Guide

## How It Works

The app reads content directly from your Supabase database in both languages.

## Database Structure

### Modules Table

Your modules table should have these columns:

```
modules
├── id (text)
├── title_en (text) - English title
├── title_rw (text) - Kinyarwanda title
├── description_en (text) - English description
├── description_rw (text) - Kinyarwanda description
├── icon (text)
├── color (text)
└── lessons (jsonb) - Array of lesson objects
```

### Lessons Structure (in modules.lessons JSON)

Each lesson object should have:

```json
{
  "id": "123",
  "title_en": "English Lesson Title",
  "title_rw": "Umutwe w'Isomo mu Kinyarwanda",
  "content_en": "Full English lesson content here...",
  "content_rw": "Ibirimo by'isomo byose hano mu Kinyarwanda...",
  "type": "youtube",
  "videoId": "abc123",
  "duration": "5 min"
}
```

## Step 1: Update Database Schema

Run this in Supabase SQL Editor:

```sql
-- Add translation columns to modules table
ALTER TABLE modules ADD COLUMN IF NOT EXISTS title_en TEXT;
ALTER TABLE modules ADD COLUMN IF NOT EXISTS title_rw TEXT;
ALTER TABLE modules ADD COLUMN IF NOT EXISTS description_en TEXT;
ALTER TABLE modules ADD COLUMN IF NOT EXISTS description_rw TEXT;
```

## Step 2: Add Content in Both Languages

### Example Module Entry

```sql
INSERT INTO modules (id, title_en, title_rw, description_en, description_rw, icon, color, lessons)
VALUES (
  'puberty',
  'Understanding Puberty',
  'Gusobanukirwa Ubwangavu',
  'Learn about the changes your body goes through during puberty.',
  'Wige ku mpinduka umubiri wawe uhura nazo mu gihe cy''ubwangavu.',
  'Sparkles',
  'bg-purple-100',
  '[
    {
      "id": "1",
      "title_en": "What is Puberty?",
      "title_rw": "Ubwangavu ni iki?",
      "content_en": "Puberty is a natural process that happens to everyone as they grow from children into adults. During this time, your body goes through many changes...",
      "content_rw": "Ubwangavu ni inzira karemano ibaho kuri buri wese mu gihe akura kuva mu bwana yerekeza mu gukura. Muri iki gihe, umubiri wawe uhura n''impinduka nyinshi...",
      "type": "youtube",
      "videoId": "abc123",
      "duration": "5 min"
    },
    {
      "id": "2",
      "title_en": "Physical Changes",
      "title_rw": "Impinduka z''Umubiri",
      "content_en": "During puberty, your body will change in many ways. You will grow taller, your voice may change...",
      "content_rw": "Mu gihe cy''ubwangavu, umubiri wawe uzahinduka mu buryo bwinshi. Uzakura, ijwi ryawe rishobora guhinduka...",
      "type": "youtube",
      "videoId": "def456",
      "duration": "7 min"
    }
  ]'::jsonb
);
```

## Step 3: Update Existing Modules

If you already have modules, update them:

```sql
-- Update a specific module
UPDATE modules
SET 
  title_en = 'Understanding Puberty',
  title_rw = 'Gusobanukirwa Ubwangavu',
  description_en = 'Learn about body changes during puberty.',
  description_rw = 'Wige ku mpinduka z''umubiri mu gihe cy''ubwangavu.'
WHERE id = 'puberty';
```

## Step 4: Update Lessons in Existing Modules

```sql
-- Update lessons for a module
UPDATE modules
SET lessons = '[
  {
    "id": "1",
    "title_en": "What is Puberty?",
    "title_rw": "Ubwangavu ni iki?",
    "content_en": "English content...",
    "content_rw": "Ibirimo mu Kinyarwanda...",
    "type": "youtube",
    "videoId": "abc123",
    "duration": "5 min"
  }
]'::jsonb
WHERE id = 'puberty';
```

## How the App Uses This

1. User opens app (default: Kinyarwanda)
2. App fetches modules from database
3. App reads `title_rw` and `description_rw` for modules
4. App reads `title_rw` and `content_rw` for lessons
5. User switches to English
6. App reads `title_en` and `description_en` for modules
7. App reads `title_en` and `content_en` for lessons

## Admin Dashboard Updates

When admin adds content, they should provide both languages:

```javascript
// In AdminDashboardScreen, update forms to include both languages
const [newLesson, setNewLesson] = useState({
  title_en: '',
  title_rw: '',
  content_en: '',
  content_rw: '',
  videoId: ''
});
```

## Quick Template

Copy this template for each module:

```json
{
  "id": "module-id",
  "title_en": "English Title",
  "title_rw": "Umutwe mu Kinyarwanda",
  "description_en": "English description",
  "description_rw": "Ibisobanuro mu Kinyarwanda",
  "icon": "Sparkles",
  "color": "bg-purple-100",
  "lessons": [
    {
      "id": "1",
      "title_en": "Lesson Title",
      "title_rw": "Umutwe w'Isomo",
      "content_en": "Lesson content in English...",
      "content_rw": "Ibirimo by'isomo mu Kinyarwanda...",
      "type": "youtube",
      "videoId": "video-id",
      "duration": "5 min"
    }
  ]
}
```

## Testing

1. Add bilingual content to database
2. Start app (should show Kinyarwanda)
3. Switch to English (should show English)
4. Open modules and lessons (should translate)

## Common Kinyarwanda Translations

| English | Kinyarwanda |
|---------|-------------|
| Understanding | Gusobanukirwa |
| Learn about | Wige ku |
| Changes | Impinduka |
| Body | Umubiri |
| Health | Ubuzima |
| Safety | Umutekano |
| Rights | Uburenganzira |
| Emotional | Amarangamutima |
| Wellbeing | Ubuzima bwiza |
| Puberty | Ubwangavu |
| Menstrual | Imihango |
| Hygiene | Isuku |
| During | Mu gihe cya |
| Natural process | Inzira karemano |
| Everyone | Buri wese |
| Grow | Gukura |
| Important | Ingenzi |
