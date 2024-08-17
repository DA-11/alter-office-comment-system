import { collection, getDocs, query, where } from "firebase/firestore";
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
    picture : string
    pid: string | null;
    reactions: Record<string, number>;
}

const CommentList: React.FC = () => {
    const [comments, setComments] = useState<Comment[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    
    const[showEmojiPicker,setShowEmojiPicker] = useState<boolean>(false);
    const [showFullText, setShowFullText] = useState(false);
    const[renderComment,setRenderComments] = useState<number>(1);

    useEffect(() => {
  
      const fetchComments = async () => {
        try {
          
            const q = query(collection(db, "comments"), where('pid', '==', ""));

            const commentSnapshot = await getDocs(q);

        //    const commentSnapshot = await db.collection('comments').where('pId', '==', '').get();
        //   const commentCollection = collection(db, 'comments');
        //   const commentSnapshot = await getDocs(commentCollection);
          //const commentList = commentSnapshot.docs.map(doc => doc.data() as Comment);
  
            const commentList = commentSnapshot.docs.map(doc => {
                const data = doc.data() as Omit<Comment, 'id'>; 
                return { id: doc.id, ...data }; 
            });

        //   const commentList = commentSnapshot.docs.map(doc => ({
        //     ...doc.data() as Comment,
        //   }));


            setComments(commentList);
  
        } catch (err) {
  
          setError('Failed to fetch comments');
          console.error('Error fetching comments:', err);
  
        } finally {
          setLoading(false);
        }
      };
  
      fetchComments();
    }, [renderComment]);

    const handleFormSubmit = () => {
        setRenderComments(prevKey => prevKey + 1);
    };
  
  const collectEmoji = (reaction : {}) => {
        console.log(reaction);
  }

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
                <CommentUI  name={comment.name} id={comment.id} text={comment.text} picture={comment.picture}></CommentUI>
            </div>
         ))}
    </div>)

{/*       
      <ul>
        {comments.map((comment, index) => (
          <div key={index}>

            <div className='flex items-center mt-5'>
                <img className='rounded-full h-8 w-8 mr-1' src={comment.picture}></img>
                <div className='font-bold ml-2'>{comment.name}</div>
            </div>

            <div className={`w-full ${showFullText ? 'max-h-none' : 'max-h-[7.5em]'} leading-[1.5em] overflow-hidden text-gray-500 font-medium mt-4`}>
                {comment.text}
            </div>

            <div className="flex items-center text-xs mt-2">
                <div className="mr-3" onClick={() => {setShowEmojiPicker(!showEmojiPicker)}}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.182 15.182a4.5 4.5 0 0 1-6.364 0M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Z" />
                    </svg>

                    
                </div>

                <div className="reactions">
                    
                        <EmojiPicker open={showEmojiPicker} onEmojiClick={collectEmoji}/>
                        
                    </div>

                <span className="mr-3">|</span>
                <div className="mr-3" onClick={() => {}}>
                    Reply
                </div>

                <span className="mr-3">|</span>
                <div>
                    5 hours
                </div>
            </div>
            {/* <button className="mt-2 text-blue-500 hover:underline" onClick={() => setShowFullText(!showFullText)}>
                {showFullText ? 'Show Less' : 'Show More'}
            </button> }
            
          </div>
        ))}
      </ul> 
      */}

}

export default CommentList;