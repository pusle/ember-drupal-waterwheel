/*
 Have ember-simple-auth use a Cookie-based store for its session store, to
 support fastboot. If fastboot is not needed and you would prefer it to use the
 browser's localStorage instead, then delete this file completely.
 */
import CookieStore from 'ember-simple-auth/session-stores/cookie';

export default CookieStore.extend();
