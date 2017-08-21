import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER } from "@angular/core";
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { LandingModule } from "./landing/landing.module";
import { AppRoutingModule } from "./app-routing.module";
import { RegistrationModule } from "./registration/registration.module";
import { SharedModule } from "./shared/shared.module";
import { DashboardModule } from "./dashboard/dashboard.module";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {EthereumService} from "./shared/ethereum.service";

export function ethereumServiceFactory(ethereumService: EthereumService): Function {
    return () => ethereumService.loadConnection();
}

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    LandingModule,
    RegistrationModule,
    DashboardModule,
    AppRoutingModule,
    RouterModule,
    SharedModule,
    BrowserAnimationsModule
  ],
  providers: [
      EthereumService,
      {
          provide: APP_INITIALIZER,
          useFactory: ethereumServiceFactory,
          deps: [EthereumService],
          multi: true
      }
  ],
  bootstrap: [AppComponent]

})
export class AppModule {
}
