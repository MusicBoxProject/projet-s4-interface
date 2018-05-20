import { Injectable, Input, Output } from '@angular/core';
import { Observable,pipe, of} from 'rxjs';
import { from } from 'rxjs';
import { map} from 'rxjs/operators';
import { Tag } from './tag';
import { TAGS } from './tag-mock';
import { PLAYLISTS } from './playlist-mock'

import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { QuerySnapshot } from '@firebase/firestore-types';
import { query } from '@angular/core/src/render3/instructions';
import { Playlist, emptyTagPlaylist, TagPlaylist } from './playlist';
import { ConfigFile, ConfigTag } from './config-file'
@Injectable()
export class TagsService {
  private itemsCollection: AngularFirestoreCollection<Tag>;
  tagFire: Observable<Tag[]>;
  tags: Tag[] = TAGS;
  parent: String
  emptyTagPlaylist: TagPlaylist = emptyTagPlaylist;



  getTags(): Observable<Tag[]> {
    return this.db.collection('tags',ref =>ref.orderBy("num")).snapshotChanges().pipe(map(actions => {
      return actions.map(a => {
        const data = a.payload.doc.data() as Tag;
        return data;
      });
    }))
  }

  /*getTags (): Observable<Tag[]> {
    return of (this.tags);

  }*/

  getTagById(id: string): any {
    /*  return new Promise( (resolve, reject) => {
        const doc ={exists:true,data:()=>this.tags.find(tag => tag.id==id)};
        resolve(doc);
      }); */
    return this.db.collection('tags').doc(id).ref.get()

  }

  addTag(tag: Tag) {
    tag.id = this.db.createId();
    this.db.collection('tags').doc(tag.id).set(Object.assign({}, tag));
    //   this.tags.push(playlist);

  }
  deleteTag(id: string): void {
    this.getTagById(id).then(doc => {
      if (doc.exists) {
        const data = doc.data();
        if (data.playlistId == 'No Playlist') {
          console.log("No Playlist to delete")
        }
        else {
          console.log("To delete", data.playlistId)
          this.emptyPlaylist(data.playlistId);
        }

      } else {
        console.log("No such tag!");
      }
    }).then(doc => {
      this.db.collection("tags").doc(id).delete().then(function () {
        console.log("Document successfully deleted!");
      }).catch(function (error) {
        console.error("Error removing document: ", error);
      });

    })
      .catch(function (error) {
        console.log("Error getting document:", error);
      });


  }

  editTag(tag: Tag): void {
    this.db.collection('tags').doc(tag.id).set(Object.assign({}, tag))
      .then(function () {
        console.log("Tag successfully updated!");
      })
      .catch(function (error) {
        console.log("Error getting Tag:", error);
      })
      .then(doc => {
        if (tag.playlistId != 'No Playlist') {
          this.db.collection("playlists").doc(tag.playlistId).update({
            "tag.num": tag.num,
            "tag.color": tag.color
          }).then(function () {
            console.log("Playlist successfully updated!!!");
          })
            .catch(function (error) {
              console.log("Error getting playlist: Probably doen't exist anymore", error);
            });
        }

      }

      )
  }
  //give new playlistsid to tag and make the requied changes
  checkTag(tag: any, playlistId: string) {
    let tagId = tag.id;
    this.getTagById(tagId).then(doc => {
      if (doc.exists) {
        const data = doc.data();
        console.log("new", playlistId, "old", data.playlistId);
        if (data.playlistId == 'No Playlist') {
          console.log("No Playlist", playlistId)
          this.db.collection("tags").doc(data.id).update({
            playlistId: playlistId
          })
        }
        else if (playlistId != data.playlistId) {
          console.log("Old", data.playlistId)
          this.emptyPlaylist(data.playlistId);
          this.db.collection("tags").doc(data.id).update({
            playlistId: playlistId
          })
        }

      } else {
        console.log("No such tag!!");
      }
    }).catch(function (error) {
      console.log("Error getting document:", error);
    });

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
  //make the tag of the playlist empty
  emptyPlaylist(id: string) {
    this.db.collection("playlists").doc(id).update({
        "tag": Object.assign({},this.emptyTagPlaylist as TagPlaylist)
    })
      .then(function () {
        console.log("Tag of the Playlist successfully emptied!!!");
      })
      .catch(function (error) {
        console.log("Error getting playlist: Probably doen't exist anymore", error);
      });
  }

  //make the playlist Id empty (No Playlist)
  emptyTag (id: string) {
    this.db.collection("tags").doc(id).update({
      playlistId:"No Playlist"
    })
    .then(function () {
      console.log("playlistId of the Tag successfully emptied!!!");
    })
    .catch(function (error) {
      console.log("Error getting Tag: Probably No Tag", error);
    });
}
  getPlaylistById(id: string): any {
    return this.db.collection('playlists').doc(id).ref.get()

  }
  editPlaylist(playlist: Playlist): void {
    this.db.collection('playlists').doc(playlist.id).set(Object.assign({}, playlist));
  }

  fileName = "newfile001.txt";

  makeTextFile(fileContent) {
    var textFile = null;
    var data = new Blob([fileContent], { type: 'data:text/json;charset=utf-8' });
    // If we are replacing a previously generated file we need to
    // manually revoke the object URL to avoid memory leaks.
    if (textFile !== null) {
      window.URL.revokeObjectURL(textFile);
    }

    textFile = window.URL.createObjectURL(data);
    return textFile;
  }

  createFile(fileContent) {
    return this.makeTextFile(fileContent);

  }
  download(configFile) {
    let a = document.createElement("a");
    document.body.appendChild(a);
    a.href = this.createFile(JSON.stringify(configFile));
    a.download = "config.json";
    a.click();
    document.body.removeChild(a);

  }
  downloadFile() {
    var configFile: ConfigFile = new ConfigFile();
    this.db.collection('tags').ref.get().then(querySnapshot => {
      let l = querySnapshot.docs.length
      let k = 0
      querySnapshot.forEach(doc => {
        const dataTag = doc.data() as Tag;
        if ((dataTag.playlistId) != 'No Playlist') {
          this.getPlaylistById(dataTag.playlistId).then(doc => {
            if (doc.exists) {
              const dataPlaylist = doc.data() as Playlist;
              configFile.configTags.push(new ConfigTag(dataTag, dataPlaylist))
              k = k + 1;
              console.log(k, l);
              if (k == l) {
                console.log("last")
                this.download(configFile);
              }

            }
            else {
              const dataPlaylist = new Playlist('Playlist Not found', '', '', '')
              configFile.configTags.push(new ConfigTag(dataTag, dataPlaylist))
              console.log("No such Playlist!");
              k = k + 1;
              console.log(k, l);
              if (k == l) {
                console.log("last")
                this.download(configFile);
              }

            }
          })
            .catch(function (error) {
              console.log("Error getting document:", error);
            });
        }
        else {
          const dataPlaylist = new Playlist('No Playlist', '', '', '')
          configFile.configTags.push(new ConfigTag(dataTag, dataPlaylist))
          k = k + 1;
          console.log(k, l);
          if (k == l) {
            console.log("last")
            this.download(configFile);
          }

        }
      });

    })
      .catch(function (error) {
        console.log("Error getting documents: ", error);
      });

  }
  constructor(private db: AngularFirestore) {
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
