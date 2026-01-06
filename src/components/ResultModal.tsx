import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { X, RotateCcw, Star } from 'lucide-react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withSequence,
  Easing,
} from 'react-native-reanimated';
import { useEffect, useState, useRef } from 'react';

interface ResultItemData {
  value: string | number;
  position: number;
}

interface ResultModalProps {
  visible: boolean;
  type: string;
  result: (string | number)[];
  sequential: boolean;
  intervalSeconds: number;
  reverseOrder?: boolean;
  onClose: () => void;
  onNewDraw: () => void;
}

export function ResultModal({
  visible,
  type,
  result,
  sequential,
  intervalSeconds,
  reverseOrder = false,
  onClose,
  onNewDraw,
}: ResultModalProps) {
  const { t } = useTranslation();
  const [visibleResults, setVisibleResults] = useState<ResultItemData[]>([]);
  const [isSorting, setIsSorting] = useState(false);
  const [runId, setRunId] = useState(0);
  
  const flatListRef = useRef<FlatList>(null);
  const iconScale = useSharedValue(0);
  const feedbackOpacity = useSharedValue(0);

  useEffect(() => {
    if (!visible) {
      iconScale.value = 0;
      return;
    }

    if (isSorting) {
      iconScale.value = withRepeat(
        withSequence(
          withTiming(1.2, { duration: 400, easing: Easing.inOut(Easing.ease) }),
          withTiming(0.9, { duration: 400, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        true
      );
    } else {
      if (iconScale.value === 0) {
        iconScale.value = withSequence(
          withTiming(1.2, { duration: 300 }),
          withTiming(1, { duration: 200 })
        );
      } else {
        iconScale.value = withTiming(1, { duration: 300 });
      }
    }
  }, [visible, isSorting]);

  useEffect(() => {
    if (!visible) return;

    const dataWithPositions: ResultItemData[] = result.map((item, index) => ({
      value: item,
      position: index + 1,
    }));

    const ordered = reverseOrder
      ? [...dataWithPositions].reverse()
      : [...dataWithPositions];

    setVisibleResults([]);
    setIsSorting(sequential);

    if (sequential) {
      feedbackOpacity.value = withRepeat(
        withTiming(1, { duration: 600 }),
        -1,
        true
      );
    }

    if (!sequential) {
      setVisibleResults(ordered);
      setIsSorting(false);
      feedbackOpacity.value = 0;
      return;
    }

    let currentIndex = 0;
    const timer = setInterval(() => {
      if (currentIndex >= ordered.length) {
        clearInterval(timer);
        setIsSorting(false);
        feedbackOpacity.value = withTiming(0);
        return;
      }

      const nextItem = ordered[currentIndex];
      setVisibleResults((prev) => {
        if (prev.find(p => p.position === nextItem.position)) return prev;
        return [...prev, nextItem];
      });

      currentIndex++;
    }, intervalSeconds * 1000);

    return () => clearInterval(timer);
  }, [visible, runId, result]);

  const iconStyle = useAnimatedStyle(() => ({
    transform: [{ scale: iconScale.value }],
  }));

  const getTitle = () => {
    if (type === 'numbers') return t('sortear.result.numbersTitle');
    if (type === 'names') return t('sortear.result.namesTitle');
    return t('sortear.result.defaultTitle');
  };

  const getGradient = (): [string, string] => {
    switch (type) {
      case 'numbers': return ['#f093fb', '#f5576c'];
      default: return ['#667eea', '#764ba2'];
    }
  };

  const handleNewDraw = () => {
    setVisibleResults([]);
    setIsSorting(false);
    setRunId((id) => id + 1);
    onNewDraw();
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
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
                <Star size={48} color="#fff" fill="#fff" />
              </Animated.View>

              <Text style={styles.title}>{getTitle()}</Text>

              <FlatList
                ref={flatListRef}
                data={visibleResults}
                keyExtractor={(item) => item.position.toString()}
                style={styles.list}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                onContentSizeChange={() => {
                   if(visibleResults.length > 0) {
                     flatListRef.current?.scrollToEnd({ animated: true });
                   }
                }}
                renderItem={({ item }) => (
                  <View style={styles.resultItem}>
                    <Text style={styles.position}>{item.position}º</Text>
                    <Text style={styles.resultText} numberOfLines={1}>
                      {item.value}
                    </Text>
                  </View>
                )}
              />

              <TouchableOpacity
                style={styles.actionButton}
                onPress={handleNewDraw}
                disabled={isSorting}
              >
                <RotateCcw 
                  size={20} 
                  color={isSorting ? "rgba(255,255,255,0.5)" : "#fff"} 
                />
                <Text style={[styles.actionText, isSorting && styles.disabledText]}>
                  {isSorting ? t('common.wait') : t('sortear.result.drawAgain')}
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
  },
  container: {
    width: '90%',
    maxWidth: 400,
    borderRadius: 24,
    overflow: 'hidden',
  },
  safeArea: {
    // padding do SafeArea
  },
  header: {
    alignItems: 'flex-end',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    padding: 24,
    alignItems: 'center',
    gap: 16,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 7,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 3,
  },
  list: {
    width: '100%',
    maxHeight: 300,
  },
  listContent: {
    gap: 12,
    paddingBottom: 20,
  },
  resultItem: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 3,
  },
  position: {
    fontSize: 18,
    fontWeight: '900',
    color: '#6366f1',
    minWidth: 40,
  },
  resultText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1e293b',
    flex: 1,
    textAlign: 'right',
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
    marginTop: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  actionText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  disabledText: {
    opacity: 0.5,
  },
});