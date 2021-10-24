import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PagedetailPageRoutingModule } from './pagedetail-routing.module';

import { PagedetailPage } from './pagedetail.page';
import { PhotoViewer } from '@ionic-native/photo-viewer/ngx';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
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
    PagedetailPageRoutingModule,
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })
  ],
  declarations: [PagedetailPage],
  providers:[PhotoViewer,SocialSharing]
})
export class PagedetailPageModule {}
