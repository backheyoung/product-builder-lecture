class LottoBall extends HTMLElement {
    constructor() {
        super();
        const shadow = this.attachShadow({ mode: 'open' });

        const wrapper = document.createElement('div');
        wrapper.setAttribute('class', 'ball');

        const number = this.getAttribute('number');
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
            }
        `;

        shadow.appendChild(style);
        shadow.appendChild(wrapper);
    }

    getBallColor(number) {
        const num = parseInt(number);
        if (num <= 10) return '#fbc400'; // Yellow
        if (num <= 20) return '#69c8f2'; // Blue
        if (num <= 30) return '#ff7272'; // Red
        if (num <= 40) return '#aaaaaa'; // Gray
        return '#b0d840'; // Green
    }
}

customElements.define('lotto-ball', LottoBall);

document.getElementById('generate-btn').addEventListener('click', () => {
    const lottoNumbersContainer = document.getElementById('lotto-numbers');
    lottoNumbersContainer.innerHTML = '';

    const numbers = new Set();
    while (numbers.size < 6) {
        numbers.add(Math.floor(Math.random() * 45) + 1);
    }

    numbers.forEach(number => {
        const lottoBall = document.createElement('lotto-ball');
        lottoBall.setAttribute('number', number);
        lottoNumbersContainer.appendChild(lottoBall);
    });
});
