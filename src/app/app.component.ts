import { Component, ViewChild, OnInit } from '@angular/core';
import { Platform, Nav } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';

import { AuthenticationService } from './services/authentication.service';
import { LoginPage } from './login/login.page';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
  // styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  @ViewChild(Nav) navElem: Nav;
  public rootPage: any = LoginPage;

  constructor(
    private auth: AuthenticationService,
    private platform: Platform,
    private splashScreen: SplashScreen
  ) {
    this.initializeApp();

    this.auth.loginStatusChanged.subscribe((authenticated) =>
      this.handleAuthChange(authenticated)
    );
  }

  ngOnInit(): void {
    this.navElem.push(LoginPage);
  }

  // async initializeApp() {
  //   const { SplashScreen } = Plugins;
  //   if (this.platform.is('hybrid')) {
  //     await SplashScreen.hide();
  //   }
  // }

  // private handleAuthChange(authenticated: boolean) {
  //   if (authenticated) {
  //     this.navController.navigateRoot(['home']);
  //   } else {
  //     this.navController.navigateRoot(['login']);
  //   }
  // }

  initializeApp() {
    if (this.platform.is('hybrid')) {
      this.splashScreen.hide();
    }
  }

  // Handle login status change event
  private handleAuthChange(authenticated: boolean) {
    if (authenticated) {
      this.navElem.setRoot('/home');
    } else {
      this.navElem.setRoot('/login');
    }
  }
}