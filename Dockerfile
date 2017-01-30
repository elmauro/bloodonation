FROM yuxidevops/lce_back
COPY package.json /src/package.json
RUN cd /src
COPY . /src
WORKDIR /src
RUN npm install
RUN npm install --save angular2-esri4-components
RUN npm install typings -g
RUN typings init
RUN typings install github:Esri/jsapi-resources/4.x/typescript/arcgis-js-api.d.ts --global --save
EXPOSE  8080

CMD ["npm", "run", "build"]

#FROM centos:centos6
#RUN curl -sL https://rpm.nodesource.com/setup_6.x | bash -
#RUN yum install -y nodejs npm
