import { useEffect, useState } from "react";
import CommentHeader from "./CommentHeader";
import CommentInput from "./CommentInput";
import CommentList from "./CommentsList";
import {collection, getCountFromServer, increment, } from 'firebase/firestore';
import { db } from "../../App";


const CommentSection: React.FC = () => {

    const[noOfComments,setNoOfComments] = useState(0);
    const[fetchByLatest,setFetchByLatest] = useState(true);

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
    },[noOfComments,fetchByLatest]);

   
    return (
        
        <div className="border-2 rounded-xl p-4 mt-4">
            <CommentHeader noOfComments={noOfComments} fetchByLatest={fetchByLatest} setFetchByLatest={(val) => {setFetchByLatest(val)}}></CommentHeader>
            <CommentInput pID={""} showCancelBtn={false} toggleComponent={() => {setNoOfComments(prevKey => prevKey + 1)}} triggerCancel={() => {}}></CommentInput>
            <CommentList noOfComments={noOfComments} toggleComponent={() => {setNoOfComments(prevKey => prevKey + 1)}}></CommentList>
        </div>
            
    )
}

export default CommentSection;