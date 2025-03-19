import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { HabitFilter } from '@/types/habit';

interface FilterBarProps {
  filters: HabitFilter;
  onFilterChange: (filters: HabitFilter) => void;
}

export function FilterBar({ filters, onFilterChange }: FilterBarProps) {
  const timeOptions = ['morning', 'afternoon', 'evening', 'anytime'];
  const frequencyOptions = ['daily', 'weekly'];
  const priorityOptions = ['low', 'medium', 'high'];

  const toggleFilter = (key: keyof HabitFilter, value: string | boolean) => {
    if (filters[key] === value) {
      const newFilters = { ...filters };
      delete newFilters[key];
      onFilterChange(newFilters);
    } else {
      onFilterChange({ ...filters, [key]: value });
    }
  };

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.container}
      contentContainerStyle={styles.content}>
      <View style={styles.filterGroup}>
        <Text style={styles.label}>Time</Text>
        <View style={styles.options}>
          {timeOptions.map(time => (
            <TouchableOpacity
              key={time}
              style={[
                styles.option,
                filters.timeOfDay === time && styles.optionSelected,
              ]}
              onPress={() => toggleFilter('timeOfDay', time)}>
              <Text
                style={[
                  styles.optionText,
                  filters.timeOfDay === time && styles.optionTextSelected,
                ]}>
                {time}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.filterGroup}>
        <Text style={styles.label}>Frequency</Text>
        <View style={styles.options}>
          {frequencyOptions.map(freq => (
            <TouchableOpacity
              key={freq}
              style={[
                styles.option,
                filters.frequency === freq && styles.optionSelected,
              ]}
              onPress={() => toggleFilter('frequency', freq)}>
              <Text
                style={[
                  styles.optionText,
                  filters.frequency === freq && styles.optionTextSelected,
                ]}>
                {freq}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.filterGroup}>
        <Text style={styles.label}>Priority</Text>
        <View style={styles.options}>
          {priorityOptions.map(priority => (
            <TouchableOpacity
              key={priority}
              style={[
                styles.option,
                filters.priority === priority && styles.optionSelected,
              ]}
              onPress={() => toggleFilter('priority', priority)}>
              <Text
                style={[
                  styles.optionText,
                  filters.priority === priority && styles.optionTextSelected,
                ]}>
                {priority}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <TouchableOpacity
        style={[
          styles.option,
          filters.completed && styles.optionSelected,
        ]}
        onPress={() => toggleFilter('completed', true)}>
        <Text
          style={[
            styles.optionText,
            filters.completed && styles.optionTextSelected,
          ]}>
          Completed
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    paddingVertical: 12,
  },
  content: {
    paddingHorizontal: 16,
    gap: 16,
  },
  filterGroup: {
    marginRight: 16,
  },
  label: {
    fontSize: 12,
    color: '#94a3b8',
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  options: {
    flexDirection: 'row',
    gap: 8,
  },
  option: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  optionSelected: {
    backgroundColor: '#6366f1',
  },
  optionText: {
    color: '#94a3b8',
    fontSize: 14,
    textTransform: 'capitalize',
  },
  optionTextSelected: {
    color: '#fff',
  },
});