// ============================================
// APP INITIALIZATION
// Main entry point
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    console.log('🐍 30-Tage Python Kurs - Initializing...');

    // Initialize navigation
    Navigation.init();

    // Update header with current stats
    UI.updateHeader();

    // Welcome message for new users
    if (appState.completedDays.length === 0) {
        setTimeout(() => {
            Animations.showToast('Willkommen! 🎉 Viel Erfolg beim Lernen!', 'info', 5000);
        }, 500);
    } else {
        // Welcome back message
        setTimeout(() => {
            const daysCompleted = appState.completedDays.length;
            const remaining = getData.getTotalDays() - daysCompleted;
            Animations.showToast(
                `Willkommen zurück! 🚀 Noch ${remaining} Tage bis zum Ziel!`,
                'info',
                4000
            );
        }, 500);
    }

    console.log('✅ App initialized successfully');
    console.log(`📊 Progress: ${State.getProgressPercentage(appState)}%`);
    console.log(`🔥 Streak: ${appState.streak} days`);
    console.log(`⭐ XP: ${appState.totalXP}`);

    // Achievement modal listeners
    const achievementsBtn = document.getElementById('achievements-btn');
    const achievementModalClose = document.getElementById('achievement-modal-close');
    const achievementModal = document.getElementById('achievement-modal');

    if (achievementsBtn) {
        achievementsBtn.addEventListener('click', () => UI.toggleAchievementModal());
    }

    if (achievementModalClose) {
        achievementModalClose.addEventListener('click', () => UI.toggleAchievementModal());
    }

    if (achievementModal) {
        achievementModal.addEventListener('click', (e) => {
            // Close modal when clicking backdrop
            if (e.target === achievementModal) {
                UI.toggleAchievementModal();
            }
        });
    }
});

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // ESC: Go back or close modal
    if (e.key === 'Escape') {
        const modal = document.getElementById('achievement-modal');
        if (modal && modal.style.display === 'flex') {
            UI.toggleAchievementModal();
        } else if (Navigation.currentView.type !== 'home') {
            Navigation.goBack();
        }
    }

    // Ctrl/Cmd + K: Quick search (future feature)
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        // TODO: Implement quick search/jump to day
    }
});

// Debug helpers (remove in production)
window.debugApp = {
    resetProgress: () => {
        const newState = State.resetProgress();
        if (newState) {
            appState = newState;
            UI.updateHeader();
            Navigation.showHomeView();
            Animations.showToast('Fortschritt wurde zurückgesetzt', 'info');
        }
    },
    exportProgress: () => {
        State.exportProgress(appState);
    },
    addXP: (amount) => {
        appState.totalXP += amount;
        State.saveProgress(appState);
        UI.updateHeader();
        Animations.showToast(`+${amount} XP hinzugefügt!`, 'success');
    },
    completeWeek: (weekId) => {
        const week = getData.getWeek(weekId);
        week.days.forEach(day => {
            appState = State.completeDay(appState, weekId, day.id);
        });
        UI.updateHeader();
        UI.renderWeeksOverview();
        Animations.showToast(`Woche ${weekId} abgeschlossen!`, 'success');
    },
    showState: () => {
        console.log('Current state:', appState);
        return appState;
    }
};

console.log('💡 Debug helpers available: window.debugApp');
console.log('   - resetProgress(): Reset all progress');
console.log('   - exportProgress(): Download progress as JSON');
console.log('   - addXP(amount): Add XP');
console.log('   - completeWeek(weekId): Complete a week');
console.log('   - showState(): Show current state');
