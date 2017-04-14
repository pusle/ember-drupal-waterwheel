import Ember from 'ember';
import DS from 'ember-data';
import ENV from '../config/environment';

const webImageMimeTypes = [
  'image/jpeg',
  'image/gif',
  'image/png',
  'image/svg+xml',
  'image/webp',
  'image/x-icon',
];

export default DS.Model.extend({
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
  filename: DS.attr(),
  filemime: DS.attr(),
  filesize: DS.attr(),
  url: DS.attr(),
  absoluteUrl: Ember.computed('url', function () {
    return ENV.APP.host + '/' + this.get('url');
  }),
  uid: DS.belongsTo('user', { async: true }),

  isWebImage: Ember.computed('filemime', function () {
    return webImageMimeTypes.includes(this.get('filemime'));
  })
});
