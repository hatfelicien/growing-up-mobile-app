# New Features Added

## 1. Multi-Language Support (English & Kinyarwanda)

### Features:
- Language switcher on the home screen
- Full app translation between English and Kinyarwanda
- Language preference saved locally (persists across app restarts)

### How to Use:
- Users can switch between English and Kinyarwanda using the language buttons at the top of the home screen
- The selected language is automatically saved and applied throughout the app

### Files Modified:
- `src/services/i18n.js` - New internationalization service
- `src/screens/HomeScreen.js` - Added language switcher
- `src/screens/ModuleScreen.js` - Added translation support
- `src/screens/LessonScreen.js` - Added translation support

## 2. Lesson Feedback System

### Features:
- Users can submit comments and suggestions after viewing a lesson
- Feedback is stored in Supabase database
- Simple text input form at the bottom of each lesson

### How to Use:
- After reading a lesson, scroll to the bottom
- Enter your comment or suggestion in the text box
- Tap "Submit Feedback" button
- Receive confirmation message

### Database Setup:
1. Open your Supabase project dashboard
2. Go to SQL Editor
3. Run the query from `supabase_feedback_table.sql` file
4. This creates the `lesson_feedback` table with proper indexes and security policies

### Files Modified:
- `src/services/api.js` - Added `submitFeedback()` and `getFeedback()` methods
- `src/screens/LessonScreen.js` - Added feedback form UI

## Database Query

Run this in Supabase SQL Editor:

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

CREATE POLICY "Allow anonymous insert" ON lesson_feedback
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow read access" ON lesson_feedback
  FOR SELECT
  USING (true);
```

## Translation Keys

To add more translations, edit `src/services/i18n.js` and add keys to both `en` and `rw` objects.

Example:
```javascript
en: {
  newSection: {
    newKey: 'English text'
  }
},
rw: {
  newSection: {
    newKey: 'Kinyarwanda text'
  }
}
```

## Future Enhancements

- Add more languages (French, Swahili)
- Admin dashboard to view all feedback
- Reply to feedback feature
- Feedback moderation system
