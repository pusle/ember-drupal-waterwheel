# Ember-Drupal Waterwheel

This Ember addon provides blueprints to help you get your Ember application up-and-running with a 
Drupal website as the data/content backend. You can start a new Ember app from scratch and add 
these blueprints from the start, or add them to an existing Ember app.

The intent of this addon is to give Ember developers a set of tools to quickly integrate with 
a Drupal site for use as Ember Data's backend.

**Also check out [ember-drupal-waterwheel-app](https://github.com/acquia/ember-drupal-waterwheel-app) 
for a sample app that demonstrates some more advanced interactions with your Drupal backend.**

## Requirements

* [Git](https://git-scm.com/)
* [Node.js and npm](https://nodejs.org/)
* [Bower](https://bower.io/)
* [Ember CLI](https://ember-cli.com/)
* [PhantomJS](http://phantomjs.org/) (only required for tests)
* A [Drupal 8](https://www.drupal.org) site with your content

## Installation

* `ember install ember-drupal-waterwheel`

This adds a few support libraries to your project, as well as an Adapter and Serializer that 
handle JSON API communication with the Drupal backend. An Authenticator, Authorizer, and Session 
Service are also installed to manage OAuth2. Finally, a "user" model is added to store user entities
fetched from the Drupal backend (which is needed to support authentication.)

Some configuration settings are added to your app's `config/environment.js` file. These will need 
to be customized to point to your Drupal backend site and OAuth settings (see [Drupal Site 
Configuration](#drupal-site-configuration)), as well as to specify which Drupal entities you'll be
pulling data in for.

### Using Drupal Built-in Entities

If you'd also like to add models and routes to your app for Drupal's built-in entities 
(Articles, Tags, Files, and Basic Pages), You can run:
* `ember generate ember-drupal-article`
* `ember generate ember-drupal-tag`
* `ember generate ember-drupal-file`
* `ember generate ember-drupal-basic-page`

From here, you can generate Ember template files for these models as you typically would using 
the Ember CLI:
* `ember g template article`
* Edit the generated template file as desired
* and repeat...

### Using Custom Drupal Entities

1. Generate boilerplate model, route, and template files for your custom entity:
    * `ember generate ember-drupal-entity your_entity_machine_name`

1. Adjust the custom entity's model as needed to include all fields you're interested in.

1. Fill in the custom entity's template file to describe how the entity should be displayed.

See the 'article' model, route, and template files from [ember-drupal-waterwheel-app](https://github.com/acquia/ember-drupal-waterwheel-app) 
for an example of how these files might be implemented.

## Drupal Site Configuration

1. Your Drupal backend needs to have the JSON API and Simple OAuth contrib modules enabled. From your Drupal root, run:
    * `composer require "drupal/jsonapi" "drupal/simple_oauth:~2.0" -o`
    * `drush en -y jsonapi simple_oauth`

1. Generate encryption keys for OAuth:
    * `openssl genrsa -out private.key 2048`
    * `openssl rsa -in private.key -pubout > public.key`

1. On your Drupal site, browse to `/admin/config/people/simple_oauth` and enter the full paths to both encryption keys 
in the Simple OAuth Settings.

1. Browse to `/admin/config/people/simple_oauth/oauth2_client/add` to create OAuth client settings for this app. For 
"Label", specify something like "Ember Waterwheel app". Leave all other settings at their defaults and click "Save". 
Copy the UUID from the list of OAuth clients and paste it into this application's `config/environment.js` at the location 
marked with a @todo. Also fill in the Drupal site's URL in that same file.

1. CORS needs to be enabled on the Drupal site. Place/modify the following lines at the bottom of your 
`sites/default/services.yml` file:

```yaml
cors.config:
  enabled: true
  # Specify allowed headers, like 'x-allowed-header'.
  allowedHeaders: ['Content-Type', 'Access-Control-Allow-Headers', 'Authorization']
  # Specify allowed request methods, specify ['*'] to allow all possible ones.
  allowedMethods: ['POST', 'GET', 'OPTIONS', 'PATCH', 'DELETE']
  # Configure requests allowed from specific origins.
  allowedOrigins: ['*']
  # Sets the Access-Control-Expose-Headers header.
  exposedHeaders: true
  # Sets the Access-Control-Max-Age header.
  maxAge: false
  # Sets the Access-Control-Allow-Credentials header.
  supportsCredentials: true
```

Ideally, the `allowedOrigins` setting should be changed to a list of permitted origins from which 
your app will be served, such as:
```yaml
  allowedOrigins: ['localhost:4200', 'localhost:3000', 'yourbackendsite.com']
```

## Running / Development

* `ember serve`
* Visit your app at [http://localhost:4200](http://localhost:4200).

### Running Tests

* `npm test` (Runs `ember try:each` to test your addon against multiple Ember versions)
* `ember test`
* `ember test --server`

### Building

* `ember build` (development)
* `ember build --environment production` (production)

## Further Reading / Useful Links

* [ember.js](http://emberjs.com/)
* [ember-cli](https://ember-cli.com/)
* [Ember Data](https://github.com/emberjs/data)
* [Drupal JSON API module](http://https://www.drupal.org/project/jsonapi/)
* [ember-drupal-waterwheel-app](https://github.com/acquia/ember-drupal-waterwheel-app)
* [JSON API specification](http://jsonapi.org/format/)
* Ember development browser extensions:
  * [Ember Inspector for Chrome](https://chrome.google.com/webstore/detail/ember-inspector/bmdblncegkenkacieihfhpjfppoconhi)
  * [Ember Inspector for Firefox](https://addons.mozilla.org/en-US/firefox/addon/ember-inspector/)
