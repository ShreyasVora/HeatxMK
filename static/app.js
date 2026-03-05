document.addEventListener('DOMContentLoaded', () => {
    // Navigation
    const tabButtons = document.querySelectorAll('.tab-btn');
    const views = {
        spinner: document.getElementById('view-spinner'),
        rules: document.getElementById('view-rules'),
        'item-details': document.getElementById('view-item-details')
    };

    function switchView(viewId) {
        // Update Buttons
        tabButtons.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.view === viewId);
        });

        // Update Sections
        Object.keys(views).forEach(id => {
            if (views[id]) {
                views[id].style.display = id === viewId ? 'block' : 'none';
            }
        });

        // Initialize views if needed
        if (viewId === 'item-details') {
            initializeItemDetailsView();
        } else if (viewId === 'rules') {
            initializeRulesView();
        }

        // Update URL hash without triggering reload
        if (location.hash !== `#${viewId}`) {
            history.pushState(null, null, `#${viewId}`);
        }
    }

    function handleRouting() {
        const hash = location.hash.replace('#', '') || 'spinner';
        if (views[hash]) {
            switchView(hash);
        } else {
            switchView('spinner');
        }
    }

    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => switchView(btn.dataset.view));
    });

    window.addEventListener('hashchange', handleRouting);

    // Initial Route
    handleRouting();

    // Make globally accessible for testing
    window.switchView = switchView;
    window.handleRouting = handleRouting;

    // View Initialization Logic
    let itemConfig = null;
    let chartInstance = null;

    async function loadItemConfig() {
        if (!itemConfig) {
            try {
                const response = await fetch('/api/config');
                itemConfig = await response.json();
            } catch (error) {
                console.error("Failed to load item config:", error);
            }
        }
    }

    async function initializeItemDetailsView() {
        await loadItemConfig();
        if (itemConfig) {
            populateItemSelector();
        }
    }

    async function initializeRulesView() {
        await loadItemConfig();
        if (itemConfig) {
            populateRulesList();
        }
    }

    function populateRulesList() {
        const rulesList = document.getElementById('rules-list');
        rulesList.innerHTML = itemConfig.items.map(item => `
            <div class="rule-item" data-name="${item.name}">
                <img src="${getImagePath(item)}" alt="${item.name}" class="rule-icon">
                <div class="rule-content">
                    <h3>${item.name}</h3>
                    <p>${item.description || "No description available."}</p>
                </div>
            </div>
        `).join('');
    }

    function getImagePath(item) {
        if (item && item.image_path) {
            return item.image_path;
        }
        return "images/items/placeholder.png"; // Fallback path
    }

    function populateItemSelector() {
        const itemList = document.getElementById('item-list');
        itemList.innerHTML = itemConfig.items.map(item => `
            <li data-name="${item.name}" title="${item.name}">
                <img src="${getImagePath(item)}" alt="${item.name}" class="selector-large-icon">
            </li>
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
        if (!item) {
            return;
        }

        const ctx = document.getElementById('distribution-chart').getContext('2d');
        const chartDesc = document.getElementById('chart-description');

        // Update description with image
        const desc = item.description || "No description available for this item.";
        const imgSrc = getImagePath(item);
        chartDesc.innerHTML = `
            <div class="desc-header">
                <img src="${imgSrc}" alt="${item.name}" class="desc-img">
                <strong>${item.name}</strong>
            </div>
            <p>${desc}</p>
        `;
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
            
            weightList.innerHTML = data.weights.map(item => {
                const itemMetadata = itemConfig ? itemConfig.items.find(i => i.name === item.name) : null;
                const imgSrc = getImagePath(itemMetadata);
                
                return `
                    <div class="weight-item visual-only" title="${item.name}: ${item.chance}%">
                        <img src="${imgSrc}" alt="${item.name}" class="large-thumbnail-img">
                        <span class="item-val">${item.chance}%</span>
                    </div>
                `;
            }).join('');
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
    loadItemConfig().then(() => {
        updateWeights();
    });

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
            const itemsToCycle = itemConfig ? itemConfig.items : [];
            
            const interval = setInterval(() => {
                if (itemsToCycle.length > 0) {
                    const randomItem = itemsToCycle[Math.floor(Math.random() * itemsToCycle.length)];
                    itemDisplay.innerHTML = `<img src="${randomItem.image_path}" alt="${randomItem.name}" class="spinner-img">`;
                } else {
                    itemDisplay.textContent = "...";
                }
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
            const imgSrc = getImagePath(data.metadata);
            itemDisplay.innerHTML = `<img src="${imgSrc}" alt="${data.name}" class="result-img">`;
            
            itemDisplay.classList.remove('spinning');
            itemDisplay.classList.add('selected');

            // Show description
            if (data.metadata) {
                const desc = data.metadata.description || "No description available for this item.";
                infoPanel.innerHTML = `
                    <div class="desc-header">
                        <img src="${imgSrc}" alt="${data.name}" class="desc-img">
                        <strong>${data.name}</strong>
                    </div>
                    <p>${desc}</p>
                `;
                infoPanel.style.display = 'block';
            }
            
            // Brief timeout before re-enabling
            setTimeout(() => {
                spinButton.disabled = false;
                itemDisplay.classList.remove('selected');
            }, 1000);

        } catch (error) {
            console.error("Finalize spin failed:", error);
            itemDisplay.textContent = "API ERROR";
            spinButton.disabled = false;
        }
    }
});
