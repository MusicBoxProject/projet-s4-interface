export class Playlist {
    id: string;
    name: string;
    description: string;
    tag: number;//to edit to tagId and type string
    type: string;
    media : Media[];
    constructor (id:string, name:string, description:string,tag:number,type:string ){
        this.id=id;
        this.name=name;
        this.description=description;
        this.tag=tag;
        this.type=type;
        this.media=[
            {id:"s1", uriType:"URL", title:"firstsong",author:"beyonce feat jayz" ,uri:"music.com"},
            {id:"s1", uriType:"URL", title:"firstsong",author:"beyonce feat jayz" ,uri:"music.com"},
          ]    }
  }
  
export class Media {
    id: string;
    uriType: string;
    title: string;
    author: string;
    uri: string;
    constructor (id:string, uriType:string, title:string,author:string ,uri:string){
        this.id=id;
        this.uriType= uriType;
        this.title=title;
        this.author=author;//to edit to array
        this.uri=uri;
    }

}

export const types : string[]= ['Music','Story','Podcast']
export const uriTypes : string[]= ['URL','PATH','RSS']
