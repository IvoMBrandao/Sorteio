import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { X, RotateCcw, Trophy } from 'lucide-react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withSequence,
  ZoomIn,
  FadeInDown,
} from 'react-native-reanimated';
import { useEffect, useState, useRef } from 'react';

const { width } = Dimensions.get('window');
const BALL_SIZE = width > 380 ? 48 : 40;

interface ResultItemData {
  value: string | number;
  position: number;
}

interface ResultModalProps {
  visible: boolean;
  result: (string | number)[];
  sequential?: boolean;
  intervalSeconds?: number;
  onClose: () => void;
  onNewDraw: () => void;
}

export function ResultModal({
  visible,
  result,
  sequential = true,
  intervalSeconds = 0.8,
  onClose,
  onNewDraw,
}: ResultModalProps) {
  const [visibleResults, setVisibleResults] = useState<ResultItemData[]>([]);
  const [isSorting, setIsSorting] = useState(false);
  const [runId, setRunId] = useState(0);
  
  const scrollViewRef = useRef<ScrollView>(null);

  /* 🏆 ÍCONE */
  const iconScale = useSharedValue(0);
  const feedbackOpacity = useSharedValue(0);

  useEffect(() => {
    if (!visible) return;

    iconScale.value = withSequence(
      withTiming(0),
      withTiming(1.2, { duration: 400 }),
      withTiming(1, { duration: 200 })
    );
  }, [visible]);

  useEffect(() => {
    if (!visible) return;

    const dataWithPositions: ResultItemData[] = result.map((item, index) => ({
      value: item,
      position: index + 1,
    }));

    setVisibleResults([]);
    setIsSorting(sequential);

    if (sequential) {
      feedbackOpacity.value = withRepeat(
        withTiming(1, { duration: 600 }),
        -1,
        true
      );
    } else {
      setVisibleResults(dataWithPositions);
      setIsSorting(false);
      feedbackOpacity.value = 0;
      return;
    }

    let currentIndex = 0;

    const timer = setInterval(() => {
      if (currentIndex >= dataWithPositions.length) {
        clearInterval(timer);
        setIsSorting(false);
        feedbackOpacity.value = withTiming(0);
        return;
      }

      const nextItem = dataWithPositions[currentIndex];
      
      setVisibleResults((prev) => {
        if (prev.find(p => p.position === nextItem.position)) return prev;
        return [...prev, nextItem];
      });

      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);

      currentIndex++;
    }, intervalSeconds * 1000);

    return () => clearInterval(timer);
  }, [visible, runId, result]);

  const iconStyle = useAnimatedStyle(() => ({
    transform: [{ scale: iconScale.value }],
  }));

  const feedbackStyle = useAnimatedStyle(() => ({
    opacity: feedbackOpacity.value,
  }));

  // ✅ NOVO GRADIENTE: Azul Puro (Blue 500 -> Blue 800)
  // Sem roxo, sem verde. Apenas azul.
  const getGradient = () => {
    return ['#3b82f6', '#1e3a8a']; 
  };

  const handleNewDraw = () => {
    setVisibleResults([]);
    setIsSorting(false);
    setRunId((id) => id + 1);
    onNewDraw();
  };

  // ✅ LÓGICA DE FONTE: Ajusta se o número for grande (3 ou 4 dígitos)
  const getFontSize = (val: string | number) => {
    const str = String(val);
    if (str.length >= 4) return BALL_SIZE * 0.32; // Pequeno para 1000+
    if (str.length === 3) return BALL_SIZE * 0.38; // Médio para 100+
    return BALL_SIZE * 0.45; // Normal para 1-99
  };

  return (
    <Modal visible={visible} transparent animationType="fade" statusBarTranslucent>
      <View style={styles.overlay}>
        <LinearGradient colors={getGradient()} style={styles.container}>
          <SafeAreaView style={styles.safeArea}>
            
            <View style={styles.header}>
              <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                <X size={24} color="#fff" />
              </TouchableOpacity>
            </View>

            <View style={styles.content}>
              <Animated.View style={[styles.iconContainer, iconStyle]}>
                <Trophy size={40} color="#fff" fill="#fff" />
              </Animated.View>

              <Text style={styles.title}>Sorteio Realizado</Text>

             

              <View style={styles.listWrapper}>
                <ScrollView
                  ref={scrollViewRef}
                  style={{ flex: 1 }}
                  contentContainerStyle={styles.ballsContainer}
                  showsVerticalScrollIndicator={false}
                >
                  {visibleResults.map((item) => (
                    <Animated.View
                      key={item.position}
                      entering={ZoomIn.springify().damping(12).mass(0.8)}
                      layout={FadeInDown}
                      style={styles.ballWrapper}
                    >
                      <View style={styles.ball}>
                        <View style={styles.ballShine} />
                        {/* ✅ APLICANDO FONTE DINÂMICA
                          Cor: Azul escuro para combinar com o fundo azul
                        */}
                        <Text style={[styles.ballText, { fontSize: getFontSize(item.value) }]}>
                          {String(item.value).padStart(2, '0')}
                        </Text>
                      </View>
                      <Text style={styles.orderText}>{item.position}º</Text>
                    </Animated.View>
                  ))}
                </ScrollView>
              </View>

              <TouchableOpacity
                style={styles.actionButton}
                onPress={handleNewDraw}
                disabled={isSorting}
              >
                <RotateCcw size={20} color={isSorting ? "rgba(255,255,255,0.5)" : "#fff"} />
                <Text style={[styles.actionText, isSorting && { opacity: 0.5 }]}>
                  {isSorting ? "Aguarde..." : "Sortear novamente"}
                </Text>
              </TouchableOpacity>

            </View>
          </SafeAreaView>
        </LinearGradient>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  container: {
    width: '100%',
    maxWidth: 400,
    minHeight: 420,
    maxHeight: '80%',
    borderRadius: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 5,
    overflow: 'hidden',
  },
  safeArea: {
    flex: 1,
  },
  header: {
    alignItems: 'flex-end',
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingBottom: 24,
    alignItems: 'center',
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
    marginTop: -20,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 4,
  },
  feedback: {
    color: '#dbeafe', // Azul bem clarinho
    fontSize: 16,
    fontWeight: '600',
    backgroundColor: 'rgba(0,0,0,0.15)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginBottom: 12,
    overflow: 'hidden',
  },
  divider: {
    height: 12,
  },
  listWrapper: {
    flex: 1,
    width: '100%',
    marginBottom: 16,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 16,
    padding: 8,
  },
  ballsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    paddingVertical: 10,
    gap: 12,
  },
  ballWrapper: {
    alignItems: 'center',
    gap: 4,
  },
  ball: {
    width: BALL_SIZE,
    height: BALL_SIZE,
    borderRadius: BALL_SIZE / 2,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
  },
  ballShine: {
    position: 'absolute',
    top: '15%',
    right: '20%',
    width: '25%',
    height: '25%',
    borderRadius: 50,
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  ballText: {
    // fontSize agora é controlado dinamicamente no componente
    fontWeight: '800',
    color: '#1e3a8a', // <--- Azul Escuro Profundo (Legibilidade perfeita no azul)
    fontVariant: ['tabular-nums'],
  },
  orderText: {
    color: '#bfdbfe', // <--- Azul Claro (Blue 200)
    fontSize: 11,
    fontWeight: '700',
  },
  actionButton: {
    backgroundColor: 'rgba(255,255,255,0.25)',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 16,
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.25)'
  },
  actionText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
});