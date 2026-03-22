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
  },

  markLessonComplete: async (userId, moduleId, lessonId) => {
    const { error } = await supabase
      .from('user_progress')
      .upsert({
        user_id: userId,
        module_id: moduleId,
        lesson_id: lessonId,
        completed: true,
        completed_at: new Date().toISOString()
      });
    return error ? { success: false } : { success: true };
  },

  getUserProgress: async (userId) => {
    const { data, error } = await supabase
      .from('user_progress')
      .select('*')
      .eq('user_id', userId);
    return error ? [] : data;
  },

  saveQuizScore: async (userId, moduleId, score, totalQuestions) => {
    const { error } = await supabase
      .from('user_quiz_scores')
      .insert({
        user_id: userId,
        module_id: moduleId,
        score,
        total_questions: totalQuestions
      });
    return error ? { success: false } : { success: true };
  },

  getUserQuizScores: async (userId) => {
    const { data, error } = await supabase
      .from('user_quiz_scores')
      .select('*')
      .eq('user_id', userId)
      .order('completed_at', { ascending: false });
    return error ? [] : data;
  },

  addQuizQuestion: async (moduleId, question) => {
    const { data: module } = await supabase
      .from('modules')
      .select('quiz')
      .eq('id', moduleId)
      .single();

    const quiz = module?.quiz || [];
    quiz.push(question);

    const { error } = await supabase
      .from('modules')
      .update({ quiz })
      .eq('id', moduleId);

    return error ? { success: false } : { success: true };
  },

  seedDummyQuiz: async (moduleId) => {
    const dummyQuestions = [
      {
        id: Date.now().toString() + '1',
        question: 'At what age does puberty usually begin for girls?',
        options: ['6–8 years', '8–13 years', '16–18 years', '20–22 years'],
        correctIndex: 1,
        explanation: 'Puberty in girls typically begins between ages 8 and 13.'
      },
      {
        id: Date.now().toString() + '2',
        question: 'What is the average length of a menstrual cycle?',
        options: ['14 days', '21 days', '28 days', '45 days'],
        correctIndex: 2,
        explanation: 'The average menstrual cycle is about 28 days, though 21–35 days is normal.'
      },
      {
        id: Date.now().toString() + '3',
        question: 'Which of the following is a healthy way to manage period cramps?',
        options: ['Avoid all movement', 'Apply a warm compress', 'Skip meals', 'Drink cold water only'],
        correctIndex: 1,
        explanation: 'A warm compress on the lower abdomen helps relax muscles and ease cramps.'
      },
      {
        id: Date.now().toString() + '4',
        question: 'How often should a sanitary pad be changed?',
        options: ['Once a day', 'Every 2–3 days', 'Every 4–8 hours', 'Only when it feels full'],
        correctIndex: 2,
        explanation: 'Pads should be changed every 4–8 hours to maintain hygiene and prevent infection.'
      },
      {
        id: Date.now().toString() + '5',
        question: 'Which hormone is mainly responsible for the menstrual cycle?',
        options: ['Testosterone', 'Insulin', 'Estrogen', 'Adrenaline'],
        correctIndex: 2,
        explanation: 'Estrogen is the primary hormone that regulates the menstrual cycle.'
      }
    ];

    const { error } = await supabase
      .from('modules')
      .update({ quiz: dummyQuestions })
      .eq('id', moduleId);

    return error ? { success: false } : { success: true };
  },

  deleteQuizQuestion: async (moduleId, questionId) => {
    const { data: module } = await supabase
      .from('modules')
      .select('quiz')
      .eq('id', moduleId)
      .single();

    const quiz = (module?.quiz || []).filter(q => q.id !== questionId);

    const { error } = await supabase
      .from('modules')
      .update({ quiz })
      .eq('id', moduleId);

    return error ? { success: false } : { success: true };
  },

  submitFeedback: async (moduleId, lessonId, comment) => {
    try {
      const { error } = await supabase
        .from('lesson_feedback')
        .insert({
          module_id: moduleId,
          lesson_id: lessonId,
          comment,
          created_at: new Date().toISOString()
        });
      return error ? { success: false, offline: false } : { success: true, offline: false };
    } catch (e) {
      return { success: false, offline: true };
    }
  },

  getFeedback: async () => {
    try {
      const { data, error } = await supabase
        .from('lesson_feedback')
        .select('*')
        .order('created_at', { ascending: false });
      return error ? [] : data;
    } catch (e) {
      return [];
    }
  }
};
