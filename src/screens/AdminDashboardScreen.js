import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, TextInput, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { api } from '../services/api';
import { colors } from '../theme/colors';

export default function AdminDashboardScreen({ navigation }) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState(null);
  const [modules, setModules] = useState([]);
  const [feedback, setFeedback] = useState([]);
  const [newLesson, setNewLesson] = useState({ title: '', videoId: '', content: '' });
  const [selectedModuleId, setSelectedModuleId] = useState('');
  const [newModule, setNewModule] = useState({ title: '', description: '', icon: 'Sparkles', color: 'bg-purple-100' });

  useEffect(() => {
    refreshData();
  }, []);

  const refreshData = async () => {
    const s = await api.getStats();
    setStats(s);
    const m = await api.syncContent();
    setModules(m);
    const f = await api.getFeedback();
    setFeedback(f);
    if (m.length > 0 && !selectedModuleId) setSelectedModuleId(m[0].id);
  };

  const handleAddLesson = async () => {
    if (!selectedModuleId) return Alert.alert('Error', 'Select a module');
    const lesson = {
      id: Date.now().toString(),
      title: newLesson.title,
      type: 'youtube',
      duration: '5 min',
      videoId: newLesson.videoId,
      content: newLesson.content
    };
    const result = await api.addLesson(selectedModuleId, lesson);
    if (result.success) {
      Alert.alert('Success', 'Lesson Added!');
      setNewLesson({ title: '', videoId: '', content: '' });
      refreshData();
    }
  };

  const handleDeleteLesson = async (moduleId, lessonId) => {
    Alert.alert('Confirm', 'Delete this lesson?', [
      { text: 'Cancel' },
      { text: 'Delete', onPress: async () => {
        await api.deleteLesson(moduleId, lessonId);
        refreshData();
      }}
    ]);
  };

  const handleAddModule = async () => {
    const module = {
      ...newModule,
      id: newModule.title.toLowerCase().replace(/\s+/g, '-'),
      lessons: []
    };
    await api.createModule(module);
    Alert.alert('Success', 'Module Created!');
    setNewModule({ title: '', description: '', icon: 'Sparkles', color: 'bg-purple-100' });
    refreshData();
  };

  const handleDeleteModule = async (moduleId) => {
    Alert.alert('Confirm', 'Delete this module and ALL its lessons?', [
      { text: 'Cancel' },
      { text: 'Delete', onPress: async () => {
        await api.deleteModule(moduleId);
        refreshData();
      }}
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Admin Dashboard</Text>
        <TouchableOpacity style={styles.logoutButton} onPress={() => navigation.replace('AdminLogin')}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.tabs}>
        <TouchableOpacity style={[styles.tab, activeTab === 'dashboard' && styles.activeTab]} onPress={() => setActiveTab('dashboard')}>
          <Text style={[styles.tabText, activeTab === 'dashboard' && styles.activeTabText]}>Dashboard</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.tab, activeTab === 'lessons' && styles.activeTab]} onPress={() => setActiveTab('lessons')}>
          <Text style={[styles.tabText, activeTab === 'lessons' && styles.activeTabText]}>Lessons</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.tab, activeTab === 'modules' && styles.activeTab]} onPress={() => setActiveTab('modules')}>
          <Text style={[styles.tabText, activeTab === 'modules' && styles.activeTabText]}>Modules</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.tab, activeTab === 'feedback' && styles.activeTab]} onPress={() => setActiveTab('feedback')}>
          <Text style={[styles.tabText, activeTab === 'feedback' && styles.activeTabText]}>Feedback</Text>
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView 
        style={{ flex: 1 }} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <ScrollView style={styles.content} keyboardShouldPersistTaps="handled">
        {activeTab === 'dashboard' && (
          <View>
            <Text style={styles.title}>Dashboard Overview</Text>
            <View style={styles.statsGrid}>
              <View style={[styles.statCard, { backgroundColor: colors.primary }]}>
                <Text style={styles.statNumber}>{stats?.modules || 0}</Text>
                <Text style={styles.statLabel}>Modules</Text>
              </View>
              <View style={[styles.statCard, { backgroundColor: colors.secondary }]}>
                <Text style={styles.statNumber}>{stats?.lessons || 0}</Text>
                <Text style={styles.statLabel}>Lessons</Text>
              </View>
            </View>
          </View>
        )}

        {activeTab === 'lessons' && (
          <View>
            <Text style={styles.title}>Add New Lesson</Text>
            <View style={styles.form}>
              <Text style={styles.label}>Select Module</Text>
              <View style={styles.picker}>
                {modules.map(m => (
                  <TouchableOpacity key={m.id} style={[styles.pickerItem, selectedModuleId === m.id && styles.pickerItemActive]} onPress={() => setSelectedModuleId(m.id)}>
                    <Text style={styles.pickerText}>{m.title}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              <Text style={styles.label}>Title</Text>
              <TextInput style={styles.input} value={newLesson.title} onChangeText={(text) => setNewLesson({ ...newLesson, title: text })} />
              <Text style={styles.label}>Video ID (YouTube)</Text>
              <TextInput style={styles.input} value={newLesson.videoId} onChangeText={(text) => setNewLesson({ ...newLesson, videoId: text })} />
              <Text style={styles.label}>Content</Text>
              <TextInput style={[styles.input, styles.textarea]} multiline numberOfLines={4} value={newLesson.content} onChangeText={(text) => setNewLesson({ ...newLesson, content: text })} />
              <TouchableOpacity style={styles.button} onPress={handleAddLesson}>
                <Text style={styles.buttonText}>Add Lesson</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.title}>All Lessons</Text>
            {modules.map(module => (
              <View key={module.id} style={styles.moduleSection}>
                <Text style={styles.moduleTitle}>{module.title}</Text>
                {module.lessons?.map(lesson => (
                  <View key={lesson.id} style={styles.lessonItem}>
                    <Text style={styles.lessonText}>{lesson.title}</Text>
                    <TouchableOpacity onPress={() => handleDeleteLesson(module.id, lesson.id)}>
                      <Text style={styles.deleteText}>Delete</Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            ))}
          </View>
        )}

        {activeTab === 'modules' && (
          <View>
            <Text style={styles.title}>Create New Module</Text>
            <View style={styles.form}>
              <Text style={styles.label}>Title</Text>
              <TextInput style={styles.input} value={newModule.title} onChangeText={(text) => setNewModule({ ...newModule, title: text })} />
              <Text style={styles.label}>Description</Text>
              <TextInput style={styles.input} value={newModule.description} onChangeText={(text) => setNewModule({ ...newModule, description: text })} />
              <TouchableOpacity style={styles.button} onPress={handleAddModule}>
                <Text style={styles.buttonText}>Create Module</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.title}>Existing Modules</Text>
            {modules.map(module => (
              <View key={module.id} style={styles.moduleCard}>
                <View>
                  <Text style={styles.moduleCardTitle}>{module.title}</Text>
                  <Text style={styles.moduleCardSubtitle}>{module.lessons?.length || 0} lessons</Text>
                </View>
                <TouchableOpacity onPress={() => handleDeleteModule(module.id)}>
                  <Text style={styles.deleteText}>Delete</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}

        {activeTab === 'feedback' && (
          <View>
            <Text style={styles.title}>User Feedback</Text>
            {feedback.length === 0 ? (
              <Text style={styles.noFeedback}>No feedback yet</Text>
            ) : (
              feedback.map((item) => {
                const module = modules.find(m => m.id === item.module_id);
                const lesson = module?.lessons?.find(l => l.id === item.lesson_id);
                return (
                  <View key={item.id} style={styles.feedbackCard}>
                    <View style={styles.feedbackHeader}>
                      <Text style={styles.feedbackModule}>Module: {module?.title || item.module_id}</Text>
                      <Text style={styles.feedbackDate}>{new Date(item.created_at).toLocaleDateString()}</Text>
                    </View>
                    <Text style={styles.feedbackLesson}>Lesson: {lesson?.title || item.lesson_id}</Text>
                    <Text style={styles.feedbackComment}>{item.comment}</Text>
                  </View>
                );
              })
            )}
          </View>
        )}
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, backgroundColor: colors.surface, borderBottomWidth: 1, borderBottomColor: colors.surfaceMuted },
  headerTitle: { fontSize: 20, fontWeight: '700', color: colors.primaryDark },
  logoutButton: { backgroundColor: colors.error, paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8 },
  logoutText: { color: colors.textInverse, fontSize: 14, fontWeight: '600' },
  tabs: { flexDirection: 'row', backgroundColor: colors.surface, borderBottomWidth: 1, borderBottomColor: colors.surfaceMuted },
  tab: { flex: 1, padding: 16, alignItems: 'center' },
  activeTab: { borderBottomWidth: 2, borderBottomColor: colors.primary },
  tabText: { fontSize: 14, color: colors.textMuted },
  activeTabText: { color: colors.primary, fontWeight: '600' },
  content: { flex: 1, padding: 20 },
  title: { fontSize: 20, fontWeight: '700', color: colors.primaryDark, marginBottom: 16 },
  statsGrid: { flexDirection: 'row', gap: 12 },
  statCard: { flex: 1, padding: 24, borderRadius: 12, alignItems: 'center' },
  statNumber: { fontSize: 36, fontWeight: '700', color: colors.textInverse, marginBottom: 4 },
  statLabel: { fontSize: 14, color: colors.textInverse, opacity: 0.9 },
  form: { backgroundColor: colors.surface, borderRadius: 12, padding: 16, marginBottom: 20 },
  label: { fontSize: 14, fontWeight: '500', color: colors.textMain, marginBottom: 8 },
  input: { borderWidth: 2, borderColor: colors.surfaceMuted, borderRadius: 8, padding: 12, fontSize: 16, marginBottom: 16 },
  textarea: { height: 100, textAlignVertical: 'top' },
  button: { backgroundColor: colors.primary, borderRadius: 8, padding: 14, alignItems: 'center' },
  buttonText: { color: colors.textInverse, fontSize: 16, fontWeight: '600' },
  picker: { marginBottom: 16 },
  pickerItem: { padding: 12, borderWidth: 1, borderColor: colors.surfaceMuted, borderRadius: 8, marginBottom: 8 },
  pickerItemActive: { backgroundColor: colors.primaryLight, borderColor: colors.primary },
  pickerText: { fontSize: 16, color: colors.textMain },
  moduleSection: { marginBottom: 20 },
  moduleTitle: { fontSize: 16, fontWeight: '600', color: colors.primary, marginBottom: 8 },
  lessonItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 12, backgroundColor: colors.surface, borderRadius: 8, marginBottom: 8 },
  lessonText: { fontSize: 14, color: colors.textMain },
  deleteText: { color: colors.error, fontSize: 14, fontWeight: '600' },
  moduleCard: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: colors.surface, padding: 16, borderRadius: 12, marginBottom: 12 },
  moduleCardTitle: { fontSize: 16, fontWeight: '600', color: colors.textMain },
  moduleCardSubtitle: { fontSize: 14, color: colors.textMuted, marginTop: 4 },
  feedbackCard: { backgroundColor: colors.surface, padding: 16, borderRadius: 12, marginBottom: 12 },
  feedbackHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  feedbackModule: { fontSize: 14, fontWeight: '600', color: colors.primary },
  feedbackDate: { fontSize: 12, color: colors.textMuted },
  feedbackLesson: { fontSize: 13, color: colors.textMuted, marginBottom: 8 },
  feedbackComment: { fontSize: 15, color: colors.textMain, lineHeight: 22 },
  noFeedback: { fontSize: 16, color: colors.textMuted, textAlign: 'center', marginTop: 20 },
});
