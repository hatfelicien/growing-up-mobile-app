import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from './api';

const QUEUE_KEY = 'feedback_queue';

export const offlineQueue = {
  add: async (moduleId, lessonId, comment) => {
    const queue = await offlineQueue.getQueue();
    queue.push({ moduleId, lessonId, comment, timestamp: Date.now() });
    await AsyncStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
  },

  getQueue: async () => {
    const data = await AsyncStorage.getItem(QUEUE_KEY);
    return data ? JSON.parse(data) : [];
  },

  sync: async () => {
    const queue = await offlineQueue.getQueue();
    const failed = [];
    
    for (const item of queue) {
      const result = await api.submitFeedback(item.moduleId, item.lessonId, item.comment);
      if (!result.success) failed.push(item);
    }
    
    await AsyncStorage.setItem(QUEUE_KEY, JSON.stringify(failed));
    return { synced: queue.length - failed.length, failed: failed.length };
  },

  clear: async () => {
    await AsyncStorage.setItem(QUEUE_KEY, JSON.stringify([]));
  }
};
