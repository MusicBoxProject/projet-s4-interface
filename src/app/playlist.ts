import { Tag } from "./tag";

export class Playlist {
    id: string;
    name: string;
    description: string;
    tag: TagPlaylist;//to edit to tagId and type string
    type: string;
    media : Media[];

    constructor (id:string, name:string, description:string,type:string){
        this.id=id;
        this.name=name;
        this.description=description;
        this.tag={id:"No Id",num:null, color:"No Color"};
        this.type=type;
        this.media=[
            {uriType:"URL", title:"Pray You Catch Me",author:"Beyonce feat jayz" ,uri:"itunes.apple.com"},
            {uriType:"URL", title:"Hold Up",author:"Beyonce feat jayz" ,uri:"itunes.apple.com"},
            {uriType:"URL", title:"Don't Hurt Yourself",author:"Beyonce ft. Jack White" ,uri:"itunes.apple.com"},
            {uriType:"URL", title:"6 Inch",author:"Beyonce ft. The Weeknd" ,uri:"itunes.apple.com"},
                                                
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

export class TagPlaylist {
    id: string;
    num: number;
    color: string;
    constructor (id:string, num:number,color:string){
        
    }

}


export const types : string[]= ['Music','Story','Podcast']
export const uriTypes : string[]= ['URL','PATH','RSS']
export const emptyTagPlaylist : TagPlaylist= new TagPlaylist('',null,'nocolor')