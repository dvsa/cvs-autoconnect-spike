import { Component, OnInit } from '@angular/core';
import { AuthMode } from '@ionic-enterprise/identity-vault';
// import { LoadingController } from 'ionic-angular';

import { AuthenticationService } from '../services/authentication.service';
import { IdentityService } from '../services/identity/identity.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html'
  // styleUrls: ['./login.page.scss']
})
export class LoginPage implements OnInit {
  errorMessage: string;
  loginType: string;

  constructor(
    private authService: AuthenticationService,
    private identity: IdentityService // private loadingController: LoadingController
  ) {}

  async ngOnInit() {
    // Web only: If redirected back to app after login and using implicitLogin = 'CURRENT' (current window),
    // pass along the auth details, such as access token, to Auth Connect

    if (window.location.hash) {
      // const loadingIndicator = await this.showLoadingIndictator();
      try {
        // Once handleCallback completes, Auth Connect calls onLoginSuccess() in Authentication service
        // await this.authService.getAuth.handleCallback(window.location.href);
        // await this.authService.onLoginSuccess();
      } catch (e) {
        this.errorMessage = e.message;
      } finally {
        // loadingIndicator.dismiss();
      }
    }
  }

  ionViewWillEnter() {
    try {
      this.setUnlockType();
    } catch (e) {
      console.error('Unable to check token status', e);
    }
  }

  private async setUnlockType(): Promise<void> {
    const previousLoginType = this.loginType;

    this.loginType = await this.determineLoginType();
    if (previousLoginType && !this.loginType) {
      alert('The vault is no longer accessible. Please login again');
    }
  }

  private async determineLoginType() {
    let loginType;

    if (await this.identity.hasStoredSession()) {
      const authMode = await this.identity.getAuthMode();
      switch (authMode) {
        case AuthMode.BiometricAndPasscode:
          loginType = await this.identity.supportedBiometricTypes();
          loginType += ' (Passcode Fallback)';
          return loginType;

        case AuthMode.BiometricOnly:
          const vault = await this.identity.getVault();
          const bioLockedOut = await vault.isLockedOutOfBiometrics();
          const bioAvailable = await this.identity.isBiometricsAvailable();
          // Making this conditional on Bio being locked out only makes sense if we are using
          // allowSystemPinFallback like we are in this demo
          return (loginType =
            bioAvailable || bioLockedOut ? await this.identity.supportedBiometricTypes() : '');

        case AuthMode.PasscodeOnly:
          return (loginType = 'Passcode');
      }
    }
  }

  async login() {
    // const loadingIndicator = await this.showLoadingIndictator();
    try {
      await this.authService.login();
    } catch (e) {
      console.log(`caught error ${e.message}`);
    } finally {
      // loadingIndicator.dismiss();
    }
  }

  // private async showLoadingIndictator(): Promise<Loading> {
  //   const loadingIndicator = this.loadingController.create({
  //     content: 'Opening login window...'
  //   });
  //   await loadingIndicator.present();
  //   return loadingIndicator;
  // }
}
