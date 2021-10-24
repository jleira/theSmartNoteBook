import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
//import { AngularFireModule } from '@angular/fire';
//import { firebaseConfig } from 'src/environments/environment';
//import { AngularFireAuthModule } from '@angular/fire/auth';
//import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { Calendar } from '@ionic-native/calendar/ngx';
import { SignInWithApple } from '@ionic-native/sign-in-with-apple/ngx';



export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, "", "");
}


@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule, 
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    IonicModule.forRoot({
      backButtonText: ''
    }), 
    AppRoutingModule,
//    AngularFireModule.initializeApp(firebaseConfig), //Modulo 1 a importa
//    AngularFireAuthModule,
    HttpClientModule],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
//    GooglePlus,
    SignInWithApple,
    SocialSharing,
    Calendar
    ,BarcodeScanner
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
