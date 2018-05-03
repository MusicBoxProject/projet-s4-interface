export class Playlist {
    id: string;
    name: string;
    description: string;
    tagId: string;//to edit to tagId and type string
    type: string;
    media : Media[];
    constructor (id:string, name:string, description:string,tagId:string,type:string ){
        this.id=id;
        this.name=name;
        this.description=description;
        this.tagId=tagId;
        this.type=type;
        this.media=[
            {uriType:"URL", title:"firstsong",author:"beyonce feat jayz" ,uri:"music.com"},
            {uriType:"URL", title:"firstsong",author:"beyonce feat jayz" ,uri:"music.com"},
          ]    }
  }
  
export class Media {
    uriType: string;
    title: string;
    author: string;
    uri: string;
    constructor (uriType:string, title:string,author:string ,uri:string){
        this.uriType= uriType;
        this.title=title;
        this.author=author;//to edit to array
        this.uri=uri;
    }

}

export const types : string[]= ['Music','Story','Podcast']
export const uriTypes : string[]= ['URL','PATH','RSS']
