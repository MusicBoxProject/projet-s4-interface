import {Tag} from './tag'
import {Playlist} from './playlist'

export class ConfigFile {
    configTags : ConfigTag[]=[]
}

export class ConfigTag {
    tag : Tag =new Tag('','','',null,'');
    playlist : Playlist =new Playlist('','','','');
    constructor (tag:Tag, playlist:Playlist){
        this.tag=tag;
        this.playlist=playlist;
        }


}