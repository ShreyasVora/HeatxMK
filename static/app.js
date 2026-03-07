document.addEventListener('DOMContentLoaded', () => {
    // State
    let itemConfig = null;
    let chartInstance = null;

    // UI Elements
    const tabButtons = document.querySelectorAll('.tab-btn');
    const views = {
        spinner: document.getElementById('view-spinner'),
        rules: document.getElementById('view-rules'),
        'item-details': document.getElementById('view-item-details')
    };
    const spinButton = document.getElementById('spin-button');
    const itemDisplay = document.getElementById('item-display');
    const distanceInput = document.getElementById('distance');
    const weightList = document.getElementById('weight-list');
    const infoPanel = document.getElementById('item-info-panel');

    // Navigation Logic
    function switchView(viewId, metadata = {}) {
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
            initializeItemDetailsView(metadata.targetItem);
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

    // Helper: Get Image Path
    function getImagePath(item) {
        if (item && item.image_path) {
            return item.image_path;
        }
        return "images/items/placeholder.png"; 
    }

    // View Initialization Logic
    async function loadItemConfig() {
        if (!itemConfig) {
            try {
                const response = await fetch('/api/config');
                itemConfig = await response.json();
                
                // Set version display
                const versionDisplay = document.getElementById('version-display');
                if (versionDisplay && itemConfig.version) {
                    versionDisplay.textContent = `v${itemConfig.version}`;
                }
            } catch (error) {
                console.error("Failed to load item config:", error);
            }
        }
    }

    async function initializeItemDetailsView(targetItem = null) {
        await loadItemConfig();
        if (itemConfig) {
            populateItemSelector();
            if (targetItem) {
                const selector = document.querySelector(`#item-list li[data-name="${targetItem}"]`);
                if (selector) selector.click();
            }
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
                    <div class="rule-header">
                        <h3>${item.name}</h3>
                        <span class="timing-badge">${item.usage_timing || "N/A"}</span>
                    </div>
                    <p>${item.description || "No description available."}</p>
                    <div class="coin-meta">
                        ${item.coin_reward !== "0" ? `<span class="reward">Reward: ${item.coin_reward}</span>` : ""}
                        ${item.coin_cost !== "0" ? `<span class="cost">Cost: ${item.coin_cost}</span>` : ""}
                    </div>
                </div>
            </div>
        `).join('');

        // Navigation to details
        rulesList.querySelectorAll('.rule-item').forEach(item => {
            item.addEventListener('click', () => {
                switchView('item-details', { targetItem: item.dataset.name });
            });
        });
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
        if (!item) return;

        const ctx = document.getElementById('distribution-chart').getContext('2d');
        const chartDesc = document.getElementById('chart-description');

        const desc = item.description || "No description available for this item.";
        const imgSrc = getImagePath(item);
        chartDesc.innerHTML = `
            <div class="desc-header">
                <img src="${imgSrc}" alt="${item.name}" class="desc-img">
                <div class="header-text">
                    <strong>${item.name}</strong>
                    <span class="timing-badge">${item.usage_timing || "N/A"}</span>
                </div>
            </div>
            <p>${desc}</p>
            <div class="coin-meta">
                ${item.coin_reward !== "0" ? `<span class="reward">Reward: ${item.coin_reward}</span>` : ""}
                ${item.coin_cost !== "0" ? `<span class="cost">Cost: ${item.coin_cost}</span>` : ""}
            </div>
        `;
        chartDesc.style.display = 'block';
        
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
                    tension: 0,
                    pointRadius: 5,
                    pointHoverRadius: 7
                }]
            },
            options: {
                responsive: true, maintainAspectRatio: false,
                scales: {
                    x: { type: 'linear', title: { display: true, text: 'Distance' }, min: 0, max: 30 },
                    y: { title: { display: true, text: 'Weight' }, beginAtZero: true }
                }
            }
        });
    }

    const itemColors = {
        "Banana": "#FFE135",
        "Red Shell": "#FF0000",
        "Mushroom": "#E74C3C",
        "Star": "#F1C40F",
        "Blue Shell": "#3498DB",
        "Bullet Bill": "#34495E",
        "Yellow Coin": "#F39C12",
        "Red Coin": "#C0392B",
        "Green Shell": "#2ECC71",
        "Fire Flower": "#E67E22",
        "Ice Flower": "#AED6F1",
        "Lightning": "#9B59B6",
        "Blooper": "#2C3E50",
        "Golden Mushroom": "#D4AC0D"
    };

    let currentRotation = 0;
    let wheelWeights = [];

    function drawWheel(weights) {
        const svg = document.getElementById('wheel-svg');
        svg.innerHTML = '';
        wheelWeights = weights;

        if (weights.length === 0) return;

        let cumulativePercent = 0;
        const centerX = 250;
        const centerY = 250;
        const radius = 240;

        weights.forEach((item, index) => {
            const startAngle = (cumulativePercent / 100) * 360;
            const endAngle = ((cumulativePercent + item.chance) / 100) * 360;
            cumulativePercent += item.chance;

            // Save angles for landing calculation
            item.startAngle = startAngle;
            item.endAngle = endAngle;

            // Create Path
            const x1 = centerX + radius * Math.cos(Math.PI * startAngle / 180);
            const y1 = centerY + radius * Math.sin(Math.PI * startAngle / 180);
            const x2 = centerX + radius * Math.cos(Math.PI * endAngle / 180);
            const y2 = centerY + radius * Math.sin(Math.PI * endAngle / 180);

            const largeArcFlag = item.chance > 50 ? 1 : 0;
            const pathData = `M ${centerX} ${centerY} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;

            const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
            path.setAttribute("d", pathData);
            path.setAttribute("fill", itemColors[item.name] || "#ccc");
            path.setAttribute("class", "wheel-slice");
            svg.appendChild(path);

            // Add Icon
            if (item.chance > 4) {
                const midAngle = startAngle + (item.chance / 2);
                const iconRadius = radius * 0.65;
                const iconX = centerX + iconRadius * Math.cos(Math.PI * midAngle / 180);
                const iconY = centerY + iconRadius * Math.sin(Math.PI * midAngle / 180);

                const itemMetadata = itemConfig ? itemConfig.items.find(i => i.name === item.name) : null;
                const imgSrc = getImagePath(itemMetadata);

                const image = document.createElementNS("http://www.w3.org/2000/svg", "image");
                image.setAttributeNS("http://www.w3.org/1999/xlink", "href", imgSrc);
                image.setAttribute("x", iconX - 35);
                image.setAttribute("y", iconY - 35);
                image.setAttribute("width", "70");
                image.setAttribute("height", "70");
                image.setAttribute("class", "wheel-icon");
                // Rotate icon to face center
                image.setAttribute("transform", `rotate(${midAngle + 90}, ${iconX}, ${iconY})`);
                svg.appendChild(image);
            }
        });
    }

    // Spinner Logic
    async function updateWeights() {
        const distance = parseInt(distanceInput.value) || 0;
        if (distance < 0) return;

        try {
            const response = await fetch(`/api/weights?distance=${distance}`);
            const data = await response.json();
            
            drawWheel(data.weights);

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

    async function finalizeSpin(responsePromise) {
        try {
            const response = await responsePromise;
            const data = await response.json();
            
            // Calculate landing angle
            const item = wheelWeights.find(w => w.name === data.name);
            if (item) {
                const targetSliceAngle = (item.startAngle + item.endAngle) / 2;
                // Wheel is rotated -90 initially to make 0deg be at top.
                // We want targetSliceAngle to be at the top (0deg in SVG space).
                // But the pointer is at the top.
                // The wheel rotates clockwise.
                // If slice is at 90deg, we need to rotate wheel 270deg (or -90) to put it at top.
                // Calculation: (360 - targetSliceAngle)
                const extraRotation = (360 - targetSliceAngle);
                
                // Add 5-10 full rotations
                currentRotation += (360 * 5) + extraRotation - (currentRotation % 360);
                
                const wheelContainer = document.querySelector('.wheel-canvas-container');
                wheelContainer.style.transform = `rotate(${currentRotation}deg)`;

                // Wait for animation
                setTimeout(async () => {
                    const imgSrc = getImagePath(data.metadata);
                    
                    itemDisplay.innerHTML = `<img src="${imgSrc}" alt="${data.name}" class="result-img">`;
                    itemDisplay.classList.remove('spinning');
                    itemDisplay.classList.add('selected');

                    if (data.metadata) {
                        const desc = data.metadata.description || "No description available.";
                        infoPanel.innerHTML = `
                            <div class="desc-header">
                                <img src="${imgSrc}" alt="${data.name}" class="desc-img">
                                <div class="header-text">
                                    <strong>${data.name}</strong>
                                    <span class="timing-badge">${data.metadata.usage_timing || "N/A"}</span>
                                </div>
                            </div>
                            <p>${desc}</p>
                            <div class="coin-meta">
                                ${data.metadata.coin_reward !== "0" ? `<span class="reward">Reward: ${data.metadata.coin_reward}</span>` : ""}
                                ${data.metadata.coin_cost !== "0" ? `<span class="cost">Cost: ${data.metadata.coin_cost}</span>` : ""}
                            </div>
                        `;
                        infoPanel.style.display = 'block';
                    }
                    
                    spinButton.disabled = false;
                    setTimeout(() => itemDisplay.classList.remove('selected'), 1000);
                }, 4000); // Match CSS transition
            }
        } catch (error) {
            console.error("Finalize spin failed:", error);
            itemDisplay.textContent = "API ERROR";
            spinButton.disabled = false;
        }
    }

    // Event Listeners
    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => switchView(btn.dataset.view));
    });

    window.addEventListener('hashchange', handleRouting);

    let timeout = null;
    distanceInput.addEventListener('input', () => {
        clearTimeout(timeout);
        timeout = setTimeout(updateWeights, 300);
    });

    spinButton.addEventListener('click', async () => {
        const distance = parseInt(distanceInput.value) || 0;
        if (distance < 0) { alert("Distance must be non-negative"); return; }

        spinButton.disabled = true;
        itemDisplay.classList.add('spinning');
        itemDisplay.textContent = "SPINNING";
        infoPanel.style.display = 'none';

        const responsePromise = fetch(`/api/item?distance=${distance}`);
        finalizeSpin(responsePromise);
    });

    const clearButton = document.getElementById('clear-button');

    clearButton.addEventListener('click', () => {
        itemDisplay.innerHTML = "READY?";
        itemDisplay.classList.remove('selected', 'spinning');
        infoPanel.style.display = 'none';
        spinButton.disabled = false;

        // Reset wheel rotation
        currentRotation = 0;
        const wheelContainer = document.querySelector('.wheel-canvas-container');
        wheelContainer.style.transition = 'transform 1s ease-in-out';
        wheelContainer.style.transform = `rotate(0deg)`;
        
        // Restore original slow transition after reset finishes
        setTimeout(() => {
            wheelContainer.style.transition = 'transform 4s cubic-bezier(0.15, 0, 0.15, 1)';
        }, 1000);
    });

    // Global Hooks for Testing
    window.switchView = switchView;
    window.handleRouting = handleRouting;

    // Bootstrap
    loadItemConfig().then(() => {
        handleRouting(); // This now happens AFTER itemConfig is available or being fetched
        updateWeights();
    });
});
