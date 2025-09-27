// ===== HISTORY MANAGER =====
class HistoryManager {
    constructor() {
        this.init();
    }

    init() {
        this.renderHistory();
    }

    renderHistory() {
        const historyContainer = document.getElementById('historyList');
        if (!historyContainer) return;

        const calculations = StorageManager.getCalculations();
        
        if (calculations.length === 0) {
            historyContainer.innerHTML = '<div class="no-history">No calculations yet</div>';
            return;
        }

        historyContainer.innerHTML = calculations.map(calc => `
            <div class="history-item" data-id="${calc.id}">
                <div class="history-item-name">${calc.itemName}</div>
                <div class="history-item-details">
                    ₹${calc.itemPrice.toLocaleString('en-IN')} • ${calc.hoursNeeded.toFixed(1)}h • 
                    ${new Date(calc.timestamp).toLocaleDateString()}
                </div>
            </div>
        `).join('');

        // Add click events
        historyContainer.querySelectorAll('.history-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const id = parseInt(e.currentTarget.dataset.id);
                this.loadCalculation(id);
            });
        });
    }

    loadCalculation(id) {
        const calculations = StorageManager.getCalculations();
        const calc = calculations.find(c => c.id === id);
        
        if (calc) {
            // Fill form with saved data
            document.getElementById('monthlySalary').value = calc.monthlySalary;
            document.getElementById('workDaysPerWeek').value = calc.workDaysPerWeek;
            document.getElementById('hoursPerDay').value = calc.hoursPerDay;
            document.getElementById('unpaidLeaveDays').value = calc.unpaidLeaveDays || 0;
            document.getElementById('itemName').value = calc.itemName;
            document.getElementById('itemPrice').value = calc.itemPrice;
            document.getElementById('taxRate').value = calc.taxRate || 0;

            // Trigger calculation
            const form = document.getElementById('calculatorForm');
            form.dispatchEvent(new Event('submit'));
        }
    }

    clearHistory() {
        StorageManager.clearCalculations();
        this.renderHistory();
    }

    addToHistory(calculation) {
        StorageManager.saveCalculation(calculation);
        this.renderHistory();
    }
}

// ===== COMPARISON MANAGER =====
class ComparisonManager {
    constructor() {
        this.comparisonMode = false;
        this.comparisonItems = [];
        this.init();
    }

    init() {
        this.createComparisonToggle();
    }

    createComparisonToggle() {
        const form = document.getElementById('calculatorForm');
        const toggleHtml = `
            <div class="comparison-toggle">
                <label style="display: flex; align-items: center; gap: 10px;">
                    <span>Compare Multiple Items</span>
                    <label class="toggle-switch">
                        <input type="checkbox" id="comparisonToggle">
                        <span class="slider"></span>
                    </label>
                </label>
            </div>
        `;
        
        form.insertAdjacentHTML('afterbegin', toggleHtml);

        document.getElementById('comparisonToggle').addEventListener('change', (e) => {
            this.toggleComparison(e.target.checked);
        });
    }

    toggleComparison(enabled) {
        this.comparisonMode = enabled;
        
        if (enabled) {
            this.showComparisonMode();
        } else {
            this.hideComparisonMode();
        }
    }

    showComparisonMode() {
        const existingContainer = document.getElementById('comparisonContainer');
        if (existingContainer) return;

        const form = document.getElementById('calculatorForm');
        const comparisonHtml = `
            <div id="comparisonContainer" class="comparison-items">
                <div class="comparison-item">
                    <h4>Item 1</h4>
                    <input type="text" id="compItem1Name" placeholder="Item name" style="margin-bottom: 10px;">
                    <input type="number" id="compItem1Price" placeholder="Price (₹)">
                </div>
                <div class="comparison-item">
                    <h4>Item 2</h4>
                    <input type="text" id="compItem2Name" placeholder="Item name" style="margin-bottom: 10px;">
                    <input type="number" id="compItem2Price" placeholder="Price (₹)">
                </div>
            </div>
            <button type="button" id="compareBtn" class="calculate-btn" style="margin-top: 15px;">
                Compare Items
            </button>
        `;

        const calculateBtn = form.querySelector('.calculate-btn');
        calculateBtn.insertAdjacentHTML('beforebegin', comparisonHtml);

        document.getElementById('compareBtn').addEventListener('click', () => {
            this.performComparison();
        });

        // Hide original item inputs
        const itemSection = form.querySelector('.section:nth-child(3)');
        itemSection.style.display = 'none';
    }

