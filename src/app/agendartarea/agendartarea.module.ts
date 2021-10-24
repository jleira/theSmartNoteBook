import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AgendartareaPageRoutingModule } from './agendartarea-routing.module';

import { AgendartareaPage } from './agendartarea.page';
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
    AgendartareaPageRoutingModule,
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })
  ],
  declarations: [AgendartareaPage]
})
export class AgendartareaPageModule {}
 