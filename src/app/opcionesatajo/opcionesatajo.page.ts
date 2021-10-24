import { Component, Input, OnInit } from '@angular/core';
import { AlertController, LoadingController, ModalController, Platform, ToastController } from '@ionic/angular';
import { PeticionesService } from '../services/peticiones.service';
//import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { AuthService } from '../services/auth.service';
import { FolderDrivePage } from './folder-drive/folder-drive.page';
import { Storage } from '@capacitor/storage';
import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';

@Component({
  selector: 'app-opcionesatajo',
  templateUrl: './opcionesatajo.page.html',
  styleUrls: ['./opcionesatajo.page.scss'],
})
export class OpcionesatajoPage implements OnInit {
  @Input() firstName?: string='';
  @Input() lastName?: string='';
  @Input() middleInitial?: string='';
  @Input() boton:number;
  @Input() botones:any;
  tipo:any=null;
  tipoRed:any=null;
  correo:any='';
  tipoNube:any=null;
  tipoSave:any="1";
  statusConnectDrive = false;
  dataDrive = {};
  infoDrive: any;
  folder = null;
  route = "Drive/";

  constructor(
    private toastController:ToastController,
    private loading:LoadingController,
    public modalController: ModalController,
    private peticiones: PeticionesService, 
    private platform: Platform,
//    private googlePlus: GooglePlus,
    private authservice: AuthService,
    private alertController: AlertController
  ) { }

  ngOnInit() {
    //this.validateConnectDrive();
    this.trySilentLogin();
  }
  dismiss() {
    this.modalController.dismiss(false);
  }

  async enviar(){
    if(!this.tipo){ 
      this.showToast('Debes seleccionar un tipo de atajo.'); return; 
    }
    if(this.tipo == '1' && !this.correo){
      this.showToast('Debes ingresar el correo electrónico.'); return;
    }
    if(this.tipo == '2' && !this.tipoNube){
      this.showToast('Debes seleccionar el lugar de almacenamiento.'); return;
    }
    if(this.tipoNube == '1' && !this.statusConnectDrive){
      this.showToast('Por favor, conecta tu cuenta de Drive.'); return;
    }
    /* if(this.tipoNube == '1' && !this.folder){
      this.showToast('Por favor, selecciona una carpeta de tu Drive.'); return;
    } */
    if(this.tipo == '2' && this.tipoNube == '2'){
      this.showToast('Dropbox actualmente se encuentra en mantenimiento.'); return;
    }
    if(this.tipo == '3' && !this.tipoRed){
      this.showToast('Debes seleccionar una red social.'); return;
    }

    let params={
      button:this.boton,
      accion:this.tipo,
      email:this.correo,
      social_share:this.tipoRed,
      type_cloud: this.tipoNube,
      type_save: this.tipoSave,
      folder: this.folder,
      route: this.route
    }

    let load = await this.loading.create();
    load.present();

    this.peticiones.postmethod(params,'api/accion/add').subscribe(()=>{
      load.dismiss();
      this.showToast("Configuración hecha.");
      this.modalController.dismiss({ load_data: true, load_delete: false });
    },err=>{
      load.dismiss();
      this.showToast('Ha ocurrido un error, intentelo nuevamente');
    })
  }

  validateConnectDrive(){
    Storage.get({ key: 'data_drive' }).then((val) => {
      this.infoDrive = JSON.parse(val.value);
    });
    setTimeout(()=>{
      console.log('obtenerdataDrive', this.infoDrive);
    }, 100);
  }



  async connectDriveAndroid(){
   const res = await GoogleAuth.signIn();
    if(res){
      this.dataDrive = {
        accessToken: res.authentication.accessToken,
        displayName: res.name,
        idToken: res.authentication.idToken,
        userId: res.id,
        email: res.email
      };
      this.authservice.guardardataDrive(this.dataDrive);
      this.statusConnectDrive = true;
      this.showToast('Conexión establecida con Drive.');

    }else{
      console.log("ha ocurrido el siguente error", res);
      this.showToast('No se ha establecido la conexión con Drive.');
    }

  }


