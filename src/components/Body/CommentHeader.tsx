
import { useEffect, useState } from "react";
import {collection, getCountFromServer, } from 'firebase/firestore';
import { db } from "../../App";

interface TotalComments {
    noOfComments : number;
    fetchByLatest : boolean;
    setFetchByLatest : (val : boolean) => void;
}

const CommentHeader: React.FC<TotalComments> = ({noOfComments,fetchByLatest,setFetchByLatest}) => {

    return (
        
        <div className="flex justify-between items-center">
           <div className="text-2xl font-bold">Comments ({noOfComments})</div>
            <div className="flex border-2 p-2 rounded">
                <div onClick={() => {setFetchByLatest(true)}} className={fetchByLatest ? "font-bold mr-2" : "mr-2 cursor-pointer"}>Latest</div>
                <div onClick={() => {setFetchByLatest(false)}} className={!fetchByLatest ? "font-bold" : "cursor-pointer"}>Popularity</div>
            </div>
        </div>
            
    )
}

export default CommentHeader;