import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { useHabits } from '@/hooks/useHabits';
import { HabitCard } from '@/components/HabitCard';
import { useRouter } from 'expo-router';
import { format } from 'date-fns';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export default function TodayScreen() {
  const router = useRouter();
  const { habits, loading, toggleHabitCompletion } = useHabits();
  const scrollY = new Animated.Value(0);

  const todayHabits = habits.filter((habit) => {
    if (habit.frequency === 'daily') return true;
    if (habit.frequency === 'weekly') return true;
    return false;
  });

  // Animate the header's translateY and opacity
  const headerTranslateY = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [0, -50], // Move the header up by 50 units
    extrapolate: 'clamp',
  });

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [1, 0.8],
    extrapolate: 'clamp',
  });

  // Streak animation
  const streakAnimation = useRef(new Animated.Value(1)).current;

  const animateStreak = () => {
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
  };

  useEffect(() => {
    // Trigger streak animation when habits are updated
    animateStreak();
  }, [habits]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6366f1" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Gradient Background */}
      <LinearGradient
        colors={['#f0f4ff', '#ffffff']}
        style={styles.background}
      />

      {/* Animated Header */}
      <Animated.View
        style={[
          styles.header,
          {
            transform: [{ translateY: headerTranslateY }], // Use transform instead of height
            opacity: headerOpacity,
          },
        ]}
      >
        <View style={styles.headerContent}>
          <Text style={styles.date}>{format(new Date(), 'EEEE, MMMM d')}</Text>
          <Text style={styles.title}>Today's Habits</Text>
          <Text style={styles.subtitle}>
            {todayHabits.length} habits scheduled for today
          </Text>
        </View>
      </Animated.View>

      {/* Scrollable Content */}
      <Animated.ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true } // Enable native driver for smoother animations
        )}
        scrollEventThrottle={16}
      >
        {todayHabits.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              No habits for today. Add some habits to get started!
            </Text>
          </View>
        ) : (
          todayHabits.map((habit) => (
            <HabitCard
              key={habit.id}
              habit={habit}
              onToggle={() => toggleHabitCompletion(habit.id)}
              onPress={() => router.push(`/habit/${habit.id}`)}
            />
          ))
        )}
      </Animated.ScrollView>

      {/* Floating Action Button (FAB) */}
      {/* <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push('/habit/new-habit')}
      >
        <Ionicons name="add" size={28} color="#ffffff" />
      </TouchableOpacity> */}
    </View>
  );
}

// Stylesheet
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  background: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  header: {
    backgroundColor: '#ffffff',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    paddingHorizontal: 24,
    paddingTop: 48,
    paddingBottom: 24,
    justifyContent: 'flex-end',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  headerContent: {
    paddingBottom: 24,
  },
  date: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 4,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  subtitle: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 4,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 100, // Add extra padding at the bottom for the FAB
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyText: {
    textAlign: 'center',
    color: '#64748b',
    fontSize: 16,
  },
  fab: {
    position: 'absolute',
    bottom: 84, // Adjusted to account for the Tab Layout height (60) + some padding (24)
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#6366f1',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
});