import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { Donor } from './donor';
import { DonorsService } from '../donors.service';

import { EsriLoaderService } from 'angular2-esri-loader';
import { Esri4MapComponent } from 'angular2-esri4-components';

@Component({
  selector: 'app-donors',
  templateUrl: './donors.component.html',
  styleUrls: ['./donors.component.css'],
  providers: [EsriLoaderService]
})

export class DonorsComponent implements OnInit {

  lat = 43.07493;
  lng = -89.381388;

  show: boolean;
  donors: Donor[];
  selectedDonor: Donor;

  connection;
  message;

  mapProperties: __esri.MapProperties = {
    basemap: 'dark-gray'
  };
  mapViewProperties: __esri.MapViewProperties = {
    center: [-118, 34.5],
    zoom: 8
  };
  map: __esri.Map;
  mapView: __esri.MapView;
  track: __esri.Track;

  @ViewChild(Esri4MapComponent) esriComponent: Esri4MapComponent;
  
  constructor(
    private router: Router,
    private donorsService: DonorsService,
    private esriLoader: EsriLoaderService
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

  onMapInit(mapInfo: {map: __esri.Map, mapView: __esri.MapView}) {
    this.map = mapInfo.map;
    this.mapView = mapInfo.mapView;
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
