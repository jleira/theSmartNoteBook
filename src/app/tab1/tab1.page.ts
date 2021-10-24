import { Component, ViewChild } from '@angular/core';
import { PeticionesService } from '../services/peticiones.service';
import { NavController, AlertController, ModalController, IonInfiniteScroll, ToastController, LoadingController, ActionSheetController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';


//import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { AuthService } from '../services/auth.service'; 
import { ActivatedRoute } from '@angular/router';

import {
  PushNotifications,
  Token,
} from '@capacitor/push-notifications';
import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';


@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;

  imgfoto=null;
  picture;
  name;
  email;
  idioma = 0;
  inicial = 0;
  status_filter = 1;
  text_search = null;
  status_product = true;
  status_search = false;
  status_scansid = false;
  scansId: any;

paginas=[];
page=1;
  texto='';
  slideOpts = {
    slidesPerView: 2,
    coverflowEffect: {
      rotate: 50,
      stretch: 0,
      depth: 100,
      modifier: 1,
      slideShadow: true
    }
  }
  slideOpts2 = {
    slidesPerView: 1,
    coverflowEffect: {
      rotate: 50,
      stretch: 0,
      depth: 100,
      modifier: 1,
      slideShadow: true
    }
  }
  searchTerm = '';

  constructor(
    public peticiones: PeticionesService,
    private nav: NavController,
    public translate: TranslateService,
    public alertController: AlertController,
    public modalController: ModalController,
    private toastController: ToastController,
    private loadingController: LoadingController,
    public actionSheetController: ActionSheetController,
   // private googleplus: GooglePlus,
    private authservice: AuthService,
    private actRoute: ActivatedRoute
  ) {
    this.scansId = this.actRoute.snapshot.params.scansid;
  }

  ngOnInit() {
    this.loadPushNotification();
    if (this.scansId) { this.viewScansId(this.scansId); }
  }


  navegar(link) {
    if (this.status_product) {
      this.nav.navigateForward(link);  
    }else{
      this.cargarpag();
    }
    
  }

  async viewScansId(id: any, event=null){
    this.status_search = false;
    this.status_product = true;
    this.status_scansid = true;
    const load = await this.loadingController.create({
      message: 'Cargando...'
    });
    load.present();
    this.paginas = [];
    if(event) this.page = 1;
    this.peticiones.getProductId(id).subscribe((ele)=>{
      load.dismiss();
      console.log(ele);
      let eled:any=ele;
      this.paginas=eled.data.data;
      if(event) event.target.complete();
    },err=>{
      load.dismiss();
      this.showToast("Ha ocurrido un error, intentelo nuevamente.");
    });
  }

  async cargarpag(event=null){
    this.status_search = false;
    this.status_product = true;
    this.status_scansid = false;
    const load = await this.loadingController.create({
      message: 'Cargando datos...'
    });
    load.present();
    this.paginas = [];
    if(event) this.page = 1;
    this.peticiones.getimagens(this.page).subscribe((ele)=>{
      load.dismiss();
      let eled:any=ele;
      this.paginas=eled.data.data;
      this.page = 1;
      console.log(ele);
      if(event){
        event.target.complete();
      }
    },err=>{
      load.dismiss();
      this.showToast("Ha ocurrido un error, intentelo nuevamente.");
    });
  }

  cargarpag2(event=null){
    if(this.status_search==true)return;
    if(this.status_product==false)return;
    let pageact = this.page+1;
    this.peticiones.getimagens(pageact).subscribe((element:any)=>{
      if(element.data.data.length > 0){
        this.page=pageact;
        this.paginas = this.paginas.concat(element.data.data);
      }
        if(event){
          event.target.complete();
        }
      })
  }
  erroralert() {
    this.alertController.create({
      cssClass: 'my-custom-class',
      message: '<div><img class="miicon" src="/assets/custom-ion-icons/tenorng.gif" width="35px" height="35px"></div><br><h5>Su registro a sido guardado exitosamente</h5>',
      buttons: ['Aceptar']
    }).then((alerta) => {
      alerta.present();
      alerta.onDidDismiss().then(() => {
        console.log('redireccionar');
      });
    })
  }
  successalert() {
    this.alertController.create({
      cssClass: 'my-custom-class',
      message: '<div><img class="miicon" src="/assets/custom-ion-icons/errorg.gif" width="35px" height="35px"></div><br><h5>Ha ocurrido un error intentelo nuevamente</h5>',
      buttons: ['Aceptar']
    }).then((alerta) => {
      alerta.present();
      alerta.onDidDismiss().then(() => {
        console.log('redireccionar');
      });
    })

  }
  cambiaridioma() {
    console.log(this.idioma);
    this.translate.use('https://disonex.virtual-tec.club/public/api/idioma/' + this.idioma);
  }


  public async addPhotoToGallery() {
    this.imgfoto = null;
  }

  async deletePage(item) {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: '¿Eliminar documento?',
      subHeader: 'Se eliminará el documento "'+item.name+'".',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary'
        }, {
          text: 'Aceptar',
          handler: () => {
            this.deleteConfirm(item.id);
          }
        }
      ]
    });
    await alert.present();
  }

  async deleteConfirm(id: any){
    const load = await this.loadingController.create({
      message: 'Eliminando...'
    });
    load.present();
    this.peticiones.postmethod({ id: id }, 'api/scan/delete').subscribe(()=>{
      load.dismiss();
      this.showToast('Documento eliminado correctamente.');
      this.cargarpag();
    },err=>{
      load.dismiss();
      this.showToast('Ha ocurrido un error, intentelo nuevamente.');
    });
  }

  leerimagen(ur) {
    console.log("url",ur);
/*     this.ocr.recText(OCRSourceType.NORMFILEURL, ur)
      .then((res: OCRResult) => )
      .catch((error: any) => console.error(error));
 */  
      this.texto=JSON.stringify('res')
    }

  cargarpaginaproudcto(event=null){
    this.peticiones.getProduct().subscribe((ele)=>{
        console.log(ele);
        let eled:any=ele;
        this.paginas=eled.data.data;
        if(event){
          event.target.complete();
        }
      })
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

  yourSearchFunction(event=null){
    this.text_search = event;
    if (!event) {
      this.cargarpag();  
    }else{
      this.enviar();
    }
  }

  async presentActionSheet() {
    let text_accion = (this.status_product)?'Listar producto':'Listar Escaner';
    let icon = (this.status_product)?'grid-outline':'scan-outline';
    const actionSheet = await this.actionSheetController.create({
      header: 'SELECCIONAR FILTRO',
      buttons: [{
        text: 'Buscar por texto',
        icon: 'text-outline',
        handler: () => {
          this.text_search = this.searchTerm;
          this.status_filter = 1;
          this.enviar();
        }
      }, {
        text: 'Buscar por indice',
        icon: 'keypad-outline',
        handler: () => {
          this.text_search = this.searchTerm;
          this.status_filter = 2;
          this.enviar();
        }
      },{
        text: text_accion,
        icon: icon,
        handler: () => {
          this.listproduct();
        }
      },{
        text: 'Limpiar filtro',
        icon: 'refresh-outline',
        handler: () => {
          this.status_filter = 1;
          this.cargarpag();
        }
      }, {
        text: 'Cancelar',
        icon: 'close',
        role: 'cancel',
        handler: () => {
          console.log('Cancel clicked');
        }
      }]
    });
    await actionSheet.present();
    const { role } = await actionSheet.onDidDismiss();
  }

  async enviar(){
    this.status_search = true;
    if(!this.text_search) return;
    let params={
      search:this.text_search,
      type:this.status_filter
    }
    this.peticiones.postmethod(params,'api/scan/search').subscribe((respuesta:any)=>{
      console.log(respuesta);
      
      this.paginas = respuesta.data.data;
      this.page = 1;
    },err=>{
      this.toastController.create({
        message: 'Ha ocurrido un error, intentelo nuevamente',
        duration: 5000,
        position: 'top'
      }).then((toast) => {
        toast.present();
      });
    })
  }

  async listproduct (){
    if(this.status_product){
      const load = await this.loadingController.create({
        message: 'Cargando datos...'
      });
      load.present();
      this.paginas=[];
      let mipeticion:any = await this.peticiones.getProduct();
      mipeticion.subscribe((element:any)=>{
        //console.log(element, "Hola");
        load.dismiss();
        this.paginas =  element.data.data; 
      });
      this.status_product = !this.status_product;
    }else{
      this.cargarpag();
    }
      
      
      //this.paginas = mipeticion.data;   
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
      this.authservice.guardardataDrive(dataDrive);
    })
    .catch(err => console.log("Error trySilentLogin", err)); 
  }

  async ionViewDidEnter(){ // Se activa cuando el enrutamiento del componente ha terminado de animarse.
    
    let res= await GoogleAuth.init();
    this.trySilentLogin();
    if (!this.scansId) this.cargarpag();
  }

  loadPushNotification(){
    PushNotifications.addListener('registration',
      (token: Token) => {
        this.peticiones.guardartoken(token.value);
      }
    );
  }
  
}