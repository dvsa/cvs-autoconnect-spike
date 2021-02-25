import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
// import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { SplashScreen } from '@ionic-native/splash-screen';
import { IonicModule } from 'ionic-angular';
import { IonicStorageModule } from '@ionic/storage';
// import { RouteReuseStrategy } from '@angular/router';
// import { IonicModule, IonicRouteStrategy } from 'ionic-angular';

import { AppComponent } from './app.component';
// import { AppRoutingModule } from './app-routing.module';
// import { AuthGuard } from './services/auth.guard';
import { AuthenticationService } from './services/authentication.service';
import { HomePageModule } from './home/home.module';
import { LoginPageModule } from './login/login.module';
import { IdentityService } from './services/identity/identity.service';
// import { SettingsService } from './services/settings/settings.service';
import { BrowserAuthService } from './services/browser-auth/browser-auth.service';
import { BrowserAuthPlugin } from './services/browser-auth/browser-auth.plugin';
// import { AuthInterceptor } from './services/http-interceptors/auth-interceptor';
// import { UnauthInterceptor } from './services/http-interceptors/unauth-interceptor';

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot(AppComponent),
    IonicStorageModule.forRoot({
      driverOrder: ['sqlite', 'websql', 'indexeddb']
    }),
    // AppRoutingModule,
    HomePageModule,
    LoginPageModule
  ],
  providers: [
    // AuthGuard,
    AuthenticationService,
    // SettingsService,
    IdentityService,
    BrowserAuthService,
    BrowserAuthPlugin,
    SplashScreen
    // { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    // { provide: HTTP_INTERCEPTORS, useClass: UnauthInterceptor, multi: true }
    // { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
