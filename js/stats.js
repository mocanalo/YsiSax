const GameStats = {
    KEY_BPM: 'ysisax_stats_bpm',
    KEY_STREAK: 'ysisax_stats_streak',

    // Data Structure: Object where keys are "Tonic|Scale"
    // Value: { bpm: Number, streak: Number }
    // Actually user wants Matrix: Rows (Tonics), Cols (Scales).
    // We can store as a single object with composite keys for simplicity, 
    // but the UI might need to iterate. 
    // "C_major" -> { maxBpm: 60, maxStreak: 12 }

    load() {
        this.bpmData = JSON.parse(localStorage.getItem(this.KEY_BPM)) || {};
        this.streakData = JSON.parse(localStorage.getItem(this.KEY_STREAK)) || {};
    },

    save() {
        localStorage.setItem(this.KEY_BPM, JSON.stringify(this.bpmData));
        localStorage.setItem(this.KEY_STREAK, JSON.stringify(this.streakData));
    },

    _getKey(tonic, scale) {
        return `${tonic}_${scale}`;
    },

    // Called when user hits 8 streaks and BPM increases
    recordLevelUp(tonic, scale, newBpm, isFullRange) {
        if (!isFullRange) return false;

        const key = this._getKey(tonic, scale);
        const currentMax = this.bpmData[key] || 0;

        if (newBpm > currentMax) {
            this.bpmData[key] = newBpm;
            this.save();
            console.log(`New Max BPM for ${key}: ${newBpm}`);
            return true; // Return true if new record
        }
        return false;
    },

    // Called on every hit to track streak
    // We track Max Streak PER BPM for that Scale? or Just Max Streak for Scale?
    // User said: "max streak reached for that BPM"
    // So we need a nested structure or composite key including BPM?
    // "C_major_60" -> maxStreak
    recordHit(tonic, scale, bpm, currentStreak, isFullRange) {
        if (!isFullRange) return false;

        // We probably want to track max streak for the *current* BPM setting.
        const key = `${tonic}_${scale}_${bpm}`;
        const currentMax = this.streakData[key] || 0;

        if (currentStreak > currentMax) {
            this.streakData[key] = currentStreak;
            this.save();
            // Optional: log or feedback
            // console.log(`New Max Streak for ${key}: ${currentStreak}`);
            return true;
        }
        return false;
    }
};

// Auto-load on include
GameStats.load();
