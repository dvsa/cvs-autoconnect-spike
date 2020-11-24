import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

import { HomePage } from './home/home.page';
import { LoginPage } from './login/login.page';
import { AuthGuard } from './services/auth.guard';

// THIS WONT WORK....... angular 5
// const routes: Routes = [
//   { path: '', redirectTo: 'login', pathMatch: 'full' },
//   {
//     path: 'home',
//     loadChildren: () => import('./home/home.module').then((m) => m.HomePageModule),
//     canActivate: [AuthGuard]
//   },
//   {
//     path: 'login',
//     loadChildren: () => import('./login/login.module').then((m) => m.LoginPageModule)
//   }
// ];

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'home',
    component: HomePage,
    canActivate: [AuthGuard]
  },
  {
    path: 'login',
    component: LoginPage
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule]
})
export class AppRoutingModule {}
