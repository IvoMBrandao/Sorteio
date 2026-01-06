import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Pressable,
  FlatList,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Modal,
  useColorScheme,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import {
  UserPlus,
  Trash2,
  Trophy,
  X,
  Zap,
  Target,
  Users,
  Weight,
} from 'lucide-react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withSequence,
  withDelay,
  runOnJS,
  interpolate,
  Extrapolate,
} from 'react-native-reanimated';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface Participant {
  id: string;
  name: string;
  weight: number;
}

interface AdvancedRaffleModalProps {
  visible: boolean;
  onClose: () => void;
}

interface ParticipantCardProps {
  participant: Participant;
  onRemove: (id: string) => void;
  index: number;
}

function ParticipantCard({ participant, onRemove, index }: ParticipantCardProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const scale = useSharedValue(1);
  const opacity = useSharedValue(0);

  React.useEffect(() => {
    opacity.value = withDelay(index * 100, withSpring(1));
  }, [index]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.95);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
  };

  return (
    <Animated.View style={animatedStyle}>
      <BlurView intensity={20} tint={isDark ? 'dark' : 'light'} style={styles.participantCard}>
        <View style={styles.participantInfo}>
          <View style={styles.participantAvatar}>
            <Text style={styles.participantInitial}>
              {participant.name.charAt(0).toUpperCase()}
            </Text>
          </View>
          <View style={styles.participantDetails}>
            <Text style={[styles.participantName, { color: isDark ? '#ffffff' : '#1f2937' }]}>
              {participant.name}
            </Text>
            <View style={styles.weightContainer}>
              <Weight size={14} color={isDark ? '#a855f7' : '#8b5cf6'} />
              <Text style={[styles.weightText, { color: isDark ? '#a855f7' : '#8b5cf6' }]}>
                {participant.weight}x chance
              </Text>
            </View>
          </View>
        </View>
        <AnimatedPressable
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          onPress={() => onRemove(participant.id)}
          style={styles.removeButton}
        >
          <Trash2 size={18} color="#ef4444" strokeWidth={2.5} />
        </AnimatedPressable>
      </BlurView>
    </Animated.View>
  );
}

interface WinnerModalProps {
  winner: Participant | null;
  onClose: () => void;
}

function WinnerModal({ winner, onClose }: WinnerModalProps) {
  const scale = useSharedValue(0);
  const rotation = useSharedValue(0);
  const confettiOpacity = useSharedValue(0);

  React.useEffect(() => {
    if (winner) {
      scale.value = withSequence(
        withSpring(1.2, { damping: 10 }),
        withSpring(1, { damping: 15 })
      );
      rotation.value = withSequence(
        withTiming(10, { duration: 100 }),
        withTiming(-10, { duration: 100 }),
        withTiming(0, { duration: 100 })
      );
      confettiOpacity.value = withTiming(1, { duration: 500 });
    }
  }, [winner]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { rotate: `${rotation.value}deg` }
    ],
  }));

  const confettiStyle = useAnimatedStyle(() => ({
    opacity: confettiOpacity.value,
  }));

  if (!winner) return null;

  return (
    <View style={styles.winnerOverlay}>
      <BlurView intensity={100} tint="dark" style={styles.winnerBlur}>
        <Animated.View style={confettiStyle}>
          <Text style={styles.confetti}>🎉 🎊 ✨ 🎉 🎊 ✨</Text>
        </Animated.View>
        
        <Animated.View style={[styles.winnerContainer, animatedStyle]}>
          <LinearGradient
            colors={['#fbbf24', '#f59e0b', '#d97706']}
            style={styles.winnerGradient}
          >
            <View style={styles.trophyContainer}>
              <Trophy size={64} color="#ffffff" strokeWidth={2} />
            </View>
            <Text style={styles.winnerTitle}>🏆 Vencedor! 🏆</Text>
            <Text style={styles.winnerName}>{winner.name}</Text>
            <Text style={styles.winnerWeight}>
              Peso: {winner.weight}x
            </Text>
            
            <Pressable onPress={onClose} style={styles.closeWinnerButton}>
              <LinearGradient
                colors={['#1f2937', '#374151']}
                style={styles.closeWinnerGradient}
              >
                <Text style={styles.closeWinnerText}>Fechar</Text>
              </LinearGradient>
            </Pressable>
          </LinearGradient>
        </Animated.View>
      </BlurView>
    </View>
  );
}

