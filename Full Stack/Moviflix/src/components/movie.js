const APIURL = 'https://api.themoviedb.org/3/';
const APIKEY =  '04c35731a5ee918f014970082a0088b1';

export async function getMovies(query) {
    const url = APIURL+query+"&api_key="+APIKEY;
    console.log(url)
    const response = await fetch(url);
    const data = await response.json();
    return data;
}
