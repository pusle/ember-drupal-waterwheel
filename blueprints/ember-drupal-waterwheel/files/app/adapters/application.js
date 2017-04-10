import ENV from '../config/environment';
import DrupalJSONAPIAdapter from 'ember-data-drupal/adapter';
import DataAdapterMixin from 'ember-simple-auth/mixins/data-adapter-mixin';

export default DrupalJSONAPIAdapter.extend(DataAdapterMixin, {
  host: ENV.APP.host,
  namespace: 'jsonapi',
  authorizer: 'authorizer:oauth2',
  coalesceFindRequests: true,

  // @todo - use 'ds-improved-ajax' feature and dataForRequest()
  findMany(store, type, ids, snapshots) {
    const url = this.buildURL(type.modelName, ids, snapshots, 'findMany');
    const filter = {
      c: {
        condition: {
          path: 'uuid',
          operator: 'IN',
          value: ids
        }
      }
    };
    return this.ajax(url, 'GET', { data: { filter: filter } });
  }
});
