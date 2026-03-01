document.addEventListener('DOMContentLoaded', () => {
    const spinButton = document.getElementById('spin-button');
    const itemDisplay = document.getElementById('item-display');
    const distanceInput = document.getElementById('distance');

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
