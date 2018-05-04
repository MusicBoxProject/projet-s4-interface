import { Injectable,Input, Output } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';

import { Tag } from './tag';
import { TAGS } from './tag-mock';

import { AngularFirestore,AngularFirestoreCollection } from 'angularfire2/firestore';
import { QuerySnapshot } from '@firebase/firestore-types';
import { query } from '@angular/core/src/render3/instructions';
import { Playlist } from './playlist';
@Injectable()
export class TagsService {
  private itemsCollection: AngularFirestoreCollection<Tag>;
  tagFire: Observable<Tag[]>;
  tags : Tag[] = TAGS ;
  parent:String



  getTags (): Observable<Tag[]> {
    return this.db.collection('tags').snapshotChanges().map(actions => {
      return actions.map(a => {
        const data = a.payload.doc.data() as Tag;
        return  data;
      });
    })   
  }

  /*getTags (): Observable<Tag[]> {
    return of (this.tags);

  }*/

  getTagById (id:string) : any {
  /*  return new Promise( (resolve, reject) => {
      const doc ={exists:true,data:()=>this.tags.find(tag => tag.id==id)};
      resolve(doc);
    }); */
    return this.db.collection('tags').doc(id).ref.get()

  }

   addTag (tag: Tag) {
    tag.id = this.db.createId();
    this.db.collection('tags').doc(tag.id).set(Object.assign({}, tag));
//   this.tags.push(playlist);

}
  deleteTag (id : string):void {
    this.getTagById(id).then(doc => {
      if (doc.exists) {
          const data =doc.data();
          if (data.playlistId=='No Playlist') {
            console.log("No Playlist to delete")            
          }
          else {
            console.log("To delete",data.playlistId)            
            this.checkPlaylist(data.playlistId);
        } 
          
      }else {
        console.log("No such tag!");
    }
    }).then(doc => {
      this.db.collection("tags").doc(id).delete().then(function() {
        console.log("Document successfully deleted!");
    }).catch(function(error) {
        console.error("Error removing document: ", error);
    });
  
    })
    .catch(function(error) {
        console.log("Error getting document:", error);
    });    


}

  editTag (tag : Tag) : void {
    this.db.collection('tags').doc(tag.id).set(Object.assign({}, tag));
  }

  checkTag (tagId:string,playlistId:string){
    this.getTagById(tagId).then(doc => {
      if (doc.exists) {
          const data =doc.data();
          console.log("new",playlistId,"old",data.playlistId);
          if (data.playlistId=='No Playlist') {
            console.log("No Playlist",playlistId)            
            data.playlistId=playlistId;
            this.editTag(data as Tag)
          }
          else if (playlistId!=data.playlistId) {
            console.log("Old",data.playlistId)            
            this.checkPlaylist(data.playlistId);
            data.playlistId=playlistId;
            this.editTag(data as Tag)            
        } 
          
      }else {
        console.log("No such tag!");
    }
    }).catch(function(error) {
        console.log("Error getting document:", error);
    });    
    
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
  checkPlaylist (id:string){
    this.getPlaylistById(id).then(doc => {
      if (doc.exists) {
          const data =doc.data();
            data.tagId='No Tag';
            this.editPlaylist(data as Playlist)
    }
    else {
      console.log("No such Playlist!");
  }
    }).catch(function(error) {
        console.log("Error getting document:", error);
    });

  }
  getPlaylistById (id:string) : any {
    return this.db.collection('playlists').doc(id).ref.get()

  }
  editPlaylist (playlist : Playlist) : void {
    this.db.collection('playlists').doc(playlist.id).set(Object.assign({}, playlist));
  }

constructor(private db : AngularFirestore) {
  // //ref makes it a collection reference
  //   db.collection('playlists').ref.get().then(querySnapshot =>
  //     console.log("query: ",querySnapshot.docs.length))
  //   /*function(querySnapshot) {
  //   querySnapshot.forEach(function(doc) {
  //         // doc.data() is never undefined for query doc snapshots
  //         console.log(doc.id, " => ", doc.data());
  //     });
  // })*/
  // .catch(function(error) {
  //     console.log("Error getting documents: ", error);
  // });
  // db.collection('playlists').snapshotChanges().map(actions => {
  //   return actions.map(a => {
  //     const data = a.payload.doc.data() as Playlist;
  //     //const id = a.payload.doc.id;
  //     return  data;
  //   });
  // })
  // .subscribe(obs => console.log(obs));
}


}
