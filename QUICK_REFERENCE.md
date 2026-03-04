# 🚀 Quick Reference Card

## Database Setup (DO THIS FIRST!)

```sql
CREATE TABLE lesson_feedback (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  module_id TEXT NOT NULL,
  lesson_id TEXT NOT NULL,
  comment TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_lesson_feedback_module_lesson ON lesson_feedback(module_id, lesson_id);
CREATE INDEX idx_lesson_feedback_created_at ON lesson_feedback(created_at DESC);

ALTER TABLE lesson_feedback ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anonymous insert" ON lesson_feedback FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow read access" ON lesson_feedback FOR SELECT USING (true);
```

## Features Overview

| Feature | Status | Location |
|---------|--------|----------|
| Language Switcher | ✅ | Home Screen (top) |
| English Translation | ✅ | All screens |
| Kinyarwanda Translation | ✅ | All screens |
| Feedback Form | ✅ | Bottom of each lesson |
| Offline Queue | ✅ | Automatic |
| Admin Feedback View | ✅ | Admin Dashboard → Feedback tab |

## User Flow

### Switching Language
1. Open app
2. Tap "English" or "Kinyarwanda" button at top
3. Entire app updates instantly

### Submitting Feedback (Online)
1. Complete a lesson
2. Scroll to bottom
3. Type comment in text box
4. Tap "Submit Feedback" / "Ohereza Ibitekerezo"
5. See success message

### Submitting Feedback (Offline)
1. Complete a lesson (no internet)
2. Scroll to bottom
3. Type comment
4. Tap submit button
5. See "Will be sent when online" message
6. Feedback saved locally
7. Next time app opens with internet → auto-syncs

### Viewing Feedback (Admin)
1. Login to admin
2. Click "Feedback" / "Ibitekerezo" tab
3. View all comments with context

## File Structure

```
GrowingUpExpo/
├── src/
│   ├── services/
│   │   ├── i18n.js              ← Translation service
│   │   ├── offlineQueue.js      ← Offline queue manager
│   │   ├── api.js               ← Updated with feedback
│   │   └── supabase.js
│   └── screens/
│       ├── HomeScreen.js        ← Language switcher + sync
│       ├── ModuleScreen.js      ← Translated
│       ├── LessonScreen.js      ← Translated + feedback form
│       ├── AdminLoginScreen.js  ← Translated
│       └── AdminDashboardScreen.js ← Translated + feedback tab
├── supabase_feedback_table.sql  ← Run this in Supabase!
├── QUICK_SETUP.md
├── IMPLEMENTATION_SUMMARY.md
└── TRANSLATION_GUIDE.md
```

## Key Code Snippets

### Using Translation in Any Component
```javascript
import { useTranslation } from '../services/i18n';

function MyComponent() {
  const { t } = useTranslation();
  return <Text>{t('home.greeting')}</Text>;
}
```

### Checking Offline Queue Status
```javascript
import { offlineQueue } from '../services/offlineQueue';

const queue = await offlineQueue.getQueue();
console.log(`${queue.length} items pending`);
```

## Translation Keys Quick Reference

| English | Kinyarwanda | Key |
|---------|-------------|-----|
| Hello, Friend! | Muraho, Nshuti! | home.greeting |
| Lessons | Amasomo | home.lessons |
| Submit Feedback | Ohereza Ibitekerezo | lesson.submit |
| Thank you! | Murakoze! | lesson.thankYou |
| Admin Portal | Urubuga rwa Umuyobozi | admin.portal |

## Testing Commands

```bash
# Start app
npm start

# Test offline mode
# 1. Turn off WiFi/Data
# 2. Submit feedback
# 3. Turn on WiFi/Data
# 4. Restart app
# 5. Check admin dashboard
```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Feedback not showing in admin | Run SQL query in Supabase |
| Language not persisting | Check AsyncStorage permissions |
| Offline queue not syncing | Check internet connection on app start |
| Translations not working | Verify i18n.js import |

## Support

- Full docs: `NEW_FEATURES.md`
- Setup guide: `QUICK_SETUP.md`
- Translation help: `TRANSLATION_GUIDE.md`
- Summary: `IMPLEMENTATION_SUMMARY.md`

---

**Status**: ✅ Ready to use!
**Last Updated**: Implementation complete
