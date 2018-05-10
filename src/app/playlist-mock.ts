import { Playlist } from './playlist';

export const PLAYLISTS: Playlist[] = [
  { id: "1", name: 'Beyonce',description:'Latest album from Beyonce',tag:{id:'',num:null,color:'No Tag'},type:"Music",
  media:[
    {uriType:"URL", title:"firstsong",author:"beyonce feat jayz" ,uri:"music.com"},
    {uriType:"URL", title:"secondtsong",author:"beyonce feat jayz" ,uri:"music.com"},
    {uriType:"URL", title:"thirdsong",author:"beyonce feat jayz" ,uri:"music.com"},
    {uriType:"URL", title:"firstsong",author:"beyonce feat jayz" ,uri:"music.com"},
  ] },
  { id: "2", name: 'Beyonce',description:'Latest album from Beyonce',tag:{id:'',num:null,color:'No Tag'},type:"Music",
  media:[
    {uriType:"URL", title:"firstsong",author:"beyonce feat jayz" ,uri:"music.com"},
    {uriType:"URL", title:"firstsong",author:"beyonce feat jayz" ,uri:"music.com"},
    {uriType:"URL", title:"firstsong",author:"beyonce feat jayz" ,uri:"music.com"},

  ] }
];
