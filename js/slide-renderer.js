// ============================================
// SLIDE RENDERING SYSTEM (Duolingo-Style)
// Handles content slides and quiz slides
// ============================================

const SlideRenderer = {
    currentSlideIndex: 0,
    slides: [],
    weekId: null,
    dayId: null,

    // Initialize slides for a day
    loadDay(weekId, dayId) {
        console.log(`SlideRenderer: Loading Week ${weekId} Day ${dayId}`);
        const day = getData.getDay(weekId, dayId);
        if (!day) {
            console.error('Day not found!');
            return;
        }

        this.weekId = weekId;
        this.dayId = dayId;
        this.slides = day.slides || day.steps || [];
        console.log(`Loaded ${this.slides.length} slides/steps`, this.slides);

        this.currentSlideIndex = this.getLastViewedSlide();
        this.render();
    },

    // Get last viewed slide from progress
    getLastViewedSlide() {
        // TODO: Load from state
        return 0;
    },

    // Render current slide
    render() {
        console.log('Rendering slide index:', this.currentSlideIndex);
        const slide = this.slides[this.currentSlideIndex];
        if (!slide) {
            console.error('No slide at index', this.currentSlideIndex);
            return;
        }

        const container = document.getElementById('slide-container');
        if (!container) {
            console.error('Container #slide-container not found!');
            return;
        }

        container.innerHTML = '';

        if (slide.type === 'content') {
            container.appendChild(this.renderContentSlide(slide));
        } else if (slide.type === 'quiz') {
            container.appendChild(this.renderQuizSlide(slide));
        } else {
            // Fallback for old steps (convert to simple content slide)
            console.warn('Unknown slide type (legacy step?):', slide);
            container.appendChild(this.renderContentSlide({
                title: slide.title,
                content: slide.instruction || slide.content || '',
                code: slide.code ? { snippet: slide.code } : null,
                highlight: slide.checkpoint
            }));
        }

        this.updateProgressBar();
        this.updateNavigationButtons();
    },

    // Render content slide
    renderContentSlide(slide) {
        const card = document.createElement('div');
        card.className = 'slide-card slide-card--content';

        let html = `
      <div class="slide-card__title">${slide.title}</div>
      <div class="slide-card__content">${this.formatContent(slide.content)}</div>
    `;

        // Add visual (Mermaid or Image)
        if (slide.visual) {
            if (slide.visual.type === 'mermaid') {
                const mermaidData = this.cleanText(slide.visual.data);
                html += `<div class="mermaid-container"><div class="mermaid">${mermaidData}</div></div>`;
            } else if (slide.visual.type === 'image') {
                html += `<img src="${slide.visual.url}" alt="${slide.visual.alt || ''}" class="slide-image">`;
            }
        }

        // Add code block
        if (slide.code) {
            const codeSnippet = this.cleanText(slide.code.snippet);
            html += `
        <div class="code-block">
          <div class="code-block__header">
            <span class="code-block__language">${slide.code.language || 'Python'}</span>
            <button class="code-block__copy" onclick="SlideRenderer.copyCode(this)">Kopieren</button>
          </div>
          <pre><code class="language-python">${this.escapeHtml(codeSnippet)}</code></pre>
        </div>
      `;
        }

        // Add highlight box
        if (slide.highlight) {
            html += `
        <div class="slide-highlight">
          ${this.formatContent(slide.highlight)}
        </div>
      `;
        }

        card.innerHTML = html;

        // Initialize syntax highlighting and Mermaid
        setTimeout(() => {
            if (typeof hljs !== 'undefined') {
                card.querySelectorAll('pre code').forEach((block) => hljs.highlightElement(block));
            }
            if (typeof mermaid !== 'undefined') {
                mermaid.init(undefined, card.querySelectorAll('.mermaid'));
            }
        }, 100);

        return card;
    },

    // Render quiz slide
    renderQuizSlide(slide) {
        const card = document.createElement('div');
        card.className = 'slide-card slide-card--quiz';

        switch (slide.quizType) {
            case 'multipleChoice':
                card.appendChild(this.renderMultipleChoice(slide));
                break;
            case 'trueFalse':
                card.appendChild(this.renderTrueFalse(slide));
                break;
            case 'matching':
                card.appendChild(this.renderMatching(slide));
                break;
            case 'ordering':
                card.appendChild(this.renderOrdering(slide));
                break;
        }

        return card;
    },

    // Render Multiple Choice Quiz
    renderMultipleChoice(slide) {
        const container = document.createElement('div');
        container.className = 'quiz-mc';

        let html = `
      <div class="quiz-question">${this.formatContent(slide.question)}</div>
      <div class="quiz-options">
    `;

        slide.options.forEach((option, index) => {
            html += `
        <button class="quiz-option" data-index="${index}" onclick="SlideRenderer.checkMultipleChoice(${index}, ${slide.correctIndex}, this)">
          ${this.formatContent(option)}
        </button>
      `;
        });

        html += `
      </div>
      <div class="quiz-feedback" style="display: none;"></div>
    `;

        container.innerHTML = html;
        return container;
    },

    // Render True/False Quiz
    renderTrueFalse(slide) {
        const container = document.createElement('div');
        container.className = 'quiz-tf';

        let html = `
      <div class="quiz-question">${this.formatContent(slide.statement)}</div>
      <div class="quiz-options quiz-options--tf">
        <button class="quiz-option quiz-option--large quiz-option--true" onclick="SlideRenderer.checkTrueFalse(true, ${slide.correct}, this)">
          <span class="quiz-option__icon">✓</span>
          <span class="quiz-option__label">Wahr</span>
        </button>
        <button class="quiz-option quiz-option--large quiz-option--false" onclick="SlideRenderer.checkTrueFalse(false, ${slide.correct}, this)">
          <span class="quiz-option__icon">✗</span>
          <span class="quiz-option__label">Falsch</span>
        </button>
      </div>
      <div class="quiz-feedback" style="display: none;"></div>
    `;

        container.innerHTML = html;
        return container;
    },

    // Render Matching Quiz
    renderMatching(slide) {
        const container = document.createElement('div');
        container.className = 'quiz-matching';

        let html = `
      <div class="quiz-question">${this.formatContent(slide.question)}</div>
      <div class="matching-container">
    `;

        // Shuffle right side
        const rightItems = slide.pairs.map(p => this.cleanText(p.right)).sort(() => Math.random() - 0.5);

        slide.pairs.forEach((pair, index) => {
            const leftText = this.formatContent(pair.left);
            const rightValue = this.cleanText(pair.right);

            html += `
        <div class="matching-pair" data-index="${index}">
          <div class="matching-left">${leftText}</div>
          <select class="matching-select" data-correct="${rightValue}">
            <option value="">-- Wähle --</option>
            ${rightItems.map(item => `<option value="${item}">${item}</option>`).join('')}
          </select>
        </div>
      `;
        });

        html += `
      </div>
      <button class="btn btn--primary" onclick="SlideRenderer.checkMatching()">Überprüfen</button>
      <div class="quiz-feedback" style="display: none;"></div>
    `;

        container.innerHTML = html;
        return container;
    },

    // Render Ordering Quiz
    renderOrdering(slide) {
        const container = document.createElement('div');
        container.className = 'quiz-ordering';

        // Shuffle items (clean them first)
        const shuffled = [...slide.items].map(item => this.cleanText(item)).sort(() => Math.random() - 0.5);
        // Original items cleaned needed for index check? 
        // Wait, checkOrdering compares index.
        // We should store original cleaned items to compare properly later or use index map.
        // Actually, let's keep it simple: just render cleaned items, but keep tracking via original index?
        // The checking logic uses `data-original` index.
        // So we need to map original items to cleaned string to show, but index refers to position in slide.items array.

        let html = `
      <div class="quiz-question">${this.formatContent(slide.question)}</div>
      <div class="ordering-list" id="ordering-list">
    `;

        // We shuffle indices instead of items to keep reference
        const indices = slide.items.map((_, i) => i);
        indices.sort(() => Math.random() - 0.5);

        indices.forEach((originalIndex) => {
            const item = slide.items[originalIndex];
            html += `
        <div class="ordering-item" draggable="true" data-original="${originalIndex}">
          <span class="ordering-handle">⋮⋮</span>
          <span class="ordering-text">${this.formatContent(item)}</span>
          <div class="ordering-buttons">
            <button class="ordering-btn" onclick="SlideRenderer.moveItem(${indices.indexOf(originalIndex)}, -1)">↑</button>
            <button class="ordering-btn" onclick="SlideRenderer.moveItem(${indices.indexOf(originalIndex)}, 1)">↓</button>
          </div>
        </div>
      `;
        });

        html += `
      </div>
      <button class="btn btn--primary" onclick="SlideRenderer.checkOrdering()">Überprüfen</button>
      <div class="quiz-feedback" style="display: none;"></div>
    `;

        container.innerHTML = html;
        return container;
    },

    // Check Multiple Choice Answer
    checkMultipleChoice(selectedIndex, correctIndex, button) {
        const container = button.closest('.quiz-mc');
        const feedback = container.querySelector('.quiz-feedback');
        const allOptions = container.querySelectorAll('.quiz-option');

        // Disable all buttons
        allOptions.forEach(btn => btn.disabled = true);

        const isCorrect = selectedIndex === correctIndex;

        if (isCorrect) {
            button.classList.add('quiz-option--correct');
            feedback.className = 'quiz-feedback quiz-feedback--correct';
            const slide = this.slides[this.currentSlideIndex];
            feedback.textContent = slide.explanation || 'Richtig! 🎉';
            Animations.showToast('Richtig! +10 XP', 'success');
            appState.totalXP += 10;
            State.saveProgress(appState);
            UI.updateHeader();
        } else {
            button.classList.add('quiz-option--wrong');
            allOptions[correctIndex].classList.add('quiz-option--correct');
            feedback.className = 'quiz-feedback quiz-feedback--wrong';
            const slide = this.slides[this.currentSlideIndex];
            feedback.textContent = slide.explanation || 'Nicht ganz richtig. Versuch es nochmal!';
            Animations.showToast('Leider falsch', 'error');
        }

        feedback.style.display = 'block';
    },

    // Check True/False Answer
    checkTrueFalse(selected, correct, button) {
        const container = button.closest('.quiz-tf');
        const feedback = container.querySelector('.quiz-feedback');
        const allOptions = container.querySelectorAll('.quiz-option');

        allOptions.forEach(btn => btn.disabled = true);

        const isCorrect = selected === correct;

        if (isCorrect) {
            button.classList.add('quiz-option--correct');
            feedback.className = 'quiz-feedback quiz-feedback--correct';
            const slide = this.slides[this.currentSlideIndex];
            feedback.textContent = slide.explanation || 'Richtig! 🎉';
            Animations.showToast('Richtig! +10 XP', 'success');
            appState.totalXP += 10;
            State.saveProgress(appState);
            UI.updateHeader();
        } else {
            button.classList.add('quiz-option--wrong');
            feedback.className = 'quiz-feedback quiz-feedback--wrong';
            const slide = this.slides[this.currentSlideIndex];
            feedback.textContent = slide.explanation || 'Nicht ganz richtig!';
            Animations.showToast('Leider falsch', 'error');
        }

        feedback.style.display = 'block';
    },

    // Check Matching
    checkMatching() {
        const container = document.querySelector('.quiz-matching');
        const selects = container.querySelectorAll('.matching-select');
        const feedback = container.querySelector('.quiz-feedback');

        let allCorrect = true;

        selects.forEach(select => {
            const correct = select.dataset.correct;
            const selected = select.value;

            if (selected === correct) {
                select.parentElement.classList.add('matching-pair--correct');
                select.parentElement.classList.remove('matching-pair--wrong');
            } else {
                select.parentElement.classList.add('matching-pair--wrong');
                select.parentElement.classList.remove('matching-pair--correct');
                allCorrect = false;
            }
        });

        if (allCorrect) {
            feedback.className = 'quiz-feedback quiz-feedback--correct';
            feedback.textContent = 'Perfekt! Alle Paare richtig zugeordnet! 🎉';
            Animations.showToast('Perfekt! +15 XP', 'success');
            appState.totalXP += 15;
            State.saveProgress(appState);
            UI.updateHeader();
        } else {
            feedback.className = 'quiz-feedback quiz-feedback--wrong';
            feedback.textContent = 'Nicht alle Paare sind richtig. Versuch es nochmal!';
        }

        feedback.style.display = 'block';
    },

    // Check Ordering
    checkOrdering() {
        const container = document.querySelector('.quiz-ordering');
        const items = container.querySelectorAll('.ordering-item');
        const feedback = container.querySelector('.quiz-feedback');

        let allCorrect = true;

        items.forEach((item, index) => {
            const originalIndex = parseInt(item.dataset.original);

            if (originalIndex === index) {
                item.classList.add('ordering-item--correct');
                item.classList.remove('ordering-item--wrong');
            } else {
                item.classList.add('ordering-item--wrong');
                item.classList.remove('ordering-item--correct');
                allCorrect = false;
            }
        });

        if (allCorrect) {
            feedback.className = 'quiz-feedback quiz-feedback--correct';
            feedback.textContent = 'Perfekt! Alle Schritte in der richtigen Reihenfolge! 🎉';
            Animations.showToast('Perfekt! +15 XP', 'success');
            appState.totalXP += 15;
            State.saveProgress(appState);
            UI.updateHeader();
        } else {
            feedback.className = 'quiz-feedback quiz-feedback--wrong';
            feedback.textContent = 'Die Reihenfolge ist noch nicht ganz richtig. Versuch es nochmal!';
        }

        feedback.style.display = 'block';
    },

    // Move item in ordering quiz
    moveItem(index, direction) {
        const list = document.getElementById('ordering-list');
        const items = Array.from(list.children);

        if (index + direction < 0 || index + direction >= items.length) return;

        const temp = items[index];
        items[index] = items[index + direction];
        items[index + direction] = temp;

        list.innerHTML = '';
        items.forEach((item, newIndex) => {
            // Update button indices
            const upBtn = item.querySelector('.ordering-btn:first-child');
            const downBtn = item.querySelector('.ordering-btn:last-child');
            upBtn.onclick = () => this.moveItem(newIndex, -1);
            downBtn.onclick = () => this.moveItem(newIndex, 1);
            list.appendChild(item);
        });
    },

    // Navigation
    next() {
        if (this.currentSlideIndex < this.slides.length - 1) {
            this.currentSlideIndex++;
            this.render();
            this.scrollToTop();
        } else {
            // Last slide - complete day
            this.completeDay();
        }
    },

    previous() {
        if (this.currentSlideIndex > 0) {
            this.currentSlideIndex--;
            this.render();
            this.scrollToTop();
        }
    },

    scrollToTop() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    },

    // Update progress bar
    updateProgressBar() {
        const progressFill = document.getElementById('slide-progress-fill');
        const progressText = document.getElementById('slide-progress-text');

        const percentage = ((this.currentSlideIndex + 1) / this.slides.length) * 100;

        if (progressFill) progressFill.style.width = `${percentage}%`;
        if (progressText) progressText.textContent = `${this.currentSlideIndex + 1} / ${this.slides.length}`;
    },

    // Update navigation buttons
    updateNavigationButtons() {
        const prevBtn = document.getElementById('slide-prev-btn');
        const nextBtn = document.getElementById('slide-next-btn');

        if (prevBtn) {
            prevBtn.style.display = this.currentSlideIndex > 0 ? 'inline-flex' : 'none';
        }

        if (nextBtn) {
            if (this.currentSlideIndex < this.slides.length - 1) {
                nextBtn.textContent = 'Weiter →';
                nextBtn.className = 'btn btn--primary btn--large';
            } else {
                nextBtn.textContent = '✓ Tag abschließen';
                nextBtn.className = 'btn btn--success btn--large';
            }
        }
    },

    // Complete day
    completeDay() {
        UI.completeDay(this.weekId, this.dayId);
    },

    // Helper to clean escaped strings (removes double escapes)
    cleanText(text) {
        if (!text) return '';
        // If it's not a string, return as is
        if (typeof text !== 'string') return text;
        return text
            .replace(/\\n/g, '\n')  // Force real newline
            .replace(/\\"/g, '"');  // Force real quote
    },

    formatContent(content) {
        if (!content) return '';
        // First clean the text to get real chars
        const cleaned = this.cleanText(content);
        // Then format for HTML display
        return cleaned
            .replace(/\n/g, '<br>')
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    },

    escapeHtml(text) {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    },

    copyCode(button) {
        const codeBlock = button.closest('.code-block').querySelector('code');
        const code = codeBlock.textContent;

        navigator.clipboard.writeText(code).then(() => {
            button.textContent = '✓ Kopiert';
            setTimeout(() => button.textContent = 'Kopieren', 2000);
        });
    }
};

// Expose to window for global access
window.SlideRenderer = SlideRenderer;
