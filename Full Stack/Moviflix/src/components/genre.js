import React, {useState,useEffect } from 'react';
import * as Movie from "./movie.js";

let type = "movie";//"tv";

async function getGenres(){
    const data = await Movie.getMovies("genre/" + type + "/list?");
    return data.genres;
}

export default function Genres(){
    const [list, setList] = useState([]);

    useEffect(() => {
        getGenres().then(items => {
            setList(items)
        })
    }, [])

    return(
        <>
            {list.map(genre => <option key={genre.id} value={genre.id}>{genre.name}</option>)}
        </>
    )
}
