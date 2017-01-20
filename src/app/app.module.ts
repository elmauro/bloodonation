import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { RouterModule } from '@angular/router';
import { Ng2Bs3ModalModule } from 'ng2-bs3-modal/ng2-bs3-modal';

import { AppComponent } from './app.component';
import { DonorsComponent } from './donors/donors.component';

// Define the routes
const ROUTES = [
  {
    path: '',
    redirectTo: 'donors',
    pathMatch: 'full'
  },
  {
    path: 'donors',
    component: DonorsComponent
  },
  {
    path: 'donor-detail',
    component: DonorDetailComponent
  }
];

import { DonorsService } from './donors.service';
import { DonorDetailComponent } from './donor-detail/donor-detail.component';
import { DonorSaveComponent } from './donor-save/donor-save.component';

@NgModule({
  declarations: [
    AppComponent,
    DonorsComponent,
    DonorDetailComponent,
    DonorSaveComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    RouterModule.forRoot(ROUTES),
    Ng2Bs3ModalModule
  ],
  providers: [DonorsService],
  bootstrap: [AppComponent]
})
export class AppModule { }
