import { collection, getDocs, limit, orderBy, query, startAfter, Timestamp, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../../App";

// compat packages are API compatible with namespaced code
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

import EmojiPicker from "emoji-picker-react";
import CommentUI from "./CommentUI";

interface Comment {
    id : string
    name: string;
    text: string;
    email: string;
    picture : string;
    pid: string | null;
    createdAt:Timestamp;
    reactions: Record<string,number>;
    attachmentsURLs:[]
}

interface TotalComments {
    noOfComments : number;
    toggleComponent :() => void; 
    fetchByLatest: boolean 
}

const COMMENTS_PER_PAGE = 8; 

const CommentList: React.FC<TotalComments> = ({noOfComments,toggleComponent,fetchByLatest}) => {
    const [comments, setComments] = useState<Comment[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    
    const[showEmojiPicker,setShowEmojiPicker] = useState<boolean>(false);
    const [showFullText, setShowFullText] = useState(false);
    const[renderComment,setRenderComments] = useState<number>(1);

    const [currentPage, setCurrentPage] = useState(1);   

    const [lastVisible, setLastVisible] = useState<any>(null); 

    useEffect(() => {
  
      const fetchComments = async () => {
        try {

          let q : any;
          if(fetchByLatest){
             q = query(
                collection(db, "comments"),
                where('pid', '==', ""),
                orderBy('createdAt', 'desc'),
                limit(COMMENTS_PER_PAGE)
            );
          }  else { 
            q = query(
              collection(db, "comments"),
              where('pid', '==', ""),
              orderBy('reactionCount', 'desc'),
              limit(COMMENTS_PER_PAGE)
            );
          }

            const commentSnapshot = await getDocs(q);

            const commentList = commentSnapshot.docs.map(doc => {
                const data = doc.data() as Omit<Comment, 'id'>; 
                return { id: doc.id, ...data }; 
            });

            setComments(commentList);
            setLastVisible(commentSnapshot.docs[commentSnapshot.docs.length - 1]);
  
        } catch (err) {
  
          setError('Failed to fetch comments');
          console.error('Error fetching comments:', err);
  
        } finally {
          setLoading(false);
        }
      };
  
      fetchComments();
    }, [renderComment,noOfComments,fetchByLatest]);

    const handleNextPage = async () => {
        if (!lastVisible) return; // Don't fetch if no more data
    
        setLoading(true);
    
        const newQuery = query(
          collection(db, "comments"),
          where('pid', '==', ""),
          orderBy('createdAt', 'desc'),
          startAfter(lastVisible),
          limit(COMMENTS_PER_PAGE)
        );
    
        const nextCommentsSnapshot = await getDocs(newQuery);
    
        const newComments = nextCommentsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data() as Omit<Comment, 'id'>,
        }));
    
        setComments(newComments);
        setLastVisible(nextCommentsSnapshot.docs[nextCommentsSnapshot.docs.length - 1]);
    
        setLoading(false);
        setCurrentPage(currentPage + 1);
      };
    
      const handlePreviousPage = async () => {
        if (currentPage === 1) return; // Don't fetch if on first page
    
        //logic to fetch previous page comments (more complex :-) )
    
        // below code retrieves the first page again for simplicity
        const fetchFirstPage = async () => {
          setLoading(true);
    
          const q = query(
            collection(db, "comments"),
            where('pid', '==', ""),
            orderBy('createdAt', 'desc'),
            limit(COMMENTS_PER_PAGE)
          );
    
          const commentSnapshot = await getDocs(q);
    
          const commentList = commentSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data() as Omit<Comment, 'id'>,
          }));
    
          setComments(commentList);
          setLastVisible(commentSnapshot.docs[commentSnapshot.docs.length - 1]);
    
          setLoading(false);
          setCurrentPage(1);
        };
    
        fetchFirstPage();
    };
    
    
    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

  return (
    <div>
         {comments.map((comment, index) => (
            <div key={index}>
                
                <CommentUI  
                    name={comment.name} 
                    id={comment.id} 
                    text={comment.text} 
                    picture={comment.picture} 
                    reactions={comment.reactions} 
                    email={comment.email} 
                    pid={comment.pid} 
                    createdAt={comment.createdAt} 
                    attachmentsURLs={comment.attachmentsURLs}
                    noOfComment={noOfComments}
                    toggleComponent={toggleComponent}
                    fetchByLatest={fetchByLatest}
                    /> 
            </div>
         ))}

        <div className="flex w-full justify-center">

            <div className="flex text-xl mt-8">
                {currentPage && currentPage > 1 && (
                    <div className="mr-10 border rounded-full cursor-pointer px-2" onClick={handlePreviousPage}>
                        1
                    </div>
                )}

                <div className="mr-10 border rounded-full px-2">
                    {currentPage}
                </div>

                <div className="border rounded-full bg-gray-200 flex items-center cursor-pointer" onClick={handleNextPage}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                    </svg>
                </div>

            </div>

            
        </div>
    </div>
    )

}

export default CommentList;