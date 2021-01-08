import { Injectable } from '@angular/core';
import { IonicAuth, IonicAuthOptions } from '@ionic-enterprise/auth';
import { Platform } from 'ionic-angular';
import { Subject, Observable } from 'rxjs';
import * as jwt_decode from 'jwt-decode';

import { azureNativeConfig, azureWebConfig } from '../../environments/environment';
import { User } from '../models/user';
import { SettingsService, Token } from './settings/settings.service';
import { IdentityService } from './identity/identity.service';

@Injectable()
export class AuthenticationService {
  private _ionicAuth: IonicAuth;
  private _loginStatusChanged: Subject<User>;

  get loginStatusChanged(): Observable<User> {
    return this._loginStatusChanged.asObservable();
  }

  // constructor(platform: Platform) {
  //   const selectedConfig: IonicAuthOptions = platform.is('hybrid') ? azureNativeConfig : azureWebConfig;
  //   super(selectedConfig);

  //   this._loginStatusChanged = new Subject();
  // }

  constructor(
    private platform: Platform,
    private settings: SettingsService,
    private identity: IdentityService
  ) {
    const selectedConfig: IonicAuthOptions = this.platform.is('hybrid')
      ? azureNativeConfig
      : azureWebConfig;
    selectedConfig.tokenStorageProvider = this.identity;

    this._ionicAuth = new IonicAuth(selectedConfig);
    this._loginStatusChanged = new Subject();
  }

  get getAuth(): IonicAuth {
    return this._ionicAuth;
  }

  // setConfigProvider(option: IonicAuthOptions): IonicAuthOptions {

  //   return {
  //     ...option,
  //     tokenStorageProvider: {
  //       getAccessToken: async () => this.settings.getToken(Token.ACCESS),
  //       setAccessToken: async (token: string) => this.settings.setToken(Token.ACCESS, token),
  //       getIdToken: async () => this.settings.getToken(Token.ID),
  //       setIdToken: async (token: string) => this.settings.setToken(Token.ID, token),
  //       getRefreshToken: async () => this.settings.getToken(Token.REFRESH),
  //       setRefreshToken: async (token: string) => this.settings.setToken(Token.REFRESH, token)
  //     }
  //   };
  // }

  async login(): Promise<void> {
    try {
      // await this.identity.logout();
      // await this.identity.setDesiredAuthMode();

      await this._ionicAuth.login();
    } catch (err) {
      // Handle the password reset case for Azure AD
      console.log('login error:', +err);
      const message: string = err.message;
      // This is the error code returned by the Azure AD servers on failure.
      if (message !== undefined && message.startsWith('AADB2C90118')) {
        // The address you pass back is the custom user flow (policy) endpoint
        await this._ionicAuth.login(
          'https://vikingsquad.b2clogin.com/vikingsquad.onmicrosoft.com/v2.0/.well-known/openid-configuration?p=B2C_1_password_reset'
        );
      } else {
        throw new Error(err.error);
      }
    }
  }

  async onLoginSuccess() {
    // Web only: Using "current window" sign-in,
    // this._loginStatusChanged.next(true);

    this._loginStatusChanged.next(await this.getUserInfo());
  }

  onLogout() {
    // this._loginStatusChanged.next(false);
  }

  async getUserInfo(): Promise<User> {
    const token = await this.settings.getToken(Token.ID);

    if (!token) {
      return;
    }

    const decodedToken: any = jwt_decode(token);

    return {
      id: decodedToken.sub,
      token: token,
      email: decodedToken.roles[0],
      employeedId: decodedToken.employeeid
    };
    // email: decodedToken.unique_name,
  }
}
