import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useHabits } from '@/hooks/useHabits';
import { HabitFormData } from '@/types/habit';
import { ArrowLeft } from 'lucide-react-native';
import RNPickerSelect from 'react-native-picker-select'; // For category and time dropdown

const COLORS = ['#6366f1', '#ec4899', '#14b8a6', '#f59e0b', '#8b5cf6'];
const TIME_OPTIONS = ['morning', 'afternoon', 'evening', 'anytime'];
const FREQUENCY_OPTIONS = ['daily', 'weekly'];

// Predefined time options (in HH:mm format)
const TIME_SLOTS = [
  '00:00', '01:00', '02:00', '03:00', '04:00', '05:00', '06:00', '07:00', '08:00', '09:00',
  '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00',
  '20:00', '21:00', '22:00', '23:00',
];

export default function NewHabitScreen() {
  const router = useRouter();
  const { addHabit, categories } = useHabits(); // Fetch categories from useHabits
  const [formData, setFormData] = useState<HabitFormData>({
    name: '',
    description: '',
    frequency: 'daily',
    timeOfDay: 'anytime',
    color: COLORS[0],
    icon: '📝',
    priority: 'low',
    categoryId: '', // Add categoryId to form data
    startTime: '09:00', // Default start time
    endTime: '17:00', // Default end time
  });

  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      alert('Please enter a habit name');
      return;
    }
    if (!formData.categoryId) {
      alert('Please select a category');
      return;
    }
    await addHabit(formData);
    router.back();
  };

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: 'https://images.unsplash.com/photo-1579546929662-711aa81148cf' }}
        style={styles.backgroundImage}
      />
      <View style={styles.overlay} />

      <ScrollView style={styles.scrollView}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft color="#fff" size={24} />
        </TouchableOpacity>

        <Text style={styles.title}>Create New Habit</Text>

        <View style={styles.form}>
          {/* Name Field */}
          <View style={styles.field}>
            <Text style={styles.label}>Name</Text>
            <TextInput
              style={styles.input}
              value={formData.name}
              onChangeText={(text) => setFormData({ ...formData, name: text })}
              placeholder="Enter habit name"
              placeholderTextColor="#94a3b8"
            />
          </View>

          {/* Description Field */}
          <View style={styles.field}>
            <Text style={styles.label}>Description (optional)</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={formData.description}
              onChangeText={(text) => setFormData({ ...formData, description: text })}
              placeholder="Enter habit description"
              placeholderTextColor="#94a3b8"
              multiline
              numberOfLines={4}
            />
          </View>

          {/* Category Field */}
          <View style={styles.field}>
            <Text style={styles.label}>Category</Text>
            <RNPickerSelect
              onValueChange={(value) => setFormData({ ...formData, categoryId: value })}
              items={categories.map((category) => ({
                label: category.name,
                value: category.id,
              }))}
              placeholder={{ label: 'Select a category', value: null }}
              style={pickerSelectStyles}
            />
          </View>

          {/* Frequency Field */}
          <View style={styles.field}>
            <Text style={styles.label}>Frequency</Text>
            <View style={styles.optionsContainer}>
              {FREQUENCY_OPTIONS.map((option) => (
                <TouchableOpacity
                  key={option}
                  style={[
                    styles.option,
                    formData.frequency === option && styles.optionSelected,
                  ]}
                  onPress={() =>
                    setFormData({ ...formData, frequency: option as 'daily' | 'weekly' })
                  }>
                  <Text
                    style={[
                      styles.optionText,
                      formData.frequency === option && styles.optionTextSelected,
                    ]}>
                    {option}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Time of Day Field */}
          <View style={styles.field}>
            <Text style={styles.label}>Time of Day</Text>
            <View style={styles.optionsContainer}>
              {TIME_OPTIONS.map((option) => (
                <TouchableOpacity
                  key={option}
                  style={[
                    styles.option,
                    formData.timeOfDay === option && styles.optionSelected,
                  ]}
                  onPress={() =>
                    setFormData({
                      ...formData,
                      timeOfDay: option as 'morning' | 'afternoon' | 'evening' | 'anytime',
                    })
                  }>
                  <Text
                    style={[
                      styles.optionText,
                      formData.timeOfDay === option && styles.optionTextSelected,
                    ]}>
                    {option}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Start Time Field */}
          <View style={styles.field}>
            <Text style={styles.label}>Start Time</Text>
            <RNPickerSelect
              onValueChange={(value) => setFormData({ ...formData, startTime: value })}
              items={TIME_SLOTS.map((time) => ({
                label: time,
                value: time,
              }))}
              value={formData.startTime}
              placeholder={{ label: 'Select start time', value: null }}
              style={pickerSelectStyles}
            />
          </View>

          {/* End Time Field */}
          <View style={styles.field}>
            <Text style={styles.label}>End Time</Text>
            <RNPickerSelect
              onValueChange={(value) => setFormData({ ...formData, endTime: value })}
              items={TIME_SLOTS.map((time) => ({
                label: time,
                value: time,
              }))}
              value={formData.endTime}
              placeholder={{ label: 'Select end time', value: null }}
              style={pickerSelectStyles}
            />
          </View>

          {/* Color Field */}
          <View style={styles.field}>
            <Text style={styles.label}>Color</Text>
            <View style={styles.colorContainer}>
              {COLORS.map((color) => (
                <TouchableOpacity
                  key={color}
                  style={[styles.colorOption, { backgroundColor: color }]}
                  onPress={() => setFormData({ ...formData, color })}
                />
              ))}
            </View>
          </View>

          {/* Submit Button */}
          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>Create Habit</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

// Stylesheet
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#030303',
  },
  backgroundImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  overlay: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(3, 3, 3, 0.8)',
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 24,
  },
  form: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    padding: 20,
    backdropFilter: 'blur(8px)',
  },
  field: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#ffffff',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  option: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
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
  colorContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  colorOption: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  submitButton: {
    backgroundColor: '#6366f1',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

// Styles for RNPickerSelect
const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    color: '#ffffff',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  inputAndroid: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    color: '#ffffff',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
});