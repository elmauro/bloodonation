import 'zone.js';
import 'reflect-metadata';

import {DonorsService} from './app/donors.service';
import { Donor } from './donors/donor';
import { Ip } from './donors/ip';

import {
  TestBed, inject
} from '@angular/core/testing';

class MockTestService extends DonorsService {
  public getAllDonors(): Promise<Donor[]> {
    return [];
  }

  public getCurrentDonor(ipaddress: string): Promise<Donor> {
    return {
		_id: "";
		firstname: "";
		lastname: "";
		number: "";
		email: "";
		address: "";
		group: "";
		ip: "";
		lat : "";
		lng : "";
	  	__v: 0;
	    };  
  	}

  public getIP(): Promise<Ip> {
    return { ip: "10.3.9.57"; };
  }

  public save(donor: Donor): Promise<Donor> {
    return {
		"firstname": "Mauricio",
		"lastname": "Cadavid",
		"number": "3116344194",
		"email": "elmauro@gmail.com",
		"address": "Avenida Las Vegas 12, Simesa, El Poblado, Medellín, Antioquia",
		"group": "O+",
		"ip": "181.48.149.130",
		"lat": "6.225",
		"lng": "-75.574"
    };
  }

  public update(): Promise<Donor> {
    return {
		"firstname": "Mauricio",
		"lastname": "Cadavid",
		"number": "3116344194",
		"email": "elmauro@gmail.com",
		"address": "Avenida Las Vegas 12, Simesa, El Poblado, Medellín, Antioquia",
		"group": "O+",
		"ip": "181.48.149.130",
		"lat": "6.225",
		"lng": "-75.574"
    };
  }

  public delete(): Promise<Donor> {
    return {
		"firstname": "Mauricio",
		"lastname": "Cadavid",
		"number": "3116344194",
		"email": "elmauro@gmail.com",
		"address": "Avenida Las Vegas 12, Simesa, El Poblado, Medellín, Antioquia",
		"group": "O+",
		"ip": "181.48.149.130",
		"lat": "6.225",
		"lng": "-75.574"
    };
  }
}

describe('DonorsService', () => {
	
  donorService: DonorsService;

  beforeEach(() => {
  	this.donorsService = new MockTestService();
  });

  it('get all donors', () => {
    expect(this.donorsService.getAllDonors()).toEqual([]);
  }));

  it('get ip', () => {
    expect(this.donorsService.getIP().ip).toEqual("10.3.9.57");
  }));

  it('get current donor', () => {
    expect(this.donorsService.getCurrentDonor()).toEqual(
    	{
		_id: "";
		firstname: "";
		lastname: "";
		number: "";
		email: "";
		address: "";
		group: "";
		ip: "";
		lat : "";
		lng : "";
	  	__v: 0;
	    };  
  	}	
    );
  }));

  it('save donor', () => {
    expect(this.donorsService.save()).toEqual(
    	{
			"firstname": "Mauricio",
			"lastname": "Cadavid",
			"number": "3116344194",
			"email": "elmauro@gmail.com",
			"address": "Avenida Las Vegas 12, Simesa, El Poblado, Medellín, Antioquia",
			"group": "O+",
			"ip": "181.48.149.130",
			"lat": "6.225",
			"lng": "-75.574"
		}
    );
  }));

  it('update donor', () => {
    expect(this.donorsService.update()).toEqual(
    	{
			"firstname": "Mauricio",
			"lastname": "Cadavid",
			"number": "3116344194",
			"email": "elmauro@gmail.com",
			"address": "Avenida Las Vegas 12, Simesa, El Poblado, Medellín, Antioquia",
			"group": "O+",
			"ip": "181.48.149.130",
			"lat": "6.225",
			"lng": "-75.574"
		}
    );
  }));

  it('delete donor', () => {
    expect(this.donorsService.delete()).toEqual(
    	{
			"firstname": "Mauricio",
			"lastname": "Cadavid",
			"number": "3116344194",
			"email": "elmauro@gmail.com",
			"address": "Avenida Las Vegas 12, Simesa, El Poblado, Medellín, Antioquia",
			"group": "O+",
			"ip": "181.48.149.130",
			"lat": "6.225",
			"lng": "-75.574"
		}
    );
  }));

});
