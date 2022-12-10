import styled from 'styled-components';
import Genres from "./genre";

let name;
let genre;
let show=false;

const TopStyle = styled.div`
    @media (min-width: 768px){
        width : 60%;
    }`

export default function Navbar(props){
    const SearchByName = ()=>{
        if(name===undefined){return;}
        props.query("search/"+props.type+"?query="+name);    
    }

    const SearchByGenre = ()=>{
        if(genre===undefined){return;}
        props.query("discover/"+props.type+"?with_genres="+genre);
    }

    const Discover = ()=>{
        props.query("discover/"+props.type+"?");
    }
    
    const HandleNameFilmSearch = (e)=>{
        name = e.target.value;
    }

    const HandleGenreSearch = (e)=>{
        genre = e.target.value;
    }
    
    const ListMenu = (e)=>{
        show=!show;
        let menu = document.getElementById("collapsibleNavbar");
        show? menu.classList.add("show"):menu.classList.remove("show");
    }

    const changeType= (e)=>{
        props.query("discover/"+e.target.value+"?");
        if(props.type!==e.target.value){
            props.changeType(e.target.value);
        }
    }

    return (
    <>
        <nav className="navbar navbar-expand-md fixed-top navbar-dark bg-dark">
            <div className="container-fluid">
                <button onClick={Discover} type="button" className="btn btn-primary me-auto">Home</button>
                <TopStyle></TopStyle>
                <div style={{"marginRight":"20px"}}>
                    <div className="form-check">
                        <input value="movie" onClick={changeType} className="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault1" defaultChecked/>
                        <label className="text-white form-check-label">Movie</label>
                    </div>
                    <div className="form-check">
                        <input value="tv" onClick={changeType} className="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault2"/>
                        <label className="text-white form-check-label">TV</label>
                    </div>
                </div>
                <button onClick={ListMenu} className="navbar-toggler" type="button" data-toggle="collapse" data-target="#collapsibleNavbar" aria-expanded="true">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="navbar-collapse collapse" id="collapsibleNavbar">
                    <ul className="navbar-nav">
                        <li className="nav-item" style={{"margin":"10px"}}>
                            <form className="d-flex" role="search">
                                <div className="input-group">
                                    <input className="form-control" id="inputGroupSelect04" type="search" placeholder="Search by name.." aria-label="Search" onChange={HandleNameFilmSearch}/>
                                    <button type="button" className="btn btn-primary pb-2" onClick={SearchByName}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-search" viewBox="0 0 16 16">
                                            <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"></path>
                                        </svg>
                                    </button>
                                </div>
                            </form>
                        </li>
                        <li className="nav-item" style={{"margin":"10px"}}>
                            <form className="d-flex">
                                <div className="input-group">
                                    <select className="form-select form-control" id="inputGroupSelect04" defaultValue={'DEFAULT'} onChange={HandleGenreSearch}>
                                        <option value="DEFAULT" disabled>Search by genre..</option>
                                        <Genres />
                                    </select>
                                    <button className="btn btn-primary pb-2" type="button" onClick={SearchByGenre}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-search" viewBox="0 0 16 16">
                                            <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"></path>
                                        </svg>
                                    </button>
                                </div>
                            </form>
                        </li>
                    </ul>                    
                </div>
            </div>
        </nav>
    </>
    );
}