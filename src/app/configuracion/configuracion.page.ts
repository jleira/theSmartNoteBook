import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
//import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { AlertController, LoadingController, ModalController, NavController, ToastController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { PeticionesService } from '../services/peticiones.service';
import { EditProfilePage } from './edit-profile/edit-profile.page';
import { DetailsProductPage } from './list-products/details-product/details-product.page';
import { ListProductsPage } from './list-products/list-products.page';
import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';

@Component({
  selector: 'app-configuracion',
  templateUrl: './configuracion.page.html', 
  styleUrls: ['./configuracion.page.scss'],
})
export class ConfiguracionPage implements OnInit {
  idioma = '0';
  usuario=false;
  cambio_idioma='';
  se_cambia='';
  cancelar='';
  cerrar_sesion='';
  cerrar_sesion_msj='';
  data_consulta:any = {};
  constructor(
    public _translate: TranslateService,
    public peticiones: PeticionesService,
    public alertController: AlertController,
   // private googlePlus: GooglePlus,
    public router: Router,
    public nav: NavController,
    public modalController: ModalController,
    private qrScanner: BarcodeScanner,
    private loading: LoadingController,
    private toastController: ToastController,
    private service: PeticionesService
  ) { }
  ionViewDidEnter(){
    GoogleAuth.init();
  }
  ngOnInit() {
    this.cargardatos();
    console.log(this.peticiones);
    this.usuario=true;

    this._translate.get('cambio_idioma').subscribe((res: string) => {
      this.cambio_idioma = res;
    });

    this._translate.get('se_cambia').subscribe((res: string) => {
      this.se_cambia = res;
    });

    this._translate.get('cancelar').subscribe((res: string) => {
      this.cancelar = res;
    });

    this._translate.get('cerrar_sesion').subscribe((res: string) => {
      this.cerrar_sesion = res;
    });

    this._translate.get('cerrar_sesion_msj').subscribe((res: string) => {
      this.cerrar_sesion_msj = res;
    });

  }
  cambiaridioma() {
    this.ngOnInit();
    this.peticiones.cambiaridioma(this.idioma);
  }
  cambiari(){
    this.alertController.create({
      subHeader: this.cambio_idioma,
      message: this.se_cambia+' '+(this.peticiones.idioma=='1'?'Spanish':'English'),
      buttons: [
        {
          text: this.cancelar,
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Cancelar Cancel: blah');
          }
        },{
          text: 'Ok',
          role: 'confirm',
          cssClass: 'secondary',
          handler: (blah) => {
            this.peticiones.cambiaridioma(this.peticiones.idioma=='1'?'2':'1');
            this.ngOnInit();
          }

        }]
    }).then((alt)=>{
      alt.present();
    });
  }
  salir(){
    this.alertController.create({
      subHeader: this.cerrar_sesion,
      message: this.cerrar_sesion_msj,
      buttons: [
        {
          text: this.cancelar,
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Cancelar Cancel: blah');
          }
        },{
          text: 'Ok',
          role: 'confirm',
          cssClass: 'secondary',
          handler: (blah) => {
            GoogleAuth.signOut().then(() => {
              this.peticiones.limpiartodo();
              this.nav.navigateRoot('/prelogin');
            },err=>{
              this.peticiones.limpiartodo();
              this.nav.navigateRoot('/prelogin');
            }).catch(()=>{
              this.peticiones.limpiartodo();
              this.nav.navigateRoot('/prelogin');

            });
          }
        }]
    }).then((alt)=>{
      alt.present();
    });
  }

  async addProduct() {
    const load = await this.loading.create({
      cssClass: 'my-custom-class',
      message: 'Escaneando...',
    });
    load.present();

    this.qrScanner.scan().then((obj: any) => {
      load.dismiss();
      this.simularqr(obj.text);
    }, err => {
      load.dismiss();
      this.showToast("Ha ocurrido un error, intentelo nuevamente.");
    });
  }

  async simularqr(qr='https://virtual-tec.com/610857df81487') {
    const load = await this.loading.create({
      message: 'Validando información...',
    });
    load.present();
    this.service.validarqr3(qr).subscribe((resp: any) => {
      load.dismiss();
      this.showToast('Producto registrado con éxito.');
      this.detailsProduct(resp.data.data[0]);
    }, err => {
      load.dismiss();
      if (err.status == 410){
        this.showToast(err.error.message);
      }else{
        this.showToast('Ha ocurrido un error inesperado');
      }
    });
  }

  async listProducts() {
    const modal = await this.modalController.create({
      component: ListProductsPage,
      componentProps: {
        'name': 'Test'
      },
      swipeToClose: true
    });
    modal.onDidDismiss().then((dataReturned) => {
      //console.log(dataReturned.data);
    });
    return await modal.present();
  }

  cargardatos(event=null){
    this.peticiones.getMethod('api/profileapp').subscribe((ele: any) => {
    this.data_consulta = ele.user;
      console.log(ele);
    }, err => {
      console.log("hubo este error asl cargar tu info", err);
    })
  }

  async detailsProduct(item: any) {
    const modal = await this.modalController.create({
      component: DetailsProductPage,
      componentProps: {
        'product': item
      },
      swipeToClose: true
    });
    modal.onDidDismiss().then((dataReturned) => {
      //console.log(dataReturned.data);
    });
    return await modal.present();
  }
  
  async modalEdit() {
    const modal = await this.modalController.create({
      component: EditProfilePage,
      cssClass: 'my-custom-class',
      componentProps: {
        'dataUser': this.data_consulta
      },
      swipeToClose: true
    });
    modal.onDidDismiss().then((dataReturned) => {
      console.log(dataReturned.data);
      if (dataReturned.data.updated) this.cargardatos();
    });
    return await modal.present();
  }

  profile(type) {
    switch (type) {
      case 1:
        return "Profesor";
        break;
      case 2:
        return "Estudiante";
        break;
      case 3:
        return "Creativo";
        break;
      case 4:
        return "Otro";
        break;
      default:
        return 'N/A';
        break;
    }
  }

  showToast(message: string){
    this.toastController.create({
      message: message, duration: 5000, position: 'top'
    }).then((toast) => { 
      toast.present();
    }); 
  }
}


