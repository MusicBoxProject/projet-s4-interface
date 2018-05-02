import { Component,ViewEncapsulation, OnInit } from '@angular/core';
import { PlaylistsService } from '../../playlists.service'
import { Playlist } from '../../playlist';
import { TagsService } from '../../tags.service'
import {Tag} from '../../tag'
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {AddComponent } from './components/add/add.component';

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

  tags : Tag[];

  isPlaylistList : boolean = true;

  getPlaylists(): void {
    this.playlistsService.getPlaylists()
        .subscribe(playlists => this.playlists=playlists);

  }

  gettags(): void {
    this.tagsService.getTags()
        .subscribe(tags => this.tags=tags);
        

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
    this.selectedPlaylist = new Playlist("18","Playlist name","Add Description",3,"Music");
    this.open();
      
  }


  constructor(private modalService: NgbModal ,private playlistsService: PlaylistsService, private tagsService : TagsService) {     }

  ngOnInit() {
    this.getPlaylists();
    this.gettags();
    
  }
  open() {

    const modalRef = this.modalService.open(AddComponent);
    modalRef.componentInstance.isEdit = this.isEdit;
    modalRef.componentInstance.model = this.selectedPlaylist; 

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
  changeList (b:boolean) {
    console.log("clicked")
    this.isPlaylistList = b; 
  }

}
