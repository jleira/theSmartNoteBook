import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Platform } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { PeticionesService } from './services/peticiones.service';
import { Storage } from '@capacitor/storage';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(
    private platform: Platform,
    public peticiones: PeticionesService,
    private router: Router,
    public translate: TranslateService

  ) {
    this.peticiones.cargarvariables().then((resp) => {
      if (resp) {
        if(resp==1){
          this.router.navigate(['/']);
        }else{
          this.router.navigate(['/completeinfo/5/0']);
        }
        setTimeout(() => {
          this.initializeApp(2);
        }, 500);
      } else {
        
        Storage.get({ key: 'intro' }).then((intro) => {
          if (!intro.value) {
            this.router.navigate(['/intro']);
            //this.router.navigate(['/login']);
            this.initializeApp(1);
          } else {
            this.router.navigate(['/prelogin']);
            setTimeout(() => {
              this.initializeApp(1);
            }, 500);
          }
        })

      }
    })

  }

  async initializeApp(intro) {
    try {
      let variableaw = await this.peticiones.cargarvariables();
      console.log("variableaw", variableaw);
    } catch (err) {
      console.log('This is normal in a browser', err);
    }
  }
}
