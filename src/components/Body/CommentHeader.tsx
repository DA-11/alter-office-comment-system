
import { useEffect, useState } from "react";
import {collection, getCountFromServer, } from 'firebase/firestore';
import { db } from "../../App";

interface TotalComments {
    noOfComments : number;
}

const CommentHeader: React.FC<TotalComments> = ({noOfComments}) => {

    return (
        
        <div className="flex justify-between items-center">
           <div className="text-2xl font-bold">Comments ({noOfComments})</div>
            <div className="flex border-2 p-2 rounded">
                <div className="mr-2">Latest</div>
                <div>Popularity</div>
            </div>
        </div>
            
    )
}

export default CommentHeader;