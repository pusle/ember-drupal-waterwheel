const chalk = require('chalk');
const EOL = require('os').EOL;

module.exports = {
  description: "Generates an adapter, serializer, and service for integrating with a Drupal backend. Also generates models for Drupal's built-in entities.",

  normalizeEntityName: function() {
    return "ember-drupal-waterwheel";
  },

  beforeInstall: function() {
    return this.addAddonsToProject({
        packages: [
          { name: 'ember-data-drupal', target: '^0.9.0' },
        ]
      });
  },

  afterInstall: function() {
    const appConfig
      = "      host: 'http://yourbackendsite.com',  // @todo - Fill in your Drupal backend URL" + EOL
      + "      oauth2TokenEndpoint: '/oauth/token'," + EOL
      + "      oauth2ClientId: '11111111-2222-3333-4444-555555555555',  // @todo - Fill in your client UUID" + EOL;

    const emberDataDrupalConfig
      = "  // Map Drupal Entities to Ember models with simplified one-part names" + EOL
      + "  ENV.drupalEntityModels = {" + EOL
      + "    // @todo - map any additional Drupal entities you want to use" + EOL
      + "    \"article\": {},  // Map 'article' Ember data model to Drupal/JSON API type 'node--article'" + EOL
      + "    \"user\": { entity: 'user', bundle: 'user' },  // Map 'user' model to 'user--user'" + EOL
      + "    \"file\": { entity: 'file', bundle: 'file' },  // Map 'file' model to 'file--file'" + EOL
      + "    \"tag\": { entity: 'taxonomy_term', bundle: 'tags' }  // Map 'tag' model to 'taxonomy-term--tags'" + EOL
      + "  };" + EOL;

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