  async modalDrive() {
    const modal = await this.modalController.create({
      component: FolderDrivePage,
      cssClass: 'my-custom-class',
      componentProps: {
        'nombre': 'Douglas'
      },
      swipeToClose: true
    });
    modal.onDidDismiss().then((dataReturned) => {
      console.log(dataReturned.data);
      let response = dataReturned.data.selected_folder;
      if (dataReturned.data.dismissed) {
        this.folder = response.id;
        this.route = "Drive/"+response.name+"/";
      }
    });
    return await modal.present();
  }

  async deleteAction(){
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: '¿Eliminar atajo?',
      subHeader: 'Se eliminará el atajo configurado.',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        }, {
          text: 'Aceptar',
          handler: () => {
            this.deleteConfirm();
          }
        }
      ]
    });
    await alert.present();
  }

  async deleteConfirm(){
    let load = await this.loading.create();
    load.present();
    this.peticiones.postmethod({ 'button': this.boton }, "api/accion/delete").subscribe((ele: any) => {
      load.dismiss();
      this.showToast("Configuración eliminada.");
      this.modalController.dismiss({ load_data: true, load_delete: true });
    }, err => {
      load.dismiss();
      this.showToast("Ha ocurrido un error inesperado.");
    });
  }


  /**
   * 
   * 
   * 
   * usar opcion refresh pero toca gurdar datos como el id el email el nombre en la variable del perfil pq el metodo refresh no las tiene
   * 
   */
  trySilentLogin(){
    GoogleAuth.signIn().then(res => {
      
      console.log("Ok trySilentLogin", res);
      this.statusConnectDrive = true;
      this.dataDrive = {
        accessToken: res.authentication.accessToken, 
        displayName: res.name, 
        idToken: res.authentication.idToken, 
        userId: res.id, 
        email: res.email
      };
      this.authservice.guardardataDrive(this.dataDrive);
    })
    .catch(err => console.log("Error trySilentLogin", err)); 
  }
  logoutGoogle(){
    GoogleAuth.signOut().then(res => {
      this.showToast('Cuenta desconectada.');
      this.statusConnectDrive = false;
    })
    .catch(err => {
      console.error("Error logoutGoogle", err);
      this.showToast('Ha ocurrido un error inesperado.');
    });

  }

  accion(accion, type_save = null) {
    switch (accion) {
      case 1:
        if (type_save == 1) return "Correo - Imagen";
        if (type_save == 2) return "Correo - Texto";
        return "Correo - Img. y texto";
        break;
      case 2:
        return "Subir a la nube";
        break;
      case 3:
        return "Redes sociales";
        break;
      case 4:
        return "Agendar en teléfono";
        break;
      default:
        return 'Sin acción configurada';
        break;
    }
  }

  stringRedSocial(accion) {
    switch (accion.social_share) {
      case 1:
        if (accion.type_save == 1) return "WhatsApp - Imagen";
        if (accion.type_save == 2) return "WhatsApp - Texto";
        return "WhatsApp - Img. y texto";
        break;
      case 2:
        return "Instagram";
        break;
      case 3:
        return "Facebook";
        break;
      case 4:
        return "Twitter";
        break;
      default:
        return 'Error';
        break;
    }
  }
  
  stringNube(data){
    if (data.type_cloud == 1){
      if (data.type_save == 1) return "Google Drive - Img.";
      if (data.type_save == 2) return "Google Drive - Doc.";
      return "Google Drive - Img. y Doc.";
    }else if (data.type_cloud == 2){
      return "Dropbox";
    }else{
      return "No hay información.";
    }
  }

  showToast(message: string){
    this.toastController.create({
      message: message, 
      duration: 5000, 
      position: 'top'
    }).then((toast) => { 
      toast.present();
    }); 
  }

  ionViewDidEnter(){
    GoogleAuth.init();
  }

}
