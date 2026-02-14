// ============================================
// STATE MANAGEMENT
// Handles progress tracking, localStorage persistence
// ============================================

const State = {
    // Default state structure
    defaultState: {
        completedDays: [],
        completedSteps: {},
        streak: 0,
        totalXP: 0,
        lastActiveDate: null,
        achievements: []
    },

    // Load progress from localStorage
    loadProgress() {
        const saved = localStorage.getItem('pythonCourseProgress');
        if (saved) {
            try {
                return { ...this.defaultState, ...JSON.parse(saved) };
            } catch (e) {
                console.error('Error loading progress:', e);
                return { ...this.defaultState };
            }
        }
        return { ...this.defaultState };
    },

    // Save progress to localStorage
    saveProgress(state) {
        try {
            localStorage.setItem('pythonCourseProgress', JSON.stringify(state));
            return true;
        } catch (e) {
            console.error('Error saving progress:', e);
            return false;
        }
    },

    // Check if a day is completed
    isDayCompleted(state, weekId, dayId) {
        return state.completedDays.some(d => d.weekId === weekId && d.dayId === dayId);
    },

    // Check if a step is completed
    isStepCompleted(state, weekId, dayId, stepNumber) {
        const key = `${weekId}-${dayId}`;
        return state.completedSteps[key]?.includes(stepNumber) || false;
    },

    // Complete a day
    completeDay(state, weekId, dayId) {
        if (this.isDayCompleted(state, weekId, dayId)) {
            return state; // Already completed
        }

        const newState = { ...state };
        newState.completedDays = [...state.completedDays, { weekId, dayId, completedAt: new Date().toISOString() }];

        // Award XP
        newState.totalXP = state.totalXP + 50;

        // Update streak
        newState.streak = this.calculateStreak(newState);
        newState.lastActiveDate = new Date().toISOString();

        this.saveProgress(newState);
        return newState;
    },

    // Mark step as completed
    completeStep(state, weekId, dayId, stepNumber) {
        const key = `${weekId}-${dayId}`;
        const newState = { ...state };

        if (!newState.completedSteps[key]) {
            newState.completedSteps[key] = [];
        }

        if (!newState.completedSteps[key].includes(stepNumber)) {
            newState.completedSteps[key] = [...newState.completedSteps[key], stepNumber];
            this.saveProgress(newState);
        }

        return newState;
    },

    // Calculate current streak
    calculateStreak(state) {
        if (state.completedDays.length === 0) return 0;

        // Sort by completion date
        const sorted = [...state.completedDays].sort((a, b) =>
            new Date(b.completedAt) - new Date(a.completedAt)
        );

        let streak = 1;
        let currentDate = new Date(sorted[0].completedAt);
        currentDate.setHours(0, 0, 0, 0);

        for (let i = 1; i < sorted.length; i++) {
            const prevDate = new Date(sorted[i].completedAt);
            prevDate.setHours(0, 0, 0, 0);

            const dayDiff = Math.floor((currentDate - prevDate) / (1000 * 60 * 60 * 24));

            if (dayDiff === 1) {
                streak++;
                currentDate = prevDate;
            } else if (dayDiff > 1) {
                break;
            }
        }

        return streak;
    },

    // Get overall progress percentage
    getProgressPercentage(state) {
        const totalDays = getData.getTotalDays();
        const completed = state.completedDays.length;
        return Math.round((completed / totalDays) * 100);
    },

    // Get week progress
    getWeekProgress(state, weekId) {
        const week = getData.getWeek(weekId);
        if (!week) return 0;

        const totalDays = week.days.length;
        const completed = state.completedDays.filter(d => d.weekId === weekId).length;

        return {
            completed,
            total: totalDays,
            percentage: Math.round((completed / totalDays) * 100)
        };
    },

    // Reset all progress
    resetProgress() {
        const confirmed = confirm('Möchtest du wirklich deinen gesamten Fortschritt zurücksetzen?');
        if (confirmed) {
            localStorage.removeItem('pythonCourseProgress');
            return { ...this.defaultState };
        }
        return null;
    },

    // Export progress as JSON
    exportProgress(state) {
        const dataStr = JSON.stringify(state, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'python-kurs-fortschritt.json';
        link.click();
        URL.revokeObjectURL(url);
    },

    // Import progress from JSON
    importProgress(jsonString) {
        try {
            const imported = JSON.parse(jsonString);
            this.saveProgress(imported);
            return imported;
        } catch (e) {
            console.error('Error importing progress:', e);
            return null;
        }
    }
};

// Initialize global state
let appState = State.loadProgress();
