export class Playlist {
    id: string;
    name: string;
    description: string;
    tag: number;
    constructor (id:string, name:string, description:string,tag:number ){
        this.id=id;
        this.name=name;
        this.description=description;
        this.tag=tag;
    }
  }
  