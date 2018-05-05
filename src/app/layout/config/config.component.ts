import { Component,ViewEncapsulation, OnInit } from '@angular/core';
import { PlaylistsService } from '../../playlists.service'
import { Playlist } from '../../playlist';
import { TagsService } from '../../tags.service'
import {Tag} from '../../tag'
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {AddComponent } from './components/add/add.component';
import { AddTagComponent } from './components/add-tag/add-tag.component';

@Component({
  selector: 'app-config',
  templateUrl: './config.component.html',
  styleUrls: ['./config.component.scss']
})
export class ConfigComponent implements OnInit {

  closeResult: string;
  playlists : Playlist[];
  selectedPlaylist : Playlist;
  selectedTag : Tag;
  isEdit : boolean ;

  tags : Tag[];

  isPlaylistList : boolean = true;

  getPlaylists(): void {
    this.playlistsService.getPlaylists()
        .subscribe(playlists => {this.playlists=playlists;});

  }

  getTags(): void {
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
//    this.selectedPlaylist = new Playlist("18","Playlist name","Add Description","Music");
    this.selectedPlaylist = new Playlist("","","","Music")
    this.open();
      
  }

  addTag():void {
    this.isEdit = false;
    this.selectedTag = new Tag("0","","",Math.floor(Math.random() * 100),"");
    this.openTag();

  }
  editTag(id): void{
    this.isEdit=true;
    this.selectedTag = this.tags.find(tag => tag.id==id)
    this.openTag();

  }

  deleteTag(id): void{
    this.tagsService.deleteTag(id)
  }

  constructor(private modalService: NgbModal ,private playlistsService: PlaylistsService, private tagsService : TagsService) {     }

  ngOnInit() {
    this.getPlaylists();
    this.getTags();
    
  }
  open() {

    const modalRef = this.modalService.open(AddComponent);
    modalRef.componentInstance.isEdit = this.isEdit;
    modalRef.componentInstance.model = this.selectedPlaylist; 

 }

 openTag() {

  const modalRef = this.modalService.open(AddTagComponent);
  modalRef.componentInstance.isEdit = this.isEdit;
  modalRef.componentInstance.model = this.selectedTag; 

}

getIcon(type:string):string {
  if (type=='Music'){
  return 'fa-music'
  }
  else if (type=='Podcast'){
    return'fa-podcast'
  }
  else if (type=='Story'){
    return 'fa-book'
  }
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
    this.isPlaylistList = b; 
  }


  download() {
    this.tagsService.downloadFile();
  }
}
