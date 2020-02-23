import React from 'react'
import loading from '../asset/img/loading.gif'

export default function Loading(props){
    let {DisplayLoading} = props;
    console.log(DisplayLoading)
    return(
        <div className="loading-block" style={{display:DisplayLoading}}>
            <img className="loading-img" src={loading}/>
        </div>
    )
}