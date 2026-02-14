// ============================================
// ANIMATIONS
// Confetti, toasts, and other visual effects
// ============================================

const Animations = {
    // Show toast notification
    showToast(message, type = 'success', duration = 3000) {
        const container = document.getElementById('toast-container');
        if (!container) return;

        const toast = document.createElement('div');
        toast.className = `toast toast--${type}`;

        const icons = {
            success: '✓',
            error: '✗',
            info: 'ℹ'
        };

        toast.innerHTML = `
      <span class="toast__icon">${icons[type] || '•'}</span>
      <div class="toast__content">
        <div class="toast__message">${message}</div>
      </div>
    `;

        container.appendChild(toast);

        // Remove after duration
        setTimeout(() => {
            toast.style.animation = 'slideOutRight 0.3s ease-out';
            setTimeout(() => toast.remove(), 300);
        }, duration);
    },

    // Confetti explosion animation
    createConfetti() {
        const container = document.getElementById('confetti-container');
        if (!container) return;

        const colors = [
            'var(--color-primary-orange)',
            'var(--color-secondary-purple)',
            'var(--color-accent-yellow)',
            'var(--color-accent-green)',
            'var(--color-accent-pink)'
        ];

        // Create 50 confetti pieces
        for (let i = 0; i < 50; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.left = Math.random() * 100 + '%';
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.animationDelay = Math.random() * 0.3 + 's';
            confetti.style.animationDuration = (Math.random() * 2 + 2) + 's';

            container.appendChild(confetti);

            // Remove after animation
            setTimeout(() => confetti.remove(), 3500);
        }
    },

    // Fade in element
    fadeIn(element, duration = 500) {
        element.style.opacity = '0';
        element.style.display = 'block';
        element.classList.add('fade-in');

        setTimeout(() => {
            element.style.opacity = '1';
        }, 10);
    },

    // Slide in element
    slideIn(element, direction = 'up') {
        element.classList.add(`slide-in-${direction}`);
    },

    // Pulse effect
    pulse(element) {
        element.classList.add('pulse-scale');
        setTimeout(() => {
            element.classList.remove('pulse-scale');
        }, 1000);
    },

    // Shake effect (for errors)
    shake(element) {
        element.classList.add('shake');
        setTimeout(() => {
            element.classList.remove('shake');
        }, 500);
    },

    // Badge pop animation
    badgePop(element) {
        element.classList.add('badge-pop');
    },

    // Stagger children animations
    staggerChildren(container) {
        container.classList.add('stagger-children');
    },

    // Update progress ring
    updateProgressRing(percentage) {
        const circle = document.getElementById('progress-circle');
        const text = document.getElementById('progress-percentage');

        if (!circle || !text) return;

        const radius = 26;
        const circumference = 2 * Math.PI * radius;
        const offset = circumference - (percentage / 100) * circumference;

        circle.style.strokeDashoffset = offset;
        text.textContent = percentage + '%';
    },

    // Count up animation for numbers
    countUp(element, start, end, duration = 1000) {
        const range = end - start;
        const increment = range / (duration / 16);
        let current = start;

        const timer = setInterval(() => {
            current += increment;
            if (current >= end) {
                current = end;
                clearInterval(timer);
            }
            element.textContent = Math.round(current);
        }, 16);
    }
};

// Add slide out animation for toasts
const style = document.createElement('style');
style.textContent = `
  @keyframes slideOutRight {
    from {
      transform: translateX(0);
      opacity: 1;
    }
    to {
      transform: translateX(100%);
      opacity: 0;
    }
  }
`;
document.head.appendChild(style);
