import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PhotoViewer } from '@ionic-native/photo-viewer/ngx';
import { AlertController, ModalController, NavController, LoadingController, ToastController, Platform } from '@ionic/angular';
import { PeticionesService } from '../services/peticiones.service';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { AgendartareaPage } from '../agendartarea/agendartarea.page';
import { HttpClient } from '@angular/common/http';
//import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { AuthService } from '../services/auth.service';
import { Storage } from '@capacitor/storage';
import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';

@Component({
  selector: 'app-pagedetail',
  templateUrl: './pagedetail.page.html',
  styleUrls: ['./pagedetail.page.scss'],
})
export class PagedetailPage implements OnInit {

  infoDrive: any;
  page = 0;
  detailpage:any = {};
  botones=[];
  itemSelected:any;
  statusEditOCR = false;
  modelTextOCR = "";
  statusDriveImgDoc = false;
  statusSendDrive = false;
  statusSendDriveDoc = false;

  constructor
    (
      public peticiones: PeticionesService,
      public alertController: AlertController,
      private actRoute: ActivatedRoute,
      private photoViewer: PhotoViewer,
      private socialSharing: SocialSharing,
      public nav: NavController, 
      public modalController: ModalController,
      private http_: HttpClient,
      private loadingController: LoadingController,
      private toastController: ToastController,
      private navCtrl: NavController,
      private platform: Platform,
  //    private googlePlus: GooglePlus,
      private authservice: AuthService
    ) {
    this.page = this.actRoute.snapshot.params.id;

  }

  ngOnInit() {
    this.cargarpag();
    this.obteneratajosguardados();
  }
  ionViewDidEnter(){
    GoogleAuth.init();
  }
  async cargarpag() {
    const load = await this.loadingController.create({
      message: 'Cargando...'
    });
    load.present();
    this.peticiones.getMethod('api/scan/detail/' + this.page).subscribe((ele: any) => {
      load.dismiss();
      console.log(ele);
      this.detailpage = ele.data;
      this.modelTextOCR = ele.data.text;
    }, err => {
      console.log("er",err);
      load.dismiss();
      this.showToast("Ha ocurrido un error cargando los datos.");
      this.navCtrl.pop();
    });
  }
  obteneratajosguardados() {
    this.peticiones.getMethod('api/accion/list').subscribe((rsp: any) => {
      this.botones=rsp?.data;
      });   
  }

  preview(link) {

    let options = {
      share: true, // default is false
      closeButton: true, // default is true
      copyToReference: true, // default is false
      headers: "",  // If it is not provided, it will trigger an exception
      piccasoOptions: {} // If it is not provided, it will trigger an exception
    };

    this.photoViewer.show(link, 'escaneado', options);
  }

  boton(boton) {
    switch (boton) {
      case 1:
        return "md-sol";
        break;
      case 2:
        return "heart";
        break;
      case 3:
        return "md-foco";
        break;
      case 4:
        return "md-reloj";
        break;
      case 5:
        return "md-monitor";
        break;
      default:
        return 'md-sol';
        break;
    }
  }

  enviarimagen(accion,email='',item){
    console.log(accion);
    switch (accion) {
      case 1:
        let urlImage = null;
        let text = null;
        if (item.type_save == 1) { // Imagen
          urlImage = [this.detailpage?.url_image+this.detailpage?.image];
        } else if (item.type_save == 2) { // Texto
          text = this.detailpage?.text;
        } else { // Ambos
          text = this.detailpage?.text;
          urlImage = [this.detailpage?.url_image+this.detailpage?.image];
        }
        return this.socialSharing.shareViaEmail(
          text,
          this.detailpage?.name, 
          [email],
          null, // CC: must be null or an array
          null, // BCC: must be null or an array
          urlImage          
          ).then((ok) => {
          console.log("ok todo",ok);
          
        }).catch((err) => {
          console.log("er",err);
          // Error!
        });
    
        break;
      case 2:
        this.itemSelected = {};
        this.itemSelected = item;
        this.validateConnectDrive();
        return "Subir a drive";
        break;
      case 3:
        this.compartirRedes(this.detailpage, item);
        return
          let options = {
          message: this.detailpage?.name,
          subject: '', // fi. for email
          files: [this.detailpage?.url_image+this.detailpage?.image]
        };
        return this.socialSharing.shareWithOptions(options).then((ok) => {
          console.log('ok',ok);
          // Success!
        }).catch((err) => {
          console.log("er",err);
          // Error!
        });
        
        break;
      case 4:
        return this.AgendarTares();
        break;
      default:
        return 'Sin accion configurada';
        break;
    }
  }

