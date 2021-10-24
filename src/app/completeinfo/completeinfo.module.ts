import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CompleteinfoPageRoutingModule } from './completeinfo-routing.module';

import { CompleteinfoPage } from './completeinfo.page';
import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, "", "");
}

@NgModule({ 
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CompleteinfoPageRoutingModule,
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })
  ],
  declarations: [CompleteinfoPage]
})
export class CompleteinfoPageModule {}
