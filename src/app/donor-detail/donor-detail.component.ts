import { Component, OnInit, Input } from '@angular/core';

import { Donor } from '../donors/donor';
import { DonorsService } from '../donors.service';

@Component({
  selector: 'app-donor-detail',
  templateUrl: './donor-detail.component.html',
  styleUrls: ['./donor-detail.component.css']
})

export class DonorDetailComponent implements OnInit {

  person: any;
  @Input() donor: Donor;

  constructor(
  	private donorsService: DonorsService
  ) { }

  ngOnInit() {
  }
  
}
