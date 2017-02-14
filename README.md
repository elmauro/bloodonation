# Bloodonation

blood donation management system to facilitate the patients from all around the world, find blood donors near them

## Asumptions

1. MongoDB local installed and running without user and password
2. NodeJS installed ... I was working with a version 6.x


## Instalation

Asumptions on the code
	
1. Custom ssl certificate into code for calling navigator.geolocation.getCurrentPosition to get current location from https server
2. calling external Api to get the current IP address

a. Install with npm

1. npm install
2. npm run build
3. open https://localhost:8080
4. reload if the page doesn't show the map

b. Install with Docker (assuming docker installed on current machine)

1. change the line on server.js

	mongodb://localhost/crossover with
	mongodb://[ip mongodb server]/crossover (the IP must to be a valid mongodb access IP)
	e.g
	mongodb://10.3.9.57/crossover

2. change the lines on donors.services.js

	https://localhost:8080/api/donors with
	https://192.168.99.100:8080/api/donors

	https://localhost:8080 with
	https://192.168.99.100:8080

3. docker build -t bloodonation .
4. docker run --name bloodonation -p 8080:8080 bloodonation
5. open https://localhost:8080
6. reload if the page doesn't show the map


## Use the API to reflect changes with socket.io

GET
https://localhost:8080/api/donors

GET
https://localhost:8080/api/donors/id_donor

POST
https://localhost:8080/api/donors
{
	"firstname": "Test1",
	"lastname": "Test1",
	"number": "3116344194",
	"email": "test1@gmail.com",
	"address": "address1",
	"group": "O+",
	"ip": "181.48.149.130",
	"lat": "6.225",
	"lng": "-75.574"
}

PUT
https://localhost:8080/api/donors/donor_id
{
  "firstnamename": "Test1XXX",
  "lastname": "Test1XXX",
  "number": "3116344194",
  "email": "test1xxx@gmail.com",
  "address": "address1xxx",
  "group": "O+",
  "ip": "181.48.149.130",
  "lat": "6.225",
  "lng": "-75.574"
}

DEL
https://localhost:8080/api/donors/donor_id

GET
https://localhost:8080/api/donors/ipaddress/ip_number


## For Testing

	Execute:

	1. npm test


## Future Work

1. work with valid ssh certificate
2. work into cloud server (AWS - Google Cloude - Azure). The deploy can be doing with Docker and 
   mapping with public IP
3. Separate the graphic part on donors into a new service