  async AgendarTares() {
    const modal = await this.modalController.create({
      component: AgendartareaPage,
      cssClass: 'my-custom-class',
      componentProps: {
        'fecha': this.detailpage?.date,
        'titulo': this.detailpage?.name,
        'calendar_array': this.detailpage?.calendar
      },
      swipeToClose: true,      
    });
    modal.onDidDismiss().then((dataReturned) => {
      console.log(dataReturned.data);
      
      if (dataReturned) {
        this.obteneratajosguardados();
      }
    });

    return await modal.present();
  }

  compartirRedes(object, accion){
     console.log('Hola entro aqui '+object.name + accion.social_share);
     switch (accion.social_share) {
      case 1:
        let urlImage = null;
        let text = null;
        if (accion.type_save == 1) { // Imagen
          urlImage = this.detailpage?.url_image+this.detailpage?.image
        } else if (accion.type_save == 2) { // Texto
          text = this.detailpage?.text;
        } else { // Ambos
          text = this.detailpage?.text;
          urlImage = this.detailpage?.url_image+this.detailpage?.image
        }
        return this.socialSharing.shareViaWhatsApp(
            this.detailpage?.name
//            ,urlImage 
//            ,text
            ).then((ok) => {
            console.log("ok todo",ok);
            
          }).catch((err) => {
            console.log("er",err);
            // Error!
          });
        break;
      case 2:
          var url_image = this.detailpage?.url_image+this.detailpage?.image;
          return this.socialSharing.shareViaInstagram(
            this.detailpage?.name, 
            url_image
            ).then((ok) => {
            console.log("ok todo",ok);
            
          }).catch((err) => {
            console.log("er",err);
            // Error!
          });
        break;
      case 3:
          var url_image = this.detailpage?.url_image+this.detailpage?.image;
          return this.socialSharing.shareViaFacebook(
            this.detailpage?.name, 
            url_image, 
            null // CC: must be null or an array
            ).then((ok) => {
            console.log("ok todo",ok);
            
          }).catch((err) => {
            console.log("er",err);
            // Error!
          });
        break;
      case 4:
          return this.socialSharing.shareViaTwitter(
            this.detailpage?.name, 
            this.detailpage?.url_image+this.detailpage?.image, 
            this.detailpage?.url_image // CC: must be null or an array
            ).then((ok) => {
            console.log("ok todo",ok);
            
          }).catch((err) => {
            console.log("er",err);
            // Error!
          });
        break;
      default:
        return 'md-estrella';
        break;
    }

  }

  shareSocialMedia(){
    let options = {
      message: this.detailpage?.name,
      subject: '', // fi. for email
      files: [this.detailpage?.url_image+this.detailpage?.image]
    };
    return this.socialSharing.shareWithOptions(options).then((ok) => {
      console.log('ok',ok);
      // Success!
    }).catch((err) => {
      console.log("er",err);
      // Error!
    });
  }

  async sendDrive(item: any){
    this.obteneriamge(this.detailpage.image, item.folder, this.detailpage?.name);
    /* const alert = await this.alertController.create({
      header: 'Nombre de la imagen:',
      inputs: [
        { name: 'name', type: 'text', value: this.detailpage?.name, placeholder: 'Nombre' }
      ],
      buttons: [
        {
          text: 'Cancelar', role: 'cancel'
        }, {
          text: 'Aceptar',
          handler: (data) => {
            if (!data.name) {
              this.showToast('Debes incluir un nombre.');
              return;
            }else{
              this.obteneriamge(this.detailpage.image, item.folder, data.name);
            }
          }
        }
      ]
    });
    await alert.present(); */
  }
  async sendDriveDoc(item: any){
    this.create_google_docu(this.detailpage?.name, item.folder);
    /* const alert = await this.alertController.create({
      header: 'Nombre del documento:',
      inputs: [
        { name: 'name', type: 'text', value: this.detailpage?.name, placeholder: 'Nombre' }
      ],
      buttons: [
        {
          text: 'Cancelar', role: 'cancel'
        }, {
          text: 'Aceptar',
          handler: (data) => {
            if (!data.name) {
              this.showToast('Debes incluir un nombre.');
              return;
            }else{
              this.create_google_docu(data.name);
            }
          }
        }
      ]
    });
    await alert.present(); */
  }

