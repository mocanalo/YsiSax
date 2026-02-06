class MidiCore {
    constructor() {
        this.midiAccess = null;
        this.inputs = [];
        this.listeners = [];
        this.isConnected = false;
    }

    async connect() {
        if (!navigator.requestMIDIAccess) {
            console.error("WebMIDI not supported");
            return false;
        }

        try {
            this.midiAccess = await navigator.requestMIDIAccess();
            this.inputs = this.midiAccess.inputs;
            this.isConnected = true;
            this.setupInputs();
            return true;
        } catch (err) {
            console.error("MIDI Access Failed", err);
            return false;
        }
    }

    setupInputs() {
        for (let input of this.inputs.values()) {
            input.onmidimessage = this.handleMessage.bind(this);
            console.log(`Connected to: ${input.name}`);
        }
    }

    handleMessage(message) {
        const [command, note, velocity] = message.data;
        // 144 = NoteOn
        if (command === 144 && velocity > 0) {
            this.notifyListeners(note, velocity);
        }
    }

    subscribe(callback) {
        this.listeners.push(callback);
    }

    unsubscribe(callback) {
        this.listeners = this.listeners.filter(cb => cb !== callback);
    }

    notifyListeners(note, velocity) {
        this.listeners.forEach(cb => cb(note, velocity));
    }
}

// Export singleton instance
const midiCore = new MidiCore();
// Make it globally available for simple script inclusion
window.midiCore = midiCore;
