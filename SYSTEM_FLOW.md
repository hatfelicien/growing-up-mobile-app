# System Flow Diagram

## Language Switching Flow
```
User Opens App
    ↓
[Home Screen]
    ↓
User Taps Language Button (EN/RW)
    ↓
i18n.setLanguage(lang)
    ↓
Save to AsyncStorage
    ↓
Update UI Immediately
    ↓
All Screens Show New Language
```

## Feedback Submission Flow (Online)
```
User Completes Lesson
    ↓
[Lesson Screen - Feedback Form]
    ↓
User Types Comment
    ↓
User Taps Submit
    ↓
api.submitFeedback()
    ↓
Try to Send to Supabase
    ↓
✅ Success
    ↓
Show "Thank You" Message
    ↓
Clear Form
    ↓
[Admin Dashboard - Feedback Tab]
    ↓
Admin Sees New Feedback
```

## Feedback Submission Flow (Offline)
```
User Completes Lesson (No Internet)
    ↓
[Lesson Screen - Feedback Form]
    ↓
User Types Comment
    ↓
User Taps Submit
    ↓
api.submitFeedback()
    ↓
Try to Send to Supabase
    ↓
❌ Network Error Detected
    ↓
offlineQueue.add(feedback)
    ↓
Save to AsyncStorage
    ↓
Show "Will Send When Online" Message
    ↓
Clear Form
    ↓
[User Closes App]
    ↓
[User Opens App Later - With Internet]
    ↓
HomeScreen useEffect()
    ↓
offlineQueue.sync()
    ↓
Loop Through Queue
    ↓
Send Each Item to Supabase
    ↓
✅ Success → Remove from Queue
    ↓
❌ Failed → Keep in Queue
    ↓
[Admin Dashboard - Feedback Tab]
    ↓
Admin Sees Synced Feedback
```

## Admin Feedback View Flow
```
Admin Logs In
    ↓
[Admin Dashboard]
    ↓
Admin Clicks "Feedback" Tab
    ↓
api.getFeedback()
    ↓
Fetch from Supabase
    ↓
Get All Feedback (sorted by date)
    ↓
For Each Feedback:
    ↓
    Find Module by module_id
    ↓
    Find Lesson by lesson_id
    ↓
    Display:
        - Module Name
        - Lesson Name
        - Comment Text
        - Submission Date
    ↓
[Admin Sees All Feedback]
```

## Data Storage Architecture
```
┌─────────────────────────────────────────┐
│           User's Device                 │
├─────────────────────────────────────────┤
│                                         │
│  AsyncStorage (Persistent)              │
│  ├── language: "en" or "rw"            │
│  └── feedback_queue: [                 │
│       { moduleId, lessonId, comment }  │
│     ]                                   │
│                                         │
└─────────────────┬───────────────────────┘
                  │
                  │ Internet Connection
                  │
                  ↓
┌─────────────────────────────────────────┐
│           Supabase Cloud                │
├─────────────────────────────────────────┤
│                                         │
│  Tables:                                │
│  ├── modules                            │
│  ├── users                              │
│  └── lesson_feedback                    │
│       ├── id (UUID)                     │
│       ├── module_id (TEXT)              │
│       ├── lesson_id (TEXT)              │
│       ├── comment (TEXT)                │
│       └── created_at (TIMESTAMP)        │
│                                         │
└─────────────────────────────────────────┘
```

