import DS from 'ember-data';

/**
 * Defines the "tag" model, which holds a "Tags" Drupal taxonomy term entity.
 */
export default DS.Model.extend({
  name: DS.attr('string'),
  description: DS.attr(),

  // Link back to articles tagged with this tag. This can be made a one-way relationship by commenting this out.
  articles: DS.hasMany('article', { async: true })
});
