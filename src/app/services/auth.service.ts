import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import { Platform } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { Storage } from '@capacitor/storage';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public user: Observable<any>;
  public userData = new BehaviorSubject(null);
  token;
  constructor(private http: HttpClient, private plt: Platform, private router: Router) {
    this.actualizartoken();
  }

  login(credentials) {
    return this.http.post('https://disonex.virtual-tec.club/public/api/login', credentials);
  }

  register(credentials) {
    return this.http.post('https://disonex.virtual-tec.club/public/api/user/registerapp', credentials);
  }
  completeinfo(credentials){
    return this.http.post('https://disonex.virtual-tec.club/public/api/registerapp', credentials);
  }
  updateuser(data){
      let options= {
        headers:{'Authorization':'Bearer ' +this.token} 
      }
      return this.http.post('https://disonex.virtual-tec.club/public/index.php/api/user/updateapp', data,options);        
  }

  actualizartoken(){
    Storage.get({ key: 'token' }).then((token) => {
      this.token=token.value;
    });

  }

  getUser() {
    return this.userData.getValue();
  }

  logout() {
    Storage.remove({key:'TOKEN_KEY'}).then(() => {
      this.router.navigateByUrl('/');
      this.userData.next(null);
    });
  }

  guardardata(data) {
    Storage.set({ key: 'isLoged', value: '1' });
    Storage.set({ key: 'completeinfo', value: data.completeinfo });
    Storage.set({ key: 'token', value: data.data });
  }

  guardarcompleteinfo() {
    Storage.set({ key: 'completeinfo', value: '1' });
  }

  guardardataDrive(data){
    Storage.set({ key: 'data_drive', value: JSON.stringify(data) });
  }
  obtenerdataDrive(){
    /* const item = Storage.get({ key: 'data_drive' });
    console.log("item.value",JSON.parse(item.value));
    return JSON.parse(item.value); */
    return Storage.get({ key: 'data_drive' }).then((val) => { // <-- Here!
      console.log(JSON.parse(val.value));
      return JSON.parse(val.value);
    });
  }
}
