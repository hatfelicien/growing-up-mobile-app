import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { api } from '../services/api';
import { colors } from '../theme/colors';

export default function QuizScreen({ route, navigation }) {
  const { moduleId } = route.params;
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [confirmed, setConfirmed] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [answers, setAnswers] = useState([]);

  useEffect(() => {
    loadQuiz();
  }, []);

  const loadQuiz = async () => {
    const modules = await api.getModules();
    const module = modules.find(m => String(m.id) === String(moduleId));
    setQuestions(module?.quiz || []);
  };

  const handleSelect = (optionIndex) => {
    if (confirmed) return;
    setSelected(optionIndex);
  };

  const handleConfirm = () => {
    if (selected === null) return;
    const isCorrect = selected === questions[current].correctIndex;
    if (isCorrect) setScore(s => s + 1);
    setAnswers(prev => [...prev, { selected, correct: questions[current].correctIndex }]);
    setConfirmed(true);
  };

  const handleNext = () => {
    if (current + 1 >= questions.length) {
      setFinished(true);
    } else {
      setCurrent(c => c + 1);
      setSelected(null);
      setConfirmed(false);
    }
  };

  const handleRetry = () => {
    setCurrent(0);
    setSelected(null);
    setConfirmed(false);
    setScore(0);
    setFinished(false);
    setAnswers([]);
  };

  if (questions.length === 0) {
    return (
      <View style={styles.centered}>
        <Text style={styles.emptyIcon}>📝</Text>
        <Text style={styles.emptyTitle}>No Quiz Yet</Text>
        <Text style={styles.emptyText}>The admin hasn't added quiz questions for this module yet.</Text>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (finished) {
    const percentage = Math.round((score / questions.length) * 100);
    const passed = percentage >= 60;
    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.resultContainer}>
        <View style={[styles.resultBadge, { backgroundColor: passed ? '#D1FAE5' : '#FEE2E2' }]}>
          <Text style={styles.resultIcon}>{passed ? '🎉' : '💪'}</Text>
          <Text style={[styles.resultTitle, { color: passed ? '#065F46' : '#991B1B' }]}>
            {passed ? 'Well Done!' : 'Keep Trying!'}
          </Text>
          <Text style={[styles.resultScore, { color: passed ? '#065F46' : '#991B1B' }]}>
            {score}/{questions.length}
          </Text>
          <Text style={[styles.resultPercent, { color: passed ? '#065F46' : '#991B1B' }]}>
            {percentage}%
          </Text>
        </View>

        <Text style={styles.reviewTitle}>Review Answers</Text>
        {questions.map((q, i) => {
          const ans = answers[i];
          const isCorrect = ans?.selected === ans?.correct;
          return (
            <View key={q.id} style={[styles.reviewCard, { borderLeftColor: isCorrect ? '#10B981' : '#EF4444' }]}>
              <Text style={styles.reviewQuestion}>{i + 1}. {q.question}</Text>
              <Text style={[styles.reviewAnswer, { color: isCorrect ? '#065F46' : '#991B1B' }]}>
                Your answer: {q.options[ans?.selected]}
              </Text>
              {!isCorrect && (
                <Text style={styles.reviewCorrect}>
                  Correct: {q.options[ans?.correct]}
                </Text>
              )}
            </View>
          );
        })}

        <TouchableOpacity style={styles.retryButton} onPress={handleRetry}>
          <Text style={styles.retryButtonText}>Try Again</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.doneButton} onPress={() => navigation.goBack()}>
          <Text style={styles.doneButtonText}>Back to Module</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  }

  const question = questions[current];
  const isCorrect = confirmed && selected === question.correctIndex;

  return (
    <View style={styles.container}>
      {/* Progress bar */}
      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: `${((current) / questions.length) * 100}%` }]} />
      </View>

      <ScrollView contentContainerStyle={styles.quizContent}>
        <Text style={styles.counter}>{current + 1} of {questions.length}</Text>
        <Text style={styles.question}>{question.question}</Text>

        {question.options.map((option, index) => {
          let optionStyle = styles.option;
          let textStyle = styles.optionText;

          if (confirmed) {
            if (index === question.correctIndex) {
              optionStyle = [styles.option, styles.optionCorrect];
              textStyle = [styles.optionText, styles.optionTextCorrect];
            } else if (index === selected && selected !== question.correctIndex) {
              optionStyle = [styles.option, styles.optionWrong];
              textStyle = [styles.optionText, styles.optionTextWrong];
            }
          } else if (index === selected) {
            optionStyle = [styles.option, styles.optionSelected];
            textStyle = [styles.optionText, styles.optionTextSelected];
          }

          return (
            <TouchableOpacity key={index} style={optionStyle} onPress={() => handleSelect(index)} activeOpacity={confirmed ? 1 : 0.7}>
              <View style={styles.optionLetter}>
                <Text style={styles.optionLetterText}>{['A', 'B', 'C', 'D'][index]}</Text>
              </View>
              <Text style={textStyle}>{option}</Text>
            </TouchableOpacity>
          );
        })}

        {confirmed && (
          <View style={[styles.feedback, { backgroundColor: isCorrect ? '#D1FAE5' : '#FEE2E2' }]}>
            <Text style={[styles.feedbackText, { color: isCorrect ? '#065F46' : '#991B1B' }]}>
              {isCorrect ? '✅ Correct!' : `❌ Incorrect! The correct answer is: ${question.options[question.correctIndex]}`}
            </Text>
            {question.explanation ? (
              <Text style={[styles.explanation, { color: isCorrect ? '#065F46' : '#991B1B' }]}>
                {question.explanation}
              </Text>
            ) : null}
          </View>
        )}
      </ScrollView>

      <View style={styles.footer}>
        {!confirmed ? (
          <TouchableOpacity
            style={[styles.confirmButton, selected === null && styles.confirmButtonDisabled]}
            onPress={handleConfirm}
            disabled={selected === null}
          >
            <Text style={styles.confirmButtonText}>Confirm Answer</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
            <Text style={styles.nextButtonText}>
              {current + 1 >= questions.length ? 'See Results' : 'Next Question'} →
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32 },
  emptyIcon: { fontSize: 64, marginBottom: 16 },
  emptyTitle: { fontSize: 22, fontWeight: '700', color: colors.primaryDark, marginBottom: 8 },
  emptyText: { fontSize: 16, color: colors.textMuted, textAlign: 'center', lineHeight: 24, marginBottom: 24 },
  backButton: { backgroundColor: colors.primary, paddingHorizontal: 24, paddingVertical: 12, borderRadius: 10 },
  backButtonText: { color: colors.textInverse, fontSize: 16, fontWeight: '600' },
  progressBar: { height: 6, backgroundColor: colors.surfaceMuted },
  progressFill: { height: 6, backgroundColor: colors.primary },
  quizContent: { padding: 20, paddingBottom: 100 },
  counter: { fontSize: 14, color: colors.textMuted, fontWeight: '600', marginBottom: 12 },
  question: { fontSize: 20, fontWeight: '700', color: colors.textMain, lineHeight: 30, marginBottom: 24 },
  option: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface, borderRadius: 12, padding: 16, marginBottom: 12, borderWidth: 2, borderColor: colors.surfaceMuted },
  optionSelected: { borderColor: colors.primary, backgroundColor: '#EDE9FE' },
  optionCorrect: { borderColor: '#10B981', backgroundColor: '#D1FAE5' },
  optionWrong: { borderColor: '#EF4444', backgroundColor: '#FEE2E2' },
  optionLetter: { width: 32, height: 32, borderRadius: 16, backgroundColor: colors.surfaceMuted, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  optionLetterText: { fontSize: 14, fontWeight: '700', color: colors.textMain },
  optionText: { fontSize: 16, color: colors.textMain, flex: 1 },
  optionTextSelected: { color: colors.primary, fontWeight: '600' },
  optionTextCorrect: { color: '#065F46', fontWeight: '600' },
  optionTextWrong: { color: '#991B1B', fontWeight: '600' },
  feedback: { borderRadius: 12, padding: 16, marginTop: 8 },
  feedbackText: { fontSize: 15, fontWeight: '600' },
  explanation: { fontSize: 14, marginTop: 6, lineHeight: 20 },
  footer: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 20, backgroundColor: colors.background, borderTopWidth: 1, borderTopColor: colors.surfaceMuted },
  confirmButton: { backgroundColor: colors.primary, borderRadius: 12, padding: 16, alignItems: 'center' },
  confirmButtonDisabled: { backgroundColor: colors.surfaceMuted },
  confirmButtonText: { color: colors.textInverse, fontSize: 16, fontWeight: '700' },
  nextButton: { backgroundColor: colors.primaryDark, borderRadius: 12, padding: 16, alignItems: 'center' },
  nextButtonText: { color: colors.textInverse, fontSize: 16, fontWeight: '700' },
  resultContainer: { padding: 20, paddingBottom: 40 },
  resultBadge: { borderRadius: 16, padding: 32, alignItems: 'center', marginBottom: 24 },
  resultIcon: { fontSize: 56, marginBottom: 12 },
  resultTitle: { fontSize: 26, fontWeight: '700', marginBottom: 8 },
  resultScore: { fontSize: 48, fontWeight: '700' },
  resultPercent: { fontSize: 20, fontWeight: '600', marginTop: 4 },
  reviewTitle: { fontSize: 18, fontWeight: '700', color: colors.textMain, marginBottom: 12 },
  reviewCard: { backgroundColor: colors.surface, borderRadius: 10, padding: 14, marginBottom: 10, borderLeftWidth: 4 },
  reviewQuestion: { fontSize: 14, fontWeight: '600', color: colors.textMain, marginBottom: 6 },
  reviewAnswer: { fontSize: 14, fontWeight: '500' },
  reviewCorrect: { fontSize: 14, color: '#065F46', marginTop: 4 },
  retryButton: { backgroundColor: colors.primary, borderRadius: 12, padding: 16, alignItems: 'center', marginTop: 16 },
  retryButtonText: { color: colors.textInverse, fontSize: 16, fontWeight: '700' },
  doneButton: { borderRadius: 12, padding: 16, alignItems: 'center', marginTop: 10, borderWidth: 2, borderColor: colors.primary },
  doneButtonText: { color: colors.primary, fontSize: 16, fontWeight: '700' },
});
