import { i18n } from './i18n';

export const translateContent = {
  // Translate module based on current language
  module: (module) => {
    if (!module) return module;
    
    const lang = i18n.getCurrentLanguage();
    
    return {
      ...module,
      title: module[`title_${lang}`] || module.title,
      description: module[`description_${lang}`] || module.description,
      lessons: module.lessons?.map(lesson => translateContent.lesson(lesson))
    };
  },
  
  // Translate lesson based on current language
  lesson: (lesson) => {
    if (!lesson) return lesson;
    
    const lang = i18n.getCurrentLanguage();
    
    return {
      ...lesson,
      title: lesson[`title_${lang}`] || lesson.title,
      content: lesson[`content_${lang}`] || lesson.content
    };
  },
  
  // Translate array of modules
  modules: (modules) => {
    if (!modules) return modules;
    return modules.map(m => translateContent.module(m));
  }
};
