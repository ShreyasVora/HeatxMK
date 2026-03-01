// Simple test runner for the frontend
function assert(condition, message) {
    if (!condition) {
        throw new Error(message || "Assertion failed");
    }
}

function testTabSwitching() {
    console.log("Running testTabSwitching...");
    
    // Setup: ensure views are in initial state
    const spinnerView = document.getElementById('view-spinner');
    const distView = document.getElementById('view-distributions');
    const spinnerBtn = document.querySelector('[data-view="spinner"]');
    const distBtn = document.querySelector('[data-view="distributions"]');

    // Initial state check
    assert(spinnerView.style.display !== 'none', "Spinner view should be visible initially");
    assert(distView.style.display === 'none', "Distributions view should be hidden initially");

    // Action: Switch to distributions
    if (typeof switchView === 'function') {
        switchView('distributions');
        
        assert(spinnerView.style.display === 'none', "Spinner view should be hidden after switch");
        assert(distView.style.display !== 'none', "Distributions view should be visible after switch");
        assert(!spinnerBtn.classList.contains('active'), "Spinner button should not be active");
        assert(distBtn.classList.contains('active'), "Distributions button should be active");
        
        console.log("testTabSwitching passed!");
    } else {
        throw new Error("switchView function not defined");
    }
}

// To run this, we would normally include it in a test page or the main page.
// For now, we'll just define it.
