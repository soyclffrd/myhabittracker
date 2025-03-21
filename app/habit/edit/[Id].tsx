import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useHabits } from '@/hooks/useHabits';

export default function EditHabitScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { habits, updateHabit, loading: habitsLoading } = useHabits();
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

  const [name, setName] = useState(habit.name);
  const [description, setDescription] = useState(habit.description);
  const [frequency, setFrequency] = useState(habit.frequency);
  const [timeOfDay, setTimeOfDay] = useState(habit.timeOfDay);

  const handleSave = async () => {
    const updatedHabit = {
      ...habit,
      name,
      description,
      frequency,
      timeOfDay,
    };
    await updateHabit(habit.id, updatedHabit);
    router.back();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Name</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="Habit Name"
      />

      <Text style={styles.label}>Description</Text>
      <TextInput
        style={styles.input}
        value={description}
        onChangeText={setDescription}
        placeholder="Habit Description"
      />

      <Text style={styles.label}>Frequency</Text>
      <TextInput
        style={styles.input}
        value={frequency}
        onChangeText={(text) => setFrequency(text as "daily" | "weekly")}
        placeholder="Frequency"
      />

      <Text style={styles.label}>Time of Day</Text>
      <TextInput
        style={styles.input}
        value={timeOfDay}
        onChangeText={(text) => {
          if (["morning", "afternoon", "evening", "anytime"].includes(text)) {
            setTimeOfDay(text as "morning" | "afternoon" | "evening" | "anytime");
          }
        }}
        placeholder="Time of Day"
      />

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Save</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f8fafc',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    fontSize: 16,
    color: '#1e293b',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
    color: '#1e293b',
  },
  saveButton: {
    backgroundColor: '#6366f1',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  saveButtonText: {
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