import { Component, OnInit } from '@angular/core';
import { LoadingController, ToastController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { PeticionesService } from '../services/peticiones.service';

@Component({
  selector: 'app-recuperarcontrasena',
  templateUrl: './recuperarcontrasena.page.html',
  styleUrls: ['./recuperarcontrasena.page.scss'],
})
export class RecuperarcontrasenaPage implements OnInit {
  usuarioext: any = {
  }
  camposincompletos = 'Debe escribir un correo valido';


  constructor(
    public peticiones: PeticionesService,
    private loadingC: LoadingController,
    public toastController: ToastController,
    private _translate: TranslateService

  ) { }

  ngOnInit() {
    setTimeout(() => {
      this._translate.get('camposincompletos').subscribe((res: string) => {
        this.camposincompletos = res;
      });


    }, 1000);
  }

  loginext() {
    if (!this.usuarioext.email) {
      this.toastController.create({
        message: this.camposincompletos,
        duration: 5000,
        position: 'top'
      }).then((toast) => {
        toast.present();
      });

    } else {
      this.recuperar();
    }
  }


  async recuperar() {
    let load = await this.loadingC.create();
    load.present();

    let datauser = {
      email: this.usuarioext.email
    };
    this.peticiones.postmethod(datauser,'api/reset-password-request').subscribe((resp) => {

      load.dismiss();
      this.toastController.create({
        message: 'Se le ha enviado un correo para restablecer su contraseña',
        duration: 10000,
        position: 'top'
      }).then((to)=>{
        to.present();
      })
     
    }, err => {
      load.dismiss();
      console.log("err", err);
      let text: string;
      if (err.status == 401) {
        text = err.error.message;
      }else{
        text = 'Ha ocurrido un error, intentelo nuevamente';
      }
      this.toastController.create({
        message: text, duration: 5000, position: 'top'
      }).then((toast) => {
        toast.present();
      });

    });

  }

}
