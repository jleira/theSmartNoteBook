import { Component, OnInit } from '@angular/core';
import { LoadingController, ModalController, ToastController } from '@ionic/angular';
import { PeticionesService } from 'src/app/services/peticiones.service';
import { DetailsProductPage } from './details-product/details-product.page';

@Component({
  selector: 'app-list-products',
  templateUrl: './list-products.page.html',
  styleUrls: ['./list-products.page.scss'],
})
export class ListProductsPage implements OnInit {

  paginas = [];
  page = 1;

  constructor(
    private loadingController: LoadingController,
    private peticiones: PeticionesService,
    private modalController: ModalController,
    private toastController: ToastController
  ) { }

  ngOnInit() {
    this.loadData();
  }

  async loadData(event = null){
    const load = await this.loadingController.create({
      message: 'Cargando datos...'
    });
    load.present();
    this.paginas = [];
    let mipeticion:any = await this.peticiones.getProduct();
    mipeticion.subscribe((element:any)=>{
      //console.log(element, "Hola");
      load.dismiss();
      if(event) event.target.complete();
      this.paginas =  element.data.data; 
    },err=>{
      load.dismiss();
      if(event) event.target.complete();
      this.showToast("Ha ocurrido un error, intentelo nuevamente.");
    });
  }

  async cargarpag(event=null){
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

  async detailsProduct(item: any) {
    const modal = await this.modalController.create({
      component: DetailsProductPage,
      componentProps: {
        'product': item
      },
      swipeToClose: true
    });
    modal.onDidDismiss().then((dataReturned) => {
      console.log(dataReturned.data);
      if (dataReturned.data) {
        setTimeout(() => {
          this.dismissModal();
        }, 100);
      }
    });
    return await modal.present();
  }

  dismissModal() {
    this.modalController.dismiss();
  }

  showToast(message: string){
    this.toastController.create({
      message: message, duration: 5000, position: 'top'
    }).then((toast) => { 
      toast.present();
    }); 
  }

}
