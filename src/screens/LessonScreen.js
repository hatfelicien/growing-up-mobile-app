import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';
import { api } from '../services/api';
import { colors } from '../theme/colors';

export default function LessonScreen({ route }) {
  const { moduleId, lessonId } = route.params;
  const [lesson, setLesson] = useState(null);

  useEffect(() => {
    loadLesson();
  }, []);

  const loadLesson = async () => {
    const modules = await api.getModules();
    const module = modules.find(m => String(m.id) === String(moduleId));
    const found = module?.lessons?.find(l => String(l.id) === String(lessonId));
    setLesson(found);
  };

  if (!lesson) return <View style={styles.container}><Text style={styles.loading}>Loading...</Text></View>;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.badge}>Lesson</Text>
        <Text style={styles.title}>{lesson.title}</Text>
      </View>

      <View style={styles.card}>
        {lesson.type === 'youtube' && lesson.videoId && (
          <View style={styles.videoContainer}>
            <WebView
              source={{ uri: `https://www.youtube.com/embed/${lesson.videoId}` }}
              allowsFullscreenVideo={true}
              allowsInlineMediaPlayback={true}
              mediaPlaybackRequiresUserAction={false}
              javaScriptEnabled={true}
              style={styles.video}
            />
          </View>
        )}
        <Text style={styles.content}>{lesson.content}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  loading: { padding: 20, fontSize: 16, color: colors.textMain },
  header: { padding: 20 },
  badge: { backgroundColor: colors.primaryLight, color: colors.textInverse, paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12, fontSize: 12, fontWeight: '600', alignSelf: 'flex-start', marginBottom: 8 },
  title: { fontSize: 24, fontWeight: '700', color: colors.primaryDark },
  card: { margin: 20, marginTop: 0, backgroundColor: colors.surface, borderRadius: 12, padding: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  videoContainer: { height: 200, borderRadius: 8, overflow: 'hidden', marginBottom: 16 },
  video: { flex: 1 },
  content: { fontSize: 16, color: colors.textMain, lineHeight: 24 },
});
