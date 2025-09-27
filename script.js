// Work Hours Calculator Logic
class WorkHoursCalculator {
    constructor() {
        this.form = document.getElementById('calculatorForm');
        this.resultsSection = document.getElementById('results');
        this.init();
    }

    init() {
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        
        // Add real-time validation
        const inputs = this.form.querySelectorAll('input[required]');
        inputs.forEach(input => {
            input.addEventListener('input', () => this.validateInput(input));
        });

        // Add preset button functionality
        this.initPresetButtons();
    }

    initPresetButtons() {
        const presetButtons = document.querySelectorAll('.preset-btn');
        presetButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                
                // Remove active class from all buttons
                presetButtons.forEach(btn => btn.classList.remove('active'));
                
                // Add active class to clicked button
                button.classList.add('active');
                
                // Fill form fields
                const name = button.getAttribute('data-name');
                const price = button.getAttribute('data-price');
                
                document.getElementById('itemName').value = name;
                document.getElementById('itemPrice').value = price;
                
                // Trigger validation
                this.validateInput(document.getElementById('itemName'));
                this.validateInput(document.getElementById('itemPrice'));
            });
        });
    }

    validateInput(input) {
        if (input.value.trim() === '' || (input.type === 'number' && parseFloat(input.value) < 0)) {
            input.style.borderColor = '#e53e3e';
        } else {
            input.style.borderColor = '#48bb78';
        }
    }

    handleSubmit(e) {
        e.preventDefault();
        
        try {
            const data = this.getFormData();
            const results = this.calculateWorkHours(data);
            this.displayResults(results);
        } catch (error) {
            this.showError(error.message);
        }
    }

    getFormData() {
        const formData = new FormData(this.form);
        
        return {
            monthlySalary: parseFloat(document.getElementById('monthlySalary').value),
            workDaysPerWeek: parseInt(document.getElementById('workDaysPerWeek').value),
            hoursPerDay: parseFloat(document.getElementById('hoursPerDay').value),
            unpaidLeaveDays: parseFloat(document.getElementById('unpaidLeaveDays').value) || 0,
            itemName: document.getElementById('itemName').value.trim(),
            itemPrice: parseFloat(document.getElementById('itemPrice').value),
            taxRate: parseFloat(document.getElementById('taxRate').value) || 0
        };
    }

    calculateWorkHours(data) {
        // Validate input data
        this.validateFormData(data);

        // Calculate working days in a month (approximately 4.33 weeks per month)
        const workDaysPerMonth = data.workDaysPerWeek * 4.33;
        
        // Subtract unpaid leave days
        const actualWorkDaysPerMonth = Math.max(0, workDaysPerMonth - data.unpaidLeaveDays);
        
        // Calculate total work hours per month
        const totalWorkHoursPerMonth = actualWorkDaysPerMonth * data.hoursPerDay;
        
        // Calculate gross hourly rate
        const grossHourlyRate = data.monthlySalary / totalWorkHoursPerMonth;
        
        // Calculate net salary after taxes
        const netMonthlySalary = data.monthlySalary * (1 - data.taxRate / 100);
        const netHourlyRate = netMonthlySalary / totalWorkHoursPerMonth;
        
        // Calculate hours needed to buy the item (using net hourly rate)
        const hoursNeeded = data.itemPrice / netHourlyRate;
        const daysNeeded = hoursNeeded / data.hoursPerDay;

        return {
            itemName: data.itemName,
            itemPrice: data.itemPrice,
            hoursNeeded: hoursNeeded,
            daysNeeded: daysNeeded,
            grossHourlyRate: grossHourlyRate,
            netHourlyRate: netHourlyRate,
            netMonthlySalary: netMonthlySalary,
            workDaysPerMonth: actualWorkDaysPerMonth,
            totalWorkHoursPerMonth: totalWorkHoursPerMonth,
            taxAmount: data.monthlySalary * (data.taxRate / 100),
            breakdown: this.createBreakdown(data, {
                grossHourlyRate,
                netHourlyRate,
                actualWorkDaysPerMonth,
                totalWorkHoursPerMonth
            })
        };
    }

    validateFormData(data) {
        const errors = [];

        if (!data.monthlySalary || data.monthlySalary <= 0) {
            errors.push('Monthly salary must be greater than 0');
        }

        if (!data.workDaysPerWeek || data.workDaysPerWeek < 1 || data.workDaysPerWeek > 7) {
            errors.push('Work days per week must be between 1 and 7');
        }

        if (!data.hoursPerDay || data.hoursPerDay < 1 || data.hoursPerDay > 24) {
            errors.push('Hours per day must be between 1 and 24');
        }

        if (data.unpaidLeaveDays < 0 || data.unpaidLeaveDays > 31) {
            errors.push('Unpaid leave days must be between 0 and 31');
        }

        if (!data.itemName) {
            errors.push('Item name is required');
        }

        if (!data.itemPrice || data.itemPrice <= 0) {
            errors.push('Item price must be greater than 0');
        }

        if (data.taxRate < 0 || data.taxRate > 100) {
            errors.push('Tax rate must be between 0 and 100');
        }

        // Check if unpaid leave days exceed work days
        const workDaysPerMonth = data.workDaysPerWeek * 4.33;
        if (data.unpaidLeaveDays > workDaysPerMonth) {
            errors.push('Unpaid leave days cannot exceed total work days in a month');
        }

        if (errors.length > 0) {
            throw new Error(errors.join('. '));
        }
    }

    createBreakdown(data, calculations) {
        return [
            `Monthly Salary: ₹${data.monthlySalary.toLocaleString('en-IN')}`,
            `Tax Deduction (${data.taxRate}%): -₹${(data.monthlySalary * data.taxRate / 100).toLocaleString('en-IN')}`,
            `Net Monthly Income: ₹${(calculations.netHourlyRate * calculations.totalWorkHoursPerMonth).toLocaleString('en-IN')}`,
            `Work Days per Week: ${data.workDaysPerWeek} days`,
            `Hours per Work Day: ${data.hoursPerDay} hours`,
            `Unpaid Leave Days: ${data.unpaidLeaveDays} days/month`,
            `Actual Work Days per Month: ${calculations.actualWorkDaysPerMonth.toFixed(1)} days`,
            `Total Work Hours per Month: ${calculations.totalWorkHoursPerMonth.toFixed(1)} hours`,
            `Gross Hourly Rate: ₹${calculations.grossHourlyRate.toFixed(2)}/hour`,
            `Net Hourly Rate: ₹${calculations.netHourlyRate.toFixed(2)}/hour (after taxes)`
        ];
    }

    displayResults(results) {
        // Update result values
        document.getElementById('resultItem').textContent = results.itemName;
        document.getElementById('resultPrice').textContent = `₹${results.itemPrice.toLocaleString('en-IN')}`;
        document.getElementById('resultHours').textContent = `${results.hoursNeeded.toFixed(1)} hours`;
        document.getElementById('resultDays').textContent = `${results.daysNeeded.toFixed(1)} days`;
        document.getElementById('resultHourlyRate').textContent = `₹${results.netHourlyRate.toFixed(2)}/hour`;
        document.getElementById('resultNetIncome').textContent = `₹${results.netMonthlySalary.toLocaleString('en-IN')}`;

        // Update breakdown
        const breakdownContent = document.getElementById('breakdownContent');
        breakdownContent.innerHTML = results.breakdown
            .map(item => `<div class="breakdown-item">• ${item}</div>`)
            .join('');

        // Show results with animation
        this.resultsSection.classList.remove('hidden');
        this.resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });

        // Add some celebration if it's a reasonable purchase
        if (results.daysNeeded <= 30) {
            this.showCelebration();
        }
    }

    showCelebration() {
        // Add a subtle celebration effect
        const resultCard = document.querySelector('.result-card');
        resultCard.style.animation = 'none';
        setTimeout(() => {
            resultCard.style.animation = 'pulse 0.6s ease-in-out';
        }, 10);
    }

    showError(message) {
        // Remove existing error messages
        const existingError = document.querySelector('.message.error');
        if (existingError) {
            existingError.remove();
        }

        // Create and show error message
        const errorDiv = document.createElement('div');
        errorDiv.className = 'message error';
        errorDiv.textContent = message;

        this.form.insertBefore(errorDiv, this.form.firstChild);

        // Remove error after 5 seconds
        setTimeout(() => {
            errorDiv.remove();
        }, 5000);

        // Scroll to error
        errorDiv.scrollIntoView({ behavior: 'smooth' });
    }
}

