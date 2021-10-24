import { Component } from '@angular/core';
import { PeticionesService } from '../services/peticiones.service';
import { Calendar, CalendarOptions } from '@ionic-native/calendar/ngx';
import * as moment from 'moment';



/* 
*****
***

En este calendario

*/
@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {
  name = '';
  id = 0;
  mydate = new Date();
  mydatef = new Date();
  opcion = 0;
  calendarid: any = null;
  fechastomadas=[];

  titulo = '';
  notes = '';
  localizacion = '';
  existecalendario = false;
  lista_agendados = [
     /* 
    {
    month: 'Mayo',
    year: '2021',
    tareas: [
    {
      show:true,
      allDay: 0,
      calendar_id: "41",
      startDate: "2020-01-22 16:00:00",
      endDate: "2020-01-22 17:00:00",
      eventLocation: "",
      event_id: "780",
      id: "196",
      rrule: "FREQ=WEEKLY;WKST=MO;BYDAY=FR,MO,TH,TU,WE",
      title: "disonex - Reunion con alex"
    }, {
      allDay: 0,
      calendar_id: "41",
      dtend: 1621958400000,
      dtstart: 1621956600000,
      eventLocation: "",
      event_id: "781",
      id: "280",
      rrule: "FREQ=WEEKLY;WKST=MO;BYDAY=FR,MO,TH,TU,WE",
      title: "disonex - Reunion con marcos"
    }, {
      allDay: 0,
      calendar_id: "41",
      dtend: 1621965600000,
      dtstart: 1621962000000,
      eventLocation: "Barranquilla",
      event_id: "787",
      id: "1536",
      title: "disonex - alex pruebas"
    }, {
      allDay: 0,
      calendar_id: "41",
      dtend: 1621980000000,
      dtstart: 1621976400000,
      eventLocation: "",
      event_id: "784",
      id: "1449",
      title: "disonex - Revision"
    }]
  }, {
    month: 'Junio',
    year: 2021,
    tareas: [{
      allDay: 0,
      calendar_id: "41",
      dtend: 1624632600000,
      dtstart: 1624629600000,
      eventLocation: "",
      event_id: "751",
      id: "1490",
      rrule: "FREQ=WEEKLY;UNTIL=20210826T045959Z;WKST=SU;BYDAY=FR,WE",
      title: "Disonex - Pruebas con alex"
    },
    {
      allDay: 0,
      calendar_id: "41",
      dtend: 1624635000000,
      dtstart: 1624633200000,
      eventLocation: "",
      event_id: "780",
      id: "219",
      rrule: "FREQ=WEEKLY;WKST=MO;BYDAY=FR,MO,TH,TU,WE",
      title: "Disonex - Pruebas con marcos",
    }, {
      allDay: 0,
      calendar_id: "41",
      dtend: 1624636800000,
      dtstart: 1624635000000,
      eventLocation: "",
      event_id: "781",
      id: "303",
      rrule: "FREQ=WEEKLY;WKST=MO;BYDAY=FR,MO,TH,TU,WE",
      title: "Disonex - applicacion"
    }, {
      allDay: 0,
      calendar_id: "41",
      dtend: 1624658400000,
      dtstart: 1624654800000,
      eventLocation: "https://us02web.zoom.us/j/7103203154?pwd=cnVObE9qMXlkblZ6em1RQmM4MlZ4Zz09",
      event_id: "777",
      id: "258",
      rrule: "FREQ=WEEKLY;WKST=MO;BYDAY=FR",
      title: "Disonex - Save the date"
    }]
  }, {
    month: 'Julio',
    year: '2021',
    tareas: []
  }
   */ 
  ];

  constructor(
    public peticiones: PeticionesService,
    private calendar: Calendar
  ) {
    this.buscarcalendario();

  }
/*
  crearporopcion() {
    let startDate = moment(this.mydate).toDate();
    let endtDate = moment(this.mydatef).toDate();

    switch (this.opcion) {
      case 0:
        this.calendar.listCalendars().then(
          msg => {
            console.log("msj", msg);
          },
          (err) => {
            console.log("err", err);
          }
        );
        break;
      case 1:
        this.calendar.createEvent('Disonex - ' + this.titulo, this.localizacion, this.notes, startDate, endtDate).then((datos) => {
          console.log(datos);
        }, err => {
          console.log(err);
        });

        break;
      case 2:

        let option: CalendarOptions = {
          calendarId: this.id
        }
        this.calendar.createEventWithOptions('Disonex - ' + this.titulo, this.localizacion, this.notes, startDate, endtDate, option).then((datos) => {
          console.log(datos);
        }, err => {
          console.log(err);
        });

        break;
      case 3:
        let option2: CalendarOptions = {
          id: this.id.toString()
        }
        this.calendar.createEventWithOptions('Disonex - ' + this.titulo, this.localizacion, this.notes, startDate, endtDate, option2).then((datos) => {
          console.log(datos);
        }, err => {
          console.log(err);
        });
        break;
      case 4:
        console.log(this.calendar.getCalendarOptions());
        break;
      case 5:
        console.log(this.calendar.getCreateCalendarOptions());
        break;
      case 6:
        this.calendar.createCalendar(this.titulo).then((ok) => {
          console.log(this.calendar.getCalendarOptions());
          console.log(this.calendar.getCreateCalendarOptions());
        }, err => {
          console.log(this.calendar.getCalendarOptions());
          console.log(this.calendar.getCreateCalendarOptions());
        })
        break;
      case 7:
        this.calendar.findEvent('Disonex').then((datos) => {
          console.log("encontro", datos);
        }, err => {
          console.log("fallo", err);
        });
        break;
      case 8:
        this.calendar.listEventsInRange(startDate, endtDate).then((datos) => {
          console.log("encontro", datos);
        }, err => {
          console.log("fallo", err);
        });;
        break
      case 9:
        this.calendar.createEvent('Disonex - ' + this.titulo, this.localizacion, this.notes, new Date(2021, 5, 23, 6, 0, 0, 0), new Date(2021, 5, 23, 7, 0, 0, 0)).then((datos) => {
          console.log(datos);
        }, err => {
          console.log(err);
        });

        break
      case 10:
        let option5: CalendarOptions = {
          calendarId: this.id
        }

        this.calendar.findEventWithOptions(null, null, null, null, null, option5).then((datos) => {
          console.log("encontro", datos);
        }, err => {
          console.log("fallo", err);
        });

        break

      case 11:
        let option6: CalendarOptions = {
          calendarId: this.id
        }

        this.calendar.findAllEventsInNamedCalendar('Disonex').then((datos) => {
          console.log("encontro", datos);
        }, err => {
          console.log("fallo", err);
        });

        break

      default:
        break;
    }
  }
*/
  buscarcalendario() {
    this.calendar.listCalendars().then(
      calendarios => {
        let cal = calendarios.filter((ele) => {
          return ele.name == 'Disonex'
        })
        if (cal.length > 0) {
          this.calendarid = cal[0].id;
          this.cargartareas();
          //buscar por tiempo
        } else {
          this.crearcalendario();
        }
      },
      (err) => {
        this.crearcalendario();
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
  cargartareas(entrada = null) {
    if (!entrada) {
      let date = new Date();
      let firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
      let lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
      let startDate = moment(firstDay).toDate();
      let endtDate = moment(lastDay).toDate();
      this.calendar.listEventsInRange(startDate, endtDate).then((datos) => {

        let lista = datos.filter((agd) => {
          return agd.title.indexOf('Disonex')>-1;
        })

        this.lista_agendados.push({
          month: this.GetMonthname(startDate),
          year: startDate.getFullYear(),
          tareas: lista
        })

        if (lista.length == 0) {
          this.buscarsiguientemes(date,1);
        }


      }, err => {
        console.log("fallo", err);

        let lista=[];
        this.lista_agendados.push({
          month: this.GetMonthname(startDate),
          year: startDate.getFullYear(),
          tareas: lista
        })
        if (lista.length == 0) {
          this.buscarsiguientemes(date,1);
        }

      });
    }
  }
  GetMonthname(date) {
    const monthNames = ["January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];


    return monthNames[date.getMonth()];
  }
  buscarsiguientemes(date: Date,iteracion) {
   /*  while (iteracion < 11) {
      
    } */
    if(iteracion < 13){

      if (date.getMonth() == 11) {
        date = new Date(date.getFullYear() + 1, 0, 1);
      } else {
        date = new Date(date.getFullYear(), date.getMonth() + 1, 1);
      }
  
      let firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
      let lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
      let startDate = moment(firstDay).toDate();
      let endtDate = moment(lastDay).toDate();
      this.calendar.listEventsInRange(startDate, endtDate).then((datos) => {
        let lista = datos.filter((agd) => {
          return agd.title.indexOf('Disonex')>-1;
        })
  
        this.lista_agendados.push({
          month: this.GetMonthname(firstDay),
          year: firstDay.getFullYear(),
          tareas: lista
        })
  
          this.buscarsiguientemes(firstDay,iteracion+1);
      },err=>{
        let lista=[];
        this.lista_agendados.push({
          month: this.GetMonthname(firstDay),
          year: firstDay.getFullYear(),
          tareas: lista
        })
        if (lista.length == 0) {
          this.buscarsiguientemes(firstDay,iteracion+1);
        }

      });
    }
  }

  filtrarinfo(){
    let startDate = moment(this.mydate).toDate();
    let endtDate = moment(this.mydatef).toDate();
    this.lista_agendados=[];
      this.calendar.listEventsInRange(startDate, endtDate).then((datos) => {
        let lista = datos.filter((agd) => {
          return agd.title.indexOf('Disonex')>-1;
        })

        let anoinicial:any;
        let mesinicial:any;
        
        if(lista?.length>0){
          let fe=moment(lista[0].startDate).toDate();
          
          anoinicial=fe.getFullYear();
          mesinicial=fe.getMonth();

          this.lista_agendados.push({
            month: this.GetMonthname(fe),
            year: fe.getFullYear(),
            tareas: []
          });
          
          lista.forEach(listacargada => {
            let fec=moment(listacargada.startDate).toDate();

            if(anoinicial==fec.getFullYear() && mesinicial==fec.getMonth()){
              this.lista_agendados[this.lista_agendados.length-1]?.tareas.push(listacargada)
            }else{
              anoinicial=fec.getFullYear();
              mesinicial=fec.getMonth();
    
              console.log("entro en lo nuevo y debe agregar una ");
              this.lista_agendados.push({
                month: this.GetMonthname(fec),
                year: fec.getFullYear(),
                tareas: [listacargada]
              });
              console.log(this.lista_agendados);
    
            }


          });


        }


      }, err => {
      
      });

  }


  fecha(timestaap,caso:number=1){ 
    let fe=moment(timestaap).toDate();
    if(caso ==1){
      return fe.toLocaleTimeString();    
    }
    if(caso ==2){
      return fe.getDate();
    }
  }
  mostrarnumero(mes,anho,dia){
    
    if(this.fechastomadas[anho] !== undefined){
      if(this.fechastomadas[anho][mes] !== undefined){
        if(this.fechastomadas[anho][mes][dia] !== undefined){
          return false;
        }else{
          this.fechastomadas[anho][mes][dia]=true;
          return true;  
        }
      }else{
        this.fechastomadas[anho][mes]={};
        this.fechastomadas[anho][mes][dia]=true;
        return true;  
      }
    }else{
      
      this.fechastomadas[anho]={};
      this.fechastomadas[anho][mes]={};
      this.fechastomadas[anho][mes][dia]=true;
      return true;
    }
  };


}
