import * as Firebase from "./firebase.js";
import * as Main from "./script.js";
import * as Utility from "./utilities.js";
import * as View from "./viewAnime.js";
export function CheckFilter(){
    return filter;
}

export function VM(anime){
    if(anime.genres==undefined){
        return false;
    }
    for(let j=0;j<anime.genres.length;j++){
        if(anime.genres[j]=="Hentai"||
        anime.genres[j]=="Ecchi"||
        anime.genres[j]=="Erotica"||
        anime.genres[j]=="Adult Cast"||
        anime.genres[j]=="Harem"||
        anime.genres[j]=="Reverse Harem"){
            return true;
        }
    }
    return false;
}

export function OnFavoriteList(id){
    for(let i in favorites){
        if(i==id){
            return true;
        }
    }
    return false;
}

export function OnTrashList(id){
    for(let i in trashed){
        if(i==id){
            return true;
        }
    }
    return false;
}

async function PutGenres(data){
    const info= await Firebase.getVal("Data/Genres");
    let fromCookie=false;
    
    if(Utility.getCookie("Genre Search")!==null){
        genres=JSON.parse(Utility.getCookie("Genre Search"));
        fromCookie=true;
    }
    info.sort((a, b) => a.localeCompare(b));

    for(let i in info){
        let name = "square-outline";
        if(!fromCookie){
            genres[info[i]] = false;
        }
        else if(genres[info[i]]){
            name = "checkbox-outline"; 
        }
        genresEl.innerHTML += 
        `<div class="genre">
            <ion-icon class="genre-search" id="${info[i]}" name="${name}"></ion-icon>
            <h6>${info[i]}</h6>
        </div>`;
    }
}

async function PersonalList(){
    if(IsLoggedIn()){
        let path="Users/"+localStorage.getItem("TokenId");
        
        favorites = await Firebase.getVal(path+"/Favorites/");
        for(let i in favorites){
            let div = document.getElementById(favorites[i]);
            if(div!==null){
                $(div).find(".like-anime").attr("name","heart").addClass("liked");
            }
        }
        
        trashed = await Firebase.getVal(path+"/Trashed/");
        //watched = await Firebase.getChilds(path+"/Watched/");
    }
}

export async function Init(){    
    PutGenres();
    Settings();
    EventListeners();
    await PersonalList();
}

function RemoveMessage(){
    while (document.getElementById("system-message")) {
        document.getElementsByTagName("body")[0].removeChild(document.getElementById("system-message"));
    }
}

function PopMessage(title,message){
    let body = document.getElementsByTagName("body")[0];
    RemoveMessage();
    body.innerHTML+=
    `<div id="system-message">
        <ion-icon class="system-close" name="close-circle-outline"></ion-icon>
        <div id="system-title">
            ${title}
        </div>   
        <div>
            ${message}   
        </div>         
    </div>`;
    Main.FixElements();
    FixElements();
}

//Auth operations
function NotAuth(){
    let message=
        `<div class="message-title">
            <h5>Log with one of the following options.</h5>
        </div>
        <div class="auth-methods">
            <ion-icon name="logo-google"></ion-icon>
            <ion-icon name="logo-facebook"></ion-icon>
            <ion-icon name="logo-twitter"></ion-icon>
        </div>`;
    PopMessage("Authentication not performed!",message);           
}

function IsLoggedIn(){
    return localStorage.getItem("TokenId")!==null;
}

