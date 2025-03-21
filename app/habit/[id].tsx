import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useHabits } from '@/hooks/useHabits';
import { format } from 'date-fns';
import { Trash2, Edit, Check } from 'lucide-react-native';

export default function HabitDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { habits, deleteHabit, toggleHabitCompletion, loading: habitsLoading } = useHabits();
  const [isLoading, setIsLoading] = useState(true);

  // Ensure `id` is always a string
  const habitId = Array.isArray(id) ? id[0] : id;

  // Find the habit by ID
  const habit = habits.find((h) => h.id === habitId);

  // Wait for habits to load
  useEffect(() => {
    if (!habitsLoading) {
      setIsLoading(false);
    }
  }, [habitsLoading]);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6366f1" />
      </View>
    );
  }

  if (!habit) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Habit not found</Text>
      </View>
    );
  }

  const handleDelete = () => {
    Alert.alert(
      'Delete Habit',
      'Are you sure you want to delete this habit? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await deleteHabit(habit.id);
            router.back();
          },
        },
      ]
    );
  };

  const handleEdit = () => {
    console.log('Navigating to edit screen with ID:', habit.id); // Debugging log
    router.push(`/habit/edit/${habit.id}`);
  };

  const isCompletedToday = habit.completedDates.includes(format(new Date(), 'yyyy-MM-dd'));

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { borderLeftColor: habit.color }]}>
        <View>
          <Text style={styles.name}>{habit.name}</Text>
          <Text style={styles.description}>{habit.description}</Text>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity onPress={handleEdit} style={styles.editButton}>
            <Edit size={24} color="#3b82f6" />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleDelete} style={styles.deleteButton}>
            <Trash2 size={24} color="#ef4444" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Streak and Progress */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Streak</Text>
        <View style={styles.streakContainer}>
          <Text style={styles.streakText}>🔥 {habit.streak || 0} day streak</Text>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                { width: `${(habit.streak / 7) * 100}%` }, // Adjust the milestone (e.g., 7 days)
              ]}
            />
          </View>
        </View>
      </View>

      {/* Details */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Details</Text>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Frequency</Text>
          <Text style={styles.detailValue}>{habit.frequency}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Time of Day</Text>
          <Text style={styles.detailValue}>{habit.timeOfDay || 'Anytime'}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Created</Text>
          <Text style={styles.detailValue}>
            {format(new Date(habit.createdAt), 'MMM d, yyyy')}
          </Text>
        </View>
      </View>

      {/* Completion History */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Completion History</Text>
        {habit.completedDates.length === 0 ? (
          <Text style={styles.emptyText}>No completions yet.</Text>
        ) : (
          habit.completedDates.map((date, index) => (
            <View key={index} style={styles.completionRow}>
              <Text style={styles.completionDate}>
                {format(new Date(date), 'MMM d, yyyy')}
              </Text>
              <Check size={20} color="#10b981" />
            </View>
          ))
        )}
      </View>

      {/* Mark as Completed */}
      <TouchableOpacity
        style={[styles.completeButton, isCompletedToday && styles.completeButtonDisabled]}
        onPress={() => toggleHabitCompletion(habit.id)}
        disabled={isCompletedToday}
      >
        <Text style={styles.completeButtonText}>
          {isCompletedToday ? 'Completed Today' : 'Mark as Completed'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderLeftWidth: 4,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: '#64748b',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 16,
  },
  editButton: {
    padding: 8,
  },
  deleteButton: {
    padding: 8,
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  detailLabel: {
    fontSize: 16,
    color: '#64748b',
  },
  detailValue: {
    fontSize: 16,
    color: '#1e293b',
    textTransform: 'capitalize',
  },
  streakContainer: {
    marginBottom: 16,
  },
  streakText: {
    fontSize: 16,
    color: '#1e293b',
    marginBottom: 8,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#f1f5f9',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#6366f1',
    borderRadius: 4,
  },
  completionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  completionDate: {
    fontSize: 16,
    color: '#1e293b',
  },
  emptyText: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
    marginTop: 8,
  },
  completeButton: {
    backgroundColor: '#6366f1',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 16,
  },
  completeButtonDisabled: {
    backgroundColor: '#cbd5e1',
  },
  completeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  errorText: {
    fontSize: 18,
    color: '#ef4444',
    textAlign: 'center',
    marginTop: 32,
  },
});