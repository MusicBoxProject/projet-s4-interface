import { Injectable, Input, Output, OnInit } from '@angular/core';
import { Observable, pipe, of } from 'rxjs';
import { from } from 'rxjs';
import { map } from 'rxjs/operators';
import { Tag } from './tag';
import { TAGS } from './tag-mock';
import { PLAYLISTS } from './playlist-mock'


import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { QuerySnapshot } from '@firebase/firestore-types';
import { Playlist, emptyTagPlaylist, TagPlaylist, Media } from './playlist';
import { ConfigFile, ConfigTag } from './config-file'
import { AuthService } from './shared'
import * as JSZip from 'jszip';
import * as FileSaver from 'file-saver';
import { HttpClient } from '@angular/common/http';


@Injectable()
export class TagsService {
  private itemsCollection: AngularFirestoreCollection<Tag>;
  tagFire: Observable<Tag[]>;
  tags: Tag[] = TAGS;
  parent: String
  emptyTagPlaylist: TagPlaylist = emptyTagPlaylist;
  user: any = { uid: '0' };
  userDoc: AngularFirestoreDocument<any>
  isSyncing=false;



  getTags(): Observable<Tag[]> {
    return this.userDoc.collection('tags', ref => ref.orderBy("num")).snapshotChanges().pipe(map(actions => {
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
    return this.userDoc.collection('tags').doc(id).ref.get()

  }

  addTag(tag: Tag) {
    tag.id = this.db.createId();
    this.userDoc.collection('tags').doc(tag.id).set(Object.assign({}, tag));
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
      this.userDoc.collection("tags").doc(id).delete().then(function () {
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
    this.userDoc.collection('tags').doc(tag.id).set(Object.assign({}, tag))
      .then(function () {
        console.log("Tag successfully updated!");
      })
      .catch(function (error) {
        console.log("Error getting Tag:", error);
      })
      .then(doc => {
        if (tag.playlistId != 'No Playlist') {
          this.userDoc.collection("playlists").doc(tag.playlistId).update({
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
          this.userDoc.collection("tags").doc(data.id).update({
            playlistId: playlistId
          })
        }
        else if (playlistId != data.playlistId) {
          console.log("Old", data.playlistId)
          this.emptyPlaylist(data.playlistId);
          this.userDoc.collection("tags").doc(data.id).update({
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
    this.userDoc.collection("playlists").doc(id).update({
      "tag": Object.assign({}, this.emptyTagPlaylist as TagPlaylist)
    })
      .then(function () {
        console.log("Tag of the Playlist successfully emptied!!!");
      })
      .catch(function (error) {
        console.log("Error getting playlist: Probably doen't exist anymore", error);
      });
  }

  //make the playlist Id empty (No Playlist)
  emptyTag(id: string) {
    if (id != 'No Id') {
      this.userDoc.collection("tags").doc(id).update({
        playlistId: "No Playlist"
      })
        .then(function () {
          console.log("playlistId of the Tag successfully emptied!!!");
        })
        .catch(function (error) {
          console.log("Error getting Tag: Probably No Tag", error);
        });
    }
    else {
      console.log("The playlist has no tag")
    }
  }

  getPlaylistById(id: string): any {
    return this.userDoc.collection('playlists').doc(id).ref.get()

  }


  editPlaylist(playlist: Playlist): void {
    this.userDoc.collection('playlists').doc(playlist.id).set(Object.assign({}, playlist));
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
  generateZip(zip: JSZip) {
    this.isSyncing=false
    console.log("last");
    zip
      .generateAsync({ type: "blob" })
      .then(function (blob) { // 1) generate the zip file
        FileSaver.saveAs(blob, "config.zip");                          // 2) trigger the download
      }, function (err) {
        console.log(err);
      });
  }
  downloadUrls(configFile: ConfigFile): void {
    this.isSyncing=true
    var zip = new JSZip();
    var j: number = 0
    var t: number = configFile.configTags.length;
    configFile.configTags.map(conf => {
      let folder: string = 'MediaBox';
      let m3u: string = '';
      let mediaList = conf.playlist.media
      let k: number = 0;
      let l: Number = mediaList.length
      if (l == 0) j = j + 1;
      mediaList.forEach(media => {
        let urlProxy = 'https://cors-anywhere.herokuapp.com/' + media.uri
        this.http.get(urlProxy, { responseType: "blob" }).subscribe(data => {
          console.log("we got data")
          if ((conf.playlist.type == 'Podcast') && (conf.playlist.onlyLatest)) {
            let reader = new FileReader();
            reader.onload = (e) => {
              let f = <FileReader>e.target
              let parser = new DOMParser();
              let xml = f.result
              let xmlDoc = parser.parseFromString(xml, "text/xml");
              let urlPodcast = xmlDoc.getElementsByTagName("rss")[0].getElementsByTagName("channel")[0].getElementsByTagName("item")[0]
                .getElementsByTagName("enclosure")[0].getAttribute('url');
              urlPodcast = 'https://cors-anywhere.herokuapp.com/' + String(urlPodcast)
              this.http.get(urlPodcast, { responseType: "blob" }).subscribe(data => {
                let ext = data.type.split('/')[1]
                let fileName: string = media.id + media.title + '.' + ext
                let filePath: string = folder + '/' + fileName
                m3u = m3u + '/' + fileName + '\n'
                zip.file(filePath, data);
                k = k + 1;
                console.log("in podcast"+ " k: "+k +"l: "+ l)
                if (k == l) {
                  let m3uFile = new Blob([m3u], { type: 'data:text/m3u;charset=utf-8' });
                  zip.file(folder + '/' + conf.tag.uuid.toUpperCase()+'.m3u', m3uFile)
                  j = j + 1;
                  console.log("tag number done download" + j + ' t=' + t + ' j=' + j)
                  if (j == t) {
                    let confJson = new Blob([JSON.stringify(configFile)], { type: 'data:text/json;charset=utf-8' });
                    zip.file("MediaBox/conf.json", confJson)
                    this.generateZip(zip)
                  }
                }

              },error => {
                console.log(error)
                console.log("no download latest podcast")
                k = k + 1;
                if (k == l) {
                  let m3uFile = new Blob([m3u], { type: 'data:text/m3u;charset=utf-8' });
                  zip.file(folder + '/' + conf.tag.uuid.toUpperCase()+'.m3u', m3uFile)
                  j = j + 1;
                  console.log("tag number done download" + j)
                  if (j == t) {
                    let confJson = new Blob([JSON.stringify(configFile)], { type: 'data:text/json;charset=utf-8' });
                    zip.file("MediaBox/conf.json", confJson)
                    this.generateZip(zip)
                  }
                }
              })
            }
            reader.readAsText(data)
          } else {
            let ext = data.type.split('/')[1]
            let fileName: string = media.id + media.title + '.' + ext
            let filePath: string = folder + '/' + fileName
            m3u = m3u + fileName + '\n'
            zip.file(filePath, data);
            k = k + 1;
            if (k == l) {
              let m3uFile = new Blob([m3u], { type: 'data:text/m3u;charset=utf-8' });
              if (conf.playlist.type != 'Podcast' || conf.playlist.onlyLatest) zip.file(folder + '/' + conf.tag.uuid.toUpperCase()+'.m3u', m3uFile)
              j = j + 1;
              console.log("tag number done download" + j + ' t=' + t + ' j=' + j)
              if (j == t) {
                let confJson = new Blob([JSON.stringify(configFile)], { type: 'data:text/json;charset=utf-8' });
                zip.file("MediaBox/conf.json", confJson)
                this.generateZip(zip)
              }
            }
          }
        }, error => {
          console.log(error)
          console.log("no download")
          k = k + 1;
          if (k == l) {
            let m3uFile = new Blob([m3u], { type: 'data:text/m3u;charset=utf-8' });
            if (conf.playlist.type != 'Podcast' || conf.playlist.onlyLatest) zip.file(folder + '/' + conf.tag.uuid.toUpperCase()+'.m3u', m3uFile)
            j = j + 1;
            console.log("tag number done download" + j)
            if (j == t) {
              let confJson = new Blob([JSON.stringify(configFile)], { type: 'data:text/json;charset=utf-8' });
              zip.file("MediaBox/conf.json", confJson)
              this.generateZip(zip)
            }
          }
        });
      })

    })
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
    this.userDoc.collection('tags').ref.get().then(querySnapshot => {
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
                //this.download(configFile);
                console.log(configFile)
                this.downloadUrls(configFile)
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
                //this.download(configFile);
                console.log(configFile)
                this.downloadUrls(configFile)
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
            //this.download(configFile);
            console.log(configFile)
            this.downloadUrls(configFile)

          }

        }
      });

    })
      .catch(function (error) {
        console.log("Error getting documents: ", error);
      });

  }


  getUser() {
    this.authService.user.subscribe(user => {
      if (user == null) {
        this.user = { uid: '0' }
      }
      else { this.user = user }
      this.updateUserDocRef()
      console.log(this.user.uid)
    })
  }

  updateUserDocRef() {
    this.userDoc = this.db.doc(`users/${this.user.uid}`)
  }

  getUserO(): Observable<any> {
    return this.authService.user
  }

  constructor(private http: HttpClient, private db: AngularFirestore, private authService: AuthService) {
    this.userDoc = this.db.doc(`users/${this.user.uid}`)
    this.getUser();

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
