import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, ActivityIndicator, StyleSheet, TouchableOpacity } from 'react-native';
import { api } from '../services/api';
import { colors } from '../theme/colors';

export default function HomeScreen({ navigation }) {
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const cached = await api.getModules();
    if (cached?.length > 0) {
      setModules(cached);
      setLoading(false);
    }
    const fresh = await api.syncContent();
    if (fresh?.length > 0) {
      setModules(fresh);
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Hello, Friend! 👋</Text>
        <Text style={styles.subtitle}>Welcome to your safe space to learn and grow.</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Your Journey</Text>
        {loading ? (
          <ActivityIndicator size="large" color={colors.primary} />
        ) : (
          modules.map(module => (
            <TouchableOpacity key={module.id} style={styles.card} onPress={() => navigation.navigate('Module', { moduleId: module.id })}>
              <View style={styles.iconContainer}>
                <Text style={styles.icon}>
                  {module.icon === 'Sparkles' ? '✨' : module.icon === 'Droplet' ? '💧' : module.icon === 'Shield' ? '🛡️' : '😊'}
                </Text>
              </View>
              <View style={styles.content}>
                <Text style={styles.cardTitle}>{module.title}</Text>
                <Text style={styles.cardSubtitle}>{module.lessons?.length || 0} Lessons • Quiz</Text>
              </View>
              <Text style={styles.arrow}>›</Text>
            </TouchableOpacity>
          ))
        )}
      </View>

      <TouchableOpacity style={styles.adminButton} onPress={() => navigation.navigate('AdminLogin')}>
        <Text style={styles.adminButtonText}>Admin Login</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { padding: 20 },
  title: { fontSize: 28, fontWeight: '700', color: colors.primaryDark, marginBottom: 8 },
  subtitle: { fontSize: 16, color: colors.textMuted, lineHeight: 24 },
  section: { padding: 20, paddingTop: 0 },
  sectionTitle: { fontSize: 20, fontWeight: '600', color: colors.textMain, marginBottom: 16 },
  card: { backgroundColor: colors.surface, borderRadius: 12, padding: 16, marginBottom: 12, flexDirection: 'row', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  iconContainer: { width: 48, height: 48, borderRadius: 12, backgroundColor: '#F3E8FF', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  icon: { fontSize: 24 },
  content: { flex: 1 },
  cardTitle: { fontSize: 18, fontWeight: '600', color: colors.textMain, marginBottom: 4 },
  cardSubtitle: { fontSize: 14, color: colors.textMuted },
  arrow: { fontSize: 24, color: colors.primaryLight },
  adminButton: { margin: 20, padding: 16, backgroundColor: colors.primary, borderRadius: 12, alignItems: 'center' },
  adminButtonText: { color: colors.textInverse, fontSize: 16, fontWeight: '600' },
});
