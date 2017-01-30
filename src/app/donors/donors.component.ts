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

  lat: any;
  lng: any;

  show: boolean;
  donors: Donor[];
  selectedDonor: any;

  connection;
  message: any;
  donor: Donor;
  ip: string;
  currentDonor: any;
  graphic: any;
  
  constructor(
    private router: Router,
    private donorsService: DonorsService,
    private esriLoader: EsriLoaderService
  ) { }

  initialize(){
    this.onGetAllDonors();
  }

  ngOnInit() {

    this.connection = this.donorsService.getMessages().subscribe(message => {
      this.message = message;
      
      if(this.message.donor.ip === this.ip){
        this.removeGraphic(this.message.donor);

        if(this.message.action !== "delete"){
          this.drawPoint(this.esriModules, this.message.donor, "red");
        }else{
          this.currentDonor = {
            firstname: '', lastname: '', number: '', email: '', address: '', group: '', ip: this.ip, lat: this.lat, lng: this.lng
          };

          this.selectedDonor = this.currentDonor;
          this.onShow();

          this.drawPoint(this.esriModules, this.currentDonor, "red"); 
        }

        this.donorsService.getCurrentDonor(this.ip).then(donor => {
          this.currentDonor = donor;

          if(this.currentDonor){
            this.onHide();
            this.selectedDonor = {
                firstname: this.currentDonor.firstname, 
                lastname: this.currentDonor.lastname, 
                number: this.currentDonor.number,
                email: this.currentDonor.email,
                address: this.currentDonor.address,
                group: this.currentDonor.group, 
                ip: this.currentDonor.ip,
                lat: this.currentDonor.lat, 
                lng: this.currentDonor.lng
              };
          }
          else
          {
            this.onShow();
          }
        });

      }
      else{
        if(this.message.action !== "save"){
          this.removeGraphic(this.message.donor);
        }
        if(this.message.action !== "delete"){
          this.drawPoint(this.esriModules, this.message.donor, "blue"); 
        }
      }

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

          this.donorsService.getIP()
            .then(Ip => {
              this.ip = Ip.ip;

              this.donorsService.getCurrentDonor(this.ip).then(donor => {
                this.currentDonor = donor;

                if(!this.currentDonor){
                  this.currentDonor = {
                    firstname: '', lastname: '', number: '', email: '', address: '', group: '', ip: this.ip, lat: this.lat, lng: this.lng
                  };

                  this.selectedDonor = this.currentDonor;
                  this.onShow();

                  this.drawPoint(this.esriModules, this.currentDonor, "red");
                }
                else{
                  this.onHide();
                }

                this.initialize();

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

    var screenPoint = {
      x: event.x,
      y: event.y
    };

    this.view.hitTest(screenPoint)
    .then(
      this.getGraphics.bind(this)
    );
  }

  getGraphics(response) {
    this.graphic = response.results[0].graphic;

    if(this.ip === this.graphic.attributes.IP){
      this.modal.open();
    }
  }

  removeGraphic(donor){
    var graphic = undefined;

    for(var i=0; i<this.view.graphics.length; i++){
      if(donor.ip === this.view.graphics.items[i].attributes.IP){
        graphic = this.view.graphics.items[i];  
      }
    }

    if(graphic !== undefined){
      this.view.graphics.remove(graphic);
    }
  }

  onSelect(donor: Donor): void {
    this.selectedDonor = donor;
  }

  onGetAllDonors(){
    this.donorsService.getAllDonors().then(donors => {
      this.donors = donors;

      for(var i=0; i< this.donors.length; i++){
        if(this.donors[i].ip === this.ip){
          this.drawPoint(this.esriModules, this.donors[i], "red"); 
        }else{
          this.drawPoint(this.esriModules, this.donors[i], "blue"); 
        }
      };

    });
  }

  onShow(){
    this.show = true;
  }

  onHide(){
    if(this.currentDonor){
      this.show = false;
    }
    else{
      this.show = true;
    }
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
      Address: donor.address,
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
        symbol: markerSymbol,
        attributes: lineAtt
      });
    }

    this.view.graphics.addMany([pointGraphic]);

    this.view.popup.viewModel.on("trigger-action", this.updateContent.bind(this));
  }

  updateContent(event){
    if (event.action.id === "show-donnor") {

      var attributes = this.view.popup.viewModel.selectedFeature.attributes;
      var content = ''; 
      content += '<div class="container">';
      content += '  <div class="row">';
      content += '    <div class="col-xs-12 col-sm-12 col-md-12">';
      content += '      <div class="well well-sm">';
      content += '        <div class="row">';
      content += '          <div class="col-sm-12 col-md-12">';
      content += '            <h4>';
      content += '                ' + attributes.Firstname + ' ' + attributes.LastName + '</h4>';
      content += '            <small><cite title="' + attributes.Number + '">' + attributes.Number + '<i class="glyphicon glyphicon-map-marker">';
      content += '            </i></cite></small>';
      content += '            <p>';
      content += '                <i class="glyphicon glyphicon-envelope"></i>' + attributes.Email;
      content += '                <br />';
       content += '                <i class="glyphicon glyphicon-envelope"></i>' + attributes.Address;
      content += '                <br />';
      content += '                <i class="glyphicon glyphicon-gift"></i>' + attributes.Group;
      content += '            </p>';
      content += '          </div>';
      content += '        </div>';
      content += '      </div>';
      content += '    </div>';
      content += '  </div>';
      content += '</div>';

      this.view.popup.content = content;

    }
  }

  onComponentChange(value){
    this.show = value;
  }

}
