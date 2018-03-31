export class Playlist {
    id: number;
    name: string;
    description: string;
    tag: number;
    constructor (id:number, name:string, description:string,tag:number ){
        this.id=id;
        this.name=name;
        this.description=description;
        this.tag=tag;
    }
  }
  