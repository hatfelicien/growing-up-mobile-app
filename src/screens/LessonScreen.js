import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Dimensions } from 'react-native';
import { WebView } from 'react-native-webview';
import { api } from '../services/api';
import { colors } from '../theme/colors';

const { width } = Dimensions.get('window');

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

  const videoHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
        <style>
          * { margin: 0; padding: 0; }
          body { background: #000; }
          .video-container {
            position: relative;
            width: 100%;
            padding-bottom: 56.25%;
            height: 0;
            overflow: hidden;
          }
          .video-container iframe {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            border: 0;
          }
        </style>
      </head>
      <body>
        <div class="video-container">
          <iframe 
            src="https://www.youtube.com/embed/${lesson.videoId}?playsinline=1&modestbranding=1&rel=0"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowfullscreen
          ></iframe>
        </div>
      </body>
    </html>
  `;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.badge}>Lesson</Text>
        <Text style={styles.title}>{lesson.title}</Text>
      </View>

      {lesson.type === 'youtube' && lesson.videoId && (
        <View style={styles.videoWrapper}>
          <WebView
            source={{ html: videoHtml }}
            style={styles.video}
            allowsFullscreenVideo={true}
            allowsInlineMediaPlayback={true}
            mediaPlaybackRequiresUserAction={false}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            scrollEnabled={false}
            bounces={false}
          />
        </View>
      )}

      <View style={styles.card}>
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
  videoWrapper: { width: width, height: width * 0.5625, backgroundColor: '#000', marginBottom: 20 },
  video: { flex: 1, backgroundColor: 'transparent' },
  card: { marginHorizontal: 20, marginBottom: 20, backgroundColor: colors.surface, borderRadius: 12, padding: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  content: { fontSize: 16, color: colors.textMain, lineHeight: 24 },
});
