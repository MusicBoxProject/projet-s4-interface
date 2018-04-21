import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConfigRoutingModule } from './config-routing.module';
import { ConfigComponent } from './config.component';
import { StatModule } from '../../shared/index';
import {TagModule} from '../../shared/index'
import { PlaylistsService } from '../../playlists.service';
import { TagsService } from '../../tags.service';
import { AddComponent } from './components/add/add.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap/modal/modal';
import { FormsModule } from '@angular/forms'; 

@NgModule({
  imports: [
    CommonModule,
    ConfigRoutingModule,
    StatModule,
    TagModule,
    FormsModule,
  ],
  declarations: [
    ConfigComponent,
    AddComponent,
    ],
    entryComponents: [
      AddComponent,],
  providers : [PlaylistsService, TagsService, NgbModal]
})
export class ConfigModule { }
