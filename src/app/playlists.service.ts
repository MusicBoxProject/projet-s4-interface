import { Injectable,Input, Output } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';

import { Playlist } from './playlist';
import { PLAYLISTS } from './playlist-mock';

@Injectable()
export class PlaylistsService {
  playlists : Playlist[] = PLAYLISTS ;
  getPlaylists (): Observable<Playlist[]> {
    return of(this.playlists);

  }
  addPlaylist (playlist: Playlist) {
    this.playlists.push(playlist);

  }
    deletePlaylist (i:number):void {
    console.log(i,this.playlists.length)
    this.playlists.splice(i,1) 
    console.log(i,this.playlists.length)

  }

    editPlaylist (playlist : Playlist) : void {
      this.playlists[this.indexOf(playlist.id,this.playlists)]=playlist
    }

    indexOf (id:number,arr: any[]) : number {
      let k : number =0;
      for (let a of arr){
        if (a.id === id) {
          return k
        }
        k++
      }
      return -1
    }
  
  constructor() { }

}
