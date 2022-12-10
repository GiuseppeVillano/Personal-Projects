import React, {useState,useEffect} from 'react';
import Pagination from 'react-bootstrap/Pagination';

export default function Page(props){
    const [state,setState] = useState("");
    
    useEffect(()=>{
        props.films===""?setState(""):setState(props.films);
    },[props])

    const IsFirst = ()=>{
        return props.films.page===1;
    }

    const LessThan6 = ()=>{
        return(props.films.page<5)
    }

    const MoreThan6 = ()=>{
        return(props.films.page>props.films.total_pages-5)
    }

    const ActivePage = (i)=>{
        return props.films.page===i;
    }

    const ChangePage = (e)=>{
        props.changePage(e.target.text);
    }

    const Assign = ()=>{
        const row = [];
        for (var i = -2; i < 3&&props.films.results.length>0; i++) {
            let value;
            if(props.films.page<5){
                value=i+4;
            }
            else if(props.films.page>props.films.total_pages-5){
                value=i+4;
            }
            else{
                value=props.films.page+i;
            }
            row.push(<Pagination.Item onClick={ChangePage} active={ActivePage(value)} key={i}>{value}</Pagination.Item>);
        }
        return row;
    };

    return (
        <>
            {state===""?
            <></>
            :
            <Pagination style={{"justifyContent":"center"}}>
                {props.films.results.length>0?<Pagination.Item onClick={ChangePage} active={IsFirst()}>{1}</Pagination.Item>:<></>}
                {LessThan6()?<></>:<Pagination.Ellipsis disabled/>}
                
                {Assign()}
                
                {MoreThan6()?<></>:<Pagination.Ellipsis disabled/>}

            </Pagination>
            }
        </>
    )
}