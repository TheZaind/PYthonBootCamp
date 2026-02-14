// ============================================
// NAVIGATION
// View switching and URL management
// ============================================

const Navigation = {
    // Current view state
    currentView: {
        type: 'home', // 'home', 'week', 'lesson'
        weekId: null,
        dayId: null
    },

    // Initialize navigation
    init() {
        // Handle back button
        const backBtn = document.getElementById('back-button');
        if (backBtn) {
            backBtn.addEventListener('click', () => this.goBack());
        }

        // Handle browser back/forward
        window.addEventListener('popstate', (e) => {
            if (e.state) {
                this.navigateTo(e.state.type, e.state.weekId, e.state.dayId, false);
            }
        });

        // Check URL on load
        this.checkURL();
    },

    // Check URL hash for deep linking
    checkURL() {
        const hash = window.location.hash.substring(1);
        if (!hash) {
            this.showHomeView();
            return;
        }

        const parts = hash.split('/');
        if (parts[0] === 'week' && parts[1]) {
            const weekId = parseInt(parts[1]);
            if (parts[2] === 'day' && parts[3]) {
                const dayId = parseInt(parts[3]);
                this.showLessonView(weekId, dayId);
            } else {
                this.showWeekView(weekId);
            }
        }
    },

    // Navigate to a view
    navigateTo(type, weekId = null, dayId = null, pushState = true) {
        this.currentView = { type, weekId, dayId };

        // Update URL
        let hash = '';
        if (type === 'week') {
            hash = `week/${weekId}`;
        } else if (type === 'lesson') {
            hash = `week/${weekId}/day/${dayId}`;
        }

        if (pushState) {
            window.history.pushState(this.currentView, '', hash ? '#' + hash : '#');
        }

        // Show views
        this.showView(type);
        this.updateBreadcrumb();
        this.updateBackButton();
    },

    // Show home view
    showHomeView() {
        this.navigateTo('home');
        UI.renderWeeksOverview();
    },

    // Show week view
    showWeekView(weekId) {
        this.navigateTo('week', weekId);
        UI.renderDaysView(weekId);

        // Scroll to top smoothly
        window.scrollTo({ top: 0, behavior: 'smooth' });
    },

    // Show lesson view
    showLessonView(weekId, dayId) {
        this.navigateTo('lesson', weekId, dayId);
        UI.renderLessonView(weekId, dayId);

        // Scroll to top smoothly
        window.scrollTo({ top: 0, behavior: 'smooth' });
    },

    // Go back to previous view
    goBack() {
        if (this.currentView.type === 'lesson') {
            this.showWeekView(this.currentView.weekId);
        } else if (this.currentView.type === 'week') {
            this.showHomeView();
        }
    },

    // Show/hide views
    showView(type) {
        const views = {
            home: document.getElementById('home-view'),
            week: document.getElementById('week-view'),
            lesson: document.getElementById('lesson-view')
        };

        Object.keys(views).forEach(key => {
            if (views[key]) {
                views[key].style.display = key === type ? 'block' : 'none';
            }
        });
    },

    // Update breadcrumb
    updateBreadcrumb() {
        const breadcrumb = document.getElementById('breadcrumb');
        if (!breadcrumb) return;

        const { type, weekId, dayId } = this.currentView;

        if (type === 'home') {
            breadcrumb.style.display = 'none';
            return;
        }

        breadcrumb.style.display = 'flex';
        breadcrumb.innerHTML = '';

        // Home link
        const homeItem = this.createBreadcrumbItem('🏠 Start', () => this.showHomeView());
        breadcrumb.appendChild(homeItem);
        breadcrumb.appendChild(this.createBreadcrumbSeparator());

        // Week link
        if (weekId) {
            const week = getData.getWeek(weekId);
            const weekItem = type === 'lesson'
                ? this.createBreadcrumbItem(week.title, () => this.showWeekView(weekId))
                : this.createBreadcrumbCurrent(week.title);
            breadcrumb.appendChild(weekItem);
        }

        // Day (current)
        if (type === 'lesson' && dayId) {
            breadcrumb.appendChild(this.createBreadcrumbSeparator());
            const day = getData.getDay(weekId, dayId);
            const dayItem = this.createBreadcrumbCurrent(`Tag ${dayId}`);
            breadcrumb.appendChild(dayItem);
        }
    },

    // Create breadcrumb item (link)
    createBreadcrumbItem(text, onClick) {
        const item = document.createElement('div');
        item.className = 'breadcrumb__item';

        const link = document.createElement('a');
        link.className = 'breadcrumb__link';
        link.textContent = text;
        link.href = '#';
        link.onclick = (e) => {
            e.preventDefault();
            onClick();
        };

        item.appendChild(link);
        return item;
    },

    // Create breadcrumb current item
    createBreadcrumbCurrent(text) {
        const item = document.createElement('div');
        item.className = 'breadcrumb__item';

        const current = document.createElement('span');
        current.className = 'breadcrumb__current';
        current.textContent = text;

        item.appendChild(current);
        return item;
    },

    // Create breadcrumb separator
    createBreadcrumbSeparator() {
        const separator = document.createElement('span');
        separator.className = 'breadcrumb__separator';
        separator.textContent = '›';
        return separator;
    },

    // Update back button
    updateBackButton() {
        const backBtn = document.getElementById('back-button');
        if (!backBtn) return;

        if (this.currentView.type === 'home') {
            backBtn.style.display = 'none';
        } else {
            backBtn.style.display = 'inline-flex';
        }
    }
};
