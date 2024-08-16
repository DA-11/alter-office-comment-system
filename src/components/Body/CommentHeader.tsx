
import { useEffect, useState } from "react";
import {collection, getCountFromServer, } from 'firebase/firestore';
import { db } from "../../App";

const CommentHeader: React.FC = () => {
    const[noOfComments,setNoOfComments] = useState(0);

    useEffect(() => {
        const fetchNoOfComments = async () => {
            try {
                
                const coll = collection(db, "comments");
                const snapshot = await getCountFromServer(coll);
    
                setNoOfComments(snapshot.data().count);

            } catch (err){
                console.log(err);
            }
        }

        fetchNoOfComments();
    },[]);

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