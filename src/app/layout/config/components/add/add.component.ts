import { Component, OnInit, Output, Input, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { Playlist, Media, types, uriTypes, emptyTagPlaylist, TagPlaylist, emptyPlaylist } from '../../../../playlist'
import { PlaylistsService } from '../../../../playlists.service'
import { TagsService } from '../../../../tags.service'
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, FormArray } from "@angular/forms"
import { OnChanges } from '@angular/core/src/metadata/lifecycle_hooks';
import { Observable, pipe, of, from } from 'rxjs';
import { map, tap, finalize } from 'rxjs/operators';
import { Tag } from '../../../../tag';

import { AngularFireStorage, AngularFireUploadTask } from 'angularfire2/storage';


@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss']
})
export class AddComponent implements OnChanges {
  @Input() model = emptyPlaylist;
  @Input() isEdit: boolean;
  @Output() getPlaylist = new EventEmitter();


  playlistForm: FormGroup;
  nameChangeLog: string[] = [];

  tags: Tag[];

  types = types;
  uriTypes = uriTypes;
  emptyTagPlaylist: TagPlaylist = emptyTagPlaylist


  submitted = false;
  tagAvailable = true;

  getTags(): void {
    let arr: number[];
    this.tagsService.getTags()
      .subscribe(tags => this.tags = tags)
  }

  constructor(private storage: AngularFireStorage, private playlistsService: PlaylistsService, private tagsService: TagsService, public activeModal: NgbActiveModal, private fb: FormBuilder) {
    this.getTags()
    this.createForm();
    this.logNameChange();
    this.logTypeChange();
    this.logTagChange();
  }

  createForm() {
    this.playlistForm = this.fb.group({
      name: '',
      description: '',
      tagId: '',
      type: '',
      secretLairs: this.fb.array([]),
      sidekick: '',
    });
  }
  ngOnChanges() {
    this.rebuildForm();
  }

  rebuildForm() {

    this.playlistForm.reset({

      name: this.model.name,
      description: this.model.description,
      tagId: this.model.tag.id,
      type: this.model.type,

    });
    this.setMedia(this.model.media);
  }

  get secretLairs(): FormArray {
    return this.playlistForm.get('secretLairs') as FormArray;
  };
  //  initializing the media array for the form
  setMedia(medias: Media[]) {
    const mediaFGs = medias.map(media => this.fb.group(
      {
        ...media,
        confirmed: true,
        isUploading: false,
        file: null,
        progress: 0,
      }
    ));
    const mediaFormArray = this.fb.array(mediaFGs);
    this.playlistForm.setControl('secretLairs', mediaFormArray);
  }

  addLair() {
    this.secretLairs.push(this.fb.group({
      ...new Media('', '', '', ''),
      confirmed: false,
      isUploading: false,
      file: null,
      progress: 0,
    }));
    /*    this.secretLairs.push(this.fb.group({
          uriType:"", 
          title:"",
          author:"",
          uri:"",
          confirmed:false,
        }));*/
  }

  deleteLair(i: number) {
    this.secretLairs.removeAt(i);
  }
  editLair(i: number) {
    let old = this.secretLairs.at(i).get('confirmed');
    this.secretLairs.at(i).get('confirmed').patchValue(!old.value)
  }

  uploadFile(i: number) {
    console.log("uploading")
  }

  onSubmit() {
    let oldTag: TagPlaylist = this.model.tag
    this.model = this.prepareSavePlaylist();
    this.submitted = true;
    //When delete() button is clicked getId gets called and emit the value of this.label
    //as an event the config componenet intercept this event
    if (this.isEdit) {
      this.playlistsService.editPlaylist(this.model, oldTag);
    }
    else {
      this.playlistsService.addPlaylist(this.model);

    }

    this.rebuildForm();
    this.activeModal.dismiss('Cross click')
  }

  prepareSavePlaylist(): Playlist {
    const formModel = this.playlistForm.value;

    // deep copy of form model lairs
    const secretLairsDeepCopy: Media[] = formModel.secretLairs.map(
      //      (media: Media) => Object.assign({}, media)
      (media: Media) => {
        const doc =
          {
            uriType: media.uriType,
            title: media.title,
            author: media.author,
            uri: media.uri,
          };
        return doc;
      }
    );

    // return new `Hero` object containing a combination of original hero value(s)
    // and deep copies of changed form model values
    const savePlaylist: Playlist = {
      id: this.model.id,
      name: formModel.name as string,
      description: formModel.description as string,
      tag: this.getTagById(formModel.tagId) as TagPlaylist,
      type: formModel.type as string,
      // addresses: formModel.secretLairs // <-- bad!
      media: secretLairsDeepCopy
    };
    return savePlaylist;
  }