    hideComparisonMode() {
        const container = document.getElementById('comparisonContainer');
        const compareBtn = document.getElementById('compareBtn');
        
        if (container) container.remove();
        if (compareBtn) compareBtn.remove();

        // Show original item inputs
        const form = document.getElementById('calculatorForm');
        const itemSection = form.querySelector('.section:nth-child(3)');
        itemSection.style.display = 'block';
    }

    performComparison() {
        const calculator = new WorkHoursCalculator();
        
        try {
            // Get salary data
            const salaryData = {
                monthlySalary: parseFloat(document.getElementById('monthlySalary').value),
                workDaysPerWeek: parseInt(document.getElementById('workDaysPerWeek').value),
                hoursPerDay: parseFloat(document.getElementById('hoursPerDay').value),
                unpaidLeaveDays: parseFloat(document.getElementById('unpaidLeaveDays').value) || 0,
                taxRate: parseFloat(document.getElementById('taxRate').value) || 0
            };

            // Get comparison items
            const item1 = {
                itemName: document.getElementById('compItem1Name').value,
                itemPrice: parseFloat(document.getElementById('compItem1Price').value)
            };

            const item2 = {
                itemName: document.getElementById('compItem2Name').value,
                itemPrice: parseFloat(document.getElementById('compItem2Price').value)
            };

            if (!item1.itemName || !item1.itemPrice || !item2.itemName || !item2.itemPrice) {
                throw new Error('Please fill in all comparison items');
            }

            // Calculate for both items
            const result1 = calculator.calculateWorkHours({...salaryData, ...item1});
            const result2 = calculator.calculateWorkHours({...salaryData, ...item2});

            this.displayComparison(result1, result2);

        } catch (error) {
            calculator.showError(error.message);
        }
    }

    displayComparison(result1, result2) {
        const resultsSection = document.getElementById('results');
        resultsSection.classList.remove('hidden');

        resultsSection.innerHTML = `
            <h2>📊 Comparison Results</h2>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px;">
                <div class="result-card">
                    <h3 style="text-align: center; margin-bottom: 15px; color: var(--primary-color);">
                        ${result1.itemName}
                    </h3>
                    <div class="result-item">
                        <span class="label">Price:</span>
                        <span class="value">₹${result1.itemPrice.toLocaleString('en-IN')}</span>
                    </div>
                    <div class="result-item highlight">
                        <span class="label">Work Hours:</span>
                        <span class="value">${result1.hoursNeeded.toFixed(1)}h</span>
                    </div>
                    <div class="result-item">
                        <span class="label">Work Days:</span>
                        <span class="value">${result1.daysNeeded.toFixed(1)} days</span>
                    </div>
                </div>
                
                <div class="result-card">
                    <h3 style="text-align: center; margin-bottom: 15px; color: var(--secondary-color);">
                        ${result2.itemName}
                    </h3>
                    <div class="result-item">
                        <span class="label">Price:</span>
                        <span class="value">₹${result2.itemPrice.toLocaleString('en-IN')}</span>
                    </div>
                    <div class="result-item highlight">
                        <span class="label">Work Hours:</span>
                        <span class="value">${result2.hoursNeeded.toFixed(1)}h</span>
                    </div>
                    <div class="result-item">
                        <span class="label">Work Days:</span>
                        <span class="value">${result2.daysNeeded.toFixed(1)} days</span>
                    </div>
                </div>
            </div>
            
            <div class="breakdown">
                <h3>💡 Comparison Summary</h3>
                <div class="breakdown-content">
                    ${this.generateComparisonSummary(result1, result2)}
                </div>
            </div>
        `;

        resultsSection.scrollIntoView({ behavior: 'smooth' });
    }

    generateComparisonSummary(result1, result2) {
        const cheaper = result1.itemPrice < result2.itemPrice ? result1 : result2;
        const expensive = result1.itemPrice > result2.itemPrice ? result1 : result2;
        const difference = expensive.itemPrice - cheaper.itemPrice;
        const hoursDifference = expensive.hoursNeeded - cheaper.hoursNeeded;

        return `
            <div class="breakdown-item">• <strong>${cheaper.itemName}</strong> is ₹${difference.toLocaleString('en-IN')} cheaper</div>
            <div class="breakdown-item">• You need ${hoursDifference.toFixed(1)} fewer hours of work for <strong>${cheaper.itemName}</strong></div>
            <div class="breakdown-item">• <strong>${expensive.itemName}</strong> costs ${(expensive.itemPrice / cheaper.itemPrice).toFixed(1)}x more</div>
            <div class="breakdown-item">• Price difference equals ${(difference / result1.netHourlyRate).toFixed(1)} hours of work</div>
        `;
    }
}
