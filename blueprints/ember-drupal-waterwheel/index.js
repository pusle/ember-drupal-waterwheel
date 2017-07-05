var RSVP = require('rsvp');
var chalk = require('chalk');
var EOL = require('os').EOL;
var Blueprint = require('ember-cli/lib/models/blueprint');

module.exports = {
  description: "Generates an adapter, serializer, and service for integrating with a Drupal backend. Also generates models for Drupal's built-in entities.",

  normalizeEntityName: function() {
    return "ember-drupal-waterwheel";
  },

  afterInstall: function() {
    var self = this;
    return this.ui.prompt([
      {
        type: 'confirm',
        name: 'article',
        message: 'Generate model, route, and template for Drupal "Article" entities?',
        default: true,
      },
      {
        type: 'confirm',
        name: 'file',
        message: 'Generate model, route, and template for Drupal "File" entities?',
        default: true,
      },
      {
        type: 'confirm',
        name: 'tag',
        message: 'Generate model, route, and template for Drupal "Tags" taxonomy terms?',
        default: true,
      },
      {
        type: 'confirm',
        name: 'oauth',
        message: 'Use OAuth 2.0 for authentication to the Drupal backend?',
        default: true,
      },
    ]).then(function(data) {

      return self.entityBlueprint('article', data.article)
        .then(self.entityBlueprint('file', data.file))
        .then(self.entityBlueprint('tag', data.tag))
        .then(self.oauth2Blueprint(data.oauth))
        .then(self.configureEnvironment());
    });
  },

  entityBlueprint: function(name, run = true) {
    let blueprintName = `drupal-${name}`;

    return new RSVP.Promise(() => {
      if (run) {
        let projectPaths = this.project ? this.project.blueprintLookupPaths() : [];
        let blueprint = Blueprint.lookup(blueprintName, { paths: projectPaths });

        // Clone 'options' adding the 'path' to pass into the blueprint
        let options = {
          target: this.options.target,
          project: this.options.project,
          pod: this.options.pod,
          dryRun: this.options.dryRun,
          ui: this.options.ui,
          path: `/${name}/:id`
        };

        return blueprint.install(options);
      }
    });
  },

  oauth2Blueprint: function(run = true) {
    return new RSVP.Promise(() => {
      if (run) {
        let projectPaths = this.project ? this.project.blueprintLookupPaths() : [];
        let blueprint = Blueprint.lookup('drupal-oauth2', { paths: projectPaths });

        // Clone 'options' adding the 'path' to pass into the blueprint
        let options = {
          target: this.options.target,
          project: this.options.project,
          pod: this.options.pod,
          dryRun: this.options.dryRun,
          ui: this.options.ui,
          path: `/login`
        };

        return blueprint.install(options);
      }
    });
  },

  configureEnvironment: function() {
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

    const self = this;

    self.insertIntoFile('config/environment.js', appConfig, {
      after: "APP: {\n"
    }).then(() => {
      return self.insertIntoFile('config/environment.js', emberDataDrupalConfig, {
          before: "  if (environment ==="
        })
        .then(() => {
          this.ui.writeLine(chalk.green('Added Drupal integration configuration to ') + 'config/environment.js');
        });
    });
  }
};
