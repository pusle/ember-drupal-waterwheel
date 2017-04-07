import ENV from '../config/environment';
import DrupalJSONAPIAdapter from 'ember-data-drupal/adapter';
import DataAdapterMixin from 'ember-simple-auth/mixins/data-adapter-mixin';

export default DrupalJSONAPIAdapter.extend(DataAdapterMixin, {
  host: ENV.APP.host,
  namespace: 'jsonapi',
  authorizer: 'authorizer:oauth2'
});