export function AdvancedRaffleModal({ visible, onClose }: AdvancedRaffleModalProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [nameInput, setNameInput] = useState('');
  const [weightInput, setWeightInput] = useState('1');
  const [winner, setWinner] = useState<Participant | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  const drawingScale = useSharedValue(1);
  const buttonScale = useSharedValue(1);

  const addParticipant = () => {
    if (!nameInput.trim()) {
      Alert.alert('Erro', 'Digite um nome válido');
      return;
    }

    const weight = Math.max(1, parseInt(weightInput) || 1);
    const newParticipant: Participant = {
      id: Math.random().toString(36).substr(2, 9),
      name: nameInput.trim(),
      weight,
    };

    setParticipants(prev => [...prev, newParticipant]);
    setNameInput('');
    setWeightInput('1');
  };

  const removeParticipant = (id: string) => {
    setParticipants(prev => prev.filter(p => p.id !== id));
  };

  const performWeightedDraw = () => {
    if (participants.length < 2) {
      Alert.alert('Erro', 'Adicione pelo menos 2 participantes');
      return;
    }

    setIsDrawing(true);
    setWinner(null);
    
    drawingScale.value = withSequence(
      withSpring(1.1),
      withSpring(1)
    );

    setTimeout(() => {
      const totalWeight = participants.reduce((acc, p) => acc + p.weight, 0);
      let random = Math.random() * totalWeight;
      
      for (const participant of participants) {
        if (random < participant.weight) {
          setWinner(participant);
          break;
        }
        random -= participant.weight;
      }
      
      setIsDrawing(false);
    }, 2000);
  };

  const performEliminationDraw = () => {
    if (participants.length < 2) {
      Alert.alert('Erro', 'Adicione pelo menos 2 participantes');
      return;
    }

    setIsDrawing(true);
    setWinner(null);
    let currentList = [...participants];

    const eliminate = () => {
      if (currentList.length > 1) {
        const randomIndex = Math.floor(Math.random() * currentList.length);
        currentList.splice(randomIndex, 1);
        setParticipants([...currentList]);
        setTimeout(eliminate, 800);
      } else {
        setWinner(currentList[0]);
        setIsDrawing(false);
      }
    };

    eliminate();
  };

  const clearAll = () => {
    Alert.alert(
      'Confirmar',
      'Deseja remover todos os participantes?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Remover', 
          style: 'destructive',
          onPress: () => setParticipants([])
        }
      ]
    );
  };

  const drawingAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: drawingScale.value }],
  }));

  const totalWeight = participants.reduce((acc, p) => acc + p.weight, 0);

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <LinearGradient
        colors={isDark ? ['#0f0f23', '#1a1a2e', '#16213e'] : ['#667eea', '#764ba2', '#f093fb']}
        style={styles.modalContainer}
      >
        <SafeAreaView style={styles.modalContent} edges={['top']}>
          {/* Header */}
          <BlurView intensity={20} tint={isDark ? 'dark' : 'light'} style={styles.header}>
            <View style={styles.headerContent}>
              <View style={styles.headerLeft}>
                <View style={styles.headerIcon}>
                  <Zap size={24} color="#ffffff" strokeWidth={2.5} />
                </View>
                <View>
                  <Text style={styles.headerTitle}>Sorteio Avançado</Text>
                  <Text style={styles.headerSubtitle}>
                    {participants.length} participantes
                  </Text>
                </View>
              </View>
              <Pressable onPress={onClose} style={styles.closeButton}>
                <X size={24} color="#ffffff" strokeWidth={2.5} />
              </Pressable>
            </View>
          </BlurView>

          <KeyboardAvoidingView 
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
            style={styles.keyboardView}
          >
            {/* Add Participant Form */}
            <BlurView intensity={20} tint={isDark ? 'dark' : 'light'} style={styles.addForm}>
              <View style={styles.inputRow}>
                <View style={styles.inputContainer}>
                  <TextInput
                    style={[styles.nameInput, { color: isDark ? '#ffffff' : '#1f2937' }]}
                    placeholder="Nome do participante"
                    placeholderTextColor={isDark ? '#9ca3af' : '#6b7280'}
                    value={nameInput}
                    onChangeText={setNameInput}
                    onSubmitEditing={addParticipant}
                  />
                </View>
                <View style={styles.weightInputContainer}>
                  <TextInput
                    style={[styles.weightInput, { color: isDark ? '#ffffff' : '#1f2937' }]}
                    placeholder="1"
                    placeholderTextColor={isDark ? '#9ca3af' : '#6b7280'}
                    keyboardType="numeric"
                    value={weightInput}
                    onChangeText={setWeightInput}
                    maxLength={2}
                  />
                </View>
                <Pressable onPress={addParticipant} style={styles.addButton}>
                  <LinearGradient
                    colors={['#8b5cf6', '#a855f7']}
                    style={styles.addButtonGradient}
                  >
                    <UserPlus size={20} color="#ffffff" strokeWidth={2.5} />
                  </LinearGradient>
                </Pressable>
              </View>
            </BlurView>

            {/* Stats */}
            {participants.length > 0 && (
              <BlurView intensity={20} tint={isDark ? 'dark' : 'light'} style={styles.statsContainer}>
                <View style={styles.statsRow}>
                  <View style={styles.statItem}>
                    <Users size={16} color={isDark ? '#a855f7' : '#8b5cf6'} />
                    <Text style={[styles.statText, { color: isDark ? '#ffffff' : '#1f2937' }]}>
                      {participants.length} participantes
                    </Text>
                  </View>
                  <View style={styles.statItem}>
                    <Weight size={16} color={isDark ? '#a855f7' : '#8b5cf6'} />
                    <Text style={[styles.statText, { color: isDark ? '#ffffff' : '#1f2937' }]}>
                      Peso total: {totalWeight}
                    </Text>
                  </View>
                  <Pressable onPress={clearAll} style={styles.clearAllButton}>
                    <Trash2 size={16} color="#ef4444" strokeWidth={2.5} />
                  </Pressable>
                </View>
              </BlurView>
            )}

            {/* Participants List */}
            <View style={styles.listContainer}>
              {participants.length === 0 ? (
                <View style={styles.emptyContainer}>
                  <Target size={48} color={isDark ? '#6b7280' : '#9ca3af'} strokeWidth={1.5} />
                  <Text style={[styles.emptyText, { color: isDark ? '#9ca3af' : '#6b7280' }]}>
                    Nenhum participante ainda
                  </Text>
                  <Text style={[styles.emptySubtext, { color: isDark ? '#6b7280' : '#9ca3af' }]}>
                    Adicione participantes para começar
                  </Text>
                </View>
              ) : (
                <FlatList
                  data={participants}
                  keyExtractor={(item) => item.id}
                  renderItem={({ item, index }) => (
                    <ParticipantCard
                      participant={item}
                      onRemove={removeParticipant}
                      index={index}
                    />
                  )}
                  contentContainerStyle={styles.listContent}
                  showsVerticalScrollIndicator={false}
                />
              )}
            </View>

            {/* Action Buttons */}
            {participants.length >= 2 && (
              <Animated.View style={[styles.actionsContainer, drawingAnimatedStyle]}>
                <BlurView intensity={20} tint={isDark ? 'dark' : 'light'} style={styles.actionsBlur}>
                  <View style={styles.actionsRow}>
                    <Pressable
                      onPress={performEliminationDraw}
                      disabled={isDrawing}
                      style={[styles.actionButton, isDrawing && styles.actionButtonDisabled]}
                    >
                      <LinearGradient
                        colors={isDrawing ? ['#6b7280', '#9ca3af'] : ['#10b981', '#059669']}
                        style={styles.actionButtonGradient}
                      >
                        <Zap size={20} color="#ffffff" strokeWidth={2.5} />
                        <Text style={styles.actionButtonText}>
                          {isDrawing ? 'Sorteando...' : 'Eliminação'}
                        </Text>
                      </LinearGradient>
                    </Pressable>

                    <Pressable
                      onPress={performWeightedDraw}
                      disabled={isDrawing}
                      style={[styles.actionButton, isDrawing && styles.actionButtonDisabled]}
                    >
                      <LinearGradient
                        colors={isDrawing ? ['#6b7280', '#9ca3af'] : ['#3b82f6', '#2563eb']}
                        style={styles.actionButtonGradient}
                      >
                        <Weight size={20} color="#ffffff" strokeWidth={2.5} />
                        <Text style={styles.actionButtonText}>
                          {isDrawing ? 'Sorteando...' : 'Por Peso'}
                        </Text>
                      </LinearGradient>
                    </Pressable>
                  </View>
                </BlurView>
              </Animated.View>
            )}
          </KeyboardAvoidingView>

          {/* Winner Modal */}
          <WinnerModal winner={winner} onClose={() => setWinner(null)} />
        </SafeAreaView>
      </LinearGradient>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
  },
  modalContent: {
    flex: 1,
  },
  header: {
    borderRadius: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.2)',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerIcon: {
    width: 40,
    height: 40,
    backgroundColor: 'rgba(139, 92, 246, 0.3)',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#ffffff',
    letterSpacing: -0.3,
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  closeButton: {
    width: 40,
    height: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  keyboardView: {
    flex: 1,
  },
  addForm: {
    margin: 20,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  inputRow: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
    alignItems: 'center',
  },
  inputContainer: {
    flex: 1,
  },
  nameInput: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  weightInputContainer: {
    width: 60,
  },
  weightInput: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    textAlign: 'center',
  },
  addButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  addButtonGradient: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statsContainer: {
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statText: {
    fontSize: 14,
    fontWeight: '600',
  },
  clearAllButton: {
    padding: 8,
  },
  listContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  listContent: {
    gap: 12,
    paddingBottom: 20,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
  },
  participantCard: {
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    overflow: 'hidden',
  },
  participantInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    flex: 1,
  },
  participantAvatar: {
    width: 48,
    height: 48,
    backgroundColor: 'rgba(139, 92, 246, 0.3)',
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  participantInitial: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ffffff',
  },
  participantDetails: {
    flex: 1,
  },
  participantName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  weightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  weightText: {
    fontSize: 12,
    fontWeight: '600',
  },
  removeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 32,
    height: 32,
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionsContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  actionsBlur: {
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    overflow: 'hidden',
  },
  actionsRow: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  actionButton: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },
  actionButtonDisabled: {
    opacity: 0.6,
  },
  actionButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    gap: 8,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
  },
  winnerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
  },
  winnerBlur: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  confetti: {
    fontSize: 32,
    textAlign: 'center',
    marginBottom: 20,
  },
  winnerContainer: {
    borderRadius: 24,
    overflow: 'hidden',
    maxWidth: 320,
    width: '100%',
  },
  winnerGradient: {
    padding: 32,
    alignItems: 'center',
  },
  trophyContainer: {
    width: 96,
    height: 96,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  winnerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 12,
    textAlign: 'center',
  },
  winnerName: {
    fontSize: 28,
    fontWeight: '800',
    color: '#ffffff',
    marginBottom: 8,
    textAlign: 'center',
  },
  winnerWeight: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 24,
    textAlign: 'center',
  },
  closeWinnerButton: {
    borderRadius: 12,
    overflow: 'hidden',
    width: '100%',
  },
  closeWinnerGradient: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  closeWinnerText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
  },
});