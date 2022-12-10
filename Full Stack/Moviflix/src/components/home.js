import React, {useState,useEffect} from 'react';

let url = "https://image.tmdb.org/t/p/w500";

export default function Home(props){
    const [state,setState] = useState("");
    
    useEffect(()=>{
        props.films===""?setState(""):setState(props.films);
    },[props])

    const cardStyle = {
        width: "260px"
    };

    const truncate ={
        "WebkitLineClamp": 4,
        display: "-webkit-box",
        "WebkitBoxOrient": "vertical",
        overflow: "hidden"
    }

    return (
        <>
            {state===""?
            <></>
            :
            <div className="container-fluid" style={{"marginTop": "90px","marginBottom":"70px"}}>
                <div className="row">
                    {props.films.results.map((film,index)=>{
                        return(
                        <div className="col" key={index}>
                            <div className="card" key={props.page} style={cardStyle}>
                                <img src={url+film.poster_path} className="card-img-top" alt=""/>
                                <div className="card-body">
                                    <h5 className="card-title">{film.title}</h5>
                                    <p className="card-text"  style={truncate}>{film.overview}</p>
                                </div>
                            </div>     
                        </div>
                        );
                    })}  
                </div>
            </div>
            }
        </>
    )
}
