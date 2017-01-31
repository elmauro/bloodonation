import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';
import 'rxjs/add/operator/toPromise';

import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import * as io from 'socket.io-client';

import { Donor } from './donors/donor';
import { Ip } from './donors/ip';

@Injectable()
export class DonorsService {

  private donorsUrl = 'https://localhost:8080/api/donors';
  private headers = new Headers({'Content-Type': 'application/json'});
  private donor;
  private url = 'https://localhost:8080';  
  private socket;

  constructor(private http: Http) { }

  getAllDonors(): Promise<Donor[]> {
    return this.http.get(this.donorsUrl)
      	.toPromise()
      	.then(res => res.json() as Donor[]);
  }

  getCurrentDonor(ipaddress: string): Promise<Donor> {
    return this.http.get(this.donorsUrl + "/ipaddress/" + ipaddress)
      .toPromise()
        .then(res => res.json() as Donor);  
  }

  save(donor: Donor): Promise<Donor> {
    return this.http
        .post('/api/donors', JSON.stringify(donor), {headers: this.headers})
        .toPromise()
        .then(() => donor);
  }

  update(id: string, donor: Donor): Promise<Donor> {
    return this.http
      	.put('/api/donors/' + id, JSON.stringify(donor), {headers: this.headers})
      	.toPromise()
      	.then(() => donor);
  }

  delete(id: string): Promise<Donor> {
    return this.http
        .delete('/api/donors/' + id, {headers: this.headers})
        .toPromise()
        .then(res => res.json() as Donor);
  }

  sendMessage(message){
    this.socket.emit('add-message', message);    
  }
  
  getMessages() {
    let observable = new Observable(observer => {
      this.socket = io(this.url);
      this.socket.on('messages', (data) => {
        observer.next(data);    
      });
      return () => {
        this.socket.disconnect();
      };  
    })     
    return observable;
  } 

  getIP(): Promise<Ip> {
    return this.http.get("https://ipv4.myexternalip.com/json")
      .toPromise()
        .then(res => res.json() as Ip);  
  }
  
}