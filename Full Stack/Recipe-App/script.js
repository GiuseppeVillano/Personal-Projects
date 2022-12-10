function AddPreferedFood(food){
    let list = document.getElementById("scroll-x-recipe");
        let li = document.createElement("li");
            li.setAttribute("class", "center-li");
            li.setAttribute("id", food.idMeal);
                let img = document.createElement("img");
                img.setAttribute("id", "liked");
                img.setAttribute("src", food.strMealThumb);
                li.appendChild(img);
                let span = document.createElement("span");
                span.textContent = food.strMeal;
                li.appendChild(span);
                let icon = document.createElement("ion-icon");
                icon.setAttribute("name", "heart-dislike-outline");
                icon.setAttribute("id", "disliked");
                li.appendChild(icon);
        list.appendChild(li);
}

function LoadSuggestedMeal(mealData){
    let list = document.getElementById("scroll-y-recipe");
        let li = document.createElement("li");
        li.setAttribute("class", "footer-li");
        li.setAttribute("id", mealData.idMeal);
            let img = document.createElement("img");
            img.setAttribute("class", "recipe-daily");
            img.setAttribute("src", mealData.strMealThumb);
            li.appendChild(img);
            let div = document.createElement("div");
            div.setAttribute("id", "info-recipe");
                let span = document.createElement("span");
                span.textContent = mealData.strMeal;
                div.appendChild(span);
                let icon = document.createElement("ion-icon");
                icon.setAttribute("name", "heart-outline");
                icon.classList.add("prefer");
                div.appendChild(icon);
            li.appendChild(div);
        list.appendChild(li);
}

async function GetRandomMeal(){
    try{      
        const response = await fetch("https://www.themealdb.com/api/json/v1/1/random.php")
        const responseData = await response.json();
        const randomMeal = responseData.meals["0"];
        LoadSuggestedMeal(randomMeal);
    }
    catch{
        GetRandomMeal();
    }
}

async function GetMealById(id){
    try{      
        const response = await fetch("https://www.themealdb.com/api/json/v1/1/lookup.php?i="+id);
        const responseData = await response.json();
        const meal = responseData.meals["0"];
        LoadSuggestedMeal(meal);
    }
    catch{
        console.log("No meals");
    }
}

async function GetMealBySearch(term){
      
        const response = await fetch("https://www.themealdb.com/api/json/v1/1/search.php?s="+term);
        const responseData = await response.json();
        console.log(responseData);
        let i=0;
        const meals = new Array();
        while(responseData.meals[i]){
            let meal= responseData.meals[i].strMeal;
            let regex = /^a/i;
            if(regex.test(meal)){
                meals.push(responseData.meals[i]);
            }
            i++;
        }
        console.log(meals);
        for(const m in meals){
            LoadSuggestedMeal(meals[m]);
        }
}

//MAIN
let searchBtn=document.getElementById("button-search");
searchBtn.addEventListener("click", function(e) {
    let searchBar = document.getElementById("search-recipe");
    searchBar.classList.contains("active") ? searchBar.classList.remove("active"): searchBar.classList.add("active");
});

//handling mouse events
$(document).on({
    mouseenter: function (e) {
        if(e.target.classList.contains("liked-food")){
            e.target.setAttribute("name","heart-dislike");
        }
        else{
            e.target.setAttribute("name","heart");
        }
    },
    mouseleave: function (e) {
        if(e.target.classList.contains("liked-food")){
            e.target.setAttribute("name","heart");
        }
        else{
            e.target.setAttribute("name","heart-outline"); 
        }        
    },
    click: function (e) {
        if(e.target.classList.contains("liked-food")){
            e.target.classList.remove("liked-food");
            e.target.setAttribute("name", "heart-outline");
            const id=e.target.parentNode.parentNode.id;
            document.getElementById(id).remove();
        }
        else{
            e.target.classList.add("liked-food");
            e.target.setAttribute("name", "heart");

            const food={
                idMeal: e.target.parentNode.parentNode.id,
                strMealThumb: $(e.target.parentNode.parentNode).find("img").attr('src'),
                strMeal: $(e.target.parentNode).find("span").text()
            }
            AddPreferedFood(food);
        }    
    }
}, ".prefer");

$(document).on({
    click: function(e) {
        const id = e.target.parentNode.id;
        e.target.parentNode.remove();
        $("#"+id).find(".prefer").removeClass("liked-food");
        $("#"+id).find(".prefer").attr("name","heart-outline");
    }
}, "#disliked");


//Random meal call
for(let i=0; i<5;i++){
    GetRandomMeal();
}

//Meal by ID
//GetMealById(52772);

//Meal by input
document.querySelector("input").addEventListener("change",function (e) {
    const word = e.target.value;
    GetMealBySearch(word);
})