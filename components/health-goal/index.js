// index.js
Component({
  properties: {
    current: { type: Number, value: 65 },
    target: { type: Number, value: 60 }
  },
  computed: {
    progress() {
      return Math.min(100, (this.data.current / this.data.target) * 100);
    }
  }
});