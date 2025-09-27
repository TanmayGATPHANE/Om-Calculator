// ===== ENHANCED WORK HOURS CALCULATOR =====
class WorkHoursCalculator {
    constructor() {
        this.form = document.getElementById('calculatorForm');
        this.resultsSection = document.getElementById('results');
        this.historyManager = new HistoryManager();
        this.comparisonManager = new ComparisonManager();
        this.init();
    }

    init() {
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        
        // Add real-time validation
        const inputs = this.form.querySelectorAll('input[required]');
        inputs.forEach(input => {
            input.addEventListener('input', () => this.validateInput(input));
        });

        // Add real-time calculation on price change
        this.initRealTimeCalculation();

        // Add preset button functionality
        this.initPresetButtons();

        // Add salary profile functionality
        this.initSalaryProfile();
        
        // Add clear history functionality
        const clearHistoryBtn = document.getElementById('clearHistory');
        if (clearHistoryBtn) {
            clearHistoryBtn.addEventListener('click', () => {
                this.historyManager.clearHistory();
            });
        }

        // Load saved salary profile on startup
        this.loadSavedSalaryProfile();
    }

    initSalaryProfile() {
        const saveBtn = document.getElementById('saveSalaryProfile');
        const loadBtn = document.getElementById('loadSalaryProfile');

        if (saveBtn) {
            saveBtn.addEventListener('click', () => this.saveSalaryProfile());
        }

        if (loadBtn) {
            loadBtn.addEventListener('click', () => this.showSalaryProfiles());
        }
    }

    saveSalaryProfile() {
        try {
            const monthlySalary = document.getElementById('monthlySalary').value;
            const workDaysPerWeek = document.getElementById('workDaysPerWeek').value;
            const hoursPerDay = document.getElementById('hoursPerDay').value;
            const unpaidLeaveDays = document.getElementById('unpaidLeaveDays').value || 0;
            const taxRate = document.getElementById('taxRate').value || 0;

            if (!monthlySalary || !workDaysPerWeek || !hoursPerDay) {
                throw new Error('Please fill in basic salary information before saving');
            }

            const profile = {
                monthlySalary: parseFloat(monthlySalary),
                workDaysPerWeek: parseInt(workDaysPerWeek),
                hoursPerDay: parseFloat(hoursPerDay),
                unpaidLeaveDays: parseFloat(unpaidLeaveDays),
                taxRate: parseFloat(taxRate)
            };

            StorageManager.saveSalaryProfile(profile);
            
            // Show success message
            this.showSuccessMessage('✅ Salary profile saved successfully!');
            
            // Update button state
            const saveBtn = document.getElementById('saveSalaryProfile');
            const originalText = saveBtn.innerHTML;
            saveBtn.innerHTML = '✅ Saved!';
            saveBtn.disabled = true;
            
            setTimeout(() => {
                saveBtn.innerHTML = originalText;
                saveBtn.disabled = false;
            }, 2000);

        } catch (error) {
            this.showError(error.message);
        }
    }

