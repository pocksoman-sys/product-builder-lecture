document.addEventListener('DOMContentLoaded', () => {
    const generateBtn = document.getElementById('generate-btn');
    const themeToggleBtn = document.getElementById('theme-toggle');
    const lottoNumbersDiv = document.getElementById('lotto-numbers');
    const body = document.body;

    // Function to generate unique random lotto numbers
    function generateLottoNumbers() {
        const numbers = new Set();
        while (numbers.size < 6) {
            numbers.add(Math.floor(Math.random() * 45) + 1);
        }
        return Array.from(numbers).sort((a, b) => a - b);
    }

    // Function to display lotto numbers
    function displayLottoNumbers(numbers) {
        lottoNumbersDiv.innerHTML = ''; // Clear previous numbers
        numbers.forEach(number => {
            const numberCircle = document.createElement('div');
            numberCircle.classList.add('number-circle');
            numberCircle.textContent = number;
            lottoNumbersDiv.appendChild(numberCircle);
        });
    }

    // Function to toggle theme
    function toggleTheme() {
        body.classList.toggle('dark-mode');
        // Save user's preference
        if (body.classList.contains('dark-mode')) {
            localStorage.setItem('theme', 'dark');
        } else {
            localStorage.setItem('theme', 'light');
        }
    }

    // Event listener for generate button
    generateBtn.addEventListener('click', () => {
        const numbers = generateLottoNumbers();
        displayLottoNumbers(numbers);
    });

    // Event listener for theme toggle button
    themeToggleBtn.addEventListener('click', toggleTheme);

    // Load saved theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        body.classList.add('dark-mode');
    }
});
