import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Habit, HabitFormData, HabitCategory, HabitFilter } from '@/types/habit';
import { format, addDays } from 'date-fns';

const HABITS_STORAGE_KEY = '@habits';
const CATEGORIES_STORAGE_KEY = '@categories';

const DEFAULT_CATEGORIES: HabitCategory[] = [
  { id: '1', name: 'Health', color: '#6366f1', icon: '💪' },
  { id: '2', name: 'Learning', color: '#ec4899', icon: '📚' },
  { id: '3', name: 'Productivity', color: '#14b8a6', icon: '⚡' },
  { id: '4', name: 'Mindfulness', color: '#f59e0b', icon: '🧘' },
];

export function useHabits() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [categories, setCategories] = useState<HabitCategory[]>(DEFAULT_CATEGORIES);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<HabitFilter>({});

  // Load data from AsyncStorage on mount
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [habitsData, categoriesData] = await Promise.all([
        AsyncStorage.getItem(HABITS_STORAGE_KEY),
        AsyncStorage.getItem(CATEGORIES_STORAGE_KEY),
      ]);

      if (habitsData) {
        setHabits(JSON.parse(habitsData));
      }

      if (categoriesData) {
        setCategories(JSON.parse(categoriesData));
      } else {
        // Save default categories if none exist
        await AsyncStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(DEFAULT_CATEGORIES));
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveHabits = async (updatedHabits: Habit[]) => {
    try {
      await AsyncStorage.setItem(HABITS_STORAGE_KEY, JSON.stringify(updatedHabits));
      setHabits(updatedHabits);
    } catch (error) {
      console.error('Error saving habits:', error);
    }
  };

  const saveCategories = async (updatedCategories: HabitCategory[]) => {
    try {
      await AsyncStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(updatedCategories));
      setCategories(updatedCategories);
    } catch (error) {
      console.error('Error saving categories:', error);
    }
  };

  const addHabit = async (habitData: HabitFormData) => {
    const newHabit: Habit = {
      ...habitData,
      id: Date.now().toString(), // Generate a unique ID
      createdAt: new Date().toISOString(),
      completedDates: [],
      streak: 0, // Initialize streak to 0
      priority: habitData.priority || 'medium',
    };
    const updatedHabits = [...habits, newHabit];
    await saveHabits(updatedHabits);
  };

  const updateHabit = async (id: string, habitData: Partial<Habit>) => {
    const updatedHabits = habits.map((habit) =>
      habit.id === id ? { ...habit, ...habitData } : habit
    );
    await saveHabits(updatedHabits);
  };

  const deleteHabit = async (id: string) => {
    const updatedHabits = habits.filter((habit) => habit.id !== id);
    await saveHabits(updatedHabits);
  };

  const toggleHabitCompletion = async (id: string, date = new Date()) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    const updatedHabits = habits.map((habit) => {
      if (habit.id === id) {
        const isCompleted = habit.completedDates.includes(dateStr);
        const completedDates = isCompleted
          ? habit.completedDates.filter((d) => d !== dateStr)
          : [...habit.completedDates, dateStr];

        // Calculate streak
        let streak = habit.streak || 0;
        if (isCompleted) {
          // If unmarking completion, decrease streak if the habit was completed yesterday or today
          const yesterdayStr = format(addDays(date, -1), 'yyyy-MM-dd');
          if (habit.completedDates.includes(yesterdayStr)) {
            streak = Math.max(streak - 1, 0);
          }
        } else {
          // If marking completion, increase streak if the habit was completed yesterday
          const yesterdayStr = format(addDays(date, -1), 'yyyy-MM-dd');
          if (habit.completedDates.includes(yesterdayStr)) {
            streak += 1;
          } else {
            streak = 1; // Reset streak if not completed yesterday
          }
        }

        return { ...habit, completedDates, streak };
      }
      return habit;
    });
    await saveHabits(updatedHabits);
  };

  const addCategory = async (category: Omit<HabitCategory, 'id'>) => {
    const newCategory: HabitCategory = {
      ...category,
      id: Date.now().toString(), // Generate a unique ID
    };
    const updatedCategories = [...categories, newCategory];
    await saveCategories(updatedCategories);
  };

  const updateCategory = async (id: string, categoryData: Partial<HabitCategory>) => {
    const updatedCategories = categories.map((category) =>
      category.id === id ? { ...category, ...categoryData } : category
    );
    await saveCategories(updatedCategories);
  };

  const deleteCategory = async (id: string) => {
    const updatedCategories = categories.filter((category) => category.id !== id);
    await saveCategories(updatedCategories);

    // Update habits that were in this category
    const updatedHabits = habits.map((habit) =>
      habit.categoryId === id ? { ...habit, categoryId: undefined } : habit
    );
    await saveHabits(updatedHabits);
  };

  const getFilteredHabits = () => {
    return habits.filter((habit) => {
      if (filters.category && habit.categoryId !== filters.category) return false;
      if (filters.timeOfDay && habit.timeOfDay !== filters.timeOfDay) return false;
      if (filters.frequency && habit.frequency !== filters.frequency) return false;
      if (filters.priority && habit.priority !== filters.priority) return false;
      if (filters.completed !== undefined) {
        const isCompletedToday = habit.completedDates.includes(format(new Date(), 'yyyy-MM-dd'));
        if (filters.completed !== isCompletedToday) return false;
      }
      return true;
    });
  };

  return {
    habits: getFilteredHabits(),
    categories,
    loading,
    filters,
    setFilters,
    addHabit,
    updateHabit,
    deleteHabit,
    toggleHabitCompletion,
    addCategory,
    updateCategory,
    deleteCategory,
  };
}