// Additional utility functions
class CalculatorUtils {
    static formatCurrency(amount) {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR'
        }).format(amount);
    }

    static formatHours(hours) {
        if (hours < 1) {
            return `${Math.round(hours * 60)} minutes`;
        } else if (hours < 24) {
            return `${hours.toFixed(1)} hours`;
        } else {
            const days = Math.floor(hours / 24);
            const remainingHours = hours % 24;
            return `${days} days, ${remainingHours.toFixed(1)} hours`;
        }
    }

    static addCommas(num) {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
}

// Preset calculations for common scenarios
class PresetCalculator {
    static getPresets() {
        return [
            {
                name: "Coffee Break",
                description: "Daily coffee (₹200)",
                price: 200,
                category: "daily"
            },
            {
                name: "Movie Night",
                description: "Movie ticket + snacks (₹800)",
                price: 800,
                category: "entertainment"
            },
            {
                name: "New Shoes",
                description: "Good quality shoes (₹5000)",
                price: 5000,
                category: "clothing"
            },
            {
                name: "Weekend Getaway",
                description: "Local trip (₹25000)",
                price: 25000,
                category: "travel"
            },
            {
                name: "New Laptop",
                description: "Mid-range laptop (₹80000)",
                price: 80000,
                category: "electronics"
            },
            {
                name: "Used Car",
                description: "Reliable used car (₹800000)",
                price: 800000,
                category: "transportation"
            }
        ];
    }
}

// Initialize the calculator when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new WorkHoursCalculator();
    
    // Add some helpful tooltips or additional features
    addTooltips();
    addKeyboardShortcuts();
});

function addTooltips() {
    // Add helpful tooltips to form elements
    const tooltips = {
        'monthlySalary': 'Enter your gross monthly salary before taxes',
        'workDaysPerWeek': 'How many days do you work in a typical week?',
        'hoursPerDay': 'Average hours you work per day',
        'unpaidLeaveDays': 'Days per month you take off without pay (vacation, sick days, etc.)',
        'taxRate': 'Approximate percentage for taxes and deductions'
    };

    Object.entries(tooltips).forEach(([id, text]) => {
        const element = document.getElementById(id);
        if (element) {
            element.title = text;
        }
    });
}

function addKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
        // Ctrl/Cmd + Enter to submit form
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            e.preventDefault();
            const form = document.getElementById('calculatorForm');
            form.dispatchEvent(new Event('submit'));
        }
    });
}

// Add some CSS animation keyframes via JavaScript
const style = document.createElement('style');
style.textContent = `
    @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.02); }
        100% { transform: scale(1); }
    }
`;
document.head.appendChild(style);
