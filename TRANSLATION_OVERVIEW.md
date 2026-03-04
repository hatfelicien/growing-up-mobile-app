# Translation System Overview

## Two Translation Systems

### 1. UI Translation (i18n.js)
Translates interface elements like buttons, labels, messages.

```
┌─────────────────────────────────────┐
│         Home Screen                 │
├─────────────────────────────────────┤
│  [Kinyarwanda] [English]  ← Buttons│
│                                     │
│  Muraho, Nshuti! 👋      ← Greeting│
│  Murakaza neza...        ← Subtitle│
│                                     │
│  Urugendo Rwawe          ← Section │
│                                     │
│  ┌─────────────────────┐           │
│  │ 💧 Module Title     │ ← From DB │
│  │ 3 Amasomo • Ikibazo │ ← UI Text │
│  └─────────────────────┘           │
│                                     │
│  [Kwinjira nka Umuyobozi] ← Button │
└─────────────────────────────────────┘
```

### 2. Content Translation (contentTranslation.js)
Translates course content from database.

```
┌─────────────────────────────────────┐
│      Module Screen                  │
├─────────────────────────────────────┤
│  Gusobanukirwa Ubwangavu ← Translated│
│  Wige ku mpinduka...     ← Translated│
│                                     │
│  Amasomo                 ← UI Text  │
│                                     │
│  ┌─────────────────────┐           │
│  │ 1. Ubwangavu ni iki?│ ← Translated│
│  │    5 min            │           │
│  └─────────────────────┘           │
└─────────────────────────────────────┘
```

## What You Need to Translate

### Already Translated (UI)
✅ Buttons (Submit, Delete, etc.)
✅ Labels (Username, Password, etc.)
✅ Messages (Success, Error, etc.)
✅ Navigation (Dashboard, Lessons, etc.)

### You Need to Translate (Content)
⚠️ Module titles from your database
⚠️ Module descriptions from your database
⚠️ Lesson titles from your database
⚠️ Lesson content from your database

## Example: Before and After

### Before (English only in database)
```
Database:
  Module: "Understanding Puberty"
  Description: "Learn about body changes"
  Lesson: "What is Puberty?"
  Content: "Puberty is a natural process..."

App shows:
  Kinyarwanda UI + English content ❌
```

### After (With translations)
```
Database:
  Module: "Understanding Puberty"
  Description: "Learn about body changes"
  Lesson: "What is Puberty?"
  Content: "Puberty is a natural process..."

contentTranslation.js:
  'puberty': {
    rw: {
      title: "Gusobanukirwa Ubwangavu",
      description: "Wige ku mpinduka z'umubiri"
    }
  }
  '123': {
    rw: {
      title: "Ubwangavu ni iki?",
      content: "Ubwangavu ni inzira karemano..."
    }
  }

App shows:
  Kinyarwanda UI + Kinyarwanda content ✅
```

## Translation Workflow

```
Step 1: Get Module IDs from Supabase
   ↓
   modules table → id column
   Example: 'puberty', 'menstrual-health'

Step 2: Get Lesson IDs from Supabase
   ↓
   modules table → lessons column (JSON)
   Example: '123', '456', '789'

Step 3: Add to contentTranslation.js
   ↓
   modules: {
     'puberty': {
       en: { title: '...', description: '...' },
       rw: { title: '...', description: '...' }
     }
   }
   lessons: {
     '123': {
       en: { title: '...', content: '...' },
       rw: { title: '...', content: '...' }
     }
   }

Step 4: Test in app
   ↓
   Switch languages and verify content changes
```

## File Structure

```
src/services/
├── i18n.js                    ← UI translations
│   └── translations = {
│         en: { home: {...}, admin: {...} },
│         rw: { home: {...}, admin: {...} }
│       }
│
└── contentTranslation.js      ← Content translations
    └── contentTranslations = {
          modules: { 'id': { en: {...}, rw: {...} } },
          lessons: { 'id': { en: {...}, rw: {...} } }
        }
```

## Quick Test

1. Start app → Should see Kinyarwanda UI
2. Check module titles → Need your translations
3. Tap English button → UI switches to English
4. Check module titles → Need your translations
5. Add translations to contentTranslation.js
6. Restart app → Should see translated content

## Common Kinyarwanda Terms

| English | Kinyarwanda |
|---------|-------------|
| Understanding | Gusobanukirwa |
| Learn | Wiga / Kwiga |
| Lesson | Isomo |
| Module | Igice |
| Health | Ubuzima |
| Safety | Umutekano |
| Rights | Uburenganzira |
| Changes | Impinduka |
| Body | Umubiri |
| Emotional | Amarangamutima |
| Wellbeing | Ubuzima bwiza |
| Puberty | Ubwangavu |
| Menstrual | Imihango |
| Hygiene | Isuku |

## Need Help?

See `CONTENT_TRANSLATION_GUIDE.md` for detailed instructions.
