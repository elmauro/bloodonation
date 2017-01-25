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
      this.esriLoader.loadModules(
        [
          "esri/widgets/Track",
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
          Track, Map, MapView,
          Graphic, Point, Polyline, Polygon,
          SimpleMarkerSymbol, SimpleLineSymbol, SimpleFillSymbol
        ]) => {

        this.map = new Map({
          basemap: "dark-gray"
        });

        // Create the MapView
          this.view = new MapView({
          container: "viewDiv",
          map: this.map,
          center: [-75.574, 6.125],
          zoom: 8
        });

        /**********************
         * Create a point graphic
         **********************/

        // First create a point geometry (this is the location of the Titanic)
        var point = new Point({
          longitude: -75.574,
          latitude: 6.125
        });

        // Create a symbol for drawing the point
        var markerSymbol = new SimpleMarkerSymbol({
          color: [226, 119, 40],
          outline: { // autocasts as new SimpleLineSymbol()
            color: [255, 255, 255],
            width: 2
          }
        });

        // Create an object for storing attributes related to the line
        var lineAtt = {
          Name: "Keystone Pipeline",
          Owner: "TransCanada",
          Length: "3,456 km"
        };

        // Create a graphic and add the geometry and symbol to it
        var pointGraphic = new Graphic({
          geometry: point,
          symbol: markerSymbol,
          attributes: lineAtt,
          popupTemplate: { // autocasts as new PopupTemplate()
            title: "{Name}",
            content: [{
              type: "fields",
              fieldInfos: [{
                fieldName: "Name"
              }, {
                fieldName: "Owner"
              }, {
                fieldName: "Length"
              }]
            }]
          }
        });

        /*************************
         * Create a polyline graphic
         *************************/

        // First create a line geometry (this is the Keystone pipeline)
        var polyline = new Polyline({
          paths: [
            [-111.30, 52.68],
            [-98, 49.5],
            [-93.94, 29.89]
          ]
        });

        // Create a symbol for drawing the line
        var lineSymbol = new SimpleLineSymbol({
          color: [226, 119, 40],
          width: 4
        });

        /*******************************************
         * Create a new graphic and add the geometry,
         * symbol, and attributes to it. You may also
         * add a simple PopupTemplate to the graphic.
         * This allows users to view the graphic's
         * attributes when it is clicked.
         ******************************************/
        var polylineGraphic = new Graphic({
          geometry: polyline,
          symbol: lineSymbol
        });

        /************************
         * Create a polygon graphic
         ************************/

        // Create a polygon geometry
        var polygon = new Polygon({
          rings: [
            [-64.78, 32.3],
            [-66.07, 18.45],
            [-80.21, 25.78],
            [-64.78, 32.3]
          ]
        });

        // Create a symbol for rendering the graphic
        var fillSymbol = new SimpleFillSymbol({
          color: [227, 139, 79, 0.8],
          outline: { // autocasts as new SimpleLineSymbol()
            color: [255, 255, 255],
            width: 1
          }
        });

        // Add the geometry and symbol to a new graphic
        var polygonGraphic = new Graphic({
          geometry: polygon,
          symbol: fillSymbol
        });

        // Add the graphics to the view's graphics layer
        this.view.graphics.addMany([pointGraphic, polylineGraphic, polygonGraphic]);

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
