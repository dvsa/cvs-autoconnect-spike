// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
import { IonicAuthOptions } from '@ionic-enterprise/auth';
// import { config } from 'dotenv';
// import { existsSync } from 'fs';

// config({ path: '../../.env' });

// if (existsSync('.env')) {
//   config({ path: '.env' });
// } else {
//   process.exit(88);
// }

export const secrets = {
  client_id: '',
  tenant_id: ''
};

export const azureWebConfig: IonicAuthOptions = {
  authConfig: 'azure',
  platform: 'web',
  clientID: secrets.client_id,
  discoveryUrl: `https://login.microsoftonline.com/${secrets.tenant_id}/v2.0/.well-known/openid-configuration?appid=${secrets.client_id}`,
  // redirectUri: 'http://localhost:8100/login',
  redirectUri: 'http://localhost:8100/#',
  scope: 'openid offline_access profile email',
  // logoutUrl: 'http://localhost:8100/login',
  logoutUrl: 'http://localhost:8100',
  logLevel: 'DEBUG'

  // implicitLogin: 'CURRENT'
  // tokenStorageProvider: 'localStorage',
};

export const azureNativeConfig: IonicAuthOptions = {
  // the auth provider
  authConfig: 'azure',

  // The platform which we are running on
  platform: 'cordova',

  // client or application id for provider
  clientID: 'clientID',
  // the discovery url for the provider
  // OpenID configuration
  discoveryUrl:
    'https://vikingsquad.b2clogin.com/vikingsquad.onmicrosoft.com/v2.0/.well-known/openid-configuration?p=B2C_1_Signup_Signin',

  // the URI to redirect to after log in
  redirectUri: 'io.ionic.demo.ac.azureb2c://login',

  // requested scopes from provider
  scope:
    'openid offline_access email profile https://vikingsquad.onmicrosoft.com/webinar/user_impersonation',
  // the URL to redirect to after log out

  logoutUrl: 'io.ionic.demo.ac.azureb2c://login',
  // The type of iOS webview to use. 'shared' will use a webview that can share session/cookies
  // on iOS to provide SSO across multiple apps but will cause a prompt for the user which asks them
  // to confirm they want to share site data with the app. 'private' uses a webview which will not
  // prompt the user but will not be able to share session/cookie data either for true SSO across
  // multiple apps.
  iosWebView: 'private'
};

export const environment = {
  production: false
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
