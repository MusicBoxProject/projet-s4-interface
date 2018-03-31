import { Component, OnInit,Output,Input, EventEmitter } from '@angular/core';
import {Playlist} from '../../../../playlist'
import { PlaylistsService } from '../../../../playlists.service'
import {NgbModal, NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss']
})
export class AddComponent implements OnInit {
  @Input() model =new Playlist(18,"Music","New one",3);
  @Input() isEdit: boolean ;
  @Output() getPlaylist = new EventEmitter();
  

  powers = [1,2,3,4,5];
 
 
  submitted = false;
 
  onSubmit() { this.submitted = true;
          //When delete() button is clicked getId gets called and emit the value of this.label
        //as an event the config componenet intercept this event
if (this.isEdit){
  console.log(this.model)
  this.playlistsService.editPlaylist(this.model);
}
  else {
    this.playlistsService.addPlaylist(this.model);

      }
    
    }
  newPlaylist() {
    this.model = new Playlist(42, '', '',1);
  }
  get diagnostic() { return JSON.stringify(this.model); }

  constructor(private playlistsService: PlaylistsService,public activeModal: NgbActiveModal) { }

  ngOnInit() {
  }

}
