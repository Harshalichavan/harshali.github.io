import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { VerificationFormComponent } from './verification-form/verification-form.component';

const routes: Routes = [
  { path: 'verify', component: VerificationFormComponent },
  { path: '', redirectTo: '/verify', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
