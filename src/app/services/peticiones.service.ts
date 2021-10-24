import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { AlertController, NavController, Platform } from '@ionic/angular';
import { Storage } from '@capacitor/storage';
import { AppTrackingTransparency } from "capacitor-ios-app-tracking";



@Injectable({
  providedIn: 'root'
})
export class PeticionesService {
  dominio = 'https://disonex.virtual-tec.club/public/'; keyGoogle = 'AIzaSyDoTfFvP7SjJ_Ff9tYiT-an9xL3PWK0FgM';
  protocolos = [];
  protocolos_cargados: boolean = false;
  noticias = [];
  noticias_cargadas: boolean = false;
  usuario: any;
  token: any;
  isloged: boolean;
  tienegrupofamiliar: boolean = false;
  grupofamiliar = [];
  idioma = '1';
  miinfo: any;
  contador: any;
  notitoken = "";

  constructor(
    private http_: HttpClient,
    public translate: TranslateService,
    private socialSharing: SocialSharing,
    public alertController: AlertController,
    private nav: NavController,
    private platform: Platform  ) {
  }
  navegar(link) {
    if (link) {
      this.nav.navigateForward(link);
    } else {
      this.nav.back();
    }    
  }
  getpermision(){
    AppTrackingTransparency.getTrackingStatus().then((response) => {
      AppTrackingTransparency.requestPermission().then((res) => console.log(res))
    })
    .catch((err: Error) => {
      AppTrackingTransparency.requestPermission().then((res) => console.log(res))
    });
  }

  public cargarprotocolos() {

  }

  public cargarnoticias() {

  }
  public getMethod(endpont, url = this.dominio, optionsData = null) {
    if (!url) {
      url = this.dominio;
    }
    let options: any;
    if (optionsData) {
      options = optionsData;
    } else {
      options = { headers: { 'Authorization': 'Bearer ' + this.token } };
    }

    return this.http_.get(url + endpont, options);
  }
  public async getMethodasync() {
    let personalinf = await this.cargarvariables();
  }


  public postmethod(params, endpont, url = this.dominio) {
    let options = {
      headers: { 'Authorization': 'Bearer ' + this.token }
    }

    return this.http_.post(url + endpont, params, options);
  }

  public guardartoken(token) {
    this.notitoken = token;
    Storage.set({ key: 'notificaciontoken', value: token }).then(() => {
      if (this.token) {
        // iOS: 1 - Android: 2
        let device_notification = 1;
        if (this.platform.is('android')) device_notification = 2;
        this.postmethod({ token_notificacion: token, device_notification: device_notification }, 'api/guardartoken').subscribe(() => {
        }, err => {
          console.log("err", err);
        });
      }
    });

  }


  public cargarvariables() {
    return new Promise(resolve => {
      Storage.get({ key: 'isLoged' }).then((isloged) => {
        if (isloged.value == '1') {
          Storage.get({ key: 'token' }).then((token) => {
            this.token = token.value;
            Storage.get({ key: 'completeinfo' }).then((completeinfo) => {
              this.iniciarcargue();
              console.log(completeinfo);
              if (completeinfo.value == "1") {
                resolve(1);
              } else {
                resolve(2)
              }
            });
          })
        } else {
          this.getDeviceLanguage();
          resolve(false);
        }
      })



    });
  }

  iniciarcargue() {
    console.log("entro al cargue de diomas");
    Storage.get({ key: 'idioma' }).then((idiomac) => {
      if (idiomac.value) {
        this.idioma = idiomac.value;
        this.cargarprotocolos();
        this.cargarnoticias();

        this.translate.setDefaultLang('https://disonex.virtual-tec.club/public/api/idioma/' + this.idioma);
      } else {
        this.getDeviceLanguage();
      }
    })

  }
  cambiaridioma(idiomase) {
    this.idioma = idiomase;
    this.cargarprotocolos();
    this.cargarnoticias();
    Storage.set({ key: 'idioma', value: idiomase });
    console.log("nuevoidioma", idiomase);
    this.translate.setDefaultLang('https://disonex.virtual-tec.club/public/api/idioma/' + idiomase);

  }

