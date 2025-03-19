export type HabitCategory = {
  id: string;
  name: string;
  color: string;
  icon: string;
};

export interface Habit {
  id: string;
  name: string;
  description?: string;
  frequency: 'daily' | 'weekly';
  timeOfDay?: 'morning' | 'afternoon' | 'evening' | 'anytime';
  createdAt: string;
  completedDates: string[];
  color: string;
  icon: string;
  categoryId?: string;
  reminder?: boolean;
  priority: 'low' | 'medium' | 'high';
  streak: number; // Add streak property
}

export type HabitFormData = Omit<Habit, 'id' | 'createdAt' | 'completedDates' | 'streak'>; // Exclude streak from form data

export type HabitFilter = {
  category?: string;
  timeOfDay?: string;
  frequency?: string;
  priority?: string;
  completed?: boolean;
};