function EventListeners() {
    filt.addEventListener("click", async (e)=>{
        filt.classList.contains("active") ? filt.classList.remove("active") : filt.classList.add("active"); 
        ChangeFilter();
        if(location.pathname=="/index.html"){
            Main.LoadMoreAnime();
        }
        else if(location.pathname=="/Html/search.html"){
            let text = Utility.getCookie("search");
            !Utility.isEmpty(text) ? StartSearch(text,0) : StartSearch(text,1);
        }
    })
    
    btnGenreSearch.addEventListener("click", (e)=>{
        Utility.eraseCookie("search");
        if(location.pathname!=="/Html/search.html"){
            window.location="/Html/search.html";
        }
        StartSearch(null,1);
    })
    
    optionGenres.addEventListener("click", (e)=>{
        optionGenres.classList.contains("active") ? optionGenres.classList.remove("active") : optionGenres.classList.add("active"); 
        let bool= optionGenres.classList.contains("active") ? 1: 0;
        Utility.setCookie("Genre Option", bool);
    })

    optionGenresReset.addEventListener("click", (e)=>{
        Utility.eraseCookie("Genre Search");
        genres={};
        let a = document.getElementsByClassName("genre-search");
        for(let i in a){
            a[i].setAttribute("name","square-outline");
        }
    })
    
    window.onscroll = async function(e) {
        if (location.pathname=="/index.html"&&(window.innerHeight + window.scrollY)+20 >= document.body.scrollHeight) {
            Main.LoadMoreAnime();
        }
    };
    
    window.onclick = async (e) =>{
        //Filter Genres window
        if(e.target.id=="filter-genres"){
            containerGenresEl.classList.contains("active") ? containerGenresEl.classList.remove("active") : containerGenresEl.classList.add("active"); 
        }
    
        //Select genre
        if(e.target.classList.contains("genre-search")){
            e.target.getAttribute("name")!=="checkbox-outline" ? e.target.setAttribute("name","checkbox-outline") : e.target.setAttribute("name","square-outline"); 
            genres[e.target.getAttribute("id")]=!genres[e.target.getAttribute("id")];
            Utility.setCookie("Genre Search",JSON.stringify(genres));
        }
    
        //Search by text
        if(e.target.getAttribute("name")=="search-circle-outline"){
            let text= document.getElementById("search-box").value;
            if(!Utility.isEmpty(text)){
                if(location.pathname!=="/Html/search.html"){
                    Utility.setCookie("search",text);
                    window.location="/Html/search.html";
                }
                StartSearch(text,0);
            }
        }
        
        //Anime Content
        let regex= /^\d+$/;
        if(e.target.id!=null&&e.target.id.match(regex)){
            Utility.setCookie("View Anime",e.target.getAttribute("name").charAt(0).toUpperCase()+"~"+e.target.id);
            window.location="/Html/selectedAnime.html";
        }

        //Close Window
        if(e.target.classList.contains("system-close")){
            RemoveMessage();
        }

        if(e.target.getAttribute("name")=="logo-google"){
            if(await Firebase.SignInGoogle()){
                location.reload();
            }
        }

        if(e.target.getAttribute("name")=="logo-facebook"||e.target.getAttribute("name")=="logo-facebook"){
            alert("Work in progress!");
        }
        
        //Buttons page episodes
        if(e.target.classList.contains("show-episodes")){
            let d= document.getElementsByClassName("container-episodes")[0];
            if(e.target.classList.contains("active")){
                e.target.classList.remove("active")
                e.target.setAttribute("name","add-circle-outline");
                d.setAttribute("style","display: none;");
            } 
            else{
                e.target.classList.add("active");
                e.target.setAttribute("name","remove-circle-outline");
                d.setAttribute("style","display: block;");
            }
        }

        if(e.target.classList.contains("b-page")){
            let id = document.getElementsByClassName("container-anime")[0].id;
            let page = e.target.innerHTML;
            View.GetEpisodes(page, id);
        }
        //Lateral menu

        if(e.target.id=="home"){
            window.location="/index.html";
        }

        if(e.target.id=="personal-list"){
            IsLoggedIn() ? window.location="/Html/listAnime.html":NotAuth();
        }

        if(e.target.id=="update-database"){
            IsLoggedIn() ? window.location="/listAnime.html":NotAuth();
        }

        if(e.target.classList.contains("bug-report")){
            alert("Work in progress!");
            return;
            IsLoggedIn() ? window.location="/Report.html":NotAuth();
        }

        if(e.target.classList.contains("switch-button-checkbox")){
            count++;
            switchFT=!switchFT;
            switchFT ? ShowFavorites() : ShowTrashed();
        }
    }

    //like button
    $(document).on({
        mouseenter: function (e) {
            if(e.target.classList.contains("liked")){
                e.target.setAttribute("name","heart-dislike");
            }
            else{
                e.target.setAttribute("name","heart");
            }
        },
        mouseleave: function (e) {
            if(e.target.classList.contains("liked")){
                e.target.setAttribute("name","heart");
            }
            else{
                e.target.setAttribute("name","heart-outline"); 
            }        
        },
        click: async function (e) {
            if(IsLoggedIn()){
                if(e.target.classList.contains("liked")){
                    e.target.classList.remove("liked");
                    e.target.setAttribute("name", "heart");
                    await Firebase.deleteVal("Users/"+localStorage.getItem("TokenId")+"/Favorites/"+e.target.parentNode.parentNode.id);
                    Notify("Removed from your favorite list!");
                }
                else{
                    e.target.classList.add("liked");                
                    e.target.setAttribute("name","heart-dislike");
                    let path="Users/"+localStorage.getItem("TokenId")+"/Favorites/";
                    await Firebase.updateVal(path,e.target.parentNode.parentNode.id,e.target.parentNode.parentNode.getAttribute("name"));
                    await Firebase.deleteVal("Users/"+localStorage.getItem("TokenId")+"/Trashed/"+e.target.parentNode.parentNode.id);
                    $(e.target.parentNode.parentNode).find('.blacklist-anime').attr("name","trash-outline").removeClass("trashed");
                    Notify("Added to your favorite list!");
                }
            }
            else{
                NotAuth();
            }    
        }
    }, ".like-anime");

    //trash button
    $(document).on({
        mouseenter: function (e) {
            if(e.target.classList.contains("trashed")){
                e.target.setAttribute("name","close-circle-outline");
            }
            else{
                e.target.setAttribute("name","trash");
            }
        },
        mouseleave: function (e) {
            if(e.target.classList.contains("trashed")){
                e.target.setAttribute("name","close-circle-outline");
            }
            else{
                e.target.setAttribute("name","trash-outline"); 
            }        
        },
        click: async function (e) {
            if(IsLoggedIn()){
                if(e.target.classList.contains("trashed")){
                    e.target.classList.remove("trashed");
                    e.target.setAttribute("name", "trash");
                    await Firebase.deleteVal("Users/"+localStorage.getItem("TokenId")+"/Trashed/"+e.target.parentNode.parentNode.id);
                    Notify("Removed from your trashed list!");
                }
                else{
                    e.target.classList.add("trashed");                
                    e.target.setAttribute("name","close-circle-outline");
                    let path="Users/"+localStorage.getItem("TokenId")+"/Trashed/";
                    await Firebase.updateVal(path,e.target.parentNode.parentNode.id,e.target.parentNode.parentNode.getAttribute("name"));
                    await Firebase.deleteVal("Users/"+localStorage.getItem("TokenId")+"/Favorites/"+e.target.parentNode.parentNode.id);
                    $(e.target.parentNode.parentNode).find('.like-anime').attr("name","heart-outline").removeClass("liked");
                    Notify("Added on your trashed list!");
                }   
            }
            else{
                NotAuth();
            }
        }
    }, ".blacklist-anime");
}