  getDeviceLanguage() {
    this.cambiaridioma('1');
  }


  limpiartodo() {
    Storage.clear();
    Storage.set({ key: 'intro', value: '1' });
  }
  compartir(item) {
    let options = {
      message: item.titulo,
      subject: '', // fi. for email
      files: [item.imagen_principal],
      url: item.archivos
    };
    this.socialSharing.shareWithOptions(options).then(() => {
      // Success!
    }).catch(() => {
      // Error!
    });
  }
  nuervaf() {
    this.http_.get(this.dominio + 'api/login2/', { headers: { Accept: 'application/json' } }).subscribe((respuesta) => {
      this.contador = respuesta;
    }, err => {
      console.log("hubo este error asl cargar tu info", err);
    })
  }
  cerrar() {
    this.alertController.create({
      subHeader: 'Ha ocurrido un error',
      message: 'Su dispositivo no se puede conectar a nuestro servidor, presione aceptar, luego de esto si esta conectado a wifi por favor cambiarse a datos moviles, si esta en datos moviles por favor cambiarse a wifi e intentarlo nuevamente, si el problema persiste por favor comunicarse con enfermeria',
      buttons: [
        {
          text: 'cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Cancelar Cancel: blah');
          }
        }, {
          text: 'Aceptar',
          role: 'confirm',
          cssClass: 'secondary',
          handler: (blah) => {

            navigator['app'].exitApp();

          }
        }]
    }).then((alt) => {
      alt.present();
    });
  }
  departamentos() {
    return this.getMethod('/api/departamento');
  }
  ciuidades(departamento) {
    return this.getMethod('/api/municipio/' + departamento);
  }
  validarqr(qr) {
    return this.getMethod('/api/qr/verficate?url=' + qr);
  }
  validarqr2(qr) {
    return this.getMethod('/api/scan/verificate/' + qr);
  }
  validarqr3(qr) {
    return this.getMethod('/api/qr/addproducto?url=' + qr);
  }
  uploadImage(blobData, name, ext, qr, blockText, type_ocr, status_scan, id_product = null) {
    const formData = new FormData();
    formData.append('file', blobData, `myimage.${ext}`);
    formData.append('name', name);
    formData.append('qr', qr);
    formData.append('text_ocr', blockText);
    formData.append('type_ocr', type_ocr);
    formData.append('status_scan', status_scan);
    formData.append('id_product', id_product);

    let url = this.dominio;
    let options = {
      headers: { 'Authorization': 'Bearer ' + this.token }
    }


    return this.http_.post(`${url}/api/scan/register`, formData, options);
  }

  uploadImageFile(file: any, name, qr) {
    const ext = file.name.split('.').pop();
    const formData = new FormData();
    formData.append('file', file, `myimage.${ext}`);
    formData.append('name', name);
    formData.append('qr', qr);
    let url = this.dominio;
    let options = {
      headers: { 'Authorization': 'Bearer ' + this.token }
    }

    return this.http_.post(`${url}/api/scan/register`, formData, options);
  }

  getimagens(page) {
    let url = this.dominio;
    let options = {
      headers: { 'Authorization': 'Bearer ' + this.token }
    }
    return this.http_.get(`${url}/api/scan/listscan?page=${page}`, options);
  }

  getProduct() {
    let url = this.dominio;
    let options = {
      headers: { 'Authorization': 'Bearer ' + this.token }
    }
    return this.http_.get(`${url}/api/product/listproduct`, options);
  }

  getProductId(id) {
    let url = this.dominio;
    let options = {
      headers: { 'Authorization': 'Bearer ' + this.token }
    }
    return this.http_.get(`${url}/api/scan/listscan/`+id, options);
  }
  parseJwt (token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
};

}
