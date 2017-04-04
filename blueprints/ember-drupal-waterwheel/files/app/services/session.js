import Ember from 'ember';
import SessionService from 'ember-simple-auth/services/session';

const { computed, RSVP, isEmpty, inject: {service} } = Ember;

export default SessionService.extend({
  store: service(),

  /**
    The currently logged-in user's data.

    @property currentUser
    @type Object
    @readOnly
    @default {}
    @public
  */
  currentUser: computed.oneWay('session.currentUser'),

  authenticate() {
    return new RSVP.Promise((/*resolve, reject*/) => {
      this._super(...arguments).then(() => {
        const username = this.get('data.authenticated.username');
        if (!isEmpty(username)) {
          this.get('store').query('user', { name: username })
            .then(users => {
              const user = users.objectAt(0);
              this.set('session.currentUser', user);
            });
        }
      });
    });
  }
});
