import ENV from '../config/environment';
import DrupalJSONAPIAdapter from 'ember-data-drupal/adapter';

export default DrupalJSONAPIAdapter.extend({
  host: ENV.APP.host,
  namespace: 'jsonapi'
});
