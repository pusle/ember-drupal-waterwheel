module.exports = {
  normalizeEntityName: function() {
    return "ember-drupal-waterwheel";
  }, // no-op since we're just adding dependencies

  beforeInstall: function() {
    return this.addAddonsToProject({
        packages: [
          { name: 'ember-data-drupal', target: '^0.9.0' },
          { name: 'ember-simple-auth', target: '^1.2.1' }
        ]
      });
  }
};