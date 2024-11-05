document.addEventListener('DOMContentLoaded', () => {
    // Initialize dark mode from localStorage
    if (localStorage.getItem('darkMode') === 'enabled') {
        document.documentElement.classList.add('dark');
    }

    // Dark mode toggle
    const darkModeToggle = document.getElementById('darkModeToggle');
    darkModeToggle.addEventListener('click', () => {
        document.documentElement.classList.toggle('dark');
        localStorage.setItem('darkMode', 
            document.documentElement.classList.contains('dark') ? 'enabled' : 'disabled'
        );
    });

    // Calculate functionality
    const calculateBtn = document.getElementById('calculateBtn');
    calculateBtn.addEventListener('click', calculateGrams);

    // Load history
    loadHistory();
});

function calculateGrams() {
    const amountRemaining = parseFloat(document.getElementById('amountRemaining').value);

    if (isNaN(amountRemaining) || amountRemaining < 0) {
        alert('Please enter a valid amount');
        return;
    }

    const gramsPerOunce = 28;
    const remainingGrams = (amountRemaining * gramsPerOunce).toFixed(2);

    // Display result
    const resultDiv = document.getElementById('result');
    const resultText = resultDiv.querySelector('p');
    
    // Main conversion result
    resultText.innerHTML = `
        <div class="text-xl mb-4">${amountRemaining} oz = ${remainingGrams} grams</div>
        <div class="text-base space-y-4">
            ${generateCombinationsHTML(parseFloat(remainingGrams))}
        </div>`;
    
    resultDiv.classList.remove('hidden');

    // Save to history
    saveToHistory(amountRemaining, remainingGrams);
}

function generateCombinationsHTML(grams) {
    const measurements = {
        ounce: 28,
        half: 14,
        quarter: 7,
        eighth: 3.5,
        preroll: 1
    };

    // Calculate individual options first
    const maxQuantities = {
        ounces: Math.floor(grams / measurements.ounce),
        halves: Math.floor(grams / measurements.half),
        quarters: Math.floor(grams / measurements.quarter),
        eighths: Math.floor(grams / measurements.eighth),
        prerolls: Math.floor(grams)
    };

    // Generate the individual options HTML as before
    const individualOptionsHTML = `
        <div class="bg-white/50 dark:bg-gray-700/50 p-3 rounded-lg">
            <div class="font-semibold mb-2 text-gray-700 dark:text-gray-200 flex items-center">
                <i class="fas fa-cannabis w-5 text-center"></i>
                <span class="ml-2">Individual Options:</span>
            </div>
            <ul class="space-y-2 text-gray-600 dark:text-gray-300">
                ${maxQuantities.ounces > 0 ? `
                    <li class="flex items-center">
                        <i class="fas fa-scale-balanced w-5 text-center"></i>
                        <span class="ml-2">${maxQuantities.ounces} ounce${maxQuantities.ounces > 1 ? 's' : ''}</span>
                    </li>` : ''}
                ${maxQuantities.halves > 0 ? `
                    <li class="flex items-center">
                        <i class="fas fa-scale-balanced w-5 text-center"></i>
                        <span class="ml-2">${maxQuantities.halves} half${maxQuantities.halves > 1 ? 's' : ''}</span>
                    </li>` : ''}
                ${maxQuantities.quarters > 0 ? `
                    <li class="flex items-center">
                        <i class="fas fa-scale-balanced w-5 text-center"></i>
                        <span class="ml-2">${maxQuantities.quarters} quarter${maxQuantities.quarters > 1 ? 's' : ''}</span>
                    </li>` : ''}
                ${maxQuantities.eighths > 0 ? `
                    <li class="flex items-center">
                        <i class="fas fa-weight-scale w-5 text-center"></i>
                        <span class="ml-2">${maxQuantities.eighths} eighth${maxQuantities.eighths > 1 ? 's' : ''}</span>
                    </li>` : ''}
                ${maxQuantities.prerolls > 0 ? `
                    <li class="flex items-center">
                        <i class="fas fa-joint w-5 text-center"></i>
                        <span class="ml-2">${maxQuantities.prerolls} preroll${maxQuantities.prerolls > 1 ? 's' : ''}</span>
                    </li>` : ''}
            </ul>
        </div>
    `;

    // Get the new mixed combinations
    const mixedCombinations = calculateCombinations(grams);
    
    return `
        <div class="grid grid-cols-1 gap-4 text-left">
            ${individualOptionsHTML}
            ${generateNewMixedCombinationsHTML(mixedCombinations)}
        </div>
    `;
}

