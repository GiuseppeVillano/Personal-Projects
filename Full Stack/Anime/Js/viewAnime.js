import * as Firebase from "./firebase.js";
import * as Utility from "./utilities.js";
import * as UI from "./ui.js";
import * as Main from "./script.js";

export async function GetEpisodes(page,id){
    let tmp= page;
    if(curPage==page){
        return
    }
    let response = await Main.QueryAnime("anime/"+id+"/episodes?page="+(Number(page)+1),(data)=>{return data;});
    let data= response.data;
    let totalPages= response.pagination.last_visible_page;
    let cont=document.getElementsByClassName("list-episodes")[0];
    let d=document.getElementsByClassName("list-episodes")[0];
    while (d.lastElementChild) {
        d.removeChild(d.lastElementChild);
    }

    for(let i in data){
        let ep=document.createElement("h6");
        ep.classList.add("eps");
        ep.innerHTML="Ep"+data[i].mal_id+" : "+data[i].title;
        if(data[i].filler){
            ep.setAttribute("style","background-color: #003566");
        }
        cont.appendChild(ep);
    }
    if(curPage==-1){
        cont=document.getElementsByClassName("buttons-page")[0];
        for(let i=0; i<totalPages; i++){
            let b=document.createElement("button");
            b.classList.add("b-page");
            b.innerHTML=i;
            cont.appendChild(b);
        }
        response = await Main.QueryAnime("anime/"+id+"/themes?page="+(Number(page)+1),(data)=>{return data;});
        let openings=response.data.openings;
        let endings=response.data.endings;

        let d1 = document.getElementsByClassName("openings")[0];
        let count=0;
        for(let i in openings){
            if(count==0){
                let text = document.createElement("h6");
                text.innerHTML= "Openings";    
                d1.appendChild(text);
                count++;
            }
            let text2 = document.createElement("h6");
            let array = openings[i].split("\"");
            text2.innerHTML = array[1]+array[2];
            d1.appendChild(text2);
        }
        count=0;
        d1 = document.getElementsByClassName("endings")[0];
        for(let i in endings){
            if(count==0){
                let text = document.createElement("h6");
                text.innerHTML= "Endings";    
                d1.appendChild(text);
                count++;
            }
            let array = endings[i].split("\"");
            let text = document.createElement("h6");
            text.innerHTML = array[1]+array[2];
            d1.appendChild(text);
        }
    }
    curPage=page;
}

//Document
async function AnimeContent(anime){
    centralEl.innerHTML += 
    `<div class="anime-content-left">
        <img src="${anime.image}"">
    </div>
    <div class="anime-content">
        <h2 class="anime-title">${anime.title}</h2>
        
        ${anime.trailer!==undefined ? `<iframe src="${anime.trailer} title="${anime.title}"></iframe>`:` `}
        <div id="${anime.id}" name="${anime.title}" class="container-anime">
            <div class="container-option container-like-anime">
                <ion-icon class="like-anime ${UI.OnFavoriteList(anime.id)? `liked`:``}" name="${UI.OnFavoriteList(anime.id)? `heart`:`heart-outline`}"></ion-icon>
                <h4>Like</h4>
            </div>    
            <div class="container-option container-blacklist-anime">
                <ion-icon class="blacklist-anime ${UI.OnTrashList(anime.id)? `trashed`:``}" name="${UI.OnTrashList(anime.id)? `close-circle-outline`:`trash-outline`}"></ion-icon>
                <h4>Remove</h4>
            </div>
        </div>
        <div class="genresAnime">
        ${anime.genres!==undefined 
            ?`<h5 class="anime-status ${anime.status}">${anime.status}</h5>    
            ${anime.genres.map(e => `<h5>${e}</h5>`).join(' ')}`
            :`<h5 class="anime-status ${anime.status}">${anime.status}</h5>`}
        </div>

        <h6 class="anime-info">Episodes: ${anime.episodes} <ion-icon style="margin-left:5px;font-size:16px;" class="show-episodes" name="add-circle-outline"></ion-icon> &nbsp Duration: ${anime.duration}</h6> 
        <div class="container-episodes">
            <div class="list-episodes">
            </div>
            <div class="buttons-page">
            </div>
        </div>
        <h6 class="anime-synopsis">Synopsis: ${anime.synopsis}</h6>
        <div class="themes" style="display: flex; justify-content: center;">
            <div class="openings" style="margin-right: 5px;">
            </div>
            <div class="endings" style="margin-left: 5px;">
            </div>
        </div>    
    </div>
    `;
    
    GetEpisodes(0,anime.id);
    
}



///MAIN
const centralEl = document.getElementById("central");
const id = Utility.getCookie("View Anime");
const init= onLoaded();
let curPage=-1;

async function onLoaded(){
    if(location.pathname !=="/Html/selectedAnime.html"){
        return;
    }
    let path = id.split("~");
    var obj = await Firebase.getVal("Anime/"+path[0]+"/"+path[1]);   
    await UI.Init();
    AnimeContent(obj);
}



