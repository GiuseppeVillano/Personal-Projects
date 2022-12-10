import React, {useState,useEffect} from 'react';
import Navbar from "./components/navbar";
import Home from "./components/home";
import Page from "./components/page";

import * as Movie from "./components/movie.js";

let type = "movie";;
let query= "";

export default function App(){
  const [films,setFilms] = useState("");

  const fetchData = async()=>{
    if(query===""){return;}
    let data = await Movie.getMovies(query);   
    setFilms(data);
  }
  
  function changeQuery(q){
    query=q;
    fetchData();
  }

  function changeType(t){
    type=t;
    fetchData();
  }

  function changePage(page){
    query+="&page="+page;
    fetchData();
  }
  
  useEffect(()=>{
    query="discover/"+type+"?";    
    changeQuery(query)   
  }// eslint-disable-next-line
  ,[]);

  return (
    <>
      <Navbar query={changeQuery} type={type} changeType={changeType}/>
      <Home films={films}/>
      <Page films={films} changePage={changePage}/>
    </>
  );
}