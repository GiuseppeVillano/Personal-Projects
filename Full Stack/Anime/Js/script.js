import * as Firebase from "./firebase.js";
import * as Utility from "./utilities.js";
import * as UI from "./ui.js";
class Anime{
    constructor(data){
        let regex= /T(\d|\D)*/;
        data.from!=null ? this.from = data.from.replace(regex,"") : "";
        data.to!= null ? this.to = data.to.replace(regex,"") : "";
        data.duration!= null ? this.duration = data.duration : "";
        data.episodes!= null ? this.episodes = data.episodes : "";
        data.image!=null ? this.image = data.image: "";
        data.id!=null ? this.id= parseInt(data.id): "";
        data.status!=null ? this.status = data.status: "";
        data.synopsis!=null ? this.synopsis = data.synopsis: "";
        data.title!=null ? this.title = data.title: "";
        data.type!=null ? this.type = data.type: "";
        data.trailer!=null ?this.trailer = data.trailer: "";

        this.themes = new Array();
        for(let theme in data.themes){
            this.themes.push(data.themes[theme]);
        }
        this.studios = new Array();
        for(let studio in data.studios){
            this.studios.push(data.studios[studio]);
        }
        this.genres = new Array();
        for(let genre in data.genres){
            this.genres.push(data.genres[genre]);
        }
        this.producers = new Array();
        for(let producer in data.producers){
            this.producers.push(data.producers[producer]);
        }
    }
}

export async function QueryAnime(query,callback){
    try{
        const requestLink = link+query;
        const response = await fetch(requestLink);
        const responseData = await response.json();
        if(responseData.status === 404){return;}
        else if(responseData.status === 429){
            await Utility.sleep(3000);
            await QueryAnime(query);
            return;
        }   
        return callback(responseData);
    }
    catch(e){
        console.log("Error"+e);
        await Utility.sleep(1000);
        await QueryAnime(query);
    }
}

//Document

export function FixElements(){
    centralEl=document.getElementById("central");
}

export function AnimeContent(anime){
    let div=document.createElement("div");
    div.classList.add("anime-content");
    div.setAttribute("name",anime.title);
    div.setAttribute("id",anime.id);
    let content=
    `   <img src="${anime.image}">
        <div class="anime-content-bottom">
            <h6 class="anime-title">${anime.title}</h6>
        </div>
        <div class="container-like-anime">
            <ion-icon class="like-anime ${UI.OnFavoriteList(anime.id)? `liked`:``}" name="${UI.OnFavoriteList(anime.id)? `heart`:`heart-outline`}"></ion-icon>
        </div>
        <div class="container-blacklist-anime">
            <ion-icon class="blacklist-anime ${UI.OnTrashList(anime.id)? `trashed`:``}" name="${UI.OnTrashList(anime.id)? `close-circle-outline`:`trash-outline`}"></ion-icon>
        </div>`
    ;
    div.innerHTML = content;
    return div;
}

async function PickAnimeFromDatabase(start,end,count){
    for(let i=start;i<end;i++){
        let o =await Firebase.getChilds("Anime/"+letters[(i+count)%letters.length]);
        avaliableAnimeId.push(o);
        originalAnimeId.push(o);
        avaliableLetters.push(letters[(i+count)%letters.length]);
    }
    if(originalAnimeId.length==36){
        localStorage.setItem("Letters",JSON.stringify(avaliableLetters));
        localStorage.setItem("AnimeIds",JSON.stringify(originalAnimeId));
    }
}

export async function LoadMoreAnime(){
    //Random anime
    let count = 0;
    while(count<20&&avaliableLetters.length>0){
        for(let i=count;i<20&&avaliableAnimeId.length!=0;i++){
            let pos = Utility.randomRange(0,avaliableLetters.length);
            let letter = avaliableLetters[pos];
            let index = Utility.randomRange(0,avaliableAnimeId[pos].length);
            let id = (avaliableAnimeId[pos])[index];
            let path= "Anime/"+letter+"/"+id;
            
            let anime = await Firebase.getVal(path);
                
            if(anime.genres!==undefined&&anime.image!==
                "https://cdn.myanimelist.net/img/sp/icon/apple-touch-icon-256.png"){
                if(!(UI.CheckFilter() && UI.VM(anime))&&!UI.OnTrashList(anime.id)){
                    centralEl.appendChild(AnimeContent(anime));
                    count++;
                }
            }    
            
            avaliableAnimeId[pos].splice(index,1);
            if(avaliableAnimeId[pos].length==0){
                avaliableAnimeId.splice(pos,1);
                avaliableLetters.splice(pos,1);
            }
        }
    }
}