  async obteneriamge(name_image, folder, name_drive){
    const load = await this.loadingController.create({
      message: 'Obteniendo imagen...'
    });
    load.present();
    let url = this.peticiones.dominio;
    let options= {
      headers:{'Authorization':'Bearer ' +this.peticiones.token} 
    }
    this.http_.get(`${url}/api/scan/image?image=${name_image}`)
    .subscribe(async (ele)=>{
      load.dismiss();
      let eled:any=ele;
      const blobData = this.b64toBlob(eled.data, `image/jpge`);
      this.create_google_file(blobData, folder, name_drive)
    }, (err) =>{
      console.log("err",err);
      load.dismiss();
      this.showToast('Ha ocurrido un error con el servidor.');
    });
  }

  async create_google_file(image_blob, folder, name_drive){
    const load = await this.loadingController.create({
      message: 'Subiendo a Google Drive...'
    });
    load.present();
    let options= {
      headers:{'Authorization':'Bearer ' + this.infoDrive.accessToken } 
    } 
    let folder_send = null;
    if(folder) folder_send=[folder];
    const form = new FormData();
    form.append('metadata', new Blob([JSON.stringify({name: name_drive,mimeType: "image/jpeg" ,parents: folder_send})], {type: 'application/json'}));
    form.append('file', image_blob);
    this.http_.post("https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart",form,options).subscribe((elemt)=>{
      load.dismiss();
      this.showToast("Imagen cargada correctamente a su Drive.", "¡Perfecto!");
      if (this.statusDriveImgDoc) this.sendDriveDoc(this.itemSelected); // Ambos
    }, (err) =>{
      console.log("err",err);
      load.dismiss();
      this.showToast('Error conectando con Google Drive. Confirme su cuenta.');
      this.connectDrive();
    });
  }

  async editPage(value = false) {
    if (value || this.detailpage.status_edit == 0) {
      const alert = await this.alertController.create({
        header: 'Actualizar nombre:',
        inputs: [
          {
            name: 'name',
            type: 'text',
            value: this.detailpage?.name,
            placeholder: 'Nombre documento'
          }
        ],
        buttons: [
          {
            text: 'Cancelar',
            role: 'cancel'
          }, {
            text: 'Aceptar',
            handler: (data) => {
              if (!data.name) {
                this.showToast('Debes incluir un nombre.')
                return;
              }else{
                this.changeName(data);
              }
            }
          }
        ]
      });
      await alert.present();
    }else{
      if (this.detailpage.status_edit != 0) {
        if (this.statusSendDrive) { this.sendDrive(this.itemSelected); this.statusSendDrive = false; }
        if (this.statusSendDriveDoc) { this.sendDriveDoc(this.itemSelected); this.statusSendDriveDoc = false; } 
        if (this.statusDriveImgDoc) { this.sendDrive(this.itemSelected); }
      }
    }
  }

  async changeName(data){
    const load = await this.loadingController.create({
      message: 'Actualizando...'
    });
    load.present();
    let params = { id: this.detailpage.id, name: data.name };
    this.peticiones.postmethod(params,'api/scan/edit').subscribe(()=>{
      load.dismiss();
      this.detailpage.name = data.name;
      this.cargarpag();
      // Cargar dependiendo el metodo seleccionado
      if (this.statusSendDrive) { this.sendDrive(this.itemSelected); this.statusSendDrive = false; }
      if (this.statusSendDriveDoc) { this.sendDriveDoc(this.itemSelected); this.statusSendDriveDoc = false; } 
      if (this.statusDriveImgDoc) { this.sendDrive(this.itemSelected) }
    },err=>{
      load.dismiss();
      this.showToast('Ha ocurrido un error, intentelo nuevamente');
    });
  }

