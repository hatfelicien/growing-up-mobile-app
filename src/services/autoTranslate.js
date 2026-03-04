import AsyncStorage from '@react-native-async-storage/async-storage';
import { i18n } from './i18n';

const CACHE_KEY = 'translation_cache';
const BATCH_DELAY = 1000; // 1 second delay between API calls
let translationQueue = [];
let isProcessing = false;

// Load cache from storage
const loadCache = async () => {
  try {
    const cached = await AsyncStorage.getItem(CACHE_KEY);
    return cached ? JSON.parse(cached) : {};
  } catch {
    return {};
  }
};

// Save cache to storage
const saveCache = async (cache) => {
  try {
    await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(cache));
  } catch {}
};

let translationCache = {};
loadCache().then(cache => translationCache = cache);

// Translate with rate limiting
const translateText = async (text, targetLang) => {
  if (!text || text.length < 2) return text;
  
  const cacheKey = `${text}_${targetLang}`;
  if (translationCache[cacheKey]) {
    return translationCache[cacheKey];
  }

  return new Promise((resolve) => {
    translationQueue.push({ text, targetLang, cacheKey, resolve });
    processQueue();
  });
};

// Process translation queue with delay
const processQueue = async () => {
  if (isProcessing || translationQueue.length === 0) return;
  
  isProcessing = true;
  const item = translationQueue.shift();
  
  try {
    const sourceLang = item.targetLang === 'rw' ? 'en' : 'rw';
    const response = await fetch(
      `https://api.mymemory.translated.net/get?q=${encodeURIComponent(item.text)}&langpair=${sourceLang}|${item.targetLang}`,
      { timeout: 5000 }
    );
    const data = await response.json();
    
    if (data.responseData?.translatedText) {
      const translated = data.responseData.translatedText;
      translationCache[item.cacheKey] = translated;
      await saveCache(translationCache);
      item.resolve(translated);
    } else {
      item.resolve(item.text);
    }
  } catch {
    item.resolve(item.text);
  }
  
  isProcessing = false;
  
  if (translationQueue.length > 0) {
    setTimeout(processQueue, BATCH_DELAY);
  }
};

export const translateContent = {
  module: async (module) => {
    if (!module) return module;
    
    const lang = i18n.getCurrentLanguage();
    if (module[`title_${lang}`]) {
      return {
        ...module,
        title: module[`title_${lang}`],
        description: module[`description_${lang}`],
        lessons: module.lessons ? await Promise.all(
          module.lessons.map(l => translateContent.lesson(l))
        ) : []
      };
    }
    
    const title = await translateText(module.title, lang);
    const description = await translateText(module.description, lang);
    
    return {
      ...module,
      title,
      description,
      lessons: module.lessons || []
    };
  },
  
  lesson: async (lesson) => {
    if (!lesson) return lesson;
    
    const lang = i18n.getCurrentLanguage();
    if (lesson[`title_${lang}`]) {
      return {
        ...lesson,
        title: lesson[`title_${lang}`],
        content: lesson[`content_${lang}`]
      };
    }
    
    const title = await translateText(lesson.title, lang);
    const content = lesson.content ? await translateText(lesson.content.substring(0, 500), lang) : lesson.content;
    
    return {
      ...lesson,
      title,
      content
    };
  },
  
  modules: async (modules) => {
    if (!modules) return modules;
    const results = [];
    for (const m of modules) {
      results.push(await translateContent.module(m));
    }
    return results;
  },
  
  clearCache: async () => {
    translationCache = {};
    await AsyncStorage.removeItem(CACHE_KEY);
  }
};
