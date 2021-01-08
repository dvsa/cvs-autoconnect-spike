import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Platform } from 'ionic-angular';

import { Subject } from 'rxjs';

import {
  AuthMode,
  IonicIdentityVaultUser,
  IonicNativeAuthPlugin,
  DefaultSession,
  VaultConfig,
  VaultError,
  VaultErrorCodes
} from '@ionic-enterprise/identity-vault';

// import { User } from '../../models/user';
import { BrowserAuthPlugin } from '../browser-auth/browser-auth.plugin';
// import { PinDialogComponent } from '../../pin-dialog/pin-dialog.component';
import { SettingsService } from '../settings/settings.service';

@Injectable()
export class IdentityService extends IonicIdentityVaultUser<DefaultSession> {
  private _changed: Subject<DefaultSession>;

  get changed() {
    return this._changed.asObservable();
  }

  constructor(
    private browserAuthPlugin: BrowserAuthPlugin,
    // private modalController: ModalController,
    private router: Router,
    private platorm: Platform,
    private settings: SettingsService
  ) {
    super(platorm, {
      restoreSessionOnReady: false,
      unlockOnReady: false,
      unlockOnAccess: true,
      lockAfter: 5000,
      hideScreenOnBackground: true,
      allowSystemPinFallback: true,
      shouldClearVaultAfterTooManyFailedAttempts: false
    });

    this._changed = new Subject();
  }

  // async set(user: User): Promise<void> {
  //   // This is just one sample login workflow. It mostly respects the settings
  //   // that were last saved with the exception that it uses "Biometrics OR Passcode"
  //   // in the case were both were saved and the user logged out.
  //   const mode = (await this.useBiometrics())
  //     ? AuthMode.BiometricOnly
  //     : (await this.settings.usePasscode())
  //     ? AuthMode.PasscodeOnly
  //     : (await this.settings.useSecureStorageMode())
  //     ? AuthMode.SecureStorage
  //     : AuthMode.InMemoryOnly;
  //   const session: DefaultSession = { username: user.email, token: user.token };

  //   await this.login({ username: user.email, token: user.token }, mode);
  //   this._changed.next(session);
  // }

  async setDesiredAuthMode(): Promise<void> {
    const mode = (await this.useBiometrics())
      ? AuthMode.BiometricOnly
      : (await this.settings.usePasscode())
      ? AuthMode.PasscodeOnly
      : (await this.settings.useSecureStorageMode())
      ? AuthMode.SecureStorage
      : AuthMode.InMemoryOnly;

    return await this.setAuthMode(mode);
  }

  private async useBiometrics(): Promise<boolean> {
    const use = await Promise.all([this.settings.useBiometrics(), this.isBiometricsAvailable()]);
    return use[0] && use[1];
  }

  async remove(): Promise<void> {
    await this.logout();
    this._changed.next();
  }

  async getToken(): Promise<string> {
    if (!this.token) {
      await this.restoreSession();
    }
    return this.token;
  }

  async restoreSession(): Promise<DefaultSession> {
    try {
      return await super.restoreSession();
    } catch (error) {
      if (error.code === VaultErrorCodes.VaultLocked) {
        const vault = await this.getVault();
        await vault.clear();
      } else {
        throw error;
      }
    }
  }

  onSessionRestored(session: DefaultSession) {
    this._changed.next(session);
  }

  // In a real app, you don't want to log a lot of this. These events are just handled
  // here to demonstrate when they are called.
  onSetupError(error: VaultError): void {
    console.error('Get error during setup', error);
  }

  onConfigChange(config: VaultConfig): void {
    console.log('Got a config update: ', config);
  }

  onVaultReady(config: VaultConfig): void {
    console.log('The service is ready with config: ', config);
  }

  onVaultUnlocked(config: VaultConfig): void {
    console.log('The vault was unlocked with config: ', config);
  }

  async onPasscodeRequest(isPasscodeSetRequest: boolean): Promise<string> {
    // const dlg = await this.modalController.create({
    //   backdropDismiss: false,
    //   component: PinDialogComponent,
    //   componentProps: {
    //     setPasscodeMode: isPasscodeSetRequest
    //   }
    // });
    // dlg.present();
    // const { data, role } = await dlg.onDidDismiss();
    // if (role === 'cancel') {
    //   throw {
    //     code: VaultErrorCodes.UserCanceledInteraction,
    //     message: 'User has canceled supplying the application passcode'
    //   };
    // }
    // return Promise.resolve(data || '');

    return Promise.resolve('');
  }

  onVaultLocked() {
    console.log('Vault Locked');
    this._changed.next();
    this.router.navigate(['login']);
  }

  getPlugin(): IonicNativeAuthPlugin {
    if (this.platorm.is('cordova')) {
      return super.getPlugin();
    }
    return this.browserAuthPlugin;
  }

  async supportedBiometricTypes(): Promise<string> {
    let result = '';
    const types = await this.getAvailableHardware();
    if (types) {
      types.forEach((t) => (result += `${result ? ', ' : ''}${this.translateBiometricType(t)}`));
    }
    return result;
  }

  private translateBiometricType(type: string): string {
    switch (type) {
      case 'fingerprint':
        return 'Finger Print';
      case 'face':
        return 'Face Match';
      case 'iris':
        return 'Iris Scan';
    }
  }
}
