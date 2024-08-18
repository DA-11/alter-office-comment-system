import { useEffect, useState } from "react";
import CommentHeader from "./CommentHeader";
import CommentInput from "./CommentInput";
import CommentList from "./CommentsList";
import {collection, getCountFromServer, } from 'firebase/firestore';
import { db } from "../../App";


const CommentSection: React.FC = () => {

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
    },[noOfComments]);

    return (
        
        <div className="border-2 rounded-xl p-4 mt-4">
            <CommentHeader noOfComments={noOfComments}></CommentHeader>
            <CommentInput pID={null} showCancelBtn={false} toggleComponent={() => {setNoOfComments(prevKey => prevKey + 1)}}></CommentInput>
            <CommentList noOfComments={noOfComments}></CommentList>
        </div>
            
    )
}

export default CommentSection;