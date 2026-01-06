import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTranslation } from 'react-i18next'; // Adicionado
import { X, RotateCcw, Users, User } from 'lucide-react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  ZoomIn,
  Layout,
  FadeInDown,
} from 'react-native-reanimated';
import { useEffect, useState, useRef } from 'react';

interface AnimationQueueItem {
  groupIndex: number;
  memberName: string;
}

interface GroupsResultModalProps {
  visible: boolean;
  result: string[];
  onClose: () => void;
  onNewDraw: () => void;
  sequential?: boolean; 
}

export function GroupsResultModal({
  visible,
  result,
  onClose,
  onNewDraw,
  sequential = false, 
}: GroupsResultModalProps) {
  const { t } = useTranslation();
  const [visibleGroups, setVisibleGroups] = useState<string[][]>([]);
  const [isSorting, setIsSorting] = useState(false);
  
  const scrollViewRef = useRef<ScrollView>(null);
  const queueRef = useRef<AnimationQueueItem[]>([]);
  const iconScale = useSharedValue(0);

  useEffect(() => {
    if (!visible) {
      setVisibleGroups([]);
      setIsSorting(false);
    }
  }, [visible]);

  useEffect(() => {
    if (!visible) return;

    iconScale.value = withSequence(
      withTiming(0),
      withTiming(1.2, { duration: 400 }),
      withTiming(1, { duration: 200 })
    );

    const parsedGroups = result.map(g => g.split(', ').filter(n => n));
    setVisibleGroups(parsedGroups.map(() => []));
    
    const newQueue: AnimationQueueItem[] = [];

    if (sequential) {
      parsedGroups.forEach((groupMembers, groupIndex) => {
        groupMembers.forEach(member => {
          newQueue.push({
            groupIndex: groupIndex,
            memberName: member
          });
        });
      });
    } else {
      const maxMembers = Math.max(...parsedGroups.map(g => g.length));
      for (let i = 0; i < maxMembers; i++) {
        for (let groupIdx = 0; groupIdx < parsedGroups.length; groupIdx++) {
          if (parsedGroups[groupIdx][i]) {
            newQueue.push({
              groupIndex: groupIdx,
              memberName: parsedGroups[groupIdx][i]
            });
          }
        }
      }
    }

    queueRef.current = newQueue;
    setIsSorting(true);

    const speed = sequential ? 300 : 600;
    let currentIndex = 0;

    const timer = setInterval(() => {
      if (currentIndex >= queueRef.current.length) {
        clearInterval(timer);
        setIsSorting(false);
        return;
      }

      const item = queueRef.current[currentIndex];
      
      setVisibleGroups(prev => {
        const newGroups = [...prev];
        if (!newGroups[item.groupIndex]) newGroups[item.groupIndex] = [];
        newGroups[item.groupIndex] = [...newGroups[item.groupIndex], item.memberName];
        return newGroups;
      });

      if (item.groupIndex > 1) {
         scrollViewRef.current?.scrollToEnd({ animated: true });
      }

      currentIndex++;
    }, speed);

    return () => clearInterval(timer);
  }, [visible, result, sequential]);

  const iconStyle = useAnimatedStyle(() => ({
    transform: [{ scale: iconScale.value }],
  }));

  const handleNewDraw = () => {
    setVisibleGroups([]);
    setIsSorting(false);
    onNewDraw();
  };

  return (
    <Modal visible={visible} transparent animationType="fade" statusBarTranslucent>
      <View style={styles.overlay}>
        <LinearGradient colors={['#8b5cf6', '#4c1d95']} style={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <X size={24} color="#fff" />
            </TouchableOpacity>
          </View>

          <View style={styles.content}>
            <Animated.View style={[styles.iconContainer, iconStyle]}>
              <Users size={40} color="#fff" fill="#fff" />
            </Animated.View>

            <Text style={styles.title}>
              {t('sortear.groupsResult.title')}
            </Text>
            <Text style={styles.subtitle}>
              {isSorting 
                ? t('sortear.groupsResult.statusSorting') 
                : t('sortear.groupsResult.statusFinished')
              }
            </Text>

            <ScrollView 
              ref={scrollViewRef}
              style={styles.scrollArea}
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
            >
              {visibleGroups.map((members, index) => (
                <Animated.View 
                  key={index}
                  entering={FadeInDown.delay(index * 100).springify()}
                  layout={Layout.springify()}
                  style={styles.groupCard}
                >
                  <View style={styles.groupHeader}>
                    <Text style={styles.groupTitle}>
                      {t('sortear.groupsResult.groupLabel')} {index + 1}
                    </Text>
                    <View style={styles.badge}>
                      <Text style={styles.badgeText}>{members.length}</Text>
                    </View>
                  </View>

                  <View style={styles.membersList}>
                    {members.map((member, mIndex) => (
                      <Animated.View 
                        key={`${index}-${mIndex}-${member}`}
                        entering={ZoomIn.springify()}
                        style={styles.memberChip}
                      >
                        <User size={14} color="#fff" />
                        <Text style={styles.memberText}>{member}</Text>
                      </Animated.View>
                    ))}
                    {members.length === 0 && isSorting && (
                      <Text style={styles.emptyText}>
                        {t('sortear.groupsResult.waiting')}
                      </Text>
                    )}
                  </View>
                </Animated.View>
              ))}
            </ScrollView>

            <TouchableOpacity
              style={styles.actionButton}
              onPress={handleNewDraw}
              disabled={isSorting}
            >
              <RotateCcw size={20} color={isSorting ? "rgba(255,255,255,0.5)" : "#fff"} />
              <Text style={[styles.actionText, isSorting && { opacity: 0.5 }]}>
                {isSorting 
                  ? t('common.sorting') 
                  : t('sortear.groupsResult.drawAgain')
                }
              </Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  container: {
    width: '100%',
    maxWidth: 400,
    height: '85%',
    borderRadius: 24,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
    overflow: 'hidden',
  },
  header: {
    alignItems: 'flex-end',
    padding: 16,
    paddingBottom: 0,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
  },
  iconContainer: {
    marginBottom: 8,
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
    marginTop: -10,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#ddd6fe',
    marginBottom: 16,
    fontWeight: '600',
  },
  scrollArea: {
    width: '100%',
    flex: 1,
  },
  scrollContent: {
    gap: 12,
    paddingBottom: 20,
  },
  groupCard: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  groupHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
    paddingBottom: 8,
  },
  groupTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
  },
  badge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
  membersList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  memberChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    gap: 6,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  memberText: {
    color: '#5b21b6',
    fontWeight: '700',
    fontSize: 14,
  },
  emptyText: {
    color: 'rgba(255,255,255,0.4)',
    fontStyle: 'italic',
    fontSize: 13,
  },
  actionButton: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    marginTop: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  actionText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
});