import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, ToastController } from '@ionic/angular';
import { PeticionesService } from '../services/peticiones.service';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';


@Component({
  selector: 'app-prelogin',
  templateUrl: './prelogin.page.html',
  styleUrls: ['./prelogin.page.scss'],
})
export class PreloginPage implements OnInit {

  constructor(
    private loading: LoadingController,
    private router: Router,
    private service: PeticionesService,
    public toastController: ToastController,
    private qrScanner: BarcodeScanner


  ) { }

  ngOnInit() {
    this.service.getpermision();
  }

  async leerQr() {
    this.service.getpermision();
    const load = await this.loading.create({
      cssClass: 'my-custom-class',
      message: 'Escaneando...',
    });
    load.present();

        this.qrScanner.scan().then((obj: any) => {
          load.dismiss();
          this.simularqr(obj.text);
        },()=>{
          //this.simularqr('https://virtual-tec.com/613b74bc59360');
          load.dismiss();
        });    
  }

  login() {
    this.router.navigate(['/login/0']);
  }
//60802fc11e798
  async simularqr(qr='6082f2819888c') {
    let load = await this.loading.create();
    load.present();

    this.service.validarqr(qr).subscribe((resp: any) => {
      load.dismiss();
      this.router.navigate(['/singup/' + resp.qr]);
    }, err => {
      load.dismiss();

      this.toastController.create({
        message: 'Este código ya fue leído, por favor inicie sesión.',
        duration: 5000,
        position: 'top'
      }).then((toast) => {
        toast.present();
        this.router.navigate(['/login/0']);
      });

    })
  }


}
