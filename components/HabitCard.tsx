import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
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
            <Text style={styles.streakIcon}>🔥</Text>
            <Text style={styles.streakText}>{habit.streak || 0} days</Text>
          </View>
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