export function ClearContents(){
    while (centralEl.lastElementChild) {
        centralEl.removeChild(centralEl.lastElementChild);
    }
    Load();
}

export async function Load(){
    //UpdateDatabase();
    let startLetter=Utility.randomRange(0,letters.length);
    
    avaliableAnimeId=[];
    avaliableLetters=[];
    if(localStorage.getItem("Letters")!==null&&localStorage.getItem('AnimeIds')!==null){
        avaliableLetters = JSON.parse(localStorage.getItem("Letters"));
        avaliableAnimeId = JSON.parse(localStorage.getItem("AnimeIds"));
        originalAnimeId=avaliableAnimeId;
    }
    else{
        let d=document.getElementById("loading");
        d.innerHTML='<div class="lds-ring"><div></div><div></div><div></div><div></div></div>';
        await PickAnimeFromDatabase(0,letters.length,startLetter);
        d.innerHTML='';
    }
}

//Database Functions
()=>{
function GetAnimeList(data){
    const info = data.data;
    const list = new Array();
    for(let d in info){
        list.push(new Anime(info[d]));
    }
    return list;
}

async function LastPagination(data){
    let cur_pagination = 0; 
    let tmp = await Firebase.getVal("Data/Anime/LastPagination");
    tmp == null ? cur_pagination=0 : cur_pagination=tmp
    const last_pagination = data.pagination.last_visible_page;
    
    let group = 500;
    for(let i=cur_pagination; i<last_pagination+1;i++){
        const animeList = await QueryAnime("anime?page="+i,GetAnimeList);
        for(let j in animeList){
            if(animeList[j].title==undefined||
               animeList[j].title.charAt(0)=="."||
               animeList[j].title.charAt(0)=="#"||
               animeList[j].title.charAt(0)=="$"||
               animeList[j].title.charAt(0)=="["||
               animeList[j].title.charAt(0)=="]"){
                continue;
            }
            await Firebase.updateVal("Anime/"+animeList[j].title.charAt(0).toUpperCase(),animeList[j].id,animeList[j]);
        }

        await Firebase.setVal("Data/Anime","LastPagination",i);
        await Utility.sleep(1000);
    }
}

async function Genres(data){
    let info = data.data;
    let arrayTmp = new Array();
    for(let i in info){
        arrayTmp.push(info[i].name);
    }
    await Firebase.updateVal("Data","Genres",arrayTmp);
}

async function UpdateDatabase(){
    //Firebase.deleteVal("Anime");
    await QueryAnime("anime",LastPagination);
    //await QueryAnime("genres/anime",Genres);    
}
}

///MAIN

const link = "https://api.jikan.moe/v4/";
let centralEl = document.getElementById("central");
let avaliableAnimeId = new Array();
let originalAnimeId = new Array();
let letters = ["0","1","2","3","4","5","6","7","8","9",
                "A","B","C","D","E","F",
                "G","H","I","J","K","L",
                "M","N","O","P","Q","R",
                "S","T","U","V","W","X","Y","Z"];
let avaliableLetters = [];

//Load More on bottom
 
//PickAnimeFromDatabase(2,letters.length,startLetter);

//await QueryAnime("genres/anime",(e)=>console.log(e))

//Anime Episodes
//await GetEps(28);


//Anime Characters
//await QueryAnime("anime/"+40748+"/characters");  

//Anime Staff
//await QueryAnime("anime/"+40748+"/staff");

//Anime News
//await QueryAnime("anime/"+40748+"/news");

//Anime Recommended based on one
// QueryAnime("anime/"+40748+"/recommendations");

//Anime By Name
//await QueryAnime("anime?q=naruto");

//Anime Genre by ID (makes an OR)   
//await QueryAnime("anime?genres=1&genres=5");

//await QueryAnime("?status=complete&page=2");    