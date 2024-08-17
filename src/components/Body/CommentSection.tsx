import { useEffect, useState } from "react";
import CommentHeader from "./CommentHeader";
import CommentInput from "./CommentInput";
import CommentList from "./CommentsList";


const CommentSection: React.FC = () => {

    return (
        
        <div className="border-2 rounded-xl p-4 mt-4">
            <CommentHeader></CommentHeader>
            <CommentInput pID={null} showCancelBtn={false} toggleComponent={() => {}}></CommentInput>
            <CommentList></CommentList>
        </div>
            
    )
}

export default CommentSection;