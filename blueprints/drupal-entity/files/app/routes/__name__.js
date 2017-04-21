import Ember from 'ember';

/**
 * A route for displaying details for a specific instance of the "<%= moduleName %>" custom entity.
 */
export default Ember.Route.extend({
  model(params) {
    return this.store.findRecord('<%= moduleName %>', params.id);
  },
});
