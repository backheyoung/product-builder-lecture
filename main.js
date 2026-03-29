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
const partnershipForm = document.getElementById('partnership-form');
const partnershipSubmit = document.getElementById('partnership-submit');
const formStatus = document.getElementById('form-status');

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

function setFormStatus(message, type = '') {
    formStatus.textContent = message;
    formStatus.className = 'form-status';

    if (type) {
        formStatus.classList.add(`is-${type}`);
    }
}

themeToggle.addEventListener('click', () => {
    const nextTheme = body.classList.contains('dark-mode') ? 'light' : 'dark';
    localStorage.setItem(THEME_KEY, nextTheme);
    applyTheme(nextTheme);
});

generateButton.addEventListener('click', generateNumbers);

partnershipForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    partnershipSubmit.disabled = true;
    partnershipSubmit.textContent = '전송 중...';
    setFormStatus('');

    try {
        const response = await fetch(partnershipForm.action, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
            },
            body: new FormData(partnershipForm),
        });

        if (!response.ok) {
            throw new Error('Request failed');
        }

        partnershipForm.reset();
        setFormStatus('문의가 정상적으로 접수되었습니다. 확인 후 연락드리겠습니다.', 'success');
    } catch (error) {
        setFormStatus('문의 전송에 실패했습니다. 잠시 후 다시 시도해 주세요.', 'error');
    } finally {
        partnershipSubmit.disabled = false;
        partnershipSubmit.textContent = '문의 보내기';
    }
});

initializeTheme();
