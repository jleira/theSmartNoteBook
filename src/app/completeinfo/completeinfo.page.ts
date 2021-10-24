import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingController, ToastController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';
import { PeticionesService } from '../services/peticiones.service';

@Component({
  selector: 'app-completeinfo',
  templateUrl: './completeinfo.page.html',
  styleUrls: ['./completeinfo.page.scss'],
})
export class CompleteinfoPage implements OnInit {
  usuarioext:any={};
  part1=true;
  part2=false;
  part3=false;
  part4=false;
  codigoQR:any;
  origen:any=0;
  departamentos:any=[];
  ciudades:any=[];

  constructor(
    private loadingC: LoadingController,
    private actRoute: ActivatedRoute,
    public router: Router,
    public authserice: AuthService,
    private peticiones: PeticionesService,
    public toastController: ToastController
   
  ) { 
    this.codigoQR = this.actRoute.snapshot.params.qrtext;
    this.origen = this.actRoute.snapshot.params.origen;

    if(this.origen != '0'){
      console.log(this.origen);
      this.part1=false;
      this.part2=true;
    }
  }


  ngOnInit() {
  this.getdepartamentos();
  }

  siguiente(){
    console.log(this.part1,this.part2,this.part3);
    if(this.part1){
      if (!this.usuarioext.name || !this.usuarioext.email || !this.usuarioext.password) { this.showToast('Por favor, complete todos los campos.'); return; }
      this.initialregister();
    }else if(this.part2){
      if (!this.usuarioext.fecha) { this.showToast('Por favor, seleccione su cumpleaños.'); return; }
      this.part1=false;
      this.part2=false;
      this.part3=true;
    }else if(this.part3){
      if (!this.usuarioext.departamento || !this.usuarioext.ciudad) { this.showToast('Por favor, complete todos los campos.'); return; }
      if (this.usuarioext.ciudad.length < 2) { this.showToast('Mínimo 2 caracteres en la ciudad.'); return; }
      this.part1=false;
      this.part2=false;
      this.part3=false;
      this.part4=true;
      console.log(this.usuarioext);
    }else if(this.part4){
      if (!this.usuarioext.profile) { this.showToast('Por favor, seleccione un tipo.'); return; }
      if (this.usuarioext.profile==5 && !this.usuarioext.otro) { this.showToast('Por favor, complete el campo nombre.'); return; }
      this.completeinfo();
    }
  }

  atras(){
    if(this.part3){
      this.part1=false;
      this.part2=true;
      this.part3=false;
    } else if (this.part4){
      this.part1=false;
      this.part2=false;
      this.part3=true;
      this.part4=false;
    }
  }

  async initialregister(){
    let load= await this.loadingC.create();
    load.present();
    let datauser = {
      name: this.usuarioext.name
      ,email: this.usuarioext.email
      ,password: this.usuarioext.password
      ,type_register: 1
      ,uuid_qr:this.codigoQR
    };
    this.authserice.register(datauser).subscribe((resp)=>{
      load.dismiss();
      resp['completeinfo']=false;
      this.authserice.guardardata(resp);
      setTimeout(() => {
        this.authserice.actualizartoken();
      }, 500);
      this.peticiones.token = resp['data'];
      this.peticiones.isloged = true;
      this.part1=false;
      this.part2=true;
    },err=>{
      console.log("err",err);
      load.dismiss();
      if (err.status == 400){
        if(err.error.error.email){
          this.showToast("El email ya ha sido registrado.");
        }else{
          this.showToast("Un dato proporcionado no es correcto.");
        }
      }else{
        this.showToast('Ha ocurrido un error inesperado, intentelo nuevamente.');
      }
    });

  }

  completeinfo() {

    this.loadingC.create({
    }).then((res) => {
      res.present();
      let datauser = {
        profile:this.usuarioext.profile, 
        birthday: this.usuarioext.fecha, 
        id_pais: this.usuarioext.departamento,
        ciudad: this.usuarioext.ciudad,
        otro: this.usuarioext.otro
      };

      this.authserice.updateuser(datauser).subscribe((resp) => {
        this.authserice.guardarcompleteinfo();
        setTimeout(() => {
          this.toastController.create({
            message:'Información actualizada',
            duration: 2000,
            position: 'top'
          }).then((toast) => {
            res.dismiss();
            toast.present();
            this.router.navigate(['/']);
          });
        }, 1000);
      }, err => {
        res.dismiss();

        this.toastController.create({
          message: 'Ha ocurrido un error, intentelo nuevamente',
          duration: 5000,
          position: 'top'
        }).then((toast) => {
          toast.present();
        });

      })
    });
  
  }
  getdepartamentos(){
    this.peticiones.departamentos().subscribe((respuesta) => {
      this.departamentos=respuesta['data'];
      
    }, err => {
      console.log("hubo este error asl cargar tu info", err);
    })
  }
  async buscarciudad(){
    let load= await this.loadingC.create();
    load.present();
    this.peticiones.ciuidades(this.usuarioext['departamento']).subscribe((respuesta) => {
      this.ciudades=respuesta['data'];
      load.dismiss();    
    }, err => {
      load.dismiss();    
      console.log("hubo este error asl cargar tu info", err);
    })
  }

  showToast(string: string){
    this.toastController.create({
      message: string, duration: 5000, position: 'top'
    }).then((toast) => {
      toast.present();
    });
  }
}
