import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { PeticionesService } from '../../services/peticiones.service';
import { LoadingController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.page.html',
  styleUrls: ['./edit-profile.page.scss'],
})
export class EditProfilePage implements OnInit {
  @Input() dataUser: any;
  
  departamentos:any=[];
  profiles = [
    { id: 1, name: 'PROFESOR' },
    { id: 2, name: 'ESTUDIANTE' },
    { id: 3, name: 'CREATIVO' },
    { id: 4, name: 'TRABAJADOR' },
    { id: 5, name: 'OTRO' },
  ];

  constructor(
    private modalController: ModalController,
    private peticiones: PeticionesService,
    private toastController: ToastController,
    private loadingController: LoadingController
  ) { }

  ngOnInit() {
    this.getdepartamentos();
  }

  async submit(){
    if (!this.dataUser.name) { this.showToast('Por favor, escriba el nombre.'); return; }
    if (!this.dataUser.birthday) { this.showToast('Por favor, seleccione su cumpleaños.'); return; }
    if (!this.dataUser.id_pais || !this.dataUser.ciudad) { this.showToast('Por favor, complete todos los campos.'); return; }
    if (this.dataUser.ciudad.length < 2) { this.showToast('Mínimo 2 caracteres en la ciudad.'); return; }
    if (!this.dataUser.profile) { this.showToast('Por favor, seleccione un perfil.'); return; }
    if (this.dataUser.profile==5 && !this.dataUser.otro) { this.showToast('Por favor, complete el campo nombre.'); return; }

    let param = {
      name: this.dataUser.name,
      birthday: this.dataUser.birthday,
      id_pais: this.dataUser.id_pais,
      ciudad: this.dataUser.ciudad,
      profile: this.dataUser.profile,
      otro: this.dataUser.otro
    };
    const load = await this.loadingController.create();
    load.present();
    this.peticiones.postmethod(param, "api/user/profile/update").subscribe((ele: any) => {
      load.dismiss();
      this.showToast("Datos actualizados correctamente.");
      this.dismissModal(true);
    }, err => {
      load.dismiss();
      this.showToast("Ha ocurrido un error inesperado.");
    });
  }

  getdepartamentos(){
    this.peticiones.departamentos().subscribe((respuesta) => {
      this.departamentos=respuesta['data'];
    }, err => {
      console.log("hubo este error asl cargar tu info", err);
    })
  }

  dismissModal(updated = false){
    this.modalController.dismiss({
      'updated': updated,
    });
  }

  showToast(string: string){
    this.toastController.create({
      message: string, duration: 5000, position: 'top'
    }).then((toast) => {
      toast.present();
    });
  }

}