function FixElements(){
    btnGenreSearch = document.getElementById("genre-search");
    filt = document.getElementById("filter");
    optionGenres = document.getElementsByClassName("option-genres")[0];
    optionGenresReset = document.getElementsByClassName("option-genres-reset")[0];
    centralEl = document.getElementById("central");
    genresEl = document.getElementsByClassName('genres')[0];
    containerGenresEl = document.getElementById("container-genres");
}

function ChangeFilter(){
    filter=!filter;
    Utility.setCookie("filter",filter);
    Main.ClearContents();
}

function Settings(){
    if (Utility.getCookie("Genre Option")!==null&&Utility.getCookie("Genre Option")==1){
        optionGenres.classList.add("active");
    }
    if (Utility.getCookie("filter")!==null){
        filter=Utility.getCookie("filter");
        !filter ? filt.classList.remove("active") : filt.classList.add("active");

    }
}

//Switch
function ElementSwitch(){
    document.getElementsByClassName("container-left")[0].innerHTML+=
    `<div class="container-switch">
        <div class="switch-button">
            <input class="switch-button-checkbox" type="checkbox"></input>
            <label class="switch-button-label" for=""><span class="switch-button-label-span">Favorites</span></label>
        </div>
    </div>`
}

//Notify
async function Notify(message){
    let container= document.createElement("div");
    container.classList.add("container-notify");
    let mess= document.createElement("h4");
    mess.innerHTML= message;    
    container.appendChild(mess);
    document.getElementsByClassName("container")[0].appendChild(container);
    await Utility.sleep(2000);
    document.getElementsByClassName("container")[0].removeChild(container);
}


//
async function ShowFavorites(){
    let curCount= count;
    Main.ClearContents();
    for(let f in favorites){
        let letter = favorites[f].charAt(0);
        let anime = await Firebase.getVal("Anime/"+letter+"/"+f);
        if(curCount==count){    
            centralEl.appendChild(Main.AnimeContent(anime));  
        }
    }
}

