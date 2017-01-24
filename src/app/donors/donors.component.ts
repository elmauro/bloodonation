import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';

import { Donor } from './donor';
import { DonorsService } from '../donors.service';

import { EsriLoaderService } from 'angular2-esri-loader';

@Component({
  selector: 'app-donors',
  templateUrl: './donors.component.html',
  styleUrls: ['./donors.component.css']
})

export class DonorsComponent implements OnInit {

  @ViewChild('map') mapEl: ElementRef;

  map: any;
  view: any;
  track: any;

  lat = 43.07493;
  lng = -89.381388;

  show: boolean;
  donors: Donor[];
  selectedDonor: Donor;

  connection;
  message;

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

    // only load the ArcGIS API for JavaScript when this component is loaded
    return this.esriLoader.load({
      // use a specific version of the API instead of the latest
      url: '//js.arcgis.com/4.2/'
    }).then(() => {
      // load the map class needed to create a new map
      this.esriLoader.loadModules(['esri/widgets/Track','esri/Map','esri/views/MapView','dojo/domReady!']).then(([Track,Map,MapView]) => {

        this.map = new Map({
          basemap: "dark-gray"
        });

        // Create the MapView
          this.view = new MapView({
          container: this.mapEl.nativeElement,
          map: this.map,
          center: [-116.3031, 43.6088],
          zoom: 12
        });

        this.track = new Track({
          view: this.view
        });
        
        this.view.ui.add(this.track, "top-left");

        this.view.on("click", function(event) {
            // Get the coordinates of the click on the view
            // around the decimals to 3 decimals
            var lat = Math.round(event.mapPoint.latitude * 1000) / 1000;
            var lon = Math.round(event.mapPoint.longitude * 1000) / 1000;

            console.log(lat, lon);
        }); 

        this.view.then(function() {
          this.track.start();
        });

      });
    });
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
