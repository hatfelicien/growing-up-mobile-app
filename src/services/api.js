import { supabase } from './supabase';

let cachedModules = [];

export const api = {
  syncContent: async () => {
    try {
      const { data } = await supabase.from('modules').select('*');
      if (data) {
        cachedModules = data;
        return data;
      }
    } catch (error) {
      return cachedModules;
    }
  },

  getModules: async () => {
    return cachedModules;
  },

  login: async (username, password) => {
    const { data } = await supabase
      .from('users')
      .select('*')
      .eq('username', username)
      .eq('password', password)
      .single();

    return data ? { success: true } : { success: false };
  },

  addLesson: async (moduleId, lesson) => {
    const { data: module } = await supabase
      .from('modules')
      .select('lessons')
      .eq('id', moduleId)
      .single();

    const lessons = module?.lessons || [];
    lessons.push(lesson);

    const { error } = await supabase
      .from('modules')
      .update({ lessons })
      .eq('id', moduleId);

    return error ? { success: false } : { success: true };
  },

  deleteLesson: async (moduleId, lessonId) => {
    const { data: module } = await supabase
      .from('modules')
      .select('lessons')
      .eq('id', moduleId)
      .single();

    const lessons = module?.lessons.filter(l => l.id !== lessonId) || [];

    await supabase
      .from('modules')
      .update({ lessons })
      .eq('id', moduleId);

    return { success: true };
  },

  createModule: async (moduleData) => {
    const { error } = await supabase.from('modules').insert([moduleData]);
    return error ? { success: false } : { success: true };
  },

  deleteModule: async (moduleId) => {
    await supabase.from('modules').delete().eq('id', moduleId);
    return { success: true };
  },

  getStats: async () => {
    try {
      const { data: modules } = await supabase.from('modules').select('*');
      const { data: users } = await supabase.from('users').select('*');
      
      const lessonCount = modules?.reduce((acc, m) => acc + (m.lessons?.length || 0), 0) || 0;
      
      return {
        modules: modules?.length || 0,
        lessons: lessonCount,
        users: users?.length || 0
      };
    } catch (e) {
      return { modules: 0, lessons: 0, users: 0 };
    }
  }
};
