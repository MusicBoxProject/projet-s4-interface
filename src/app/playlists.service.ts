import { Injectable,Input, Output } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';

import { Playlist } from './playlist';
import { PLAYLISTS } from './playlist-mock';

import { AngularFirestore,AngularFirestoreCollection } from 'angularfire2/firestore';
import { QuerySnapshot } from '@firebase/firestore-types';
import { query } from '@angular/core/src/render3/instructions';


@Injectable()
export class PlaylistsService {
    private itemsCollection: AngularFirestoreCollection<Playlist>;
    playlistsFire: Observable<Playlist[]>;
    playlists : Playlist[] = PLAYLISTS ;
    parent:String

  getPlaylists (): Observable<Playlist[]> {
    return this.db.collection('playlists').snapshotChanges().map(actions => {
      return actions.map(a => {
        const data = a.payload.doc.data() as Playlist;
        return  data;
      });
    })
  }
/*    getPlaylists (): Observable<Playlist[]> {
      return of(this.playlists);
     }*/
  
     addPlaylist (playlist: Playlist) {
      playlist.id = this.db.createId();
      this.db.collection('playlists').doc(playlist.id).set(Object.assign({}, playlist));
 //   this.playlists.push(playlist);

  }
    deletePlaylist (id : string):void {
      this.db.collection("playlists").doc(id).delete().then(function() {
        console.log("Document successfully deleted!");
    }).catch(function(error) {
        console.error("Error removing document: ", error);
    });
  }

    editPlaylist (playlist : Playlist) : void {
      this.db.collection('playlists').doc(playlist.id).set(Object.assign({}, playlist));


      /*this.db.collection("cities").doc(playlist.id)
      .update({
      tag: 1
       })
      .then(function() {
      console.log("Document successfully updated!");
      })
      .catch(function(error) {
      // The document probably doesn't exist.
      console.error("Error updating document: ", error);
      });
      this.playlists[this.indexOf(playlist.id,this.playlists)]=playlist
      */
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
  
  constructor(private db : AngularFirestore) {
  //   //ref makes it a collection reference
  //     db.collection('playlists').ref.get().then(querySnapshot =>
  //       console.log("query: ",querySnapshot.docs.length))
  //     /*function(querySnapshot) {
  //     querySnapshot.forEach(function(doc) {
  //           // doc.data() is never undefined for query doc snapshots
  //           console.log(doc.id, " => ", doc.data());
  //       });
  //   })*/
  //   .catch(function(error) {
  //       console.log("Error getting documents: ", error);
  //   });
  //   db.collection('playlists').snapshotChanges().map(actions => {
  //     return actions.map(a => {
  //       const data = a.payload.doc.data() as Playlist;
  //       //const id = a.payload.doc.id;
  //       return  data;
  //     });
  //   })
  //   .subscribe(obs => console.log(obs));
  }
}

