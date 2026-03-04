import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState, useEffect } from 'react';

const translations = {
  en: {
    home: {
      greeting: 'Hello, Friend! 👋',
      subtitle: 'Welcome to your safe space to learn and grow.',
      journey: 'Your Journey',
      lessons: 'Lessons',
      quiz: 'Quiz',
      adminLogin: 'Admin Login',
    },
    module: {
      lessons: 'Lessons',
      loading: 'Loading...',
    },
    lesson: {
      badge: 'Lesson',
      loading: 'Loading...',
      watchVideo: 'Tap to watch video',
      feedback: 'Share Your Thoughts',
      feedbackPlaceholder: 'What did you think about this lesson? Any suggestions?',
      submit: 'Submit Feedback',
      thankYou: 'Thank you for your feedback!',
      offlineQueued: 'Feedback saved! Will be sent when online.',
    },
    settings: {
      language: 'Language',
      english: 'English',
      kinyarwanda: 'Kinyarwanda',
    },
    admin: {
      portal: 'Admin Portal',
      signIn: 'Sign in to manage content',
      username: 'Username',
      password: 'Password',
      signInButton: 'Sign In',
      error: 'Error',
      invalidCredentials: 'Invalid credentials',
      dashboard: 'Dashboard',
      lessons: 'Lessons',
      modules: 'Modules',
      feedback: 'Feedback',
      overview: 'Dashboard Overview',
      addLesson: 'Add New Lesson',
      selectModule: 'Select Module',
      title: 'Title',
      videoId: 'Video ID (YouTube)',
      content: 'Content',
      addLessonButton: 'Add Lesson',
      allLessons: 'All Lessons',
      delete: 'Delete',
      createModule: 'Create New Module',
      description: 'Description',
      createModuleButton: 'Create Module',
      existingModules: 'Existing Modules',
      confirm: 'Confirm',
      deleteLesson: 'Delete this lesson?',
      deleteModule: 'Delete this module and ALL its lessons?',
      cancel: 'Cancel',
      success: 'Success',
      lessonAdded: 'Lesson Added!',
      moduleCreated: 'Module Created!',
      userFeedback: 'User Feedback',
      noFeedback: 'No feedback yet',
      module: 'Module',
      lesson: 'Lesson',
      comment: 'Comment',
      date: 'Date',
    },
  },
  rw: {
    home: {
      greeting: 'Muraho, Nshuti! 👋',
      subtitle: 'Murakaza neza ahantu heza ho kwiga no gukura.',
      journey: 'Urugendo Rwawe',
      lessons: 'Amasomo',
      quiz: 'Ikibazo',
      adminLogin: 'Kwinjira nka Umuyobozi',
    },
    module: {
      lessons: 'Amasomo',
      loading: 'Biratunganywa...',
    },
    lesson: {
      badge: 'Isomo',
      loading: 'Biratunganywa...',
      watchVideo: 'Kanda urebe videyo',
      feedback: 'Sangiza Ibitekerezo Byawe',
      feedbackPlaceholder: 'Watekereje iki kuri iri somo? Hari icyo usaba?',
      submit: 'Ohereza Ibitekerezo',
      thankYou: 'Murakoze kubitekerezo byanyu!',
      offlineQueued: 'Ibitekerezo byabitswe! Bizoherekezwa mugihe internet ihari.',
    },
    settings: {
      language: 'Ururimi',
      english: 'Icyongereza',
      kinyarwanda: 'Ikinyarwanda',
    },
    admin: {
      portal: 'Urubuga rwa Umuyobozi',
      signIn: 'Injira kugirango uyobore ibikubiyemo',
      username: 'Izina ryukoresha',
      password: 'Ijambo ryibanga',
      signInButton: 'Injira',
      error: 'Ikosa',
      invalidCredentials: 'Amakuru atariyo',
      dashboard: 'Ikibaho',
      lessons: 'Amasomo',
      modules: 'Ibice',
      feedback: 'Ibitekerezo',
      overview: 'Incamake ya Dashboard',
      addLesson: 'Ongeraho Isomo Rishya',
      selectModule: 'Hitamo Igice',
      title: 'Umutwe',
      videoId: 'ID ya Video (YouTube)',
      content: 'Ibirimo',
      addLessonButton: 'Ongeraho Isomo',
      allLessons: 'Amasomo Yose',
      delete: 'Siba',
      createModule: 'Kora Igice Rishya',
      description: 'Ibisobanuro',
      createModuleButton: 'Kora Igice',
      existingModules: 'Ibice Biriho',
      confirm: 'Emeza',
      deleteLesson: 'Siba iri somo?',
      deleteModule: 'Siba iri gice hamwe namasomo yose?',
      cancel: 'Hagarika',
      success: 'Byagenze neza',
      lessonAdded: 'Isomo Ryongeweho!',
      moduleCreated: 'Igice Ryakozwe!',
      userFeedback: 'Ibitekerezo byabakoresha',
      noFeedback: 'Nta bitekerezo',
      module: 'Igice',
      lesson: 'Isomo',
      comment: 'Igitekerezo',
      date: 'Itariki',
    },
  },
};

let currentLanguage = 'rw';

export const i18n = {
  setLanguage: async (lang) => {
    currentLanguage = lang;
    await AsyncStorage.setItem('language', lang);
  },

  getLanguage: async () => {
    const saved = await AsyncStorage.getItem('language');
    if (saved) currentLanguage = saved;
    return currentLanguage;
  },

  getCurrentLanguage: () => currentLanguage,

  t: (key) => {
    const keys = key.split('.');
    let value = translations[currentLanguage];
    for (const k of keys) {
      value = value?.[k];
    }
    return value || key;
  },
};

export const useTranslation = () => {
  const [language, setLanguage] = useState('rw');

  useEffect(() => {
    i18n.getLanguage().then(setLanguage);
  }, []);

  const changeLanguage = async (lang) => {
    await i18n.setLanguage(lang);
    setLanguage(lang);
  };

  return { t: i18n.t, language, changeLanguage };
};
