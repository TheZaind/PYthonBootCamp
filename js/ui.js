// ============================================
// UI RENDERING
// Functions to render different views and components
// ============================================

const UI = {
  // Render weeks overview (home page)
  renderWeeksOverview() {
    const grid = document.getElementById('weeks-grid');
    if (!grid) return;

    grid.innerHTML = '';

    courseData.weeks.forEach(week => {
      const progress = State.getWeekProgress(appState, week.id);
      const card = this.createWeekCard(week, progress);
      grid.appendChild(card);
    });

    // Render motivation banner
    this.renderMotivationBanner();
  },

  // Create week card element
  createWeekCard(week, progress) {
    const card = document.createElement('div');
    card.className = 'card week-card card--clickable hover-lift';
    card.onclick = () => Navigation.showWeekView(week.id);

    const colorMap = {
      orange: '#FF6B35',
      purple: '#A855F7',
      yellow: '#FACC15',
      green: '#10B981'
    };

    // Bento Grid Logic
    if (week.id === 1) {
      card.classList.add('bento-item--large');
    } else if (week.id === 2 || week.id === 5) {
      card.classList.add('bento-item--wide');
    }

    card.innerHTML = `
      <div class="week-card__header">
        <div class="week-card__number" style="color: ${colorMap[week.color] || colorMap.orange}">
          ${week.id}
        </div>
        <div>
          <div class="badge ${progress.percentage === 100 ? 'badge--success' : progress.percentage > 0 ? 'badge--warning' : 'badge--locked'}">
            ${progress.completed}/${progress.total} Tage
          </div>
        </div>
      </div>
      <div style="flex: 1;">
         <h3 class="week-card__title">${week.title}</h3>
         <p class="week-card__subtitle">${week.subtitle}</p>
      </div>
      <div class="week-card__progress">
        <div class="progress-bar">
          <div class="progress-bar__fill" style="width: ${progress.percentage}%"></div>
        </div>
      </div>
      <div class="week-card__stats">
        <span>📚 ${week.days.length} Lektionen</span>
        <span style="color: ${colorMap[week.color] || colorMap.orange}">${progress.percentage}%</span>
      </div>
    `;

    // Add flex column style for bento cards to stretch content
    card.style.display = 'flex';
    card.style.flexDirection = 'column';

    return card;
  },

  // Render days view for a specific week
  renderDaysView(weekId) {
    const week = getData.getWeek(weekId);
    if (!week) return;

    const grid = document.getElementById('days-grid');
    const title = document.getElementById('week-title');
    const description = document.getElementById('week-description');

    if (!grid || !title || !description) return;

    title.textContent = week.title;
    description.textContent = week.description;
    grid.innerHTML = '';

    week.days.forEach(day => {
      const card = this.createDayCard(day, weekId);
      grid.appendChild(card);
    });
  },

  // Create day card element
  createDayCard(day, weekId) {
    const card = document.createElement('div');
    const isCompleted = State.isDayCompleted(appState, weekId, day.id);
    const isLocked = false; // For now, all days are unlocked. Could add logic here.

    card.className = `card day-card card--clickable hover-lift ${isCompleted ? 'day-card--completed' : ''
      } ${isLocked ? 'day-card--locked' : ''}`;

    if (!isLocked) {
      card.onclick = () => Navigation.showLessonView(weekId, day.id);
    }

    const icon = isCompleted ? '✓' : isLocked ? '🔒' : '📖';

    // Calculate step/slide progress for dots
    const items = day.slides || day.steps || [];
    const totalItems = items.length;
    // For now, simplify dot rendering or use slide progress
    // TODO: Update state tracking for slides

    let dotsHTML = '';
    if (totalItems > 0) {
      dotsHTML = '<div class="day-card__step-dots">';
      // Simplified: just show total dots, maybe colored if day is completed
      for (let i = 1; i <= Math.min(totalItems, 12); i++) { // Limit dots to 12
        // Fallback logic for dots
        dotsHTML += `<div class="step-dot ${isCompleted ? 'step-dot--completed' : ''}"></div>`;
      }
      dotsHTML += '</div>';
    }

    card.innerHTML = `
      <div class="day-card__icon">${icon}</div>
      <div class="day-card__number">Tag ${day.id}</div>
      <div class="day-card__title">${day.title}</div>
      <div class="day-card__duration">${day.duration}</div>
      ${dotsHTML}
    `;

    return card;
  },

  // Render lesson view (task + guide)
  renderLessonView(weekId, dayId) {
    const day = getData.getDay(weekId, dayId);
    if (!day) return;

    // Update lesson info
    document.getElementById('lesson-duration').textContent = day.duration;
    document.getElementById('lesson-title').textContent = `Tag ${day.id}: ${day.title}`;

    // Render task
    this.renderTask(day.task);

    // Initialize Slide Renderer
    if (typeof SlideRenderer !== 'undefined') {
      SlideRenderer.loadDay(weekId, dayId);
    } else {
      console.error('SlideRenderer not loaded!');
      // Fallback or Error
    }

    // Update complete button (managed by SlideRenderer now mostly, but keep for fallback)
    const completeBtn = document.getElementById('complete-lesson-btn');
    const isCompleted = State.isDayCompleted(appState, weekId, dayId);

    if (isCompleted) {
      completeBtn.textContent = '✓ Abgeschlossen';
      completeBtn.disabled = true;
      completeBtn.className = 'btn btn--secondary btn--large';
    } else {
      completeBtn.textContent = '✓ Tag abschließen';
      completeBtn.disabled = false;
      completeBtn.className = 'btn btn--success btn--large';
      completeBtn.onclick = () => this.completeDay(weekId, dayId);
    }
  },

  // Render task content
  renderTask(task) {
    const content = document.getElementById('lesson-task-content');
    const goals = document.getElementById('lesson-goals');

    if (content) {
      content.innerHTML = `<p>${task.description}</p>`;
    }

    if (goals && task.goals) {
      goals.innerHTML = '<ul>' +
        task.goals.map(goal => `<li>${goal}</li>`).join('') +
        '</ul>';
    }
  },

  // Render steps accordion
  renderSteps(steps, weekId, dayId) {
    const accordion = document.getElementById('steps-accordion');
    if (!accordion) return;

    accordion.innerHTML = '';

    steps.forEach(step => {
      const isCompleted = State.isStepCompleted(appState, weekId, dayId, step.number);
      const item = document.createElement('div');
      item.className = 'accordion-item';

      const stepId = `step-${weekId}-${dayId}-${step.number}`;

      item.innerHTML = `
        <button class="accordion-header" id="header-${stepId}">
          <span>
            <span style="color: var(--color-primary-orange); font-weight: bold;">Schritt ${step.number}:</span>
            ${step.title}
            ${isCompleted ? ' <span style="color: var(--color-accent-green);">✓</span>' : ''}
          </span>
          <span class="accordion-header__icon">▼</span>
        </button>
        <div class="accordion-content" id="content-${stepId}">
          <div class="accordion-content__inner">
            <p><strong>🎯 Ziel:</strong> ${step.goal}</p>
            <p><strong>💡 Warum:</strong> ${step.why}</p>
            
            <div class="step-instruction" style="margin: var(--space-4) 0;">
              ${this.formatContent(step.instruction)}
            </div>

            ${step.code ? `
              <div class="code-block">
                <div class="code-block__header">
                  <span class="code-block__language">Python</span>
                  <button class="code-block__copy" onclick="UI.copyCode(this)">Kopieren</button>
                </div>
                <pre><code class="language-python">${this.escapeHtml(step.code)}</code></pre>
              </div>
            ` : ''}
            <div style="margin-top: var(--space-4); padding: var(--space-3); background-color: var(--color-bg-secondary); border-radius: var(--radius-md); border-left: 3px solid var(--color-accent-green);">
              <strong>✅ Checkpoint:</strong> ${step.checkpoint}
            </div>
            ${!isCompleted ? `
              <button class="btn btn--primary" style="margin-top: var(--space-4);" onclick="UI.completeStep(${weekId}, ${dayId}, ${step.number})">
                Schritt abschließen
              </button>
            ` : ''}
          </div>
        </div>
      `;

      accordion.appendChild(item);

      // Add click listener for accordion
      const header = item.querySelector('.accordion-header');
      header.addEventListener('click', () => this.toggleAccordion(header));
    });

    // Initialize syntax highlighting for all code blocks
    if (typeof hljs !== 'undefined') {
      accordion.querySelectorAll('pre code').forEach((block) => {
        hljs.highlightElement(block);
      });
    }

    // Initialize Mermaid diagrams
    if (typeof mermaid !== 'undefined') {
      mermaid.init(undefined, accordion.querySelectorAll('.mermaid'));
    }
  },

  // Helper to format content (Simple Markdown Parser)
  formatContent(text) {
    if (!text) return '';

    // 1. Handle Mermaid blocks
    text = text.replace(/```mermaid([\s\S]*?)```/g, '<div class="mermaid">$1</div>');

    // 2. Handle bold text (**text**)
    text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

    // 3. Handle italics (*text*)
    text = text.replace(/\*(.*?)\*/g, '<em>$1</em>');

    // 4. Handle code snippets (`text`)
    text = text.replace(/`([^`]+)`/g, '<code style="background: rgba(255,255,255,0.1); padding: 2px 4px; border-radius: 4px;">$1</code>');

    // 5. Convert newlines to breaks
    text = text.replace(/\n/g, '<br>');

    return text;
  },

  // Toggle accordion open/close
  toggleAccordion(header) {
    const isActive = header.classList.contains('active');
    const content = header.nextElementSibling;

    if (isActive) {
      header.classList.remove('active');
      content.classList.remove('active');
    } else {
      header.classList.add('active');
      content.classList.add('active');
    }
  },

  // Complete a step
  completeStep(weekId, dayId, stepNumber) {
    appState = State.completeStep(appState, weekId, dayId, stepNumber);
    Animations.showToast(`Schritt ${stepNumber} abgeschlossen! 🎉`);
    this.renderLessonView(weekId, dayId);
  },

  // Get completed steps count for a day
  getCompletedStepsCount(weekId, dayId, totalSteps) {
    let count = 0;
    for (let i = 1; i <= totalSteps; i++) {
      if (State.isStepCompleted(appState, weekId, dayId, i)) {
        count++;
      }
    }
    return count;
  },

  // Complete a day
  completeDay(weekId, dayId) {
    const oldXP = appState.totalXP;
    appState = State.completeDay(appState, weekId, dayId);
    const xpGained = appState.totalXP - oldXP;

    // Show confetti
    Animations.createConfetti();

    // Show toast
    Animations.showToast(`✨ Tag abgeschlossen! +${xpGained} XP`, 'success', 4000);

    // Check for achievements
    const newAchievements = Gamification.checkAchievements(appState);
    newAchievements.forEach(achievement => {
      appState = Gamification.unlockAchievement(appState, achievement.id);
      setTimeout(() => {
        Animations.showToast(`${achievement.title}: ${achievement.description}`, 'info', 5000);
      }, 1500);
    });

    // Update UI
    this.updateHeader();
    this.renderLessonView(weekId, dayId);
  },

  // Update header stats
  updateHeader() {
    const streakEl = document.getElementById('streak-count');
    const xpEl = document.getElementById('xp-count');

    if (streakEl) {
      const oldStreak = parseInt(streakEl.textContent) || 0;
      if (appState.streak > oldStreak) {
        Animations.countUp(streakEl, oldStreak, appState.streak, 500);
      } else {
        streakEl.textContent = appState.streak;
      }
    }

    if (xpEl) {
      const oldXP = parseInt(xpEl.textContent) || 0;
      if (appState.totalXP > oldXP) {
        Animations.countUp(xpEl, oldXP, appState.totalXP, 1000);
      } else {
        xpEl.textContent = appState.totalXP;
      }
    }

    // Update level display
    const level = Gamification.getLevel(appState.totalXP);
    const levelBadge = document.getElementById('level-badge');
    const levelLabel = document.getElementById('level-label');
    if (levelBadge) levelBadge.textContent = level;
    if (levelLabel) levelLabel.textContent = `Level ${level}`;

    // Update XP progress to next level
    const levelProgress = Gamification.getLevelProgress(appState.totalXP);
    const nextLevelXP = Gamification.getXPForNextLevel(appState.totalXP);
    const currentLevelXP = level === 1 ? 0 : Gamification.getXPForNextLevel(appState.totalXP - 1);
    const xpInLevel = appState.totalXP - currentLevelXP;
    const xpNeeded = nextLevelXP - currentLevelXP;

    const xpFill = document.getElementById('xp-to-next-fill');
    const xpText = document.getElementById('xp-to-next-text');
    if (xpFill) xpFill.style.width = `${levelProgress}%`;
    if (xpText) xpText.textContent = `${xpInLevel}/${xpNeeded} XP`;

    // Update achievements count
    const achievementsCount = document.getElementById('achievements-count');
    if (achievementsCount) achievementsCount.textContent = appState.achievements.length;

    const percentage = State.getProgressPercentage(appState);
    Animations.updateProgressRing(percentage);
  },

  // Copy code to clipboard
  copyCode(button) {
    const codeBlock = button.closest('.code-block');
    const code = codeBlock.querySelector('code').textContent;

    navigator.clipboard.writeText(code).then(() => {
      button.textContent = 'Kopiert!';
      setTimeout(() => {
        button.textContent = 'Kopieren';
      }, 2000);
    });
  },

  // Escape HTML for safe rendering
  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  },

  // Render motivation banner
  renderMotivationBanner() {
    const quotes = [
      { quote: "Der beste Weg, die Zukunft vorherzusagen, ist, sie zu programmieren.", source: "— Alan Kay" },
      { quote: "Code ist wie Humor. Wenn du ihn erklären musst, ist er schlecht.", source: "— Cory House" },
      { quote: "Jeder Experte war einmal ein Anfänger.", source: "— Helen Hayes" },
      { quote: "Programmieren ist die Kunst, einem Computer zu sagen, was er tun soll.", source: "— Donald Knuth" },
      { quote: "Fehler sind die Portale der Entdeckung.", source: "— James Joyce" },
      { quote: "Python ist eine Sprache, die man in einem Wochenende lernen kann.", source: "— Guido van Rossum" },
      { quote: "Der einzige Weg, großartige Arbeit zu leisten, ist zu lieben, was man tut.", source: "— Steve Jobs" }
    ];

    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    const quoteEl = document.getElementById('motivation-quote');
    const sourceEl = document.getElementById('motivation-source');

    if (quoteEl) quoteEl.textContent = `"${randomQuote.quote}"`;
    if (sourceEl) sourceEl.textContent = randomQuote.source;
  },

  // Update step progress bar
  updateStepProgress(weekId, dayId, steps) {
    const totalSteps = steps.length;
    const completedSteps = this.getCompletedStepsCount(weekId, dayId, totalSteps);
    const percentage = totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0;

    const progressText = document.getElementById('step-progress-text');
    const progressPercent = document.getElementById('step-progress-percent');
    const progressFill = document.getElementById('step-progress-fill');

    if (progressText) progressText.textContent = `${completedSteps} von ${totalSteps} Schritten`;
    if (progressPercent) progressPercent.textContent = `${percentage}%`;
    if (progressFill) progressFill.style.width = `${percentage}%`;
  },

  // Update lesson navigation buttons
  updateLessonNavigation(weekId, dayId) {
    const prevBtn = document.getElementById('prev-lesson-btn');
    const nextBtn = document.getElementById('next-lesson-btn');

    // Find current week and day
    const week = getData.getWeek(weekId);
    if (!week) return;

    const currentDayIndex = week.days.findIndex(d => d.id === dayId);

    // Previous day logic
    if (currentDayIndex > 0) {
      const prevDay = week.days[currentDayIndex - 1];
      prevBtn.style.display = 'inline-flex';
      prevBtn.onclick = () => Navigation.showLessonView(weekId, prevDay.id);
    } else if (weekId > 1) {
      // Go to last day of previous week
      const prevWeek = getData.getWeek(weekId - 1);
      if (prevWeek && prevWeek.days.length > 0) {
        const lastDay = prevWeek.days[prevWeek.days.length - 1];
        prevBtn.style.display = 'inline-flex';
        prevBtn.onclick = () => Navigation.showLessonView(weekId - 1, lastDay.id);
      } else {
        prevBtn.style.display = 'none';
      }
    } else {
      prevBtn.style.display = 'none';
    }

    // Next day logic
    if (currentDayIndex < week.days.length - 1) {
      const nextDay = week.days[currentDayIndex + 1];
      nextBtn.style.display = 'inline-flex';
      nextBtn.onclick = () => Navigation.showLessonView(weekId, nextDay.id);
    } else if (weekId < courseData.weeks.length) {
      // Go to first day of next week
      const nextWeek = getData.getWeek(weekId + 1);
      if (nextWeek && nextWeek.days.length > 0) {
        const firstDay = nextWeek.days[0];
        nextBtn.style.display = 'inline-flex';
        nextBtn.onclick = () => Navigation.showLessonView(weekId + 1, firstDay.id);
      } else {
        nextBtn.style.display = 'none';
      }
    } else {
      nextBtn.style.display = 'none';
    }
  },

  // Render achievement modal
  renderAchievementModal() {
    const achievementList = document.getElementById('achievement-list');
    if (!achievementList) return;

    const gridHTML = '<div class="achievement-grid">' +
      Gamification.achievements.map(achievement => {
        const isUnlocked = appState.achievements.includes(achievement.id);
        return `
          <div class="achievement-card ${isUnlocked ? 'achievement-card--unlocked' : 'achievement-card--locked'}">
            <div class="achievement-card__icon">${achievement.title.split(' ')[0]}</div>
            <div class="achievement-card__title">${achievement.title}</div>
            <div class="achievement-card__description">${achievement.description}</div>
          </div>
        `;
      }).join('') +
      '</div>';

    achievementList.innerHTML = gridHTML;
  },

  // Toggle achievement modal
  toggleAchievementModal() {
    const modal = document.getElementById('achievement-modal');
    if (!modal) return;

    if (modal.style.display === 'none' || !modal.style.display) {
      this.renderAchievementModal();
      modal.style.display = 'flex';
    } else {
      modal.style.display = 'none';
    }
  }
};
