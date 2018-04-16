import { Component,ViewEncapsulation, OnInit } from '@angular/core';
import { PlaylistsService } from '../../playlists.service'
import { Playlist } from '../../playlist';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import { AddComponent } from './components/add/add.component';

@Component({
  selector: 'app-config',
  templateUrl: './config.component.html',
  styleUrls: ['./config.component.scss']
})
export class ConfigComponent implements OnInit {

  closeResult: string;
  playlists : Playlist[];
  selectedPlaylist : Playlist;
  isEdit : boolean ;
  getPlaylists(): void {
    this.playlistsService.getPlaylists()
        .subscribe(playlists => this.playlists=playlists);

  }

  indexOf (id:string,arr: any[]) : number {
    let k : number =0;
    for (let a of arr){
      if (a.id === id) {
        return k
      }
      k++
    }
    return -1
  }

  deletePlaylist(id): void{
    this.playlistsService.deletePlaylist(id)
  }
  editPlaylist(id): void{
    this.isEdit=true;
    this.selectedPlaylist = this.playlists[this.indexOf(id,this.playlists)]
    this.open();

  }
  addPlaylist(): void {
    this.isEdit = false;
    this.selectedPlaylist = new Playlist("18","Playlist name","Add Description",3);
    this.open();
      
  }


  constructor(private modalService: NgbModal ,private playlistsService: PlaylistsService) {     }

  ngOnInit() {
    this.getPlaylists();
    
  }
  open() {

    const modalRef = this.modalService.open(AddComponent);
    modalRef.componentInstance.isEdit = this.isEdit;
    modalRef.componentInstance.model = this.selectedPlaylist; 

 }

}
