import { Component, OnInit,Output,Input, EventEmitter } from '@angular/core';
import {Playlist, Media,types,uriTypes} from '../../../../playlist'
import { PlaylistsService } from '../../../../playlists.service'
import { Address, Hero, states,heroes } from '../../../../data-model';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {FormBuilder, FormGroup, FormArray} from "@angular/forms"
import { OnChanges } from '@angular/core/src/metadata/lifecycle_hooks';
@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss']
})
export class AddComponent implements OnChanges {
  @Input() model =new Playlist("18","Name your playlist","Add Description",3,"Music");
  @Input() isEdit: boolean ;
  @Output() getPlaylist = new EventEmitter();

  
  playlistForm: FormGroup;
  nameChangeLog: string[] = [];
  states = states;

  tags = [1,2,3,4,5];
  types = types;
  uriTypes= uriTypes;
 
 
  submitted = false;
 
  constructor(private playlistsService: PlaylistsService,public activeModal: NgbActiveModal,private fb: FormBuilder) {
    console.log(this.model);
    this.createForm();
    this.logNameChange();
   }

   createForm() {
    this.playlistForm = this.fb.group({
      name: '',
      description: '',
      tag:0,
      type:'',
      secretLairs: this.fb.array([]),
      sidekick:'',
    });
  }
  ngOnChanges() {
    this.rebuildForm();
  }

  rebuildForm() {
    console.log(this.model.name);

    this.playlistForm.reset({
      
      name: this.model.name,
      description: this.model.description,
      tag:this.model.tag,
      type:this.model.type,

    });
    this.setMedia(this.model.media);
  }

  get secretLairs(): FormArray {
    return this.playlistForm.get('secretLairs') as FormArray;
  };

  setMedia(medias: Media[]) {
    const mediaFGs = medias.map(media => this.fb.group(media));
    const mediaFormArray = this.fb.array(mediaFGs);
    this.playlistForm.setControl('secretLairs', mediaFormArray);
  }

  addLair() {
    this.secretLairs.push(this.fb.group(new Media('0','','','','')));
  }

  deleteLair(i:number) {
    this.secretLairs.removeAt(i);
  }

  onSubmit() {
    this.model = this.prepareSavePlaylist();
    console.log(this.model)
    this.playlistsService.addPlaylist(this.model)//.subscribe(/* error handling */);
    this.rebuildForm();
  }

  prepareSavePlaylist(): Playlist {
    const formModel = this.playlistForm.value;

    // deep copy of form model lairs
    const secretLairsDeepCopy: Media[] = formModel.secretLairs.map(
      (media: Media) => Object.assign({}, media)
    );

    // return new `Hero` object containing a combination of original hero value(s)
    // and deep copies of changed form model values
    const savePlaylist: Playlist = {
      id: this.model.id,
      name: formModel.name as string,
      description: formModel.description as string,
      tag: formModel.tag as number,
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

  }

}