## Component Interaction Map
```
┌──────────────┐
│   App.js     │
└──────┬───────┘
       │
       ↓
┌──────────────────────────────────────────┐
│        AppNavigator                      │
├──────────────────────────────────────────┤
│                                          │
│  ┌────────────────┐  ┌────────────────┐ │
│  │  HomeScreen    │  │ AdminLogin     │ │
│  │  - i18n ✓      │  │ - i18n ✓       │ │
│  │  - sync queue  │  │                │ │
│  └────────┬───────┘  └────────────────┘ │
│           │                              │
│           ↓                              │
│  ┌────────────────┐  ┌────────────────┐ │
│  │ ModuleScreen   │  │ AdminDashboard │ │
│  │  - i18n ✓      │  │ - i18n ✓       │ │
│  └────────┬───────┘  │ - feedback tab │ │
│           │          └────────────────┘ │
│           ↓                              │
│  ┌────────────────┐                     │
│  │ LessonScreen   │                     │
│  │  - i18n ✓      │                     │
│  │  - feedback    │                     │
│  │  - offline     │                     │
│  └────────────────┘                     │
│                                          │
└──────────────────────────────────────────┘
       │
       ↓
┌──────────────────────────────────────────┐
│           Services Layer                 │
├──────────────────────────────────────────┤
│  ┌────────────┐  ┌──────────────┐       │
│  │   i18n     │  │ offlineQueue │       │
│  │  - en/rw   │  │  - add()     │       │
│  │  - t()     │  │  - sync()    │       │
│  └────────────┘  └──────────────┘       │
│                                          │
│  ┌────────────┐  ┌──────────────┐       │
│  │    api     │  │   supabase   │       │
│  │  - CRUD    │  │  - client    │       │
│  │  - feedback│  │              │       │
│  └────────────┘  └──────────────┘       │
└──────────────────────────────────────────┘
```

## Translation System Architecture
```
┌─────────────────────────────────────┐
│         i18n.js                     │
├─────────────────────────────────────┤
│                                     │
│  translations = {                   │
│    en: {                            │
│      home: { ... },                 │
│      module: { ... },               │
│      lesson: { ... },               │
│      admin: { ... }                 │
│    },                               │
│    rw: {                            │
│      home: { ... },                 │
│      module: { ... },               │
│      lesson: { ... },               │
│      admin: { ... }                 │
│    }                                │
│  }                                  │
│                                     │
│  currentLanguage = 'en' or 'rw'     │
│                                     │
│  t('home.greeting')                 │
│    ↓                                │
│  translations[currentLanguage]      │
│    .home.greeting                   │
│    ↓                                │
│  "Hello, Friend!" or                │
│  "Muraho, Nshuti!"                  │
│                                     │
└─────────────────────────────────────┘
```

## Offline Queue Mechanism
```
Time: T0 (Offline)
┌─────────────────────────┐
│  User Submits Feedback  │
└───────────┬─────────────┘
            ↓
┌─────────────────────────┐
│  Detect Network Error   │
└───────────┬─────────────┘
            ↓
┌─────────────────────────┐
│  offlineQueue.add()     │
└───────────┬─────────────┘
            ↓
┌─────────────────────────────────────┐
│  AsyncStorage                       │
│  feedback_queue: [                  │
│    {                                │
│      moduleId: "puberty",           │
│      lessonId: "123",               │
│      comment: "Very helpful!",      │
│      timestamp: 1234567890          │
│    }                                │
│  ]                                  │
└─────────────────────────────────────┘

Time: T1 (App Closed)
[Queue persists in AsyncStorage]

Time: T2 (App Opens - Online)
┌─────────────────────────┐
│  HomeScreen loads       │
└───────────┬─────────────┘
            ↓
┌─────────────────────────┐
│  offlineQueue.sync()    │
└───────────┬─────────────┘
            ↓
┌─────────────────────────┐
│  Read Queue from        │
│  AsyncStorage           │
└───────────┬─────────────┘
            ↓
┌─────────────────────────┐
│  For each item:         │
│  api.submitFeedback()   │
└───────────┬─────────────┘
            ↓
┌─────────────────────────┐
│  Send to Supabase       │
└───────────┬─────────────┘
            ↓
┌─────────────────────────┐
│  ✅ Success             │
│  Remove from queue      │
└───────────┬─────────────┘
            ↓
┌─────────────────────────┐
│  AsyncStorage           │
│  feedback_queue: []     │
└─────────────────────────┘
```

---

This diagram shows the complete flow of all features in the Growing Up app!
