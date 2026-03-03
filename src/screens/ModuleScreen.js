import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { api } from '../services/api';
import { colors } from '../theme/colors';

export default function ModuleScreen({ route, navigation }) {
  const { moduleId } = route.params;
  const [module, setModule] = useState(null);

  useEffect(() => {
    loadModule();
  }, []);

  const loadModule = async () => {
    const modules = await api.getModules();
    const found = modules.find(m => String(m.id) === String(moduleId));
    setModule(found);
  };

  if (!module) return <View style={styles.container}><Text>Loading...</Text></View>;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{module.title}</Text>
        <Text style={styles.description}>{module.description}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Lessons</Text>
        {module.lessons?.map((lesson, index) => (
          <TouchableOpacity key={lesson.id} style={styles.card} onPress={() => navigation.navigate('Lesson', { moduleId, lessonId: lesson.id })}>
            <View style={styles.number}>
              <Text style={styles.numberText}>{index + 1}</Text>
            </View>
            <View style={styles.content}>
              <Text style={styles.cardTitle}>{lesson.title}</Text>
              <Text style={styles.cardSubtitle}>{lesson.duration}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { padding: 20 },
  title: { fontSize: 28, fontWeight: '700', color: colors.primaryDark, marginBottom: 8 },
  description: { fontSize: 16, color: colors.textMuted, lineHeight: 24 },
  section: { padding: 20, paddingTop: 0 },
  sectionTitle: { fontSize: 20, fontWeight: '600', color: colors.textMain, marginBottom: 16 },
  card: { backgroundColor: colors.surface, borderRadius: 12, padding: 16, marginBottom: 12, flexDirection: 'row', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  number: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.surfaceMuted, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  numberText: { fontSize: 16, fontWeight: '700', color: colors.primary },
  content: { flex: 1 },
  cardTitle: { fontSize: 18, fontWeight: '600', color: colors.textMain, marginBottom: 4 },
  cardSubtitle: { fontSize: 14, color: colors.textMuted },
});
