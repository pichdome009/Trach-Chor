document.addEventListener('DOMContentLoaded', function () {
    const provinceSelect = document.getElementById('province');
    const daysInput = document.getElementById('days');
    const peopleInput = document.getElementById('people');
    const transportSelect = document.getElementById('transport');
    const hotelSelect = document.getElementById('hotel');
    const foodSelect = document.getElementById('food');
    const btnCalculate = document.getElementById('btnCalculate');

    const totalBudgetEl = document.getElementById('totalBudget');
    const costTransportEl = document.getElementById('costTransport');
    const costHotelEl = document.getElementById('costHotel');
    const costFoodEl = document.getElementById('costFood');
    const costActivitiesEl = document.getElementById('costActivities');
    
    let breakdownChart = null;
    let currentTotalCost = 0;

    function formatMoney(amount) {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
    }

    function extractPrice(str) {
        if (!str) return 0;
        const match = str.match(/\$(\d+)/);
        if (match) return parseInt(match[1]);
        const num = parseInt(str);
        return isNaN(num) ? 0 : num;
    }

    function calculateBudget() {
        if(!provinceSelect || !daysInput || !peopleInput) return;

        const days = parseInt(daysInput.value) || 1;
        const people = parseInt(peopleInput.value) || 1;
        const nights = days > 1 ? days - 1 : 1;

        // Base Costs from Dropdowns
        const provinceBase = extractPrice(provinceSelect.value) || 0;
        const transportPrice = extractPrice(transportSelect.value) || 0;
        const hotelCostPerNight = extractPrice(hotelSelect.value) || 0;
        const foodCostPerDayPerPerson = extractPrice(foodSelect.value) || 0;

        // Calculations
        let transportCost = 0;
        if (transportSelect.value.includes('តាក់ស៊ី')) {
            transportCost = transportPrice * days;
        } else {
            transportCost = transportPrice * people; // default for flight, bus, etc.
        }

        const roomsNeeded = Math.ceil(people / 2);
        const hotelCost = roomsNeeded * nights * hotelCostPerNight;
        const foodCost = foodCostPerDayPerPerson * people * days;
        const activityCost = provinceBase * people * days;

        currentTotalCost = transportCost + hotelCost + foodCost + activityCost;
        const totalCost = currentTotalCost;

        // Update DOM
        totalBudgetEl.textContent = formatMoney(totalCost);
        costTransportEl.textContent = formatMoney(transportCost);
        costHotelEl.textContent = formatMoney(hotelCost);
        costFoodEl.textContent = formatMoney(foodCost);
        costActivitiesEl.textContent = formatMoney(activityCost);

        updateChart(transportCost, hotelCost, foodCost, activityCost);
    }

    function updateChart(transport, hotel, food, activity) {
        const chartEl = document.getElementById('budgetChart');
        if(!chartEl) return;
        const ctx = chartEl.getContext('2d');
        
        const data = {
            labels: ['យានជំនិះ', 'ការស្នាក់នៅ', 'អាហារ', 'សកម្មភាពផ្សេងៗ'],
            datasets: [{
                data: [transport, hotel, food, activity],
                backgroundColor: ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b'],
                borderWidth: 0,
                hoverOffset: 4
            }]
        };

        if (breakdownChart) {
            breakdownChart.data = data;
            breakdownChart.update();
        } else {
            breakdownChart = new Chart(ctx, {
                type: 'doughnut',
                data: data,
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'bottom',
                            labels: {
                                font: { family: "'Kantumruy Pro', sans-serif", size: 14 }
                            }
                        }
                    },
                    cutout: '70%'
                }
            });
        }
    }

    
    // Auto calculate on change
    [provinceSelect, transportSelect, hotelSelect, foodSelect].forEach(el => {
        if(el) el.addEventListener('change', calculateBudget);
    });
    [daysInput, peopleInput].forEach(el => {
        if(el) el.addEventListener('input', calculateBudget);
    });
    
    
    const btnBookNow = document.getElementById('btnBookNow');
    if (btnBookNow) {
        btnBookNow.addEventListener('click', () => {
            localStorage.setItem('grandTotal', currentTotalCost.toFixed(2));
            // Add a nice visual effect or sweet alert if you want, but simple redirect works for static
            window.location.href = 'booking-payment.html';
        });
    }

    if(btnCalculate) {
        btnCalculate.addEventListener('click', calculateBudget);
    }
    
    // Initial calculate
    calculateBudget();
});
