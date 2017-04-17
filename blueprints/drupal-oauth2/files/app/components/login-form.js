import Ember from 'ember';

const { inject: { service } } = Ember;

/**
 * The login-form component provides a basic login form that passes credentials
 * along to ember-simple-auth for authentication against the Drupal backend.
 */
export default Ember.Component.extend({
  session: service(),

  actions: {
    authenticate() {
      let {username, password} = this.getProperties('username', 'password');
      this.get('session').authenticate('authenticator:oauth2', username, password)
        .catch((reason) => {
        // Set an error message that will be displayed in the component
        if (reason === undefined) {
          this.set('errorMessage', 'authenticate failed for unknown reasons.');
        }
        else {
          this.set('errorMessage', reason.error || reason);
        }
      });
    }
  }
});
