import { Component, Input, OnInit } from '@angular/core';
import { AlertController, LoadingController, ModalController, ToastController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { PeticionesService } from 'src/app/services/peticiones.service';
import { HttpClient } from '@angular/common/http';
import { Storage } from '@capacitor/storage';

@Component({
  selector: 'app-folder-drive',
  templateUrl: './folder-drive.page.html',
  styleUrls: ['./folder-drive.page.scss'],
})
export class FolderDrivePage implements OnInit {
  // Data passed in by componentProps
  @Input() nombre: string;
  dataFiles = [];
  infoUser: any;

  constructor(
    private modalController: ModalController,
    private loadingController: LoadingController,
    public peticiones: PeticionesService,
    private authService: AuthService,
    private toastController: ToastController,
    public alertController: AlertController,
    private http_: HttpClient
  ) {
    this.infoUser = authService.obtenerdataDrive();
    console.log("this.infoUser", this.infoUser);
  }

  ngOnInit() {
    this.getDataDrive();
  }

  getDataDrive(){
    Storage.get({ key: 'data_drive' }).then((val) => {
      this.infoUser = JSON.parse(val.value);
    });
    setTimeout(()=>{
      if (this.infoUser) { this.loadData(); }
      else{
        this.showToast("No estás conectado a Drive.");
        this.dismissModal();
      }
    }, 100);
  }

  async loadData(){
    const load = await this.loadingController.create({
      message: 'Cargando información...'
    });
    load.present();
    let options= {
      headers: { 'Authorization': 'Bearer ' + this.infoUser.accessToken } 
    }
    this.peticiones.getMethod("", "https://www.googleapis.com/drive/v3/files?key="+this.peticiones.keyGoogle+"&q=mimeType='application/vnd.google-apps.folder'", options).subscribe((ele: any) => {
      load.dismiss();
      console.log(ele);
      this.dataFiles = ele.files;
    }, err => {
      load.dismiss();
      this.showToast("Hubo un error con la conexión a Drive.");
      console.log("hubo este error asl cargar tu info", err);
    })
  }

  async selectedFolder(item: any) {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: '¿Usar esta carpeta?',
      message: 'Se usará la carpeta <strong>'+item.name+'</strong> para guardar archivos en su Drive.',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Aceptar',
          handler: () => {
            this.dismissModal(true, item);
          }
        }
      ]
    });

    await alert.present();
  }

  dismissModal(dismissed = false, selected_folder = null) {
    this.modalController.dismiss({
      'dismissed': dismissed,
      'selected_folder': selected_folder
    });
  }

  async create_google_folder(){
    const load = await this.loadingController.create({
      message: 'Creando carpeta en Google Drive...'
    });
    load.present();
    let options= {
      headers:{'Authorization':'Bearer ' + this.infoUser.accessToken } 
    } 
    /* let folder_send = null;
    if(folder) folder_send=[folder]; */
    const form = new FormData();
    //form.append('resource', new Blob([JSON.stringify({name: "Pruebas disonexxx", mimeType: "application/vnd.google-apps.folder"})], {type: 'application/json'}));
    form.append("name", "Pruebas disonexxx");
    form.append("mimeType", "application/vnd.google-apps.folder");
    this.http_.post("https://www.googleapis.com/upload/drive/v3/files?uploadType=media", { "metadata": {'name': 'Invoices', 'mimeType': 'application/vnd.google-apps.folder', 'parents' : ['1AS8MfSapoJbJ6Qwc6Qjok4_BQeslb6-l'], } },options).subscribe((elemt)=>{
      load.dismiss();
      this.showToast("Cargado correctamente.");
    }, (err) =>{
      console.log("err",err);
      load.dismiss();
      this.showToast('Error conectando con Google Drive. Confirme su cuenta.');
    });
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

}
