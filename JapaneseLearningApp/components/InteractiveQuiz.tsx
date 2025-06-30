import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Alert } from 'react-native';

interface QuizItem {
  id: string;
  character: string;
  options: string[];
  correctAnswer: string;
  type: 'reading' | 'meaning' | 'character';
}

interface InteractiveQuizProps {
  visible: boolean;
  onClose: () => void;
  items: any[];
  title: string;
  type: 'hiragana' | 'katakana' | 'kanji';
}

export default function InteractiveQuiz({ visible, onClose, items, title, type }: InteractiveQuizProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [quizQuestions, setQuizQuestions] = useState<QuizItem[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isQuizComplete, setIsQuizComplete] = useState(false);

  useEffect(() => {
    if (visible && items.length > 0) {
      generateQuizQuestions();
    }
  }, [visible, items]);

  const generateQuizQuestions = () => {
    const questions: QuizItem[] = [];
    const shuffledItems = [...items].sort(() => Math.random() - 0.5).slice(0, Math.min(10, items.length));

    shuffledItems.forEach((item, index) => {
      // Create different types of questions
      const questionTypes = ['reading', 'meaning', 'character'];
      const questionType = questionTypes[Math.floor(Math.random() * questionTypes.length)] as 'reading' | 'meaning' | 'character';

      let question: QuizItem;
      
      if (type === 'kanji') {
        // For kanji, create more complex questions
        if (questionType === 'reading') {
          const correctReading = item.readings.kunyomi[0] || item.readings.onyomi[0];
          const wrongReadings = shuffledItems
            .filter(i => i.character !== item.character)
            .map(i => i.readings.kunyomi[0] || i.readings.onyomi[0])
            .slice(0, 3);
          
          question = {
            id: `q${index}`,
            character: `What is the reading of ${item.character}?`,
            options: [correctReading, ...wrongReadings].sort(() => Math.random() - 0.5),
            correctAnswer: correctReading,
            type: 'reading'
          };
        } else if (questionType === 'meaning') {
          const wrongMeanings = shuffledItems
            .filter(i => i.character !== item.character)
            .map(i => i.meaning)
            .slice(0, 3);
          
          question = {
            id: `q${index}`,
            character: `What does ${item.character} mean?`,
            options: [item.meaning, ...wrongMeanings].sort(() => Math.random() - 0.5),
            correctAnswer: item.meaning,
            type: 'meaning'
          };
        } else {
          const wrongCharacters = shuffledItems
            .filter(i => i.character !== item.character)
            .map(i => i.character)
            .slice(0, 3);
          
          question = {
            id: `q${index}`,
            character: `Which character means "${item.meaning}"?`,
            options: [item.character, ...wrongCharacters].sort(() => Math.random() - 0.5),
            correctAnswer: item.character,
            type: 'character'
          };
        }
      } else {
        // For hiragana/katakana
        if (questionType === 'reading') {
          const wrongReadings = shuffledItems
            .filter(i => i.character !== item.character)
            .map(i => i.romanji)
            .slice(0, 3);
          
          question = {
            id: `q${index}`,
            character: `What is the romanji for ${item.character}?`,
            options: [item.romanji, ...wrongReadings].sort(() => Math.random() - 0.5),
            correctAnswer: item.romanji,
            type: 'reading'
          };
        } else {
          const wrongCharacters = shuffledItems
            .filter(i => i.character !== item.character)
            .map(i => i.character)
            .slice(0, 3);
          
          question = {
            id: `q${index}`,
            character: `Which character represents "${item.romanji}"?`,
            options: [item.character, ...wrongCharacters].sort(() => Math.random() - 0.5),
            correctAnswer: item.character,
            type: 'character'
          };
        }
      }

      questions.push(question);
    });

    setQuizQuestions(questions);
    setCurrentQuestionIndex(0);
    setScore(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setIsQuizComplete(false);
  };

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswer(answer);
  };

  const handleSubmitAnswer = () => {
    if (!selectedAnswer) return;

    const isCorrect = selectedAnswer === quizQuestions[currentQuestionIndex].correctAnswer;
    if (isCorrect) {
      setScore(score + 1);
    }

    setShowResult(true);

    // Auto advance after showing result
    setTimeout(() => {
      if (currentQuestionIndex < quizQuestions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setSelectedAnswer(null);
        setShowResult(false);
      } else {
        setIsQuizComplete(true);
      }
    }, 1500);
  };

  const handleRestart = () => {
    generateQuizQuestions();
  };

  const handleClose = () => {
    setCurrentQuestionIndex(0);
    setScore(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setIsQuizComplete(false);
    onClose();
  };

  if (!visible || quizQuestions.length === 0) return null;

  const currentQuestion = quizQuestions[currentQuestionIndex];
  const isCorrect = selectedAnswer === currentQuestion?.correctAnswer;

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>{title} Quiz</Text>
          <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>
        </View>

        {!isQuizComplete ? (
          <>
            <View style={styles.progressContainer}>
              <Text style={styles.progressText}>
                Question {currentQuestionIndex + 1} of {quizQuestions.length}
              </Text>
              <Text style={styles.scoreText}>Score: {score}</Text>
            </View>

            <View style={styles.questionContainer}>
              <Text style={styles.questionText}>{currentQuestion.character}</Text>
            </View>

            <View style={styles.optionsContainer}>
              {currentQuestion.options.map((option, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.optionButton,
                    selectedAnswer === option && styles.selectedOption,
                    showResult && option === currentQuestion.correctAnswer && styles.correctOption,
                    showResult && selectedAnswer === option && option !== currentQuestion.correctAnswer && styles.incorrectOption,
                  ]}
                  onPress={() => handleAnswerSelect(option)}
                  disabled={showResult}
                >
                  <Text style={[
                    styles.optionText,
                    selectedAnswer === option && styles.selectedOptionText,
                    showResult && option === currentQuestion.correctAnswer && styles.correctOptionText,
                  ]}>
                    {option}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {selectedAnswer && !showResult && (
              <TouchableOpacity style={styles.submitButton} onPress={handleSubmitAnswer}>
                <Text style={styles.submitButtonText}>Submit Answer</Text>
              </TouchableOpacity>
            )}

            {showResult && (
              <View style={styles.resultContainer}>
                <Text style={[styles.resultText, isCorrect ? styles.correctText : styles.incorrectText]}>
                  {isCorrect ? '✓ Correct!' : '✗ Incorrect'}
                </Text>
                {!isCorrect && (
                  <Text style={styles.correctAnswerText}>
                    Correct answer: {currentQuestion.correctAnswer}
                  </Text>
                )}
              </View>
            )}
          </>
        ) : (
          <View style={styles.completionContainer}>
            <Text style={styles.completionTitle}>Quiz Complete!</Text>
            <Text style={styles.finalScore}>
              Final Score: {score} / {quizQuestions.length}
            </Text>
            <Text style={styles.percentage}>
              {Math.round((score / quizQuestions.length) * 100)}%
            </Text>

            <View style={styles.completionButtons}>
              <TouchableOpacity style={styles.restartButton} onPress={handleRestart}>
                <Text style={styles.restartButtonText}>Try Again</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.doneButton} onPress={handleClose}>
                <Text style={styles.doneButtonText}>Done</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonText: {
    fontSize: 18,
    color: '#64748B',
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  progressText: {
    fontSize: 16,
    color: '#64748B',
  },
  scoreText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
  },
  questionContainer: {
    padding: 20,
    alignItems: 'center',
    minHeight: 120,
    justifyContent: 'center',
  },
  questionText: {
    fontSize: 24,
    fontWeight: '600',
    color: '#1E293B',
    textAlign: 'center',
  },
  optionsContainer: {
    paddingHorizontal: 20,
    gap: 12,
  },
  optionButton: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E2E8F0',
  },
  selectedOption: {
    borderColor: '#3B82F6',
    backgroundColor: '#EFF6FF',
  },
  correctOption: {
    borderColor: '#10B981',
    backgroundColor: '#ECFDF5',
  },
  incorrectOption: {
    borderColor: '#EF4444',
    backgroundColor: '#FEF2F2',
  },
  optionText: {
    fontSize: 18,
    color: '#1E293B',
    textAlign: 'center',
  },
  selectedOptionText: {
    color: '#3B82F6',
    fontWeight: '600',
  },
  correctOptionText: {
    color: '#10B981',
    fontWeight: '600',
  },
  submitButton: {
    backgroundColor: '#3B82F6',
    marginHorizontal: 20,
    marginTop: 20,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  resultContainer: {
    padding: 20,
    alignItems: 'center',
  },
  resultText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  correctText: {
    color: '#10B981',
  },
  incorrectText: {
    color: '#EF4444',
  },
  correctAnswerText: {
    fontSize: 16,
    color: '#64748B',
  },
  completionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  completionTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 20,
  },
  finalScore: {
    fontSize: 24,
    color: '#64748B',
    marginBottom: 8,
  },
  percentage: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#10B981',
    marginBottom: 40,
  },
  completionButtons: {
    flexDirection: 'row',
    gap: 16,
  },
  restartButton: {
    backgroundColor: '#3B82F6',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  restartButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  doneButton: {
    backgroundColor: '#10B981',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  doneButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
