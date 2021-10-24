import { Component, Input, OnInit } from '@angular/core';
import { NavController, ModalController } from '@ionic/angular';

@Component({
  selector: 'app-details-product',
  templateUrl: './details-product.page.html',
  styleUrls: ['./details-product.page.scss'],
})
export class DetailsProductPage implements OnInit {
  @Input() product: any;

  constructor(
    private modalController: ModalController,
    private nav: NavController
  ) { }

  ngOnInit() {}

  dismissModal(close = false) {
    this.modalController.dismiss(close);
  }

  navegar(link) {
    this.dismissModal(true);
    this.nav.navigateForward(link);
  }

}