function calculateCombinations(totalWeight) {
    const items = [
        { name: 'Full Ounce', weight: 28 },
        { name: 'Half Ounce', weight: 14 },
        { name: 'Quarter', weight: 7 },
        { name: 'Eighth', weight: 3.5 },
        { name: 'PreRoll', weight: 1 }
    ];

    const combinations = [];
    const maxCounts = items.map(item => Math.floor(totalWeight / item.weight));

    // Start with full ounces
    for (let fullOunce = maxCounts[0]; fullOunce >= 0; fullOunce--) {
        let remainingAfterFullOunce = totalWeight - fullOunce * items[0].weight;

        // Then half ounces
        for (let halfOunce = Math.floor(remainingAfterFullOunce / items[1].weight); halfOunce >= 0; halfOunce--) {
            let remainingAfterHalfOunce = remainingAfterFullOunce - halfOunce * items[1].weight;

            for (let quarter = Math.floor(remainingAfterHalfOunce / items[2].weight); quarter >= 0; quarter--) {
                let remainingAfterQuarter = remainingAfterHalfOunce - quarter * items[2].weight;

                for (let eighth = Math.floor(remainingAfterQuarter / items[3].weight); eighth >= 0; eighth--) {
                    let remainingAfterEighth = remainingAfterQuarter - eighth * items[3].weight;

                    for (let preRoll = Math.floor(remainingAfterEighth / items[4].weight); preRoll >= 0; preRoll--) {
                        let total = (
                            fullOunce * items[0].weight +
                            halfOunce * items[1].weight +
                            quarter * items[2].weight +
                            eighth * items[3].weight +
                            preRoll * items[4].weight
                        );

                        if (total <= totalWeight && totalWeight - total < 1) {
                            combinations.push({
                                ounces: fullOunce,
                                halves: halfOunce,
                                quarters: quarter,
                                eighths: eighth,
                                prerolls: preRoll
                            });
                        }
                    }
                }
            }
        }
    }

    return combinations;
}

function generateNewMixedCombinationsHTML(combinations) {
    if (combinations.length === 0) return '';

    // Filter combinations to only include those with different measurement types
    const mixedCombinations = combinations.filter(combo => {
        // Count how many different types of measurements are used
        const differentTypes = [
            combo.ounces > 0,    // full ounces
            combo.halves > 0,    // halves
            combo.quarters > 0,  // quarters
            combo.eighths > 0,   // eighths
            combo.prerolls > 0   // prerolls
        ].filter(Boolean).length;
        
        return differentTypes > 1; // Only return combinations that use different measurement types
    });

    if (mixedCombinations.length === 0) return '';

    return `
        <div class="bg-white/50 dark:bg-gray-700/50 p-3 rounded-lg">
            <div class="font-semibold mb-2 text-gray-700 dark:text-gray-200 flex items-center">
                <i class="fas fa-shuffle w-5 text-center"></i>
                <span class="ml-2">Mixed Combinations:</span>
            </div>
            <ul class="space-y-2 text-gray-600 dark:text-gray-300">
                ${mixedCombinations
                    .slice(0, 3)
                    .map(combo => {
                        const parts = [];
                        
                        if (combo.ounces > 0) {
                            parts.push(`<li class="flex items-center">
                                <i class="fas fa-scale-balanced w-5 text-center"></i>
                                <span class="ml-2">${combo.ounces} ounce${combo.ounces > 1 ? 's' : ''}</span>
                            </li>`);
                        }
                        if (combo.halves > 0) {
                            parts.push(`<li class="flex items-center">
                                <i class="fas fa-scale-balanced w-5 text-center"></i>
                                <span class="ml-2">${combo.halves} half${combo.halves > 1 ? 's' : ''}</span>
                            </li>`);
                        }
                        if (combo.quarters > 0) {
                            parts.push(`<li class="flex items-center">
                                <i class="fas fa-scale-balanced w-5 text-center"></i>
                                <span class="ml-2">${combo.quarters} quarter${combo.quarters > 1 ? 's' : ''}</span>
                            </li>`);
                        }
                        if (combo.eighths > 0) {
                            parts.push(`<li class="flex items-center">
                                <i class="fas fa-weight-scale w-5 text-center"></i>
                                <span class="ml-2">${combo.eighths} eighth${combo.eighths > 1 ? 's' : ''}</span>
                            </li>`);
                        }
                        if (combo.prerolls > 0) {
                            parts.push(`<li class="flex items-center">
                                <i class="fas fa-joint w-5 text-center"></i>
                                <span class="ml-2">${combo.prerolls} preroll${combo.prerolls > 1 ? 's' : ''}</span>
                            </li>`);
                        }
                        return `<div class="space-y-2">${parts.join('')}</div>`;
                    })
                    .join('<div class="my-2 border-t dark:border-gray-600"></div>')}
            </ul>
        </div>
    `;
}

function saveToHistory(ounces, grams) {
    const history = JSON.parse(localStorage.getItem('calculationHistory') || '[]');
    // Format timestamp without seconds
    const options = { 
        year: 'numeric', 
        month: 'numeric', 
        day: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit'
    };
    history.unshift({
        ounces,
        grams,
        timestamp: new Date().toLocaleString(undefined, options)
    });

    // Keep only last 5 calculations
    if (history.length > 5) {
        history.pop();
    }

    localStorage.setItem('calculationHistory', JSON.stringify(history));
    loadHistory();
}

function loadHistory() {
    const historyList = document.getElementById('historyList');
    const history = JSON.parse(localStorage.getItem('calculationHistory') || '[]');

    historyList.innerHTML = '';
    history.forEach(calc => {
        const item = document.createElement('div');
        item.className = 'p-2 bg-gray-50 dark:bg-gray-700 rounded text-sm text-gray-800 dark:text-gray-200 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors';
        item.textContent = `${calc.ounces} oz = ${calc.grams} grams (${calc.timestamp})`;
        
        // Add click handler
        item.addEventListener('click', () => {
            // Set the input value
            document.getElementById('amountRemaining').value = calc.ounces;
            // Scroll to top smoothly
            window.scrollTo({ top: 0, behavior: 'smooth' });
            // Run calculation
            calculateGrams();
        });
        
        historyList.appendChild(item);
    });
} 