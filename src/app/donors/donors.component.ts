import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { Donor } from './donor';
import { DonorsService } from '../donors.service';

import { EsriLoaderService } from 'angular2-esri-loader';
import { Esri4MapComponent } from 'angular2-esri4-components';

import { Ng2Bs3ModalModule, ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';

@Component({
  selector: 'app-donors',
  templateUrl: './donors.component.html',
  styleUrls: ['./donors.component.css'],
  providers: [EsriLoaderService]
})

export class DonorsComponent implements OnInit {
  @ViewChild('modal')
  modal: ModalComponent;

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
  track: any;
  locate: any;

  point: any;
  markerSymbol: any;
  pointGraphic: any;
  esriModules: any;
  
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
    });

    if(navigator.geolocation){
      navigator.geolocation.getCurrentPosition(this.setPosition.bind(this));
    };
  }

  createGraphics([Graphic,Point,SimpleMarkerSymbol,Track]){
    this.point = new Point({
      longitude: -75.675,
      latitude: 6.225
    });

    this.markerSymbol = new SimpleMarkerSymbol({
      color: [226, 119, 40],
      outline: { // autocasts as new SimpleLineSymbol()
        color: [255, 255, 255],
        width: 2
      }
    });

    this.pointGraphic = new Graphic({
      geometry: this.point,
      symbol: this.markerSymbol
    });

    this.mapView.graphics.addMany([this.pointGraphic]);

    this.track = new Track({
      view: this.mapView
    });

    this.track.start(); 
  }

  onMapInit(mapInfo: {map: __esri.Map, mapView: __esri.MapView}) {
    this.map = mapInfo.map;
    this.mapView = mapInfo.mapView;
    
    this.mapView.on("click", this.openModal.bind(this));

    return this.esriLoader.load({
      url: '//js.arcgis.com/4.2/'
    }).then(() => {
      this.esriLoader.loadModules(['esri/Graphic','esri/geometry/Point','esri/symbols/SimpleMarkerSymbol','esri/widgets/Track']).then(([Graphic,Point,SimpleMarkerSymbol,Track]) => {
          this.esriModules = [Graphic,Point,SimpleMarkerSymbol,Track];
          this.createGraphics(this.esriModules);
      });
    });
  }

  setPosition(position){
    this.lat = Math.round(position.coords.latitude * 1000) / 1000;
    this.lng = Math.round(position.coords.longitude * 1000) / 1000;
  }

  openModal(event){
    // Get the coordinates of the click on the view
    // around the decimals to 3 decimals
    var lat = Math.round(event.mapPoint.latitude * 1000) / 1000;
    var lon = Math.round(event.mapPoint.longitude * 1000) / 1000;

    if(this.lat === lat && this.lng === lon)
    {
        this.selectedDonor=null;
        this.modal.open();
    }

    console.log(lat, lon);
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
