import Ember from 'ember';

/**
 * A route for editing a specific article.
 */
export default Ember.Route.extend({
  model(params) {
    return this.store.findRecord('article', params.id, { include: 'uid' });
  }
});
