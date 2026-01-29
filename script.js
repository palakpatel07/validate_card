(function () {
    'use strict';

    // DOM Elements
    const form = document.getElementById('validation-form');
    const cardInput = document.getElementById('card-number');
    const clearBtn = document.getElementById('clear-btn');
    const resultContainer = document.getElementById('result');

    // Validate required DOM elements exist
    if (!form || !cardInput || !clearBtn || !resultContainer) {
        console.error('Required DOM elements not found');
        return;
    }

    const resultIcon = resultContainer.querySelector('.result__icon');
    const resultMessage = resultContainer.querySelector('.result__message');

    if (!resultIcon || !resultMessage) {
        console.error('Result container child elements not found');
        return;
    }

    // Constants
    const MIN_CARD_LENGTH = 13;
    const MAX_CARD_LENGTH = 19;

    /**
     * Validates a card number using the Luhn algorithm
     * @param {string} cardNumber - The card number to validate (digits only)
     * @returns {boolean} - True if the card number is valid
     */
    function luhnValidate(cardNumber) {
        const digits = cardNumber.split('').map(Number);
        let sum = 0;

        for (let i = digits.length - 1; i >= 0; i--) {
            let digit = digits[i];
            const isSecondFromRight = (digits.length - 1 - i) % 2 === 1;

            if (isSecondFromRight) {
                digit *= 2;
                if (digit > 9) {
                    digit -= 9;
                }
            }

            sum += digit;
        }

        return sum % 10 === 0;
    }

    /**
     * Formats a card number with spaces every 4 digits
     * @param {string} value - The raw input value
     * @returns {string} - Formatted card number
     */
    function formatCardNumber(value) {
        const digitsOnly = value.replace(/\D/g, '');
        const groups = digitsOnly.match(/.{1,4}/g) || [];
        return groups.join(' ');
    }

    /**
     * Extracts digits only from a string
     * @param {string} value - The input value
     * @returns {string} - Digits only
     */
    function getDigitsOnly(value) {
        return value.replace(/\D/g, '');
    }

    /**
     * Validates card number and returns validation result
     * @param {string} cardNumber - The card number to validate
     * @returns {{valid: boolean, message: string}} - Validation result
     */
    function validateCard(cardNumber) {
        const digits = getDigitsOnly(cardNumber);

        // Check if empty
        if (digits.length === 0) {
            return {
                valid: false,
                message: 'Please enter a card number'
            };
        }

        // Check minimum length
        if (digits.length < MIN_CARD_LENGTH) {
            return {
                valid: false,
                message: `Card number is too short. Minimum ${MIN_CARD_LENGTH} digits required.`
            };
        }

        // Check maximum length
        if (digits.length > MAX_CARD_LENGTH) {
            return {
                valid: false,
                message: `Card number is too long. Maximum ${MAX_CARD_LENGTH} digits allowed.`
            };
        }

        // Validate using Luhn algorithm
        if (luhnValidate(digits)) {
            return {
                valid: true,
                message: 'Valid card number! The number passes the Luhn algorithm check.'
            };
        }

        return {
            valid: false,
            message: 'Invalid card number. The number does not pass the Luhn algorithm check.'
        };
    }

    /**
     * Displays the validation result
     * @param {{valid: boolean, message: string}} result - The validation result
     */
    function displayResult(result) {
        resultContainer.hidden = false;
        resultContainer.className = 'result ' + (result.valid ? 'result--success' : 'result--error');
        resultMessage.textContent = result.message;

        // Update icon
        if (result.valid) {
            resultIcon.innerHTML = `
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
            `;
        } else {
            resultIcon.innerHTML = `
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="15" y1="9" x2="9" y2="15"></line>
                    <line x1="9" y1="9" x2="15" y2="15"></line>
                </svg>
            `;
        }

    }

    /**
     * Hides the validation result
     */
    function hideResult() {
        resultContainer.hidden = true;
        resultContainer.className = 'result';
    }

    /**
     * Resets the form to its initial state
     */
    function resetForm() {
        cardInput.value = '';
        hideResult();
        cardInput.focus();
    }

    // Event Listeners

    // Format card number as user types
    cardInput.addEventListener('input', function (e) {
        const cursorPosition = e.target.selectionStart;
        const oldValue = e.target.value;
        const newValue = formatCardNumber(oldValue);

        e.target.value = newValue;

        // Adjust cursor position for added spaces
        const oldSpaces = (oldValue.slice(0, cursorPosition).match(/ /g) || []).length;
        const newSpaces = (newValue.slice(0, cursorPosition + 1).match(/ /g) || []).length;
        const newPosition = cursorPosition + (newSpaces - oldSpaces);

        e.target.setSelectionRange(newPosition, newPosition);

        // Hide result when user starts typing again
        if (!resultContainer.hidden) {
            hideResult();
        }
    });

    // Only allow numeric input and spaces
    cardInput.addEventListener('keypress', function (e) {
        if (!/[\d ]/.test(e.key) && e.key !== 'Backspace' && e.key !== 'Enter') {
            e.preventDefault();
        }
    });

    // Handle form submission
    form.addEventListener('submit', function (e) {
        e.preventDefault();
        const result = validateCard(cardInput.value);
        displayResult(result);
    });

    // Handle clear button
    clearBtn.addEventListener('click', resetForm);

    // Handle keyboard shortcut (Escape to clear)
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
            resetForm();
        }
    });
})();
