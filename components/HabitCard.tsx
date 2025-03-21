import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { format } from 'date-fns';
import { Check } from 'lucide-react-native';
import { Habit } from '@/types/habit';

interface HabitCardProps {
  habit: Habit;
  onToggle: () => void;
  onPress: () => void;
}

export function HabitCard({ habit, onToggle, onPress }: HabitCardProps) {
  const isCompletedToday = habit.completedDates.includes(format(new Date(), 'yyyy-MM-dd'));
  const streakAnimation = useRef(new Animated.Value(1)).current;

  // Animate the streak when the habit is toggled
  useEffect(() => {
    if (isCompletedToday) {
      Animated.sequence([
        Animated.timing(streakAnimation, {
          toValue: 1.2,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(streakAnimation, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isCompletedToday]);

  return (
    <TouchableOpacity
      style={[styles.card, { borderLeftColor: habit.color }]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.content}>
        <Text style={styles.name}>{habit.name}</Text>
        <Text style={styles.description} numberOfLines={2}>
          {habit.description}
        </Text>
        <View style={styles.details}>
          <Text style={styles.frequency}>{habit.frequency}</Text>
          {habit.timeOfDay && (
            <Text style={styles.timeOfDay}> • {habit.timeOfDay}</Text>
          )}
          {/* Streak Display */}
          <View style={styles.streakContainer}>
            <Animated.Text
              style={[styles.streakIcon, { transform: [{ scale: streakAnimation }] }]}
            >
              🔥
            </Animated.Text>
            <Text style={styles.streakText}>{habit.streak || 0} days</Text>
          </View>
        </View>
        {/* Streak Progress Bar */}
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              { width: `${(habit.streak / 7) * 100}%` }, // Adjust the milestone (e.g., 7 days)
            ]}
          />
        </View>
      </View>
      <TouchableOpacity
        style={[styles.checkButton, isCompletedToday && styles.checkButtonCompleted]}
        onPress={onToggle}
      >
        <Check
          size={20}
          color={isCompletedToday ? '#fff' : '#64748b'}
        />
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  content: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 8,
  },
  details: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8, // Added gap for better spacing
  },
  frequency: {
    fontSize: 12,
    color: '#64748b',
    textTransform: 'capitalize',
  },
  timeOfDay: {
    fontSize: 12,
    color: '#64748b',
    textTransform: 'capitalize',
  },
  streakContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 'auto', // Push streak to the right
  },
  streakIcon: {
    fontSize: 14,
    marginRight: 4,
  },
  streakText: {
    fontSize: 12,
    color: '#64748b',
  },
  progressBar: {
    height: 4,
    backgroundColor: '#f1f5f9',
    borderRadius: 2,
    marginTop: 8,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#6366f1',
    borderRadius: 2,
  },
  checkButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  checkButtonCompleted: {
    backgroundColor: '#6366f1',
  },
});