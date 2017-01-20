import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Donor } from './donor';
import { DonorsService } from '../donors.service';

@Component({
  selector: 'app-donors',
  templateUrl: './donors.component.html',
  styleUrls: ['./donors.component.css']
})

export class DonorsComponent implements OnInit {

  lat = 43.07493;
  lng = -89.381388;

  show: boolean;
  donors: Donor[];
  selectedDonor: Donor;

  connection;
  message;
  
  constructor(
    private router: Router,
    private donorsService: DonorsService
  ) { }

  initialize(){
    this.onGetAllDonors();
  }

  ngOnInit() {
  	this.initialize();

    this.connection = this.donorsService.getMessages().subscribe(message => {
      this.onGetAllDonors();
    })
  }

  onSelect(donor: Donor): void {
    this.selectedDonor = donor;
  }

  onGetAllDonors(){
    this.donorsService.getAllDonors().then(donors => {
      this.donors = donors;
    });
  }

  onComponentChange(){
   this.donorsService.getAllDonors().then(donors => {
    this.donors = donors;
   });
  }

  onShow(){
    this.show = true;
  }

  onHide(){
    this.show = false;
  }
}
