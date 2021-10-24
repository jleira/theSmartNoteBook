import { Component, Input, OnInit } from '@angular/core';
import { LoadingController, ModalController, ToastController } from '@ionic/angular';
import { PeticionesService } from '../services/peticiones.service';
import { Calendar, CalendarOptions } from '@ionic-native/calendar/ngx';
import * as moment from 'moment';

@Component({
  selector: 'app-agendartarea',
  templateUrl: './agendartarea.page.html',
  styleUrls: ['./agendartarea.page.scss'],
})
export class AgendartareaPage implements OnInit {
  @Input() fecha?: any='';
  @Input() titulo?: any='';
  @Input() calendar_array?: any=[];

  tipo:any=null;
  correo:any='';

  name = '';
  mydate:any = new Date();
  mydatef:any = new Date();
  calendarid: number = null;
  localizacion = '';
  existecalendario = false;



  constructor(private toastController:ToastController,private loading:LoadingController,public modalController: ModalController,private peticiones: PeticionesService,    private calendar: Calendar
    ) { }

  ngOnInit() {
    console.log(this.calendar_array);
    if (this.calendar_array.length != 0){
      this.changeScheduling(0);
    }else{
      this.changeScheduling("other");
    }

    this.buscarcalendario();
    setTimeout(() => {

    }, 500);
  }
  dismiss() {
    this.modalController.dismiss(false);
  }

  async enviar(){
    let params={
      accion:this.tipo,
      email:this.correo
    }

    let load = await this.loading.create();
    load.present();

    this.peticiones.postmethod(params,'api/accion/add').subscribe(()=>{
      load.dismiss();
      this.modalController.dismiss(true);
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

  async agendar(){
    let option: CalendarOptions = {
      calendarId: this.calendarid
    }
    let startDate = moment(this.mydate).toDate();

    let endtDate = moment(this.mydatef).toDate();

    let load = await this.loading.create();
    load.present();



    this.calendar.createEventWithOptions('Disonex - ' + this.titulo, '', '', startDate, endtDate, option).then((datos) => {
      console.log(datos);
      load.dismiss();
      this.modalController.dismiss(true);
    }, err => {
      load.dismiss();
      console.log(err);
    });
  }

  changeScheduling(value: any = null){
    if (value === "other") {
      this.titulo = "";
    }else{
      this.titulo = this.calendar_array[value]?.title;
    }

    let startDate = moment(this.fecha).toDate();
    let startDateTime = startDate.toTimeString();
    if (value != null && value != "other") startDateTime = this.calendar_array[value].hour;
    this.mydate=startDate.toDateString() + " " + startDateTime;
    let startDateMoment = moment(this.mydate).toDate();
    startDateMoment.setHours(startDateMoment.getHours()+1);
    this.mydatef=startDateMoment.toDateString() + " " + startDateMoment.toTimeString();
  }

  buscarcalendario() {
    this.calendar.listCalendars().then(
      calendarios => {
        let cal = calendarios.filter((ele) => {
          return ele.name == 'Disonex'
        })
        if (cal.length > 0) {
          this.calendarid = cal[0].id;
          //buscar por tiempo
        } else {
          this.crearcalendario();
        }
      },
      (err) => {
        this.crearcalendario();
        console.log("err", err);
      }
    );
  }

  crearcalendario() {
    this.calendar.createCalendar('Disonex').then(
      calendarios => {
        this.buscarcalendario();
      },
      (err) => {
        console.log("err", err);
        //crear alerta de error y cerrar aplicacion
      }
    )
  }


}
 