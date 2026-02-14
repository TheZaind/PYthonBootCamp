// ============================================
// GAMIFICATION
// Achievements, XP calculations, rewards
// ============================================

const Gamification = {
    // Achievement definitions
    achievements: [
        {
            id: 'first-day',
            title: '🚀 Der Anfang',
            description: 'Ersten Tag abgeschlossen',
            condition: (state) => state.completedDays.length >= 1
        },
        {
            id: 'three-days',
            title: '💪 Durchhaltevermögen',
            description: '3 Tage abgeschlossen',
            condition: (state) => state.completedDays.length >= 3
        },
        {
            id: 'first-week',
            title: '⭐ Woche 1 Meister',
            description: 'Woche 1 komplett',
            condition: (state) => {
                const week1Days = state.completedDays.filter(d => d.weekId === 1);
                return week1Days.length >= 7;
            }
        },
        {
            id: 'streak-3',
            title: '🔥 3-Tage-Streak',
            description: '3 Tage hintereinander',
            condition: (state) => state.streak >= 3
        },
        {
            id: 'streak-7',
            title: '🔥🔥 Woche Streak',
            description: '7 Tage hintereinander',
            condition: (state) => state.streak >= 7
        },
        {
            id: 'halfway',
            title: '🎯 Halbzeit',
            description: '15 Tage abgeschlossen',
            condition: (state) => state.completedDays.length >= 15
        },
        {
            id: 'complete',
            title: '💯 Vollendung',
            description: 'Alle 30 Tage abgeschlossen',
            condition: (state) => state.completedDays.length >= 30
        }
    ],

    // Check for new achievements
    checkAchievements(state) {
        const newAchievements = [];

        this.achievements.forEach(achievement => {
            const alreadyUnlocked = state.achievements.includes(achievement.id);
            const conditionMet = achievement.condition(state);

            if (conditionMet && !alreadyUnlocked) {
                newAchievements.push(achievement);
            }
        });

        return newAchievements;
    },

    // Unlock achievement
    unlockAchievement(state, achievementId) {
        if (state.achievements.includes(achievementId)) {
            return state; // Already unlocked
        }

        const newState = { ...state };
        newState.achievements = [...state.achievements, achievementId];

        State.saveProgress(newState);
        return newState;
    },

    // Calculate XP for completing a day
    calculateDayXP(dayNumber, streak) {
        let xp = 50; // Base XP

        // Streak bonus
        if (streak >= 3) xp += 10;
        if (streak >= 7) xp += 20;
        if (streak >= 14) xp += 30;

        // Milestone bonus
        if (dayNumber === 7 || dayNumber === 14 || dayNumber === 21 || dayNumber === 30) {
            xp += 50;
        }

        return xp;
    },

    // Get level based on XP
    getLevel(xp) {
        // Level 1: 0-99 XP
        // Level 2: 100-299 XP
        // Level 3: 300-599 XP
        // etc.
        if (xp < 100) return 1;
        if (xp < 300) return 2;
        if (xp < 600) return 3;
        if (xp < 1000) return 4;
        if (xp < 1500) return 5;
        return Math.floor(xp / 300) + 1;
    },

    // Get XP needed for next level
    getXPForNextLevel(currentXP) {
        const thresholds = [100, 300, 600, 1000, 1500];

        for (let threshold of thresholds) {
            if (currentXP < threshold) {
                return threshold;
            }
        }

        const level = this.getLevel(currentXP);
        return level * 300;
    },

    // Get progress to next level as percentage
    getLevelProgress(xp) {
        const level = this.getLevel(xp);
        const nextLevelXP = this.getXPForNextLevel(xp);
        const prevLevelXP = level === 1 ? 0 : this.getXPForNextLevel(xp - 1);
        const xpInLevel = xp - prevLevelXP;
        const xpNeededForLevel = nextLevelXP - prevLevelXP;

        return Math.round((xpInLevel / xpNeededForLevel) * 100);
    }
};
