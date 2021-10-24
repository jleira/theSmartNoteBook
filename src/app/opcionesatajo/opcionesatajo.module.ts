import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OpcionesatajoPageRoutingModule } from './opcionesatajo-routing.module';

import { OpcionesatajoPage } from './opcionesatajo.page';
import { HttpClient } from '@angular/common/http';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, "", "");
}
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OpcionesatajoPageRoutingModule,
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })
  ],
  declarations: [OpcionesatajoPage]
})
export class OpcionesatajoPageModule {}
