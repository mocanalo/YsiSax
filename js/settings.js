const Settings = {
    KEY: 'ysisax_transposition',

    getTransposition() {
        return localStorage.getItem(this.KEY) || 'C';
    },

    setTransposition(scale) {
        localStorage.setItem(this.KEY, scale);
        console.log(`Transposition set to: ${scale}`);
    },

    initModal() {
        // Only run if elements exist (e.g., on index.html)
        const modal = document.getElementById('settings-modal');
        const btn = document.getElementById('settings-card');
        const closeSpan = document.getElementsByClassName('close-btn')[0];
        const inputs = document.querySelectorAll('input[name="transposition"]');

        if (!modal || !btn) return;

        // Toggle Settings Menu
        btn.onclick = () => {
            if (modal.style.display === "block") {
                modal.style.display = "none";
            } else {
                modal.style.display = "block";
                // Pre-select current
                const current = this.getTransposition();
                const radio = document.querySelector(`input[value="${current}"]`);
                if (radio) radio.checked = true;
            }
        }

        // Close
        closeSpan.onclick = () => {
            modal.style.display = "none";
        }

        // Click outside to close
        window.onclick = (event) => {
            if (event.target == modal) {
                modal.style.display = "none";
            }
        }

        // Save on change
        inputs.forEach(input => {
            input.addEventListener('change', (e) => {
                this.setTransposition(e.target.value);
            });
        });
    }
};

window.Settings = Settings;
