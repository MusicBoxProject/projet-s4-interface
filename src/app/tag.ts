export class Tag {
    id: string;
    name: string;
    color: string;
    num: number;
    uuid: string;
    playlistId: string;
    constructor (id:string, name:string,color:string,num:number,uuid: string ){
        this.id=id;
        this.name=name;
        this.color=color;
        this.num=num;
        this.uuid=uuid;
        this.playlistId='No Playlist';
    }
  }
  
export const tagColors : string[]= ["blue","green","purple","orange","red","pink","yellow","nocolor"] 