/* eslint-env node */

var fs          = require('fs-extra');
var path        = require('path');
var chalk       = require('chalk');
var EOL         = require('os').EOL;
var EmberRouterGenerator = require('ember-router-generator');


module.exports = {
  description: 'Generates a model, route, and example template for a custom Drupal entity.',

  availableOptions: [
    {
      name: 'path',
      type: String,
    },
    {
      name: 'skip-router',
      type: Boolean,
      default: false
    }
  ],

  locals: function(options) {
    return { moduleName: options.entity.name };
  },

  afterInstall: function(options) {
    updateRouter.call(this, 'add', options);

    const emberDataDrupalConfig
      = `    \"${options.entity.name}\": {},  // @todo - Map Ember data model to custom Drupal/JSON API type`;

    return this.insertIntoFile('config/environment.js', emberDataDrupalConfig, {
      after: "ENV.drupalEntityModels = {\n"
    }).then(() => {
      this.ui.writeLine(chalk.green('Added emberDataDrupalConfig mapping to ') + 'config/environment.js');
    });
  },

  afterUninstall: function(options) {
    updateRouter.call(this, 'remove', options);
  }
};

function updateRouter(action, options) {
  var name = options.entity.name;
  var actionColorMap = {
    add: 'green',
    remove: 'red'
  };
  var color = actionColorMap[action] || 'gray';
  options.path = options.path || `/${options.entity.name}/:id`;

  writeRoute(action, name, options);

  this.ui.writeLine('updating router');
  this._writeStatusToUI(chalk[color], action + ' route', name);
}

function findRouter(options) {
  var routerPathParts = [options.project.root];

  routerPathParts = routerPathParts.concat(['app', 'router.js']);

  return routerPathParts;
}

function writeRoute(action, name, options) {
  var routerPath = path.join.apply(null, findRouter(options));
  var source = fs.readFileSync(routerPath, 'utf-8');

  var routes = new EmberRouterGenerator(source);
  var newRoutes = routes[action](name, options);

  fs.writeFileSync(routerPath, newRoutes.code());
}
