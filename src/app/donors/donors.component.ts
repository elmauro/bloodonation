import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';

import { Donor } from './donor';
import { DonorsService } from '../donors.service';

import { EsriLoaderService } from 'angular2-esri-loader';

import { Ng2Bs3ModalModule, ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';

@Component({
  selector: 'app-donors',
  templateUrl: './donors.component.html',
  styleUrls: ['./donors.component.css']
})

export class DonorsComponent implements OnInit {
  @ViewChild('modal')
  modal: ModalComponent;

  esriModules: any;
  map: any;
  view: any;

  lat = 43.07493;
  lng = -89.381388;

  show: boolean;
  donors: Donor[];
  selectedDonor: Donor;

  connection;
  message: any;
  donor: Donor;
  ip: string;
  currentDonor: any;

  constructor(
    private router: Router,
    private donorsService: DonorsService,
    private esriLoader: EsriLoaderService
  ) { }

  initialize(){
    this.onGetAllDonors();
  }

  createMap([Map, MapView,
          Graphic, Point, Polyline, Polygon,
          SimpleMarkerSymbol, SimpleLineSymbol, SimpleFillSymbol]){

    this.map = new Map({
      basemap: "dark-gray"
    });

    this.view = new MapView({
      container: "viewDiv",
      map: this.map,
      center: [this.lng, this.lat],
      zoom: 15
    });
  }

  drawPoint([Map, MapView,
          Graphic, Point, Polyline, Polygon,
          SimpleMarkerSymbol, SimpleLineSymbol, SimpleFillSymbol], donor, color){

    var point = new Point({
      longitude: donor.lng,
      latitude: donor.lat
    }); 

    var markerSymbol;
    var pointGraphic;

    var lineAtt = {
      Firstname: donor.firstname,
      LastName: donor.lastname,
      Number: donor.number,
      Email: donor.email,
      Group: donor.group,
      IP: donor.ip
    };

    if(color === "blue"){
      markerSymbol = new SimpleMarkerSymbol({
        color: [0, 0, 255],
        outline: { // autocasts as new SimpleLineSymbol()
          color: [255, 255, 255],
          width: 2
        }
      });

      pointGraphic = new Graphic({
      geometry: point,
      symbol: markerSymbol,
      attributes: lineAtt,
      popupTemplate: { // autocasts as new PopupTemplate()
        title: "Donor Info",
        actions: [{
          id: "show-donnor",
          title: "Click to show"
        }]
      }
    });

    }else{
      markerSymbol = new SimpleMarkerSymbol({
        color: [255, 0, 0],
        outline: { // autocasts as new SimpleLineSymbol()
          color: [255, 255, 255],
          width: 2
        }
      });

      pointGraphic = new Graphic({
        geometry: point,
        symbol: markerSymbol
      });
    }

    this.view.graphics.addMany([pointGraphic]);

    this.view.popup.viewModel.on("trigger-action", function (event) {
      if (event.action.id === "show-donnor") {
        var attributes = this.view.popup.viewModel.selectedFeature.attributes;
        var content = ''; 
        content += '<div class="row">';
        content += '        <div class="col-sm-6 col-md-8">';
        content += '            <h4>';
        content += '                ' + attributes.Firstname + ' ' + attributes.LastName + '</h4>';
        content += '            <small><cite title="' + attributes.number + '">' + attributes.Number + '<i class="glyphicon glyphicon-map-marker">';
        content += '            </i></cite></small>';
        content += '            <p>';
        content += '                <i class="glyphicon glyphicon-envelope"></i>' + attributes.Email;
        content += '                <br />';
        content += '                <i class="glyphicon glyphicon-gift"></i>' + attributes.Group;
        content += '                <br />';
        content += '                <i class="glyphicon glyphicon-gift"></i>' + attributes.IP;
        content += '            </p>';
        content += '        </div>';
        content += '    </div>';

        this.view.popup.content = content;
            
      }
    });
  }

  ngOnInit() {

    this.connection = this.donorsService.getMessages().subscribe(message => {
      this.message = message;
      console.log(this.message);

      this.drawPoint(this.esriModules, this.message, "blue");
      //this.onGetAllDonors();
    });

    if(navigator.geolocation){
      navigator.geolocation.getCurrentPosition(this.setPosition.bind(this));
    };

    return this.esriLoader.load({
      url: '//js.arcgis.com/4.2/'
    }).then(() => {
      this.esriLoader.loadModules(
      [
        "esri/Map",
        "esri/views/MapView",
        "esri/Graphic",
        "esri/geometry/Point",
        "esri/geometry/Polyline",
        "esri/geometry/Polygon",
        "esri/symbols/SimpleMarkerSymbol",
        "esri/symbols/SimpleLineSymbol",
        "esri/symbols/SimpleFillSymbol",
        "dojo/domReady!"
      ]).then((
      [
        Map, MapView,
          Graphic, Point, Polyline, Polygon,
          SimpleMarkerSymbol, SimpleLineSymbol, SimpleFillSymbol
      ]) => {
          this.esriModules = [Map, MapView,
          Graphic, Point, Polyline, Polygon,
          SimpleMarkerSymbol, SimpleLineSymbol, SimpleFillSymbol];

          this.createMap(this.esriModules);
          this.view.on("click", this.openModal.bind(this));

          this.initialize();

          this.donorsService.getIP()
            .then(Ip => {
              this.ip = Ip.ip;

              this.donorsService.getCurrentDonor(this.ip).then(donor => {
                this.currentDonor = donor;

                if(!this.currentDonor){
                  this.currentDonor = {
                    firstname: '', lastname: '', number: '', email: '', group: '', ip: '', lat: this.lat, lng: this.lng
                  };

                  this.drawPoint(this.esriModules, this.currentDonor, "red");
                }

              });
            });
      });
    });
  }

  setPosition(position){
    this.lat = Math.round(position.coords.latitude * 1000) / 1000;
    this.lng = Math.round(position.coords.longitude * 1000) / 1000;
  }

  openModal(event){
    var lat = Math.round(event.mapPoint.latitude * 1000) / 1000;
    var lon = Math.round(event.mapPoint.longitude * 1000) / 1000;

    this.donorsService.getCurrentDonor(this.ip).then(donor => {
      this.currentDonor = donor;

      if(!this.currentDonor && this.lat === lat && this.lng === lon){
        this.selectedDonor=null;
        this.modal.open();
      }

    });

    console.log(lat, lon);
  }

  onSelect(donor: Donor): void {
    this.selectedDonor = donor;
  }

  onGetAllDonors(){
    this.donorsService.getAllDonors().then(donors => {
      this.donors = donors;

      for(var i=0; i< this.donors.length; i++){
        this.drawPoint(this.esriModules, this.donors[i], "blue"); 
      };

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
