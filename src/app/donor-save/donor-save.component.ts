import { Component, OnInit, Input, Output, EventEmitter, SimpleChange } from '@angular/core';

import { Donor } from '../donors/donor';
import { Ip } from '../donors/ip';
import { DonorsService } from '../donors.service';

@Component({
  selector: 'app-donor-save',
  templateUrl: './donor-save.component.html',
  styleUrls: ['./donor-save.component.css']
})
export class DonorSaveComponent implements OnInit {
	
  @Input() modal: any;
  @Input() selectedDonor: any;
  @Input() show: boolean;
  @Output() outputEvent:EventEmitter<boolean>=new EventEmitter();
  
  lat: any;
  lng: any;
  
  donor: any;
  currentDonor: Donor;
  id: string;
  ip: string;

  ngOnChanges(changes: { selectedDonor: SimpleChange, show: SimpleChange } ) { 
    if(changes.selectedDonor){
      this.donor = changes.selectedDonor.currentValue;
      this.onSelectCurrentDonor();
    }
    else{
      if(changes.show){
        this.show = changes.show.currentValue;
      }
    }
  }

  constructor(
  	private donorsService: DonorsService
  ) { }

  initialize(){
    this.donor = {
      firstname: '', lastname: '', number: '', email: '', group: '', ip: '', lat: this.lat, lng: this.lng
    };
  }

  ngOnInit() {
  	this.initialize();

    if(navigator.geolocation){
      navigator.geolocation.getCurrentPosition(this.setPosition.bind(this));
    };
  }

  setPosition(position){
    this.lat = Math.round(position.coords.latitude * 1000) / 1000;
    this.lng = Math.round(position.coords.longitude * 1000) / 1000;

    this.onSelectCurrentDonor();
  }

  onSave(): void {
    if(this.id){
      this.donorsService.update(this.id, this.donor)
      .then(donorsaved => {
        this.onSelectCurrentDonor();
      this.modal.dismiss();
      });
    }
    else{
      this.donor.ip = this.ip;
      this.donor.lat = this.lat;
      this.donor.lng = this.lng;
      
      this.donorsService.save(this.donor)
        .then(donorsaved => {
          this.onSelectCurrentDonor();
         this.modal.dismiss();
        });
    }
  }

  onDelete(){
    if(this.id){
      this.donorsService.delete(this.id)
      .then(donordeleted => {
        this.initialize();
      this.modal.dismiss();
      });
    }  
  }

  onSelectCurrentDonor(){
    this.donorsService.getIP()
      .then(Ip => {
        this.ip = Ip.ip;
        
        this.donorsService.getCurrentDonor(this.ip).then(donor => {
          this.currentDonor = donor;

          if(this.currentDonor){
            this.id = this.currentDonor._id;

            this.donor = {
              firstname: this.currentDonor.firstname, 
              lastname: this.currentDonor.lastname, 
              number: this.currentDonor.number,
              email: this.currentDonor.email, 
              group: this.currentDonor.group, 
              ip: this.currentDonor.ip,
              lat: this.currentDonor.lat, 
              lng: this.currentDonor.lng
            };  
          }
          else{
            this.id = undefined;
          }
        });
      });
  }

  onShow(){
    this.show = true;
    this.outputEvent.emit(true);
  }

  onHide(){
    this.show = false;
    this.outputEvent.emit(false);
  }
  
}
