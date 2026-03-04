# How to Add Content Translations

## Overview
The app now translates:
- UI text (buttons, labels, etc.) - via `i18n.js`
- Course content (module titles, descriptions, lesson titles, content) - via `contentTranslation.js`

**Default Language**: Kinyarwanda (users can switch to English)

## Adding Module Translations

Edit `src/services/contentTranslation.js`:

```javascript
modules: {
  'your-module-id': {
    en: {
      title: 'English Module Title',
      description: 'English module description.'
    },
    rw: {
      title: 'Umutwe w\'Igice mu Kinyarwanda',
      description: 'Ibisobanuro by\'igice mu Kinyarwanda.'
    }
  }
}
```

## Adding Lesson Translations

Edit `src/services/contentTranslation.js`:

```javascript
lessons: {
  'your-lesson-id': {
    en: {
      title: 'English Lesson Title',
      content: 'Full English lesson content here...'
    },
    rw: {
      title: 'Umutwe w\'Isomo mu Kinyarwanda',
      content: 'Ibirimo by\'isomo byose hano mu Kinyarwanda...'
    }
  }
}
```

## Example: Complete Module with Lessons

```javascript
const contentTranslations = {
  modules: {
    'puberty': {
      en: {
        title: 'Understanding Puberty',
        description: 'Learn about the changes your body goes through.'
      },
      rw: {
        title: 'Gusobanukirwa Ubwangavu',
        description: 'Wige ku mpinduka umubiri wawe uhura nazo.'
      }
    }
  },
  
  lessons: {
    '1': {
      en: {
        title: 'What is Puberty?',
        content: 'Puberty is a natural process that happens to everyone...'
      },
      rw: {
        title: 'Ubwangavu ni iki?',
        content: 'Ubwangavu ni inzira karemano ibaho kuri buri wese...'
      }
    },
    '2': {
      en: {
        title: 'Physical Changes',
        content: 'During puberty, your body will change in many ways...'
      },
      rw: {
        title: 'Impinduka z\'Umubiri',
        content: 'Mu gihe cy\'ubwangavu, umubiri wawe uzahinduka mu buryo bwinshi...'
      }
    }
  }
};
```

## How It Works

1. **User opens app** → Default language is Kinyarwanda
2. **Content loads** → Modules and lessons show Kinyarwanda text
3. **User switches to English** → All content updates to English
4. **User switches back to Kinyarwanda** → Content returns to Kinyarwanda

## Important Notes

- Module ID must match the ID in your Supabase database
- Lesson ID must match the lesson ID in the module's lessons array
- If translation is missing, original content from database is shown
- Language preference is saved and persists across app restarts

## Translation Workflow

1. Get module/lesson IDs from your Supabase database
2. Add translations to `contentTranslation.js`
3. Test by switching languages in the app
4. Verify all content updates correctly

## Example Module IDs from Your Database

Based on common module structures:
- `puberty` or `understanding-puberty`
- `menstrual-health`
- `emotional-wellbeing`
- `safety-rights`

Check your Supabase `modules` table for exact IDs.

## Quick Reference

| What to Translate | Where | File |
|-------------------|-------|------|
| Buttons, labels, UI | `translations` object | `src/services/i18n.js` |
| Module titles & descriptions | `modules` object | `src/services/contentTranslation.js` |
| Lesson titles & content | `lessons` object | `src/services/contentTranslation.js` |

## Testing

1. Start app (should be in Kinyarwanda by default)
2. Check module titles and descriptions
3. Open a lesson, check title and content
4. Switch to English
5. Verify all content changes to English
6. Switch back to Kinyarwanda
7. Verify content returns to Kinyarwanda
