import { Component, OnInit,Output,Input, EventEmitter, ChangeDetectorRef } from '@angular/core';
import {Playlist, Media,types,uriTypes} from '../../../../playlist'
import { PlaylistsService } from '../../../../playlists.service'
import { TagsService } from '../../../../tags.service'
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {FormBuilder, FormGroup, FormArray} from "@angular/forms"
import { OnChanges } from '@angular/core/src/metadata/lifecycle_hooks';
import { Observable } from 'rxjs/Observable';
import { Tag } from '../../../../tag';
@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss']
})
export class AddComponent implements OnChanges {
  @Input() model =new Playlist("18","Name your playlist","Add Description","Music");
  @Input() isEdit: boolean ;
  @Output() getPlaylist = new EventEmitter();

  
  playlistForm: FormGroup;
  nameChangeLog: string[] = [];

  tags: Tag[];

  types = types;
  uriTypes= uriTypes;
 
 
  submitted = false;

  getTags(): void{
     let arr: number[];
     this.tagsService.getTags()
    .subscribe(tags => this.tags=tags)
  }

  constructor(private playlistsService: PlaylistsService,private tagsService: TagsService,public activeModal: NgbActiveModal,private fb: FormBuilder) {
    this.getTags()
    this.createForm();
    this.logNameChange();
    this.logTypeChange();
   }

   createForm() {
    this.playlistForm = this.fb.group({
      name: '',
      description: '',
      tagId:"0",
      type:'',
      secretLairs: this.fb.array([]),
      sidekick:'',
    });
  }
  ngOnChanges() {
    this.rebuildForm();
  }

  rebuildForm() {

    this.playlistForm.reset({
      
      name: this.model.name,
      description: this.model.description,
      tagId:this.model.tagId,
      type:this.model.type,

    });
    this.setMedia(this.model.media);
  }

  get secretLairs(): FormArray {
    return this.playlistForm.get('secretLairs') as FormArray;
  };
//  initializing the media array 
  setMedia(medias: Media[]) {
    const mediaFGs = medias.map(media => this.fb.group(
      {uriType:media.uriType, 
      title:media.title,
      author:media.author,
      uri:media.uri,
      confirmed:true,  
      }
    ));
    const mediaFormArray = this.fb.array(mediaFGs);
    this.playlistForm.setControl('secretLairs', mediaFormArray);
  }

  addLair() {
//    this.secretLairs.push(this.fb.group(new Media('','','','')));
    this.secretLairs.push(this.fb.group({
      uriType:"", 
      title:"",
      author:"",
      uri:"",
      confirmed:false,
    }));
  }

  deleteLair(i:number) {
    this.secretLairs.removeAt(i);
  }
  editLair(i:number) {
    let old=this.secretLairs.at(i).get('confirmed');
    this.secretLairs.at(i).get('confirmed').patchValue(!old.value)
  }

  onSubmit() {
    this.model = this.prepareSavePlaylist();
    this.submitted = true;
          //When delete() button is clicked getId gets called and emit the value of this.label
        //as an event the config componenet intercept this event
  if (this.isEdit){
    this.playlistsService.editPlaylist(this.model);
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
(media: Media) => { const doc=
  {uriType:media.uriType, 
  title:media.title,
  author:media.author,
  uri:media.uri,  
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
      tagId: formModel.tagId as string,
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
        this.setMedia([])}
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

  getUriTypes(type: string) : String[] {
    if (type=='Music') {
        return ['URL','PATH']
    }
   else if (type=='Podcast') {
      return ['RSS']
  }
  else if (type=='Story') {
      return ['URL','PATH']
  }
  else{
    return []
  }

  }

  isAddPossible() : boolean{
    let type =this.playlistForm.value.type
    if (type=='Music'){
    return true
  }
  else if ((type=='Podcast')||(type=='Story')){
    return (this.secretLairs.length==0)
  }
  else {
    return false
  }
  }


}