  revert() { this.rebuildForm(); }

  logNameChange() {
    const nameControl = this.playlistForm.get('name');
    nameControl.valueChanges.forEach(
      (value: string) => this.nameChangeLog.push(value)
    );
  }

  logTypeChange() {
    const typeControl = this.playlistForm.get('type');
    typeControl.valueChanges.forEach(
      (value: string) => {
        console.log('change')
        this.setMedia([])
      }
    );
  }

  logTagChange() {
    const tagControl = this.playlistForm.get('tagId');
    tagControl.valueChanges.forEach(
      (tagId: string) => {
        if ((tagId == 'No Id') || (!this.tags)) {
          this.tagAvailable = true
        }
        else if (this.tags.find(tag => tag.id == tagId).playlistId == "No Playlist") {
          this.tagAvailable = true
        }
        else if (this.tags.find(tag => tag.id == tagId).playlistId != this.model.id) {
          this.tagAvailable = false
        }
        else {
          this.tagAvailable = true
        }
      }
    );
  }

  /*  onSubmit() { this.submitted = true;
            //When delete() button is clicked getId gets called and emit the value of this.label
          //as an event the config componenet intercept this event
  if (this.isEdit){
    this.model.tag=Number(this.model.tag)
    console.log(this.model)
    this.playlistsService.editPlaylist(this.model);
  }
    else {
      this.model.tag=Number(this.model.tag)
      this.playlistsService.addPlaylist(this.model);
  
        }
      
      }
    newPlaylist() {
      this.model = new Playlist("42", '', '','Music',1);
    }*/
  get diagnostic() { return JSON.stringify(this.model); }



  ngOnInit() {
    this.rebuildForm();
    console.log(this.model)

  }

  getUriTypes(type: string): String[] {
    if (type == 'Music') {
      return ['URL', 'PATH']
    }
    else if (type == 'Podcast') {
      return ['RSS']
    }
    else if (type == 'Story') {
      return ['URL', 'PATH']
    }
    else {
      return []
    }

  }

  isAddPossible(): boolean {
    let type = this.playlistForm.value.type
    if (type == 'Music') {
      return true
    }
    else if ((type == 'Podcast') || (type == 'Story')) {
      return (this.secretLairs.length == 0)
    }
    else {
      return false
    }
  }

  getTagById(id: string): any {
    //you have to return a pure Javascript Object (not TagPlaylist)
    let tag: any;
    if (id == 'No Id') {
      tag = { id: 'No Id', num: null, color: '' }
    } else {
      tag = this.tags.find(tag => tag.id == id)

    }
    console.log("tag saved", tag)
    return { id: tag.id, num: tag.num, color: tag.color };

  }

  onFileChange(event, i) {
    var file = event.target.files[0]
    console.log(file.name)
    console.log(i)
    this.secretLairs.at(i).get('file').patchValue(file)
    console.log(this.secretLairs.at(i).get('file').value.name)

    var task: AngularFireUploadTask;
    var percentage: Observable<number>;
    var snapshot: Observable<any>;
    //  var downloadURL: Observable<string>;
    // The storage path
    const path = `${this.model.id}/${new Date().getTime()}_${file.name}`;

    // Totally optional metadata
    const customMetadata = { app: 'My AngularFire-powered PWA!' };


    // The main task
    task = this.storage.upload(path, file, { customMetadata })
    this.secretLairs.at(i).get('isUploading').patchValue(true)
    // Progress monitoring
    percentage = task.percentageChanges();
    snapshot = task.snapshotChanges()
    percentage.subscribe(per => {
      this.secretLairs.at(i).get('progress').patchValue(per)
      console.log(this.secretLairs.at(i).get('progress').value)
      if (per == 100) {
        this.secretLairs.at(i).get('isUploading').patchValue(false)
        const fileRef = this.storage.ref(path);
        fileRef.getDownloadURL().subscribe(url => {
          this.secretLairs.at(i).get('uri').patchValue(url)
        })
      }
    });

    // The file's download URL
    //    downloadURL = task.downloadURL();
  }
  resetUri(i: number): void {
    console.log("resetting")
    this.secretLairs.at(i).get('uri').patchValue("")
    this.secretLairs.at(i).get('isUploading').patchValue(false)
    this.secretLairs.at(i).get('progress').patchValue(0)
  }

  getProgress(i): number {
    return this.secretLairs.at(i).get('progress').value
  }

}
