import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

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
  @Output() outputEvent:EventEmitter<string>=new EventEmitter();
  
  lat = 43.07493;
  lng = -89.381388;
  
  donor: any;
  currentDonor: Donor;
  id: string;
  ip: Ip;

  constructor(
  	private donorsService: DonorsService
  ) { }

  initialize(){
    this.donor = {
      firstname: '', lastname: '', number: '', email: '', group: '', ip: '', lat: this.lat, lng: this.lng
    };

    this.onSelectCurrentDonor();
  }

  ngOnInit() {
  	this.initialize();
  }

  onSave(): void {
    if(this.id){
      this.donorsService.update(this.id, this.donor)
      .then(donorsaved => {
        this.initialize();
      this.modal.dismiss();
      this.changeComponentValue();
      });
    }
    else{
      this.donorsService.getIP()
        .then(Ip => {
          this.donor.ip = Ip.ip;
          
          this.donorsService.save(this.donor)
            .then(donorsaved => {
              this.initialize();
             this.modal.dismiss();
             this.changeComponentValue();
            });
        });
    }
  }

  changeComponentValue(){
    this.outputEvent.emit();
  }

  onSelectCurrentDonor(){
    this.donorsService.getCurrentDonor(this.lat, this.lng).then(donor => {
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
    });
  }
  
}
