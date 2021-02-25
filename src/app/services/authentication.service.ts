import { Injectable } from '@angular/core';
import { IonicAuth, IonicAuthOptions } from '@ionic-enterprise/auth';
import { Platform } from 'ionic-angular';
import { Subject, Observable } from 'rxjs';
// import * as jwt_decode from 'jwt-decode';

import { azureNativeConfig, azureWebConfig } from '../../environments/environment';
import { User } from '../models/user';
// import { /*SettingsService,*/ Token } from './settings/settings.service';
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
    private identity: IdentityService // private settings: SettingsService
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
      console.error(err);
      throw new Error(err);
    }
  }

  async onLoginSuccess() {
    // Web only: Using "current window" sign-in,
    // this._loginStatusChanged.next(true);
    // this._loginStatusChanged.next(await this.getUserInfo());
  }

  onLogout() {
    // this._loginStatusChanged.next(false);
  }

  async getUserInfo(): Promise<User> {
    const token = await this.getAuth.getAuthResponse();

    if (!token) {
      return;
    }

    // const decodedToken: any = jwt_decode(token);

    return {
      ...token
    };
    //   // email: decodedToken.unique_name,
  }
}