  async deletePage() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: '¿Eliminar documento?',
      subHeader: 'Se eliminará el documento "'+this.detailpage.name+'".',
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
    const load = await this.loadingController.create({
      message: 'Eliminando...'
    });
    load.present();
    this.peticiones.postmethod({ id: this.detailpage.id }, 'api/scan/delete').subscribe(()=>{
      load.dismiss();
      this.showToast('Documento eliminado correctamente.');
      this.navCtrl.pop();
    },err=>{
      load.dismiss();
      this.showToast('Ha ocurrido un error, intentelo nuevamente.');
    });
  }

  b64toBlob(b64Data, contentType = '', sliceSize = 512) {
    const byteCharacters = atob(b64Data);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);

      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }

    const blob = new Blob(byteArrays, { type: contentType });
    return blob;
  }

  validateConnectDrive(){
    Storage.get({ key: 'data_drive' }).then((val) => {
      this.infoDrive = JSON.parse(val.value);
    });
    setTimeout(()=>{
      console.log('obtenerdataDrive', this.infoDrive);
      if (this.infoDrive) {
        if (this.itemSelected.type_save == 1){ 
          this.statusSendDrive = true;
          // this.sendDrive(this.itemSelected); 
        } else if (this.itemSelected.type_save == 2){ 
          this.statusSendDriveDoc = true;
          // this.sendDriveDoc(this.itemSelected); 
        } else{
          this.statusDriveImgDoc = true;
          // this.sendDrive(this.itemSelected); 
        }
        this.editPage();
      }
      else { 
        this.showToast('Necesita conectar su cuenta de Drive.');
        this.connectDrive();
      }
    }, 100);
  }

  showToast(message: string, header = null){
    this.toastController.create({
      header: header,
      message: message, 
      duration: 5000, 
      position: 'top',
      color: 'dark',
    }).then((toast) => { 
      toast.present();
    }); 
  }

  async create_google_docu(title: string, folder: string){
    const load = await this.loadingController.create({
      message: 'Creando documento en Drive...'
    });
    load.present();
    let options= {
      headers:{'Authorization':'Bearer ' + this.infoDrive.accessToken } 
    } 
    let folder_send = null;
    if(folder) folder_send=[folder];
    let body = { 
      title: title
      /* mimeType: 'application/vnd.google-apps.document',
      parents: folder_send */
    };
    this.http_.post("https://docs.googleapis.com/v1/documents",body,options).subscribe((ele: any)=>{
      load.dismiss();
      console.log(ele.documentId);
      this.add_text_doct_google(ele.documentId);
      //this.showToast("Imagen cargada correctamente a su ruta configurada.");
    }, err => {
      load.dismiss();
      console.log("err", err);
      this.showToast('Ha ocurrido un error creando el documento. Confirme su cuenta de Drive.');
      this.connectDrive();
    });
  }
  async add_text_doct_google(documentId){
    const load = await this.loadingController.create({
      message: 'Guardando información...'
    });
    load.present();
    let options= {
      headers:{'Authorization':'Bearer ' + this.infoDrive.accessToken } 
    } 
    let body = {requests:[{"insertText":{"text": this.detailpage.text ,"location":{"index":1}}}]};

    this.http_.post(`https://docs.googleapis.com/v1/documents/${documentId}:batchUpdate`,body,options).subscribe((ele: any)=>{
      load.dismiss();
      this.showToast("El documento ha sido creado y guardado en su Drive.", "¡Perfecto!");
      if (this.statusDriveImgDoc) this.statusDriveImgDoc = false;
    }, err =>{
      load.dismiss();
      console.log("error", err);
      this.showToast("Ha ocurrido un error insertando el texto en el documento.");
    });
  }

  async obteneriamgegt(name_image, folder, name_drive){
    const load = await this.loadingController.create({
      message: 'Obteniendo imagen...'
    });
    load.present();
    let url = this.peticiones.dominio;
    let options= {
      headers:{'Authorization':'Bearer ' +this.peticiones.token,} 
    }
    this.http_.get(`${url}/api/scan/image?image=${this.detailpage.image}`)
    .subscribe(async (ele)=>{
      load.dismiss();
      let eled:any=ele;
      this.ocr_google(eled.data);
      //const blobData = this.b64toBlob(eled.data, `image/jpge`);
      //this.create_google_file(blobData, folder, name_drive)
    });
  }

  ocr_google(image) {
   /* let options= {
      headers:{'Authorization':'Bearer ya29.a0AfH6SMAGM2t7z33ZuQav6AbAQlC_2b5bwdUrA97AQSU1W1BtnAOFnDl2ur-8DefPLO-ULNQt5MtvPSuhzdDOHRwHH8FvvH776efKJOgQfIXb3mIsqaNqxv338lpip5tladnoV7XVkUM5Z9MXXIM0JcESxZ7-' } 
    } */
    let body = {
      "requests": [
      {
      "features": [
      {
      "type": "DOCUMENT_TEXT_DETECTION",
      "maxResults": 10
      }],
      "image": {
      "content": image
      }}]}

    this.http_.post(`https://vision.googleapis.com/v1/images:annotate?key=AIzaSyBTNb558ORou0i8iC-XkhGVvfTBsUYyUz8`,body).subscribe((ele: any)=>{
      //load.dismiss();
      console.log(ele);
      //this.showToast("Imagen cargada correctamente a su ruta configurada.");
    });
  }

  connectDrive(){
    if (this.platform.is('android')) {
      this.connectDriveAndroid();
    } else if (this.platform.is('ios')) {
      this.connectDriveAndroid();
      //this.showToast('Función no habilitada para iOS.');
    }
  }

  async connectDriveAndroid(){
const res = await GoogleAuth.signIn().then((res) => {
      console.log(res);
      let dataDrive = {
        accessToken: res.authentication.accessToken,
        displayName: res.name,
        idToken: res.authentication.idToken,
        userId: res.id,
        email: res.email
      };
      this.authservice.guardardataDrive(dataDrive);
      this.showToast('Conexión establecida con Drive.');
      this.validateConnectDrive();
    })
    .catch((err) => {
      console.log("ha ocurrido el siguente error", err);
      this.showToast('No se ha establecido la conexión con Drive.');
    });
  }

  editOCR(){
    this.statusEditOCR = true;
    this.modelTextOCR = "";
    this.modelTextOCR = this.detailpage.text;
  }

  async saveTextOCR(){
    if(!this.modelTextOCR){
      this.showToast('Debes incluir un texto en el campo.'); return;
    }

    const load = await this.loadingController.create({
      message: 'Guardando cambios...'
    });
    load.present();
    this.peticiones.postmethod({id: this.detailpage.id, new_text: this.modelTextOCR },'api/scan/ocr/edit').subscribe((data)=>{
      load.dismiss();
      this.statusEditOCR = false;
      this.showToast('Cambios guardados correctamente.');
      this.cargarpag();
    }, (err) =>{
      console.log("err",err);
      load.dismiss();
      this.statusEditOCR = false;
      this.showToast('Ha ocurrido un error inesperado.');
    });
  }

  cancelTextOCR(){
    this.statusEditOCR = false;
    this.cargarpag();
  }

  addAtajo(){
    this.showToast('Aquí puede configurar sus atajos.');
    this.nav.navigateForward('/tabs/tab4');
  }

  stringAccion(item: any) {
    switch (item.accion) {
      case 1:
        if (item.type_save == 1) return "Correo - Imagen";
        if (item.type_save == 2) return "Correo - Texto";
        return "Correo - Img. y texto";
        break;
      case 2:
        if (item.type_cloud == 1){
          if (item.type_save == 1) return "Google Drive - Img.";
          if (item.type_save == 2) return "Google Drive - Doc.";
          return "Drive - Img y Doc";
        }else if (item.type_cloud == 2){
          return "Dropbox";
        }else{
          return "No hay información.";
        }
        break;
      case 3:
        return this.stringRedSocial(item);
        break;
      case 4:
        return "Agendar en teléfono";
        break;
      default:
        return 'Sin acción configurada';
        break;
    }
  }

  stringRedSocial(item) {
    switch (item.social_share) {
      case 1:
        if (item.type_save == 1) return "WhatsApp - Imagen";
        if (item.type_save == 2) return "WhatsApp - Texto";
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
}
