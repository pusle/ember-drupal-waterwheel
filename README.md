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

If you have not yet created an Ember application, generate a new one:

* `ember new your-new-app-name`

and get rid of the welcome message that is added by default by removing these lines from `app/templates/application.hbs`:
```handlebars
{{!-- The following component displays Ember's default welcome message. --}}
{{welcome-page}}
{{!-- Feel free to remove this! --}}
```

Install the ember-drupal-waterwheel addon:

* `ember install ember-drupal-waterwheel`

This adds a few support libraries to your project, as well as an Adapter and Serializer that 
handle JSON API communication with the Drupal backend. An Authenticator, Authorizer, and Session 
Service are also installed to manage OAuth2. Finally, a "user" model is added to store user entities
fetched from the Drupal backend (which is needed to support authentication and storing ownership of entities.)

Some configuration settings are added to your app's `config/environment.js` file. These will need 
to be customized to point to your Drupal backend site and OAuth settings (see [Drupal Site 
Configuration](#drupal-site-configuration)) as needed, as well as to specify which Drupal entities you'll be
pulling data in for. Search for "@todo" to find thing that will need to be customized for your application.

### Using Drupal Built-in Entities

If you'd also like to add models, routes, and templates to your app for Drupal's built-in entities
(Articles, Tags, Files, and Basic Pages), You can run:
* `ember generate drupal-article`
* `ember generate drupal-tag`
* `ember generate drupal-file`
* `ember generate drupal-basic-page`

From here, you can edit the Ember template files for these models as you typically would using
the Ember CLI. It's also a good idea to search for "@todo" in the generated files, to see if there
are customizations or coding choices you can make.

### Using Custom Drupal Entities

1. Generate boilerplate model, route, and template files for your custom entity/content type (a one-word, simplified `entity_name` is 
highly recommended):
    * `ember generate drupal-entity entity_name`
    
1. Adjust the custom entity's model as needed to include all fields you're interested in from the Drupal entity

1. Configure mapping of the Drupal entity to the Ember model in `config/environment.js` (see @todo)

1. Fill in the custom entity's template file to describe how the entity should be displayed

See the "article" model, route, and template files from [ember-drupal-waterwheel-app](https://github.com/acquia/ember-drupal-waterwheel-app) 
for an example of how these files might be implemented.

## Drupal Site Configuration

1. Your Drupal backend needs to have the JSON API contrib module enabled. From your Drupal root, run:
    * `composer require "drupal/jsonapi" "drupal/simple_oauth:~2.0" -o`
    * `drush en -y jsonapi`

1. Cross-Origin Resource Sharing (CORS) needs to be enabled on the Drupal site. Modify the related lines near the
bottom of your `sites/default/services.yml` file:

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

To increase security, the `allowedOrigins` setting should be changed to a list of permitted origins from which 
your app will be served, such as:
```yaml
  allowedOrigins: ['localhost:4200', 'localhost:3000', 'yourbackendsite.com']
```

### Drupal Authentication Using OAuth 2.0

1. If you don't need to perform authentication to your Drupal backend, you're done configuring Drupal! Otherwise,
you'll also need to enable and configure the Simple OAuth contrib module:
    * `composer require "drupal/simple_oauth:~2.0" -o`
    * `drush en -y simple_oauth`

1. Generate encryption keys for Simple OAuth:
    * `openssl genrsa -out private.key 2048`
    * `openssl rsa -in private.key -pubout > public.key`

1. On your Drupal site, browse to `/admin/config/people/simple_oauth` and enter the full paths to both encryption keys
in the Simple OAuth Settings.

1. Browse to `/admin/config/people/simple_oauth/oauth2_client/add` to create OAuth client settings for this app. For
"Label", specify something like "Ember Waterwheel app". Leave all other settings at their defaults and click "Save".
Copy the UUID from the list of OAuth clients and paste it into this application's `config/environment.js` at the location
marked with a @todo. Also fill in the Drupal site's URL in that same file.

## Running / Development

* `ember serve`
* Visit your app at [http://localhost:4200](http://localhost:4200).

### Running Using FastBoot (Server-side Rendering) [Experimental]

Ember provides the FastBoot addon for server-side rendering. Server-side redering has the advantages of allowing your
app to work on browsers that don't have JavaScript enabled, and can also help many search engines to index your app's
content. It may also speed up initial page load times. **(Note that FastBoot is considered experimental until it reaches
its 1.0 release, and as such is not guaranteed to work!)**

To use FastBoot in your Ember app, you'll first need to install the addon:

* `ember install ember-cli-fastboot`

FastBoot has some built-in security measures that require a list of the domains you'll be serving your app from the be
whitelisted. This can be done in your app's `config/environment.js` file by adding the following lines inside the
`var ENV = { ... }` definition:

```javascript
fastboot: {
  hostWhitelist: ['yourbackendsite.com', 'yourstagingsite.com', /^localhost:\d+$/]
}
```
This will whitelist serving the app on your production and staging environments, as well as locally at any port.

If you're using this addon's OAuth 2.0 features, you'll need to switch the session store to use cookies instead of
browser local storage. Do this by creating `app/session-stores/application.js` with the following two lines:

```javascript
import CookieStore from 'ember-simple-auth/session-stores/cookie';
export default CookieStore.extend();
```

Finally, whitelist a library required for ember-simple-auth to work with FastBoot by adding these lines at the bottom 
of your app's package.json file:

```javascript
  "fastbootDependencies": [
    "node-fetch"
  ]
```

Now, you can start serving your app with FastBoot:

* `ember fastboot --serve-assets`
* Visit your app at [http://localhost:3000](http://localhost:3000).

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
