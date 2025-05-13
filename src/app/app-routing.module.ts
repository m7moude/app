import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FeedComponent } from './components/feed/feed.component';
import { IngredientsComponent } from './components/ingredients/ingredients.component';
import { AnimalsComponent } from './components/animals/animals.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { NewbornComponent } from './components/newborn/newborn.component';
import { DairyComponent } from './components/dairy/dairy.component';
import { LoginComponent } from './components/auth/login/login.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { ForgotPasswordComponent } from './components/auth/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './components/auth/reset-password/reset-password.component';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'reset-password', component: ResetPasswordComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'feed', component: FeedComponent, canActivate: [AuthGuard] },
  { path: 'ingredients', component: IngredientsComponent, canActivate: [AuthGuard] },
  { path: 'animals', component: AnimalsComponent, canActivate: [AuthGuard] },
  { path: 'newborn', component: NewbornComponent, canActivate: [AuthGuard] },
  { path: 'dairy', component: DairyComponent, canActivate: [AuthGuard] },
  // Add other routes as needed
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
