import { Component, OnInit,Output,Input, EventEmitter } from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {FormBuilder, FormGroup, FormArray} from "@angular/forms"
import { OnChanges } from '@angular/core/src/metadata/lifecycle_hooks';
import { Tag, tagColors } from '../../../../tag';
import { TagsService } from '../../../../tags.service';
@Component({
  selector: 'app-add-tag',
  templateUrl: './add-tag.component.html',
  styleUrls: ['./add-tag.component.scss']
})
export class AddTagComponent implements OnChanges {
  @Input() model =new Tag("0","tag1","purple",99,"uuid");
  @Input() isEdit: boolean ;
  @Output() getTag = new EventEmitter();

  
  tagForm: FormGroup;
  nameChangeLog: string[] = [];

  tagColors = tagColors;
 
  submitted = false;
 
  constructor(private tagsService: TagsService,public activeModal: NgbActiveModal,private fb: FormBuilder) {
    this.createForm();
    this.logNameChange();
   }

   createForm() {
    this.tagForm = this.fb.group({
      name: '',
      color: '',
      num:0,
      uuid:'',
      playlistId:''
    });
  }
  ngOnChanges() {
    this.rebuildForm();
  }

  rebuildForm() {
    this.tagForm.reset({
      
      name: this.model.name,
      color: this.model.color,
      num:this.model.num,
      uuid:this.model.uuid,
      playlistId:this.model.playlistId

    });
  }





  onSubmit() {
    this.model = this.prepareSavePlaylist();
    this.submitted = true;
          //When delete() button is clicked getId gets called and emit the value of this.label
        //as an event the config componenet intercept this event
  if (this.isEdit){
    this.model.num=Number(this.model.num)
    this.tagsService.editTag(this.model);
  }
    else {
      this.model.num=Number(this.model.num)
      this.tagsService.addTag(this.model);

        }
            
      this.rebuildForm();
      this.activeModal.dismiss('Cross click')
  }

  prepareSavePlaylist(): Tag {
    const formModel = this.tagForm.value;

    const saveTag: Tag = {
      id: this.model.id,
      name: formModel.name as string,
      color: formModel.color as string,
      num: formModel.num as number,
      uuid: formModel.uuid as string,
      playlistId: this.model.playlistId

    };
    return saveTag;
  }

  revert() { this.rebuildForm(); }

  logNameChange() {
    const nameControl = this.tagForm.get('name');
    nameControl.valueChanges.forEach(
      (value: string) => this.nameChangeLog.push(value)
    );
  }
  get diagnostic() { return JSON.stringify(this.model); }

  ngOnInit() {
    this.rebuildForm();
  }

}
