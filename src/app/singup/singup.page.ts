import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
//import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { LoadingController, Platform, ToastController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';
import { PeticionesService } from '../services/peticiones.service';
import { SignInWithApple, AppleSignInResponse, AppleSignInErrorResponse, ASAuthorizationAppleIDRequest } from '@ionic-native/sign-in-with-apple/ngx';
import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';

@Component({
  selector: 'app-singup',
  templateUrl: './singup.page.html',
  styleUrls: ['./singup.page.scss'],
})
export class SingupPage implements OnInit {
  usuarioext:any ={};
  codigoQR:any;
  isios=false;

  constructor(
    private loadingC: LoadingController,
    private actRoute: ActivatedRoute,
    public router: Router,
    private platform: Platform,
//    private googlePlus: GooglePlus,
    public authserice: AuthService,
    private peticiones: PeticionesService,
    public toastController: ToastController,
    private signInWithApple: SignInWithApple

   
  ) { 
    if(this.platform.is("ios")){
      this.isios=true;
    }

    this.codigoQR = this.actRoute.snapshot.params.qrtext;
  }

  ngOnInit() {
  }
  ionViewDidEnter(){
    GoogleAuth.init();
  }

  async initialregister(type){
    let load= await this.loadingC.create();
    load.present();
    let datauser = {
      name: this.usuarioext.name
      ,email: this.usuarioext.email
      ,password: this.usuarioext.password
      ,type_register: type
      ,uuid_qr:this.codigoQR
      ,login_apple:true
    };
    if(type!=4){
      delete datauser.login_apple;
    }    
    this.authserice.register(datauser).subscribe((resp)=>{
      load.dismiss();
      resp['completeinfo']=false;
      this.authserice.guardardata(resp);
      setTimeout(() => {
        this.authserice.actualizartoken();
      }, 500);
      this.peticiones.token = resp['data'];
      this.peticiones.isloged = true;
      this.toastController.create({
        message: 'Por favor complete su registro',
        duration: 5000,
        position: 'top'
      }).then((to)=>{
        to.present();
        this.router.navigate(['/completeinfo/5/0']);
      })

    },err=>{
      load.dismiss();
      console.log("err", err);
      let text: string;
      if (err.status == 401) {
        text = err.error.message;
      }else{
        text = 'Ha ocurrido un error, intentelo nuevamente';
      }
        this.toastController.create({
        message: text,
        duration: 5000,
        position: 'top'
      }).then((toast) => {
        toast.present();
      });

    });

  }


  loginGoogle() {
      this.loginGoogleios();
  }




  async loginGoogleios() {
  const res = await GoogleAuth.signIn();
   
    this.usuarioext.email=res.email;
    this.usuarioext.password=res.id;
    this.usuarioext.name=res.name;

    this.initialregister(2);
  }

  registro(){
    this.router.navigate(['/completeinfo/0/'+this.codigoQR]);    
  }
  signIn(){
    this.router.navigate(['/login/'+this.codigoQR]);    
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
      this.usuarioext.name=myJson.name;
  
      this.initialregister(3);
  
      console.log('myjson', myJson);    
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
          this.usuarioext.email=res.email;
          this.usuarioext.password=res.authorizationCode;
          this.usuarioext.name='';
          
          this.usuarioext.email=res.email;;
          this.usuarioext.password=res.authorizationCode;
          this.usuarioext.name=res.email;;

          this.initialregister(4);
          
        })
        .catch((err: AppleSignInErrorResponse) => {
          
          this.toastController.create({
            message: 'Ha ocurrido un error, intentelo nuevamente', duration: 5000, position: 'top'
          }).then((toast) => {
            toast.present();
          });
        });    
      }
}
