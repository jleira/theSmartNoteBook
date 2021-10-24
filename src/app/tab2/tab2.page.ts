import { Component, ElementRef, OnInit, ViewChild, ViewChildren } from '@angular/core';
import { ActionSheetController, AlertController, LoadingController, NavController, Platform, ToastController } from '@ionic/angular';
import { PeticionesService } from '../services/peticiones.service';

import { ApiImage, ImageService } from '../services/image.service';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../services/auth.service';
//import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { IonSelect } from '@ionic/angular';
import * as ocr from 'ocrvtempanada';
import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';


@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit {
  @ViewChild('select1', { static: false }) selectRef: IonSelect;
  visibleSelect = false;
  dataProductsResults = [];
  idProductSelected = null;
  qrcod = null;
  name = '';
  statusValidateQR = null;
  blockText: any = [];
  dataUser: any;
  constructor(
    public navs: NavController,
    public peticiones: PeticionesService,
    private loading: LoadingController,
    public toastController: ToastController,
    private api: ImageService,
    private plt: Platform,
    private actionSheetCtrl: ActionSheetController,
    private nav: NavController,
    private qrScanner: BarcodeScanner,
    private loadingController: LoadingController,
    private http_: HttpClient,
//    private googlePlus: GooglePlus,
    private authService: AuthService,
    private alertController: AlertController
  ) {
    // this.loadImages();
  }
  images: ApiImage[] = [];
  @ViewChild('fileInput', { static: false }) fileInput: ElementRef;
 
  ngOnInit() {
    this.cargardatos();
  }

  loadImages() {
    this.api.getImages().subscribe(images => {
      this.images = images;
    });
  }

  async selectImageSource() {
    const buttons = [
      {
        text: 'Take Photo',
        icon: 'camera',
        handler: () => {
//          this.addImage(CameraSource.Camera);
        }
      },
      {
        text: 'Choose From Photos Photo',
        icon: 'image',
        handler: () => {
//          this.addImage(CameraSource.Photos);
        }
      }
    ];

    // Only allow file selection inside a browser
    if (!this.plt.is('hybrid')) {
      buttons.push({
        text: 'Choose a File',
        icon: 'attach',
        handler: () => {
          this.fileInput.nativeElement.click();
        }
      });
    }

    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Select Image Source',
      buttons
    });
    await actionSheet.present();
  }

  async addImage(source: any) {
    let image: any;
/*     if (this.dataUser.plan == 1){
      image = await Camera.getPhoto({
        quality: 90,
        allowEditing: true,
        resultType: CameraResultType.Uri,
        source
      });
    }else{
      image = await Camera.getPhoto({
        quality: 90,
        allowEditing: true,
        resultType: CameraResultType.Base64,
        source
      });
    } */

    if (!this.qrcod) {
      this.toastController.create({
        message: '  La imagen debe tener un QR valido',
        duration: 5000,
        position: 'top'
      }).then((toast) => {
        toast.present();
      });
      return true;
    }

    let blobData: any;
    if (this.dataUser.plan == 1){ // Plan normal
      blobData = await fetch(image.webPath).then(r => r.blob());
    }else{ // Plan Premium
      blobData = await fetch(`data:image/jpeg;base64,${image.base64String}`).then(r => r.blob());
      //blobData = this.b64toBlob(image.base64String, `image/${image.format}`);
    }
  
    this.leerimagen(image, blobData);
  }

  async addImage2(image: any, blobData: any, text_google = null) {
    if (this.statusValidateQR == 1) {
      this.addImage3(image, blobData, text_google);
    }else{
      const alert = await this.alertController.create({
        cssClass: 'my-custom-class',
        header: 'Método',
        message: '¿Método a emplear?',
        buttons: [
          {
            text: 'Por agenda',
            handler: (blah) => {
              this.addImage3(image, blobData, text_google, 1);
            }
          }, {
            text: 'Por notas',
            handler: () => {
              this.addImage3(image, blobData, text_google, 2);
            }
          }
        ]
      });
      await alert.present();
    }
  }

  async addImage3(image: any, blobData: any, text_google = null, status_scan = null) {
    let load = await this.loading.create();
    load.present();
    let blockText: any = JSON.stringify(this.blockText);
    if (text_google) blockText = text_google;
    this.peticiones.uploadImage(blobData, this.name, image.format, this.qrcod, blockText, this.dataUser.plan, status_scan, this.idProductSelected).subscribe((resp: any) => {
      console.log(resp);
      this.toastController.create({
        message: 'Imagen agregada',
        duration: 5000,
        position: 'top'
      }).then((toast) => {
        toast.present();
        this.qrcod = null;
      });
      load.dismiss();
      this.navegar('/pagedetail/' + resp.id);
    }, err => {
      console.log(err);
      load.dismiss();
      this.toastController.create({
        message: 'Ha ocurrido un error, intentelo nuevamente',
        duration: 5000,
        position: 'top'
      }).then((toast) => {
        toast.present();
        this.qrcod = null;
      });
    });
  }

  // Used for browser direct file upload
  async uploadFile(event: EventTarget) {
  //  const eventObj: MSInputMethodContext = event as MSInputMethodContext;
//    const target: HTMLInputElement = eventObj.target as HTMLInputElement;
//    const file: File = target.files[0];

    let load = await this.loading.create();
    load.present();
    this.peticiones.uploadImageFile('', this.name, this.qrcod).subscribe((resp: any) => {
      console.log(resp);
      this.toastController.create({
        message: 'Imagen agregada',
        duration: 5000,
        position: 'top'
      }).then((toast) => {
        toast.present();
        this.qrcod = null;
      });

      load.dismiss();
    }, err => {
      console.log(err);
      load.dismiss();
      this.toastController.create({
        message: 'Ha ocurrido un error, intentelo nuevamente',
        duration: 5000,
        position: 'top'
      }).then((toast) => {
        toast.present();
        this.qrcod = null;
      });
    });
  }

  deleteImage(image: ApiImage, index) {
    this.api.deleteImage(image._id).subscribe(res => {
      this.images.splice(index, 1);
    });
  }

  // Helper function
  // https://stackoverflow.com/questions/16245767/creating-a-blob-from-a-base64-string-in-javascript
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
  escanear() {
    ocr.Principal.echo({value:'hello'}).then((hola)=>{
      console.log(hola,'hola es esto');
    },err=>{
      console.log(err,'hola es error');
    })
  }
  async escanear2() {
    const load = await this.loading.create({
      cssClass: 'my-custom-class',
      message: 'Escaneando...',
      duration: 10000
    });

    load.present();
    //this.simularqr("60809fc9bea9d"); return;
    this.qrScanner.scan().then((obj: any) => {
      load.dismiss();
      this.simularqr(obj.text);
    }, err => {
      console.log(err);
      load.dismiss();
    });
  }

  //60802fc11e798
  //60809f956ccb2
  async simularqr(qr) {
    let load = await this.loading.create();
    load.present();
    this.statusValidateQR = null;
    this.dataProductsResults = [];
    this.idProductSelected = null;
    this.peticiones.validarqr2(qr).subscribe((resp: any) => {
      this.qrcod = qr;
      load.dismiss();
      this.statusValidateQR = resp.status;
      console.log("resp", resp);
      if (resp.count && resp.count > 1){
        this.visibleSelect = true;
        this.dataProductsResults = resp.data;
        this.selectRef.open();
        this.toastController.create({
          message: 'Para continuar, seleccione producto.', duration: 5000, position: 'top'
        }).then((toast) => { toast.present(); });
      }else{
        this.toastController.create({
          message: '¡QR válido!',
          duration: 5000,
          position: 'top'
        }).then((toast) => {
          toast.present();
 //         this.addImage(CameraSource.Camera);
        });
      }
    }, err => {
      load.dismiss();
      this.toastController.create({
        message: 'Este código no existe',
        duration: 5000,
        position: 'top'
      }).then((toast) => {
        toast.present();
      });

    })
  }
  changeSelectProduct(value: any){
    if (value){
      this.visibleSelect = false;
      this.idProductSelected = value;
      this.toastController.create({
        message: 'Continuando proceso...', duration: 5000, position: 'top'
      }).then((toast) => { 
        toast.present();
   //     this.addImage(CameraSource.Camera);
      });
    }else{
      this.toastController.create({
        message: 'Por favor, seleccione el producto.', duration: 5000, position: 'top'
      }).then((toast) => { toast.present(); });
    }
  }

  navegar(link: any) {
    this.nav.navigateForward(link);
  }

  async leerimagen(image: any, blobData: any) {
    console.log("url",image.path);
    if (this.dataUser.plan == 1){ // Validate plan Normal
/*       this.ocr.recText(OCRSourceType.NORMFILEURL, image.path)
      .then((res: OCRResult) => {
        console.log("res.blocks.blocktext", res.blocks.blocktext);
 */        this.blockText = 'res.blocks.blocktext';
/*         this.addImage2(image, blobData);
      })
      .catch((error: any) => console.error(error)); 
 */    }else{ // Validate plan Premium
      console.log("Plan Premium");
      console.log("image", image);
      const load = await this.loadingController.create({
        message: 'Lectura texto con Google...'
      });
      load.present();
      let body = {
        "requests": [
          {
            "features": [
              {
                "type": "DOCUMENT_TEXT_DETECTION",
                "maxResults": 10
              }
            ],
            "image": {
              "content": image.base64String
            }
          }
        ]
      };
      this.http_.post(`https://vision.googleapis.com/v1/images:annotate?key=${this.peticiones.keyGoogle}`,body).subscribe((ele: any)=>{
        load.dismiss();
        console.log("Google response", ele);
        this.addImage2(image, blobData, ele.responses[0].fullTextAnnotation.text);
        //this.showToast("Imagen cargada correctamente a su ruta configurada.");
      }, err => {
        load.dismiss();
        console.log("err", err);
        this.toastController.create({
          message: 'Ha ocurrido un error inesperado.', duration: 5000, position: 'top'
        }).then((toast) => {
          toast.present();
        });
      });
    }
  }

  async cargardatos(){
    const load = await this.loadingController.create({
      message: 'Cargando...'
    });
    load.present();
    this.peticiones.getMethod('api/profileapp').subscribe((ele: any) => {
      load.dismiss();
      this.dataUser = ele.user;
      console.log(ele);
    }, err => {
      load.dismiss();
      console.log("hubo este error asl cargar tu info", err);
    })
  }
  
  trySilentLogin(){
    GoogleAuth.signIn().then(res => {
      const dataDrive = {
        accessToken: res.authentication.accessToken, 
        displayName: res.name, 
        idToken: res.authentication.idToken, 
        userId: res.id, 
        email: res.email
      };
      this.authService.guardardataDrive(dataDrive);
    })
    .catch(err => console.log("Error trySilentLogin", err)); 
  }

  async ionViewDidEnter(){ // Se activa cuando el enrutamiento del componente ha terminado de animarse.    
    let res= await GoogleAuth.init();
    this.trySilentLogin();
  }
}
