import { Injectable, Input, Output } from '@angular/core';
import { Observable,pipe, of, from} from 'rxjs';
import { map} from 'rxjs/operators';
import { Playlist, TagPlaylist } from './playlist';
import { PLAYLISTS } from './playlist-mock';

import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { QuerySnapshot } from '@firebase/firestore-types';
import { TagsService } from './tags.service'
import {AuthService} from './shared'


@Injectable()
export class PlaylistsService {
  private itemsCollection: AngularFirestoreCollection<Playlist>;
  playlistsFire: Observable<Playlist[]>;
  playlists: Playlist[] = PLAYLISTS;
  parent: String
  user : any ={uid: '0'} ;
  userDoc : AngularFirestoreDocument<any>;

  getPlaylists(): Observable<Playlist[]> {
    return this.userDoc.collection('playlists',ref =>ref.orderBy("name")).snapshotChanges().pipe(map(actions => {
      return actions.map(a => {
        const data = a.payload.doc.data() as Playlist;
        return data;
      });
    }))
  }

  /*  getPlaylists (): Observable<Playlist[]> {
      return of(this.playlists);
     }*/

  addPlaylist(playlist: Playlist) {
    playlist.id = this.db.createId();
    this.userDoc.collection('playlists').doc(playlist.id).set(Object.assign({}, playlist));
    this.checkTag(playlist.tag, playlist.id);
    //this.playlists.push(playlist);

  }

  editPlaylist(playlist: Playlist,oldTag: TagPlaylist): void {
    this.userDoc.collection('playlists').doc(playlist.id).set(Object.assign({}, playlist));
    if (oldTag.id!=playlist.tag.id){
      this.checkTag(playlist.tag, playlist.id);
      this.emptyTag(oldTag.id);
    } 
    else {    
      console.log("The tagPlaylist has not changed")
    }

    /*db.collection("cities").doc(playlist.id)
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

  deletePlaylist(playlist: Playlist): void {
    this.userDoc.collection("playlists").doc(playlist.id).delete().then( ()=> {
      this.emptyTag(playlist.tag.id)
      console.log("Document successfully deleted!");
    }).catch(function (error) {
      console.error("Error removing document: ", error);
    });
  }

  //check if tag is free on have another playlist
  checkTag(tag: any, playlistId: string) {
    this.tagsService.checkTag(tag, playlistId);
  }

  emptyTag(id: string) {
    this.tagsService.emptyTag(id);
  }


  indexOf(id: string, arr: any[]): number {
    let k: number = 0;
    for (let a of arr) {
      if (a.id === id) {
        return k
      }
      k++
    }
    return -1
  }
  getUser() {
    this.authService.user.subscribe(user => {
      if (user==null) {
        this.user ={uid: '0'}
      }
      else {this.user=user}
      this.updateUserDocRef()
    console.log(this.user.uid)})
  }

  updateUserDocRef() {
    this.userDoc = this.db.doc(`users/${this.user.uid}`)
  }
  getUserO(): Observable<any> {
    return this.authService.user
  }

  constructor(private db: AngularFirestore, private tagsService: TagsService,private authService: AuthService) {
    this.userDoc = this.db.doc(`users/${this.user.uid}`)
    this.getUser()
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

