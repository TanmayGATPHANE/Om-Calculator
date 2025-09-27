// ===== THEME MANAGER =====
class ThemeManager {
    constructor() {
        this.currentTheme = localStorage.getItem('theme') || 'light';
        this.init();
    }

    init() {
        this.applyTheme(this.currentTheme);
        this.createToggleButton();
    }

    createToggleButton() {
        const header = document.querySelector('header');
        const toggleBtn = document.createElement('button');
        toggleBtn.className = 'theme-toggle';
        toggleBtn.innerHTML = this.currentTheme === 'dark' ? '☀️ Light' : '🌙 Dark';
        toggleBtn.addEventListener('click', () => this.toggleTheme());
        header.appendChild(toggleBtn);
    }

    toggleTheme() {
        this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.applyTheme(this.currentTheme);
        localStorage.setItem('theme', this.currentTheme);
        
        const toggleBtn = document.querySelector('.theme-toggle');
        toggleBtn.innerHTML = this.currentTheme === 'dark' ? '☀️ Light' : '🌙 Dark';
    }

    applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
    }
}

// ===== STORAGE MANAGER =====
class StorageManager {
    static saveCalculation(data) {
        const calculations = this.getCalculations();
        const calculation = {
            id: Date.now(),
            timestamp: new Date().toISOString(),
            ...data
        };
        calculations.unshift(calculation);
        
        // Keep only last 50 calculations
        if (calculations.length > 50) {
            calculations.splice(50);
        }
        
        localStorage.setItem('calculations', JSON.stringify(calculations));
        return calculation;
    }

    static getCalculations() {
        const stored = localStorage.getItem('calculations');
        return stored ? JSON.parse(stored) : [];
    }

    static clearCalculations() {
        localStorage.removeItem('calculations');
    }

    static deleteCalculation(id) {
        const calculations = this.getCalculations();
        const filtered = calculations.filter(calc => calc.id !== id);
        localStorage.setItem('calculations', JSON.stringify(filtered));
    }

    // ===== SALARY PROFILE MANAGEMENT =====
    static saveSalaryProfile(profile) {
        const profiles = this.getSalaryProfiles();
        const newProfile = {
            id: Date.now(),
            timestamp: new Date().toISOString(),
            name: profile.name || `Profile ${profiles.length + 1}`,
            ...profile
        };
        
        profiles.unshift(newProfile);
        
        // Keep only last 10 profiles
        if (profiles.length > 10) {
            profiles.splice(10);
        }
        
        localStorage.setItem('salaryProfiles', JSON.stringify(profiles));
        return newProfile;
    }

    static getSalaryProfiles() {
        const stored = localStorage.getItem('salaryProfiles');
        return stored ? JSON.parse(stored) : [];
    }

    static getLatestSalaryProfile() {
        const profiles = this.getSalaryProfiles();
        return profiles.length > 0 ? profiles[0] : null;
    }

    static clearSalaryProfiles() {
        localStorage.removeItem('salaryProfiles');
    }
}

// ===== CHART MANAGER =====
class ChartManager {
    static createDoughnutChart(workHours, totalMonthlyHours) {
        const percentage = Math.min((workHours / totalMonthlyHours) * 100, 100);
        const angle = (percentage / 100) * 360;
        
        const chartContainer = document.querySelector('.chart-container');
        if (!chartContainer) return;

        const chart = chartContainer.querySelector('.doughnut-chart');
        if (chart) {
            chart.style.setProperty('--work-angle', `${angle}deg`);
            
            const centerText = chart.querySelector('.chart-center');
            centerText.innerHTML = `
                <div style="font-size: 18px;">${workHours.toFixed(1)}h</div>
                <div style="font-size: 12px; opacity: 0.8;">needed</div>
            `;
        }
    }

    static createProgressBar(workHours, totalMonthlyHours, containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        const percentage = Math.min((workHours / totalMonthlyHours) * 100, 100);
        
        container.innerHTML = `
            <div class="progress-container">
                <div class="progress-label">
                    <span>Work Progress</span>
                    <span>${percentage.toFixed(1)}%</span>
                </div>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${percentage}%"></div>
                </div>
            </div>
        `;
    }
}

// ===== COLOR CODING MANAGER =====
class ColorManager {
    static getAffordabilityLevel(workDays) {
        if (workDays <= 7) return 'affordable';
        if (workDays <= 30) return 'expensive';
        return 'very-expensive';
    }

    static getAffordabilityMessage(workDays) {
        if (workDays <= 1) return '🎉 Less than a day of work!';
        if (workDays <= 7) return '✅ About a week of work';
        if (workDays <= 30) return '⚠️ About a month of work';
        if (workDays <= 90) return '🔶 About 3 months of work';
        return '❌ Very expensive purchase';
    }

    static applyResultColors(results, workDays) {
        const level = this.getAffordabilityLevel(workDays);
        results.className = `results ${level}`;
        
        const valueElements = results.querySelectorAll('.result-item .value');
        valueElements.forEach(el => {
            if (el.textContent.includes('hours') || el.textContent.includes('days')) {
                el.className = `value ${level}`;
            }
        });
    }
}
