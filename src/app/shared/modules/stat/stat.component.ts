import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import {TagsService} from '../../../tags.service'


@Component({
    selector: 'app-stat',
    templateUrl: './stat.component.html',
    styleUrls: ['./stat.component.scss']
})
export class StatComponent implements OnInit {
    [x: string]: any;
    @Input() tagId: string;
    @Input() icon: string;
    @Input() name: string;
    @Input() count: number;
    @Input() label: string;
    @Input() data: string;
    @Output() getIdToDelete = new EventEmitter();
    @Output() getIdToEdit = new EventEmitter();

    Counter = 0;
    bgClass = "nocolor"

    delete() { // You can give any function name
        //When delete() button is clicked getId gets called and emit the value of this.label
        //as an event the config componenet intercept this event

        this.getIdToDelete.emit(this.label);

    }

    edit () {

        this.getIdToEdit.emit(this.label);
    }



    constructor(private tagsService : TagsService) {
    }

    ngOnInit() {
        this.getPlaylistColor(this.tagId)    
    }

    getPlaylistColor(tagId:string) {
        return this.tagsService.getTagById(tagId).then(doc => {
          if (doc.exists) {
              const data =doc.data().color;
              console.log(data);
              this.bgClass = data;
            } else {
              console.log("No such document!");
          }
        }).catch(function(error) {
            console.log("Error getting document:", error);
        });    
        
      }
    
}
