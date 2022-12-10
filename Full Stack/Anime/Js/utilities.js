//Cookies
export function setCookie(name,value,days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days*24*60*60*1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "")  + expires + "; path=/";
}

export function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}

export function eraseCookie(name) {   
    document.cookie = name +'=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}

//Wait
export function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

//Random
export function randomRange(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

//Check string empty even with spaces
export function isEmpty(str) {
    if(str==undefined||str==null){
        return true;
    }
    return !str.trim().length;
}

//regex
export function Match(text,pattern,flags){
    let regex = new RegExp(pattern,flags);
    return text.match(regex);
}