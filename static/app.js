document.addEventListener('DOMContentLoaded', () => {
    // Navigation
    const tabButtons = document.querySelectorAll('.tab-btn');
    const views = {
        spinner: document.getElementById('view-spinner'),
        distributions: document.getElementById('view-distributions')
    };

    function switchView(viewId) {
        // Update Buttons
        tabButtons.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.view === viewId);
        });

        // Update Sections
        Object.keys(views).forEach(id => {
            views[id].style.display = id === viewId ? 'block' : 'none';
        });

        // If switching to distributions, we might need to initialize the chart
        if (viewId === 'distributions') {
            initializeDistributionsView();
        }
    }

    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => switchView(btn.dataset.view));
    });

    // Distribution View Logic
    let itemConfig = null;
    let chartInstance = null;

    async function initializeDistributionsView() {
        if (!itemConfig) {
            try {
                const response = await fetch('/api/config');
                itemConfig = await response.json();
                populateItemSelector();
            } catch (error) {
                console.error("Failed to load item config:", error);
            }
        }
    }

    function populateItemSelector() {
        const itemList = document.getElementById('item-list');
        itemList.innerHTML = itemConfig.items.map(item => `
            <li data-name="${item.name}">${item.name}</li>
        `).join('');

        itemList.querySelectorAll('li').forEach(li => {
            li.addEventListener('click', () => {
                itemList.querySelectorAll('li').forEach(el => el.classList.remove('active'));
                li.classList.add('active');
                renderCurve(li.dataset.name);
            });
        });

        // Select first item by default
        if (itemConfig.items.length > 0) {
            itemList.querySelector('li').click();
        }
    }

    function renderCurve(itemName) {
        const item = itemConfig.items.find(i => i.name === itemName);
        if (!item) return;

        const ctx = document.getElementById('distribution-chart').getContext('2d');
        const chartDesc = document.getElementById('chart-description');

        // Update description
        const desc = item.description || "No description available for this item.";
        chartDesc.innerHTML = `<strong>${item.name}:</strong> ${desc}`;
        chartDesc.style.display = 'block';
        
        // Transform curve [distance, weight] to Chart.js data
        const data = item.weight_curve.map(p => ({ x: p[0], y: p[1] }));

        if (chartInstance) {
            chartInstance.destroy();
        }

        chartInstance = new Chart(ctx, {
            type: 'line',
            data: {
                datasets: [{
                    label: `${itemName} Weight Distribution`,
                    data: data,
                    borderColor: '#007bff',
                    backgroundColor: 'rgba(0, 123, 255, 0.1)',
                    fill: true,
                    tension: 0, // Linear interpolation
                    pointRadius: 5,
                    pointHoverRadius: 7
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: {
                        type: 'linear',
                        title: { display: true, text: 'Distance to First Place' },
                        min: 0,
                        max: 120
                    },
                    y: {
                        title: { display: true, text: 'Weight' },
                        beginAtZero: true
                    }
                },
                plugins: {
                    legend: { display: true, position: 'top' }
                }
            }
        });
    }

    // Make switchView globally accessible for testing
    window.switchView = switchView;

    // Spinner Logic
    const spinButton = document.getElementById('spin-button');
    const itemDisplay = document.getElementById('item-display');
    const distanceInput = document.getElementById('distance');
    const weightList = document.getElementById('weight-list');
    const infoPanel = document.getElementById('item-info-panel');

    async function updateWeights() {
        const distance = parseInt(distanceInput.value) || 0;
        if (distance < 0) return;

        try {
            const response = await fetch(`/api/weights?distance=${distance}`);
            const data = await response.json();
            
            weightList.innerHTML = data.weights.map(item => `
                <div class="weight-item">
                    <span class="item-name">${item.name}</span>
                    <span class="item-val">${item.chance}%</span>
                </div>
            `).join('');
        } catch (error) {
            console.error("Failed to fetch weights:", error);
        }
    }

    // Debounce to prevent too many API calls
    let timeout = null;
    distanceInput.addEventListener('input', () => {
        clearTimeout(timeout);
        timeout = setTimeout(updateWeights, 300);
    });

    // Initial update
    updateWeights();

    const commonItems = ["Mushroom", "Banana", "Red Shell", "Green Shell", "Star", "Blue Shell", "Lightning"];

    spinButton.addEventListener('click', async () => {
        const distance = parseInt(distanceInput.value) || 0;
        
        if (distance < 0) {
            alert("Distance must be non-negative");
            return;
        }

        // Disable button during spin
        spinButton.disabled = true;
        itemDisplay.classList.add('spinning');
        infoPanel.style.display = 'none';

        try {
            // Start fetch early
            const responsePromise = fetch(`/api/item?distance=${distance}`);
            
            // Animation: Cycle through items
            let cycleCount = 0;
            const maxCycles = 15;
            const interval = setInterval(() => {
                const randomItem = commonItems[Math.floor(Math.random() * commonItems.length)];
                itemDisplay.textContent = randomItem;
                cycleCount++;

                if (cycleCount >= maxCycles) {
                    clearInterval(interval);
                    finalizeSpin(responsePromise);
                }
            }, 100);

        } catch (error) {
            console.error("Spin failed:", error);
            itemDisplay.textContent = "ERROR";
            spinButton.disabled = false;
        }
    });

    async function finalizeSpin(responsePromise) {
        try {
            const response = await responsePromise;
            if (!response.ok) throw new Error("API error");
            
            const data = await response.json();
            
            // Set final item
            itemDisplay.textContent = data.name;
            itemDisplay.classList.remove('spinning');
            itemDisplay.classList.add('selected');

            // Show description
            if (data.metadata) {
                const desc = data.metadata.description || "No description available for this item.";
                infoPanel.innerHTML = `<strong>${data.name}:</strong> ${desc}`;
                infoPanel.style.display = 'block';
            }
            
            // Brief timeout before re-enabling
            setTimeout(() => {
                spinButton.disabled = false;
                itemDisplay.classList.remove('selected');
            }, 1000);

        } catch (error) {
            itemDisplay.textContent = "API ERROR";
            spinButton.disabled = false;
        }
    }
});
