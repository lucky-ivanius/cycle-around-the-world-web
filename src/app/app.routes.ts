import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { authGuard } from './auth/auth.guard';
import { noAuthGuard } from './auth/no-auth.guard';
import { SpotsListComponent } from './spots/spots-list/spots-list.component';
import { SpotDetailComponent } from './spots/spot-detail/spot-detail.component';

export const routes: Routes = [
  {
    path: 'spots',
    component: SpotsListComponent,
    canActivate: [authGuard],
  },
  {
    path: 'spots/:spotNameSlug',
    component: SpotDetailComponent,
    canActivate: [authGuard],
  },
  { path: 'login', component: LoginComponent, canActivate: [noAuthGuard] },
  { path: '', redirectTo: 'spots', pathMatch: 'full' },
];
