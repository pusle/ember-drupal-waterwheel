import DS from 'ember-data';

/**
 * Defines the "<%= moduleName %>" model, which holds a custom Drupal entity.
 */
export default DS.Model.extend({
  // @todo - specify your Drupal entity's fields
  title: DS.attr('string'),
});
