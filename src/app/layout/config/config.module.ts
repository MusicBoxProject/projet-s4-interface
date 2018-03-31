import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConfigRoutingModule } from './config-routing.module';
import { ConfigComponent } from './config.component';
import { StatModule } from '../../shared/index';
import { PlaylistsService } from '../../playlists.service';
import { AddComponent } from './components/add/add.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap/modal/modal';
import { NgbModalStack } from '@ng-bootstrap/ng-bootstrap/modal/modal-stack';
import { NgbModalBackdrop } from '@ng-bootstrap/ng-bootstrap/modal/modal-backdrop';
import { NgbModalWindow } from '@ng-bootstrap/ng-bootstrap/modal/modal-window';
import { FormsModule } from '@angular/forms'; 

@NgModule({
  imports: [
    CommonModule,
    ConfigRoutingModule,
    StatModule,
    FormsModule
  ],
  declarations: [
    ConfigComponent,
    AddComponent,
    NgbModalBackdrop,
    NgbModalWindow,
    ],
    entryComponents: [
      NgbModalBackdrop, 
      NgbModalWindow,
      AddComponent,],
  providers : [PlaylistsService, NgbModal,NgbModalStack]
})
export class ConfigModule { }
