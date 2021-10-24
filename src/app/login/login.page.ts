import { Component, OnInit } from '@angular/core';
import { LoadingController, ToastController, Platform } from '@ionic/angular';
import { AuthService } from '../services/auth.service';
import { PeticionesService } from '../services/peticiones.service';
import { TranslateService } from '@ngx-translate/core';
import { Router, ActivatedRoute } from '@angular/router';
import { SignInWithApple, AppleSignInResponse, AppleSignInErrorResponse, ASAuthorizationAppleIDRequest } from '@ionic-native/sign-in-with-apple/ngx';

import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {


  picture = '';
  name = '';
  email = '';
  userid = '';
  error = '';
  logueado = '';
  only_mary = '';
  usuarioincorrecto = '';
  camposincompletos = '';
  isios=false;
  usuarioext: any = {
  }
  imgfoto = null;
  loginexterno = false;
  nuevavariable = false;
  codigoQR: any;
  isapplelogin=false;

  constructor(
    private platform: Platform,
    public authserice: AuthService,
    private peticiones: PeticionesService,
    private loadingC: LoadingController,
    public toastController: ToastController,
    private router: Router,
    private _translate: TranslateService,
    private actRoute: ActivatedRoute,
    private signInWithApple: SignInWithApple
    
  ) {
    if(this.platform.is("ios")){
      this.isios=true;
    }
    this.codigoQR = this.actRoute.snapshot.params.qrtext;

  }
  ngOnInit() {
    //@ionic-native/core
    setTimeout(() => {
      this._translate.get('logueado').subscribe((res: string) => {
        this.logueado = res;
      });

      this._translate.get('error').subscribe((res: string) => {
        this.error = res;
      });

      this._translate.get('only_mary').subscribe((res: string) => {
        this.only_mary = res;
      });
      this._translate.get('camposincompletos').subscribe((res: string) => {
        this.camposincompletos = res;
      });

      this._translate.get('usuarioincorrecto').subscribe((res: string) => {
        this.usuarioincorrecto = res;
      });

    }, 1000);

  }
  async loginGoogleios() {
    const user = await GoogleAuth.signIn();
    console.log(user);

    if(user){
      this.email = user.email;
      this.userid = user.id; 
      this.usuarioext.email=this.email;
      this.usuarioext.password=this.userid;  
      this.initiallogin();
  
    }else{
      this.toastController.create({
        message: 'Ha ocurrido un error, por favor intentelo nuevamente',
        duration: 5000,
        position: 'top'
      }).then((to)=>{
        to.present();
      })
    }
  }

  loginext() {
    if (!this.usuarioext.email || !this.usuarioext.password) {
      this.toastController.create({
        message: this.camposincompletos,
        duration: 5000,
        position: 'top'
      }).then((toast) => {
        toast.present();
      });

    } else {
      this.initiallogin();
    }
  }


  async signInfb(): Promise<void> {
    const FACEBOOK_PERMISSIONS = ['public_profile', 'email', 'user_link'];

/*     const result = await Plugins.FacebookLogin.login({ permissions: FACEBOOK_PERMISSIONS });
    console.log('logeado con fb', result);
    if (result && result.accessToken) {
      this.getCurrentState(result.accessToken.userId,result.accessToken.token);
    } */
  }
  async getCurrentState(userId,token) {
      const response = await fetch(`https://graph.facebook.com/${userId}?fields=id,name,gender,email,link,picture&type=large&access_token=${token}`);
      const myJson = await response.json();
      this.usuarioext.email=myJson.email;;
      this.usuarioext.password=userId;
      this.initiallogin();    
  }


  async initiallogin(applelogin=false) {
    let load = await this.loadingC.create();
    load.present();

    
    let datauser :any;
    if(applelogin){
      datauser={
        email: this.usuarioext.email
        , password: this.usuarioext.password
        , uuid_qr: this.codigoQR,
        login_apple:true
      };
    }else{
      datauser={
        email: this.usuarioext.email
        , password: this.usuarioext.password
        , uuid_qr: this.codigoQR
      };
    }
    console.log(datauser);
    this.authserice.login(datauser).subscribe((resp) => {

      resp['completeinfo'] = resp['register_complet']?'1':'false';
      resp['data'] = resp['token'];
      this.authserice.guardardata(resp);
      load.dismiss();

      setTimeout(() => {
        this.authserice.actualizartoken();
        this.peticiones.token = resp['token'];
        this.peticiones.isloged = true;
  
        if(resp['register_complet']){
          this.toastController.create({
            message: 'Sesion iniciada exitosamente',
            duration: 5000,
            position: 'top'
          }).then((to)=>{
            to.present();
            this.router.navigate(['/']);    
          })
        }else{
          this.toastController.create({
            message: 'Por favor complete su registro',
            duration: 5000,
            position: 'top'
          }).then((to)=>{
            to.present();
            this.router.navigate(['/completeinfo/5/0']);
          })

        }
      }, 500);
      
    }, err => {
      load.dismiss();
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
  loginIos(){
     this.signInWithApple.signin({
      requestedScopes: [
        ASAuthorizationAppleIDRequest.ASAuthorizationScopeFullName,
        ASAuthorizationAppleIDRequest.ASAuthorizationScopeEmail,
      ]
    })
    .then((res: AppleSignInResponse) => {
      const user= this.peticiones.parseJwt(res.identityToken);
      this.email = user.email;
      this.userid = res.authorizationCode;
      this.usuarioext.email=this.email;
      this.usuarioext.password=this.userid;      
      this.initiallogin(true);
    })
    .catch((err: AppleSignInErrorResponse) => {
      
      this.toastController.create({
        message: 'Ha ocurrido un error, intentelo nuevamente', duration: 5000, position: 'top'
      }).then((toast) => {
        toast.present();
      });
    });    
  }

  ionViewDidEnter(){
    GoogleAuth.init();
  }
  async doLogin() {
    const user = await GoogleAuth.signIn();
    console.log(user);
  }
}
