Component({
  properties: {
    recipe: Object,
    showCalorie: {
      type: Boolean,
      value: true
    }
  },

  methods: {
    onTap() {
      this.triggerEvent('tap', this.properties.recipe);
    }
  }
});