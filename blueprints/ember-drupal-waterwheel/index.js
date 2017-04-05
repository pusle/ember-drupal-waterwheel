const chalk = require('chalk');
const EOL = require('os').EOL;

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
  },

  afterInstall: function() {
    const appConfig
      = "      host: 'http://yourbackendsite.com',  // @todo - Fill in your Drupal backend URL" + EOL
      + "      oauth2TokenEndpoint: '/oauth/token'," + EOL
      + "      oauth2ClientId: '11111111-2222-3333-4444-555555555555',  // @todo - Fill in your client UUID" + EOL;

    const emberDataDrupalConfig
      = "  ENV.drupalEntityModels = {  // @todo - modify to map all entities you want to use" + EOL
      + "    \"article\": {},  // Map 'article' Ember data model to Drupal/JSON API type 'node--article'" + EOL
      + "    \"user\": { entity: 'user', bundle: 'user' },  // Map 'user' model to type 'user--user'" + EOL
      + "    \"tag\": { entity: 'taxonomy-term', bundle: 'tags' }  // Map 'tag' model to type 'taxonomy-term--tags'" + EOL
      + "  }" + EOL;

    return this.insertIntoFile('config/environment.js', appConfig, {
      after: "APP: {\n"
    }).then(() => {
      this.ui.writeLine(chalk.green('Added Drupal host and OAuth APP configuration to ') + 'config/environment.js');

      return this.insertIntoFile('config/environment.js', emberDataDrupalConfig, {
        before: '  if (environment ==='
      }).then(() => {
        this.ui.writeLine(chalk.green('Added emberDataDrupalConfig mapping to ') + 'config/environment.js');
      });
    });
  }
};
