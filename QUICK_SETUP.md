# Quick Setup Guide

## Step 1: Database Setup (REQUIRED)

Copy and run this query in your Supabase SQL Editor:

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

## Step 2: Test the App

1. Start the app: `npm start`
2. On the home screen, you'll see language buttons (English/Kinyarwanda) at the top
3. Switch between languages to see the translation throughout the entire app
4. Open any lesson and scroll to the bottom
5. You'll see a feedback form where users can submit comments
6. Test offline mode: Turn off internet, submit feedback - it will be queued
7. Turn internet back on and open the app - queued feedback will sync automatically

## What's New?

### 🌍 Complete Language Support
- **English** and **Kinyarwanda** translations
- Language switcher on home screen
- Translations applied to ALL screens including admin dashboard
- Preference saved automatically

### 💬 Offline-Ready Feedback System
- Comment form on every lesson
- Works offline - feedback is queued locally
- Auto-syncs when internet is available
- Admin can view all feedback in dashboard

### 👨‍💼 Admin Dashboard Enhancements
- New "Feedback" tab to view all user comments
- See which module and lesson each comment is about
- View submission dates
- Fully translated interface

## Files Created/Modified

### New Files:
- `src/services/i18n.js` - Translation service
- `src/services/offlineQueue.js` - Offline feedback queue
- `supabase_feedback_table.sql` - Database query
- `NEW_FEATURES.md` - Detailed documentation
- `QUICK_SETUP.md` - This file

### Modified Files:
- `src/services/api.js` - Added feedback methods with offline handling
- `src/screens/HomeScreen.js` - Added language switcher + offline sync
- `src/screens/ModuleScreen.js` - Added translations
- `src/screens/LessonScreen.js` - Added translations + offline-ready feedback form
- `src/screens/AdminLoginScreen.js` - Added translations
- `src/screens/AdminDashboardScreen.js` - Added translations + feedback tab

## Viewing Feedback (Admin)

1. Login to admin dashboard
2. Click on "Feedback" tab (or "Ibitekerezo" in Kinyarwanda)
3. View all submitted comments with module, lesson, and date info

## How Offline Mode Works

1. User submits feedback while offline
2. Feedback is saved locally in AsyncStorage queue
3. User sees message: "Feedback saved! Will be sent when online."
4. When app opens with internet connection, queue automatically syncs
5. Successfully sent feedback is removed from queue

## Need Help?

Check `NEW_FEATURES.md` for detailed documentation.
