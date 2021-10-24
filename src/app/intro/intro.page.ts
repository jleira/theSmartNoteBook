import { Component, OnInit, ViewChild } from '@angular/core';
import { IonSlides, LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';
import { PeticionesService } from '../services/peticiones.service';
import { Storage } from '@capacitor/storage';

@Component({
  selector: 'app-intro',
  templateUrl: './intro.page.html',
  styleUrls: ['./intro.page.scss'],
})
export class IntroPage implements OnInit {

  @ViewChild('slidesConfig') slidesConfig: IonSlides;
  slideOpts = {
    initialSlide: 0,
  };
  inicio=false;
  constructor(
    private router: Router,
    private loadingC: LoadingController,
    public peticiones: PeticionesService
    ) { 

  }

  ngOnInit() {
    this.inicio=true;   
  }
  nextSlide() {
    this.slidesConfig.slideNext();
  }

  setearintro(){
    this.loadingC.create({
      message: '',
    }).then((res)=>{
      res.present();
      Storage.set({key:'intro',value:'1'}).then(()=>{
        this.router.navigate(['/prelogin']);
        res.dismiss();
      });
    });
  }

}
