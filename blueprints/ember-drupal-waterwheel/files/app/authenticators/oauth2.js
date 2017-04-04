import Ember from 'ember';
import ENV from '../config/environment';
import OAuth2PasswordGrant from 'ember-simple-auth/authenticators/oauth2-password-grant';

const { RSVP } = Ember;

export default OAuth2PasswordGrant.extend({
  serverTokenEndpoint: ENV.APP.host + ENV.APP.oauth2TokenEndpoint,
  clientId: ENV.APP.oauth2ClientId,

  authenticate(username /*, password, scope = [], headers = {}*/) {
    // Include username in returned data for use by the session service
    return new RSVP.Promise((resolve, reject) => {
      this._super(...arguments).then(data => {
        data['username'] = username;
        resolve(data);
      }).catch((reason) => {
        reject(reason);
      });
    });
  }
});
