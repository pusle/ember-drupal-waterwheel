import DS from 'ember-data';
import DrupalJSONAPISerializer from 'ember-data-drupal/serializer';
import { singularize } from 'ember-inflector';

const { normalizeModelName } = DS;

export default DrupalJSONAPISerializer.extend({
  // @todo - incorporate in ember-data-drupal
  modelNameFromPayloadKey(key) {
    const parts = key.split('--');
    if (parts.length === 2) {
      const entity = parts[0];
      const bundle = parts[1];
      return this.get('drupalMapper').modelNameFor(entity, bundle) || singularize(normalizeModelName(bundle));
    }
    return singularize(normalizeModelName(key));
  },

  // @todo - incorporate in ember-data-drupal
  payloadKeyFromModelName(modelName) {
    const drupalMapper = this.get('drupalMapper');
    if (drupalMapper.isMapped(modelName)) {
      const entity = drupalMapper.entityFor(modelName);
      const bundle = drupalMapper.bundleFor(modelName);
      return `${entity}--${bundle}`;
    }
    return modelName;
  },

  // @todo - incorporate in ember-data-drupal
  keyForRelationship(key /*, typeClass, method*/) {
    // Prevent dash-ification of underscores in relationship keys
    return key;
  },

  extractErrors(store, typeClass, payload /*, id*/) {
    // Adapt validation errors returned from the JSON API module so that they
    // can be easily displayed inline in an edit form.
    payload = this._super(...arguments);

    let out = {};
    Object.keys(payload).forEach(key => {
      let error = payload[key].toString();

      // Remove the field path (ex. 'title:', 'body.0.format:', etc.) from the error message
      /* let splitPos = error.indexOf(':');
       if (splitPos > 0) {
       error = error.substring(splitPos + 2);
       }*/

      // Convert '/' in key (ex. 'body/format') to '__'
      key = key.replace('/', '__');
      out[key] = error;
    });
    return out;
  },

  // @todo - incorporate in ember-data-drupal
  serializeHasMany(snapshot, json, relationship) {
    // Only serialize hasMany relationships that actually contain items
    let hasMany = snapshot.hasMany(relationship.key);
    if (hasMany !== undefined) {
      if (hasMany.length) {
        this._super(...arguments);
      }
    }
  }

});
