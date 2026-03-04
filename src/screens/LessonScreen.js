import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Dimensions, TouchableOpacity, Linking, Image, TextInput, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { api } from '../services/api';
import { colors } from '../theme/colors';
import { offlineQueue } from '../services/offlineQueue';

const { width } = Dimensions.get('window');

export default function LessonScreen({ route }) {
  const { moduleId, lessonId } = route.params;
  const [lesson, setLesson] = useState(null);
  const [comment, setComment] = useState('');

  useEffect(() => {
    loadLesson();
  }, []);

  const loadLesson = async () => {
    const modules = await api.getModules();
    const module = modules.find(m => String(m.id) === String(moduleId));
    const found = module?.lessons?.find(l => String(l.id) === String(lessonId));
    setLesson(found);
  };

  const handleSubmitFeedback = async () => {
    if (!comment.trim()) return;
    const result = await api.submitFeedback(moduleId, lessonId, comment);
    if (result.success) {
      Alert.alert('Thank you for your feedback!');
      setComment('');
    } else if (result.offline) {
      await offlineQueue.add(moduleId, lessonId, comment);
      Alert.alert('Feedback saved! Will be sent when online.');
      setComment('');
    }
  };

  if (!lesson) return <View style={styles.container}><Text style={styles.loading}>Loading...</Text></View>;

  return (
    <KeyboardAvoidingView 
      style={{ flex: 1 }} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
      <View style={styles.header}>
        <Text style={styles.badge}>Lesson</Text>
        <Text style={styles.title}>{lesson.title}</Text>
      </View>

      {lesson.type === 'youtube' && lesson.videoId && (
        <TouchableOpacity 
          style={styles.videoWrapper}
          onPress={() => Linking.openURL(`vnd.youtube://${lesson.videoId}`).catch(() => 
            Linking.openURL(`https://www.youtube.com/watch?v=${lesson.videoId}`)
          )}
          activeOpacity={0.9}
        >
          <Image 
            source={{ uri: `https://img.youtube.com/vi/${lesson.videoId}/maxresdefault.jpg` }}
            style={styles.thumbnail}
            resizeMode="cover"
          />
          <View style={styles.playOverlay}>
            <View style={styles.playButton}>
              <Text style={styles.playIcon}>▶</Text>
            </View>
            <Text style={styles.playText}>Tap to watch video</Text>
          </View>
        </TouchableOpacity>
      )}

      <View style={styles.card}>
        <Text style={styles.content}>{lesson.content}</Text>
      </View>

      <View style={styles.feedbackCard}>
        <Text style={styles.feedbackTitle}>Share Your Thoughts</Text>
        <TextInput
          style={styles.input}
          placeholder="What did you think about this lesson? Any suggestions?"
          value={comment}
          onChangeText={setComment}
          multiline
          numberOfLines={4}
          textAlignVertical="top"
        />
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmitFeedback}>
          <Text style={styles.submitText}>Submit Feedback</Text>
        </TouchableOpacity>
      </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  loading: { padding: 20, fontSize: 16, color: colors.textMain },
  header: { padding: 20 },
  badge: { backgroundColor: colors.primaryLight, color: colors.textInverse, paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12, fontSize: 12, fontWeight: '600', alignSelf: 'flex-start', marginBottom: 8 },
  title: { fontSize: 24, fontWeight: '700', color: colors.primaryDark },
  videoWrapper: { width: width, height: width * 0.5625, backgroundColor: '#000', marginBottom: 20, position: 'relative' },
  thumbnail: { width: '100%', height: '100%' },
  playOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center' },
  playButton: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#FF0000', justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  playIcon: { color: '#FFFFFF', fontSize: 32, marginLeft: 6 },
  playText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600', textShadowColor: 'rgba(0,0,0,0.75)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 3 },
  card: { marginHorizontal: 20, marginBottom: 20, backgroundColor: colors.surface, borderRadius: 12, padding: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  content: { fontSize: 16, color: colors.textMain, lineHeight: 24 },
  feedbackCard: { marginHorizontal: 20, marginBottom: 30, backgroundColor: colors.surface, borderRadius: 12, padding: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  feedbackTitle: { fontSize: 18, fontWeight: '600', color: colors.textMain, marginBottom: 12 },
  input: { backgroundColor: colors.background, borderRadius: 8, padding: 12, fontSize: 16, color: colors.textMain, minHeight: 100, marginBottom: 12, borderWidth: 1, borderColor: colors.surfaceMuted },
  submitButton: { backgroundColor: colors.primary, borderRadius: 8, padding: 14, alignItems: 'center' },
  submitText: { color: colors.textInverse, fontSize: 16, fontWeight: '600' },
});
