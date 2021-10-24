import { Component, OnInit } from '@angular/core';
import { PeticionesService } from '../services/peticiones.service';
import { LoadingController, ModalController, NavController } from '@ionic/angular';
import { OpcionesatajoPage } from '../opcionesatajo/opcionesatajo.page';
//import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { AuthService } from '../services/auth.service';
import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';

@Component({
  selector: 'app-tab4',
  templateUrl: './tab4.page.html',
  styleUrls: ['./tab4.page.scss'],
})
export class Tab4Page implements OnInit {

  botones = [null, null, null, null, null];
  data_consulta:any = {};

  constructor(public peticiones: PeticionesService, public nav: NavController, public modalController: ModalController, private loadingController: LoadingController,
//    private googlePlus: GooglePlus,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.obteneratajosguardados();
    this.cargardatos();
  }
  navegar(link) {
    this.nav.navigateForward(link);
  }


  async Presentopciones(boton) {
    const modal = await this.modalController.create({
      component: OpcionesatajoPage,
      cssClass: 'my-custom-class',
      componentProps: {
        'firstName': 'Douglas',
        'lastName': 'Adams',
        'middleInitial': 'N',
        'boton': boton
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
  obteneratajosguardados() {
    this.peticiones.getMethod('api/accion/list').subscribe((rsp: any) => {
      rsp?.data?.forEach(element => {
        this.botones[(element?.button -1) ] = {
          accion: element?.accion, email: element?.email,
          social_share: element?.social_share,
          type_cloud: element?.type_cloud,
          type_save: element?.type_save,
          route: element?.route
        }
      });
      
    })

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
      if (data.type_save == 2) return "Google Drive - Doc.";
      return "Google Drive - Img.";
    }else if (data.type_cloud == 2){
      return "Dropbox";
    }else{
      return "No hay información.";
    }
  }

  async cargardatos(event=null){
    const load = await this.loadingController.create({
      message: 'Cargando...'
    });
    load.present();
    this.peticiones.getMethod('api/profileapp').subscribe((ele: any) => {
      load.dismiss();
      this.data_consulta = ele.user;
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
