import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

export enum Token {
  ID = 'idToken',
  ACCESS = 'accessToken',
  REFRESH = 'refreshToken'
}

@Injectable()
export class SettingsService {
  private keys = {
    biometrics: 'useBiometrics',
    passcode: 'usePasscode',
    secureStorageMode: 'useSecureStorageMode'
  };

  constructor(private storage: Storage) {}

  async getToken(tokenName: Token): Promise<string | null> {
    try {
      return JSON.parse(await this.storage.get(tokenName));
    } catch (error) {
      return Promise.resolve(null);
    }
  }

  async setToken(tokenName: Token, token: string): Promise<void> {
    return await this.storage.set(tokenName, JSON.stringify(token));
  }

  async useBiometrics(): Promise<boolean> {
    return await this.storage.get(this.keys.biometrics);
  }

  async usePasscode(): Promise<boolean> {
    return await this.storage.get(this.keys.passcode);
  }

  async useSecureStorageMode(): Promise<boolean> {
    return await this.storage.get(this.keys.secureStorageMode);
  }

  async store(settings: {
    useBiometrics: boolean;
    usePasscode: boolean;
    useSecureStorageMode: boolean;
  }) {
    if (settings.useBiometrics !== undefined) {
      this.storage.set(this.keys.biometrics, settings.useBiometrics);
    }
    if (settings.usePasscode !== undefined) {
      this.storage.set(this.keys.passcode, settings.usePasscode);
    }
    if (settings.useSecureStorageMode !== undefined) {
      this.storage.set(this.keys.secureStorageMode, settings.useSecureStorageMode);
    }
  }
}
