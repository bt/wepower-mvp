import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';

import { LandingComponent } from "./landing/landing.component";
import { PlantFormComponent } from "./registration/plant-form/plant-form.component";
import { ConsumerFormComponent } from "./registration/consumer-form/consumer-form.component";

const appRoutes: Routes = [
  { path: '', redirectTo: 'landing', pathMatch: 'full' },
  { path: 'landing', component: LandingComponent, pathMatch: 'full' },
  { path: 'register/plant', component: PlantFormComponent, pathMatch: 'full' },
  { path: 'register/consumer', component: ConsumerFormComponent, pathMatch: 'full' }
];

@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