async function ShowTrashed(){
    let curCount= count;
    Main.ClearContents();
    for(let f in trashed){
        let letter = trashed[f].charAt(0);
        let anime = await Firebase.getVal("Anime/"+letter+"/"+f);
        if(curCount==count){   
            centralEl.appendChild(Main.AnimeContent(anime));
        }
    }
}

//Search
async function BlockSearch(){
    stopSearching=true;
    await Utility.sleep(500);
    stopSearching=false;
}

async function AddAnimeByText(anime,text){
    if(!(CheckFilter() && VM(anime))){
        if(Utility.Match(anime.title,text,"i")){
            centralEl.appendChild(Main.AnimeContent(anime));
        }
        else{
            let words = anime.title.split(" ");
            for(let i = 0; i < words.length; i++){
                words[i] = words[i].replace(/\W/g, '');
                if(!Utility.isEmpty(words[i])&&Utility.Match(text,words[i],"i")){
                    centralEl.appendChild(Main.AnimeContent(anime));
                    return;
                }
            }   
        }
    }
}

async function SearchAnimeByText(l,a,text){
    let count= l.indexOf(text.charAt(0).toUpperCase());
    for(let i=0;i<l.length&&!stopSearching;i++){
        for(let j=0;j<a[(i+count)%l.length].length&&!stopSearching;j++){
            try{
                let path= "Anime/"+l[(i+count)%l.length]+"/"+(a[(i+count)%l.length])[j];
                let anime = await Firebase.getVal(path);
                AddAnimeByText(anime,text);
            }catch{}
        }
    }
}

async function AddAnimeByGenre(anime,genres,option){
    if(anime.genres==undefined||genres.length==0){
        return;
    }
    if(!(CheckFilter() && VM(anime))){
        let quit = false;
        for(let j=0;j<genres.length&&!quit;j++){
            let exists= false;
            for(let i=0;i<anime.genres.length&&!quit;i++){
                //Option or
                if(!option){
                    if(anime.genres[i]==genres[j]){
                        centralEl.appendChild(Main.AnimeContent(anime));
                        return;
                    }
                }
                //Option and
                else if(anime.genres[i]==genres[j]){
                    exists=true;
                    break;
                }
            }    
            if(!exists&&option){
                return;
            }        
        }
        if(option){
            centralEl.appendChild(Main.AnimeContent(anime));
        }
    }
}

async function SearchAnimeByGenre(l,a){
    let g=[];
    for(let i in genres){
        if(genres[i]==true){
            g.push(i);
        }
    }

    const option = Utility.getCookie("Genre Option")!==null ?document.getElementsByClassName("option-genres")[0].classList.contains("active") : false;
    for(let i=0;i<l.length&&!stopSearching;i++){
        for(let j=0;j<a[i].length&&!stopSearching;j++){
            try{
                let path= "Anime/"+l[i]+"/"+(a[i])[j];
                let anime = await Firebase.getVal(path);
                AddAnimeByGenre(anime,g,option);
            }catch{}
        }
    }
}

async function StartSearch(text,type){
    let l = JSON.parse(localStorage.getItem("Letters"));
    let a = JSON.parse(localStorage.getItem("AnimeIds"));
    await BlockSearch();
    Main.ClearContents();
    type==0 ? SearchAnimeByText(l,a,text) : SearchAnimeByGenre(l,a);
}

//MAIN
let btnGenreSearch = document.getElementById("genre-search");
let filt = document.getElementById("filter");
let optionGenres = document.getElementsByClassName("option-genres")[0];
let optionGenresReset = document.getElementsByClassName("option-genres-reset")[0];
let centralEl = document.getElementById("central");
let genresEl = document.getElementsByClassName('genres')[0];
let containerGenresEl = document.getElementById("container-genres");
let filter = true;
let stopSearching= false;
let genres= {};
let favorites = {};
let trashed = {};
let switchFT = true;
let count=0;
const version = "1.0.0.1";

console.log("Version: "+version);
if(location.pathname=="/"){
    window.location="/index.html";
}


if(location.pathname!=="/Html/selectedAnime.html"){
    await Init();
}

//localStorage.removeItem('Letters')

if(location.pathname=="/Html/search.html"){
    let text = Utility.getCookie("search");
    document.getElementById("search-box").value=text;
    
    !Utility.isEmpty(text) ? StartSearch(text,0) : StartSearch(text,1);
}
else if(location.pathname=="/index.html"){
    await Main.Load();
    Main.LoadMoreAnime();
}else if(location.pathname=="/Html/listAnime.html"){
    ElementSwitch();
    ShowFavorites();
}