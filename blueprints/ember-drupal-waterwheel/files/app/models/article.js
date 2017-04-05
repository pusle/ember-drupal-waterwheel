import Ember from 'ember';
import DS from 'ember-data';

export default DS.Model.extend({
  nid: DS.attr(),
  uuid: DS.attr(),
  status: DS.attr('boolean'),
  created: DS.attr(),
  createdDate: Ember.computed('created', function () {
    let created = this.get('created');
    if (created) {
      let date = new Date(created * 1000);
      return date.toString();
    }
    else {
      return "[No Date]";
    }
  }),
  uid: DS.belongsTo('user', { async: true }),
  title: DS.attr(),
  body: DS.attr(),
  field_tags: DS.hasMany('tag', { async: true }),
});
