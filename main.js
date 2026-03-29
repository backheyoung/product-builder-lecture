class LottoBall extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    static get observedAttributes() {
        return ['number'];
    }

    connectedCallback() {
        this.render();
    }

    attributeChangedCallback() {
        this.render();
    }

    render() {
        const shadow = this.shadowRoot;
        const number = this.getAttribute('number');

        if (!shadow || !number) {
            return;
        }

        const wrapper = document.createElement('div');
        wrapper.setAttribute('class', 'ball');
        wrapper.textContent = number;

        const style = document.createElement('style');
        const ballColor = this.getBallColor(number);
        style.textContent = `
            .ball {
                width: var(--ball-size, 50px);
                height: var(--ball-size, 50px);
                border-radius: 50%;
                background-color: ${ballColor};
                color: white;
                display: flex;
                justify-content: center;
                align-items: center;
                font-size: 1.2rem;
                font-weight: bold;
                box-shadow: inset 0 -4px 0 rgba(0, 0, 0, 0.15);
            }
        `;

        shadow.replaceChildren(style, wrapper);
    }

    getBallColor(number) {
        const num = parseInt(number, 10);
        if (num <= 10) return '#fbc400';
        if (num <= 20) return '#69c8f2';
        if (num <= 30) return '#ff7272';
        if (num <= 40) return '#aaaaaa';
        return '#b0d840';
    }
}

customElements.define('lotto-ball', LottoBall);

const THEME_KEY = 'lotto-theme';
const body = document.body;
const themeToggle = document.getElementById('theme-toggle');
const generateButton = document.getElementById('generate-btn');
const lottoNumbersContainer = document.getElementById('lotto-numbers');

function applyTheme(theme) {
    const isDark = theme === 'dark';
    body.classList.toggle('dark-mode', isDark);
    themeToggle.textContent = isDark ? 'Light Mode' : 'Dark Mode';
    themeToggle.setAttribute('aria-pressed', String(isDark));
}

function initializeTheme() {
    const savedTheme = localStorage.getItem(THEME_KEY);
    const preferredDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    applyTheme(savedTheme || (preferredDark ? 'dark' : 'light'));
}

function generateNumbers() {
    lottoNumbersContainer.innerHTML = '';

    const numbers = new Set();
    while (numbers.size < 6) {
        numbers.add(Math.floor(Math.random() * 45) + 1);
    }

    [...numbers].sort((a, b) => a - b).forEach((number) => {
        const lottoBall = document.createElement('lotto-ball');
        lottoBall.setAttribute('number', number);
        lottoNumbersContainer.appendChild(lottoBall);
    });
}

themeToggle.addEventListener('click', () => {
    const nextTheme = body.classList.contains('dark-mode') ? 'light' : 'dark';
    localStorage.setItem(THEME_KEY, nextTheme);
    applyTheme(nextTheme);
});

generateButton.addEventListener('click', generateNumbers);

initializeTheme();