    showSalaryProfiles() {
        const profiles = StorageManager.getSalaryProfiles();
        
        if (profiles.length === 0) {
            this.showError('No saved salary profiles found');
            return;
        }

        // Create modal-style selection
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
        `;

        const content = document.createElement('div');
        content.style.cssText = `
            background: var(--card-background);
            border-radius: 15px;
            padding: 25px;
            max-width: 500px;
            width: 90%;
            max-height: 80vh;
            overflow-y: auto;
            color: var(--text-color);
        `;

        content.innerHTML = `
            <h3 style="margin-bottom: 20px; color: var(--primary-color);">📂 Select Salary Profile</h3>
            <div class="profile-list">
                ${profiles.map((profile, index) => `
                    <div class="profile-item" data-index="${index}" style="
                        padding: 15px;
                        margin-bottom: 10px;
                        background: var(--section-background);
                        border-radius: 8px;
                        cursor: pointer;
                        transition: all 0.2s ease;
                        border: 2px solid var(--border-color);
                    ">
                        <div style="font-weight: 600; margin-bottom: 5px;">
                            Profile ${index + 1} • ₹${profile.monthlySalary.toLocaleString('en-IN')}/month
                        </div>
                        <div style="font-size: 12px; color: var(--text-light);">
                            ${profile.workDaysPerWeek} days/week • ${profile.hoursPerDay} hours/day • 
                            Tax: ${profile.taxRate}% • 
                            Saved: ${new Date(profile.timestamp).toLocaleDateString()}
                        </div>
                    </div>
                `).join('')}
            </div>
            <div style="margin-top: 20px; display: flex; gap: 10px;">
                <button id="cancelProfileSelect" style="
                    flex: 1;
                    padding: 10px;
                    background: var(--border-color);
                    color: var(--text-color);
                    border: none;
                    border-radius: 8px;
                    cursor: pointer;
                ">Cancel</button>
            </div>
        `;

        modal.appendChild(content);
        document.body.appendChild(modal);

        // Add click handlers
        content.querySelectorAll('.profile-item').forEach((item, index) => {
            item.addEventListener('click', () => {
                this.loadSalaryProfile(profiles[index]);
                document.body.removeChild(modal);
            });

            item.addEventListener('mouseenter', () => {
                item.style.borderColor = 'var(--primary-color)';
                item.style.background = 'var(--card-background)';
            });

            item.addEventListener('mouseleave', () => {
                item.style.borderColor = 'var(--border-color)';
                item.style.background = 'var(--section-background)';
            });
        });

        content.querySelector('#cancelProfileSelect').addEventListener('click', () => {
            document.body.removeChild(modal);
        });

        // Close on background click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                document.body.removeChild(modal);
            }
        });
    }

    loadSalaryProfile(profile) {
        document.getElementById('monthlySalary').value = profile.monthlySalary;
        document.getElementById('workDaysPerWeek').value = profile.workDaysPerWeek;
        document.getElementById('hoursPerDay').value = profile.hoursPerDay;
        document.getElementById('unpaidLeaveDays').value = profile.unpaidLeaveDays || 0;
        document.getElementById('taxRate').value = profile.taxRate || 0;

        // Trigger validation
        this.validateInput(document.getElementById('monthlySalary'));
        this.validateInput(document.getElementById('hoursPerDay'));

        this.showSuccessMessage('📂 Salary profile loaded successfully!');
    }

    loadSavedSalaryProfile() {
        const savedProfile = StorageManager.getLatestSalaryProfile();
        if (savedProfile) {
            this.loadSalaryProfile(savedProfile);
        }
    }

    initRealTimeCalculation() {
        const itemPriceInput = document.getElementById('itemPrice');
        const itemNameInput = document.getElementById('itemName');
        let debounceTimer;

        // Function to perform real-time calculation
        const performRealTimeCalc = () => {
            // Clear previous timer
            clearTimeout(debounceTimer);
            
            // Debounce the calculation to avoid too many updates
            debounceTimer = setTimeout(() => {
                try {
                    // Check if we have minimum required data
                    const monthlySalary = document.getElementById('monthlySalary').value;
                    const workDaysPerWeek = document.getElementById('workDaysPerWeek').value;
                    const hoursPerDay = document.getElementById('hoursPerDay').value;
                    const itemPrice = itemPriceInput.value;
                    const itemName = itemNameInput.value;

                    // Only calculate if we have the essential data
                    if (monthlySalary && workDaysPerWeek && hoursPerDay && itemPrice && itemName) {
                        const data = this.getFormData();
                        const results = this.calculateWorkHours(data);
                        this.displayResults(results, true); // true flag for real-time update
                        
                        // Add visual feedback
                        itemPriceInput.style.borderColor = 'var(--success-color)';
                        itemPriceInput.style.boxShadow = '0 0 0 2px rgba(72, 187, 120, 0.2)';
                    }
                } catch (error) {
                    // Silently handle errors for real-time updates
                    // Don't show error messages during typing
                    console.log('Real-time calculation skipped:', error.message);
                }
            }, 500); // Wait 500ms after user stops typing
        };

        // Add event listeners for real-time calculation
        itemPriceInput.addEventListener('input', performRealTimeCalc);
        
        // Also trigger on other essential fields
        document.getElementById('monthlySalary').addEventListener('input', performRealTimeCalc);
        document.getElementById('workDaysPerWeek').addEventListener('change', performRealTimeCalc);
        document.getElementById('hoursPerDay').addEventListener('input', performRealTimeCalc);
        document.getElementById('itemName').addEventListener('input', performRealTimeCalc);
        document.getElementById('taxRate').addEventListener('input', performRealTimeCalc);
        document.getElementById('unpaidLeaveDays').addEventListener('input', performRealTimeCalc);
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
            input.style.borderColor = 'var(--danger-color)';
        } else {
            input.style.borderColor = 'var(--success-color)';
        }
    }

    handleSubmit(e) {
        e.preventDefault();
        
        try {
            const data = this.getFormData();
            const results = this.calculateWorkHours(data);
            this.displayResults(results, false); // false = manual calculation
            
            // Add to history only for manual calculations
            this.historyManager.addToHistory({
                monthlySalary: data.monthlySalary,
                workDaysPerWeek: data.workDaysPerWeek,
                hoursPerDay: data.hoursPerDay,
                unpaidLeaveDays: data.unpaidLeaveDays,
                itemName: data.itemName,
                itemPrice: data.itemPrice,
                taxRate: data.taxRate,
                hoursNeeded: results.hoursNeeded
            });
            
        } catch (error) {
            this.showError(error.message);
        }
    }

    getFormData() {
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
        
        // Prevent division by zero
        if (totalWorkHoursPerMonth <= 0) {
            throw new Error('Total work hours per month must be greater than 0');
        }
        
        // Calculate gross hourly rate
        const grossHourlyRate = data.monthlySalary / totalWorkHoursPerMonth;
        
        // Calculate net salary after taxes
        const netMonthlySalary = data.monthlySalary * (1 - data.taxRate / 100);
        const netHourlyRate = netMonthlySalary / totalWorkHoursPerMonth;
        
        // Prevent division by zero for hourly rate
        if (netHourlyRate <= 0) {
            throw new Error('Net hourly rate must be greater than 0');
        }
        
        // Calculate hours needed to buy the item (using net hourly rate)
        const hoursNeeded = data.itemPrice / netHourlyRate;
        const daysNeeded = data.hoursPerDay > 0 ? hoursNeeded / data.hoursPerDay : 0;

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
                totalWorkHoursPerMonth,
                hoursNeeded
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
        return this.createDetailedBreakdown(data, calculations);
    }

    createDetailedBreakdown(data, calculations) {
        // Ensure all values exist and are numbers
        const safeData = {
            monthlySalary: data.monthlySalary || 0,
            workDaysPerWeek: data.workDaysPerWeek || 5,
            hoursPerDay: data.hoursPerDay || 8,
            unpaidLeaveDays: data.unpaidLeaveDays || 0,
            taxRate: data.taxRate || 0,
            itemName: data.itemName || 'Unknown Item',
            itemPrice: data.itemPrice || 0
        };

        const safeCalculations = {
            grossHourlyRate: calculations.grossHourlyRate || 0,
            netHourlyRate: calculations.netHourlyRate || 0,
            totalWorkHoursPerMonth: calculations.totalWorkHoursPerMonth || 0,
            actualWorkDaysPerMonth: calculations.actualWorkDaysPerMonth || 0,
            hoursNeeded: calculations.hoursNeeded || 0
        };

        // Recalculate hours needed to ensure accuracy
        const actualHoursNeeded = safeCalculations.netHourlyRate > 0 ? safeData.itemPrice / safeCalculations.netHourlyRate : 0;
        
        const workDaysPerMonth = safeData.workDaysPerWeek * 4.33;
        const totalPossibleHours = workDaysPerMonth * safeData.hoursPerDay;
        const lostHours = safeData.unpaidLeaveDays * safeData.hoursPerDay;

        // Calculate annual figures
        const annualGrossSalary = safeData.monthlySalary * 12;
        const annualTaxDeduction = annualGrossSalary * (safeData.taxRate / 100);
        const annualNetSalary = annualGrossSalary - annualTaxDeduction;
        const annualWorkHours = safeCalculations.totalWorkHoursPerMonth * 12;

        // Calculate daily rates
        const dailyGrossRate = safeCalculations.grossHourlyRate * safeData.hoursPerDay;
        const dailyNetRate = safeCalculations.netHourlyRate * safeData.hoursPerDay;
        
        // Calculate effective monthly daily rate (monthly income divided by actual work days)
        const effectiveMonthlyDailyRate = safeCalculations.actualWorkDaysPerMonth > 0 ? 
            (safeCalculations.netHourlyRate * safeCalculations.totalWorkHoursPerMonth) / safeCalculations.actualWorkDaysPerMonth : 0;

        // Time to afford item (with safe division) - use recalculated hours
        const daysToAfford = safeData.hoursPerDay > 0 ? actualHoursNeeded / safeData.hoursPerDay : 0;
        const weeksToAfford = safeData.workDaysPerWeek > 0 ? daysToAfford / safeData.workDaysPerWeek : 0;
        const monthsToAfford = safeCalculations.actualWorkDaysPerMonth > 0 ? daysToAfford / safeCalculations.actualWorkDaysPerMonth : 0;

        return {
            salaryStructure: [
                ['Monthly Gross Salary', `₹${safeData.monthlySalary.toLocaleString('en-IN')}`],
                ['Annual Gross Salary', `₹${annualGrossSalary.toLocaleString('en-IN')}`],
                ['Tax Rate Applied', `${safeData.taxRate}%`],
                ['Monthly Tax Deduction', `₹${(safeData.monthlySalary * safeData.taxRate / 100).toLocaleString('en-IN')}`],
                ['Annual Tax Deduction', `₹${annualTaxDeduction.toLocaleString('en-IN')}`],
                ['Monthly Net Income', `₹${(safeCalculations.netHourlyRate * safeCalculations.totalWorkHoursPerMonth).toLocaleString('en-IN')}`],
                ['Annual Net Income', `₹${annualNetSalary.toLocaleString('en-IN')}`]
            ],
            workSchedule: [
                ['Work Days per Week', `${safeData.workDaysPerWeek} days`],
                ['Hours per Work Day', `${safeData.hoursPerDay} hours`],
                ['Work Days per Month', `${workDaysPerMonth.toFixed(1)} days`],
                ['Unpaid Leave Days/Month', `${safeData.unpaidLeaveDays} days`],
                ['Actual Work Days/Month', `${safeCalculations.actualWorkDaysPerMonth.toFixed(1)} days`],
                ['Total Work Hours/Month', `${safeCalculations.totalWorkHoursPerMonth.toFixed(1)} hours`],
                ['Total Work Hours/Year', `${annualWorkHours.toFixed(0)} hours`],
                ['Lost Hours (Unpaid Leave)', `${lostHours.toFixed(1)} hours/month`]
            ],
            hourlyRates: [
                ['Gross Hourly Rate', `₹${safeCalculations.grossHourlyRate.toFixed(2)}/hour`],
                ['Net Hourly Rate (After Tax)', `₹${safeCalculations.netHourlyRate.toFixed(2)}/hour`],
                ['Gross Daily Rate', `₹${dailyGrossRate.toFixed(2)}/day`],
                ['Net Daily Rate (After Tax)', `₹${dailyNetRate.toFixed(2)}/day`],
                ['Effective Daily Rate', `₹${effectiveMonthlyDailyRate.toFixed(2)}/day`]
            ],
            itemAnalysis: [
                ['Item Name', safeData.itemName],
                ['Item Price', `₹${safeData.itemPrice.toLocaleString('en-IN')}`],
                ['Work Hours Required', `${actualHoursNeeded.toFixed(1)} hours`],
                ['Work Days Required', `${daysToAfford.toFixed(1)} days`],
                ['Work Weeks Required', `${weeksToAfford.toFixed(1)} weeks`],
                ['Work Months Required', `${monthsToAfford.toFixed(2)} months`],
                ['% of Monthly Income', safeCalculations.totalWorkHoursPerMonth > 0 ? `${((safeData.itemPrice / (safeCalculations.netHourlyRate * safeCalculations.totalWorkHoursPerMonth)) * 100).toFixed(1)}%` : '0%'],
                ['% of Annual Income', annualNetSalary > 0 ? `${((safeData.itemPrice / annualNetSalary) * 100).toFixed(2)}%` : '0%']
            ],
            comparison: [
                ['Hours of Coffee (₹200)', `${(safeData.itemPrice / 200).toFixed(0)} cups`],
                ['Days of Lunch (₹500)', `${(safeData.itemPrice / 500).toFixed(0)} lunches`],
                ['Movie Tickets (₹800)', `${(safeData.itemPrice / 800).toFixed(0)} tickets`],
                ['Monthly Rent (₹15000)', `${(safeData.itemPrice / 15000).toFixed(1)} months`],
                ['Smartphone (₹25000)', `${(safeData.itemPrice / 25000).toFixed(1)} phones`]
            ]
        };
    }

    displayResults(results, isRealTime = false) {
        // Apply color coding based on affordability
        ColorManager.applyResultColors(this.resultsSection, results.daysNeeded);
        
        // Update result values
        document.getElementById('resultItem').textContent = results.itemName;
        document.getElementById('resultPrice').textContent = `₹${results.itemPrice.toLocaleString('en-IN')}`;
        document.getElementById('resultHours').textContent = `${results.hoursNeeded.toFixed(1)} hours`;
        document.getElementById('resultDays').textContent = `${results.daysNeeded.toFixed(1)} days`;
        document.getElementById('resultHourlyRate').textContent = `₹${results.netHourlyRate.toFixed(2)}/hour`;
        document.getElementById('resultNetIncome').textContent = `₹${results.netMonthlySalary.toLocaleString('en-IN')}`;

        // Add affordability message
        const affordabilityMessage = ColorManager.getAffordabilityMessage(results.daysNeeded);
        const existingMessage = this.resultsSection.querySelector('.affordability-message');
        if (existingMessage) existingMessage.remove();
        
        const messageDiv = document.createElement('div');
        messageDiv.className = 'affordability-message';
        messageDiv.style.cssText = 'text-align: center; padding: 10px; margin: 15px 0; font-weight: bold; border-radius: 8px; background: var(--section-background);';
        messageDiv.textContent = affordabilityMessage;
        this.resultsSection.insertBefore(messageDiv, this.resultsSection.querySelector('.result-card'));

        // Add real-time indicator
        if (isRealTime) {
            const realtimeIndicator = document.createElement('div');
            realtimeIndicator.className = 'realtime-indicator';
            realtimeIndicator.style.cssText = 'text-align: center; padding: 5px; margin: 5px 0; font-size: 12px; color: var(--primary-color); opacity: 0.8;';
            realtimeIndicator.innerHTML = '⚡ Live calculation - results update as you type';
            this.resultsSection.insertBefore(realtimeIndicator, this.resultsSection.querySelector('.result-card'));
            
            // Remove indicator after 3 seconds
            setTimeout(() => {
                if (realtimeIndicator.parentNode) {
                    realtimeIndicator.remove();
                }
            }, 3000);
        }

        // Update detailed breakdown
        const breakdownContent = document.getElementById('breakdownContent');
        breakdownContent.innerHTML = this.renderDetailedBreakdown(results.breakdown);

        // Create progress bar
        ChartManager.createProgressBar(results.hoursNeeded, results.totalWorkHoursPerMonth, 'progressContainer');
        
        // Create chart
        ChartManager.createDoughnutChart(results.hoursNeeded, results.totalWorkHoursPerMonth);

        // Show results with animation (but gentler for real-time updates)
        this.resultsSection.classList.remove('hidden');
        
        // Only scroll to results on manual calculation, not real-time
        if (!isRealTime) {
            this.resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }

        // Add celebration if it's a reasonable purchase (only for manual calculations)
        if (results.daysNeeded <= 30 && !isRealTime) {
            this.showCelebration();
        }

        // Add subtle pulse animation for real-time updates
        if (isRealTime) {
            const resultCard = this.resultsSection.querySelector('.result-card');
            resultCard.style.animation = 'none';
            setTimeout(() => {
                resultCard.style.animation = 'pulse 0.3s ease-in-out';
            }, 10);
        }
    }

    showCelebration() {
        const resultCard = document.querySelector('.result-card');
        resultCard.style.animation = 'none';
        setTimeout(() => {
            resultCard.style.animation = 'pulse 0.6s ease-in-out';
        }, 10);
    }

    renderDetailedBreakdown(breakdown) {
        // Check if breakdown exists and has required properties
        if (!breakdown || typeof breakdown !== 'object') {
            return '<div class="breakdown-item">• Error: Unable to generate detailed breakdown</div>';
        }

        const sections = [
            { title: '💰 Salary Structure', data: breakdown.salaryStructure || [] },
            { title: '📅 Work Schedule', data: breakdown.workSchedule || [] },
            { title: '⏱️ Hourly Rates', data: breakdown.hourlyRates || [] },
            { title: '🎯 Item Analysis', data: breakdown.itemAnalysis || [] },
            { title: '📊 Price Comparison', data: breakdown.comparison || [] }
        ];

        return `
            <div class="detailed-breakdown">
                ${sections.map(section => `
                    <div class="breakdown-section">
                        <h4>${section.title}</h4>
                        <div class="breakdown-grid">
                            ${section.data.map(([label, value]) => `
                                <span class="breakdown-label">${label || 'N/A'}:</span>
                                <span class="breakdown-value ${this.getValueClass(label, value)}">${value || 'N/A'}</span>
                            `).join('')}
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    getValueClass(label, value) {
        if (label.toLowerCase().includes('deduction') || label.toLowerCase().includes('tax')) {
            return 'negative';
        }
        if (label.toLowerCase().includes('net') || label.toLowerCase().includes('income')) {
            return 'positive';
        }
        if (label.toLowerCase().includes('required') || label.toLowerCase().includes('hours')) {
            return 'highlight';
        }
        return '';
    }

    showSuccessMessage(message) {
        // Remove existing messages
        const existingMessage = document.querySelector('.message.success');
        if (existingMessage) {
            existingMessage.remove();
        }

        // Create and show success message
        const successDiv = document.createElement('div');
        successDiv.className = 'message success';
        successDiv.textContent = message;

        this.form.insertBefore(successDiv, this.form.firstChild);

        // Remove message after 3 seconds
        setTimeout(() => {
            successDiv.remove();
        }, 3000);
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

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', () => {
    // Initialize theme manager
    new ThemeManager();
    
    // Initialize calculator
    new WorkHoursCalculator();
    
    // Add keyboard shortcuts
    addKeyboardShortcuts();
});

function addKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
        // Ctrl/Cmd + Enter to submit form
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            e.preventDefault();
            const form = document.getElementById('calculatorForm');
            form.dispatchEvent(new Event('submit'));
        }
        
        // Ctrl/Cmd + D to toggle dark mode
        if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
            e.preventDefault();
            const themeToggle = document.querySelector('.theme-toggle');
            if (themeToggle) themeToggle.click();
        }
    });
}
