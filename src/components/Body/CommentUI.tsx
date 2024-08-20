import EmojiPicker from "emoji-picker-react";
import { collection, getDocs, query, where , doc, updateDoc, getDoc, increment, Timestamp, orderBy, limit } from "firebase/firestore";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { db } from "../../App";
import CommentInput from "./CommentInput";
import ImageRenderer from "../utils/ImageRenderer";

interface Comment {
    id : string
    name: string;
    text: string;
    email: string;
    picture : string;
    createdAt:Timestamp;
    pid: string | null;
    reactions: Record<string,number>;
    attachmentsURLs:[],
    noOfComment : number;
    toggleComponent :() => void; 
    fetchByLatest: boolean
}


const COMMENTS_PER_LINE = 5;
const COMMENTS_PER_PAGE = 8; 

const CommentUI : React.FC<Comment> = ({id,name,text,picture,reactions,createdAt,attachmentsURLs,noOfComment,toggleComponent,fetchByLatest}) => {

    const[showEmojiPicker,setShowEmojiPicker] = useState<boolean>(false);
    const[showReplyOption,setShowReplyOption] = useState<boolean>(false);

    const [comments, setComments] = useState<Comment[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const[renderComment,setRenderComments] = useState<number>(1);

    const [showFullText, setShowFullText] = useState(false);

    const[localReactions,setLocalReactions] = useState<Record<string,number>>(reactions);

    const currentDate = new Date();
    const commentDate = createdAt.toMillis();
    const currentTime = Math.floor((currentDate.getTime() - commentDate)/1000);

    const [isOverflowing, setIsOverflowing] = useState<boolean>(false);
    const textRef = useRef<HTMLDivElement>(null);

    const createMarkup = (html: string) => {
        return { __html: html };
    };

    useLayoutEffect(() => {
        
        const element = textRef.current;
        if (element) {
            console.log(element.scrollHeight)
            console.log(element.clientHeight)
            setIsOverflowing(element.scrollHeight > element.clientHeight);
        }
    }, [text, showFullText]);
    
    useEffect(() => {
        
       
        const fetchComments = async () => {
          try {
          let q : any;
          if(fetchByLatest){

            q = query(
                collection(db, "comments"),
                where('pid', '==', id),
                orderBy('createdAt', 'desc'),
                limit(COMMENTS_PER_PAGE)
            );

          }  else { 

            q = query(
              collection(db, "comments"),
              where('pid', '==', id),
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
    
          } catch (err) {
    
            setError('Failed to fetch comments');
            console.error('Error fetching comments:', err);
    
          } finally {
            setLoading(false);
          }
        };
    
        fetchComments();


    }, [renderComment,noOfComment,id,fetchByLatest]);

    

    const updateReaction = async ( collectionName : string, docId : string, reactionKey : number ) => {
        
        const newLocalReactions = { ...localReactions };
        newLocalReactions[reactionKey] = (newLocalReactions[reactionKey] || 0) + 1;
        setLocalReactions(newLocalReactions);
        
        try {
            const docRef = doc(db, collectionName, docId);
        
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
              const existingReactions = docSnap.data()?.reactions || {};
        
              if (existingReactions.hasOwnProperty(reactionKey)) {
                
                await updateDoc(docRef, {
                  [`reactions.${reactionKey}`]: increment(1) 
                });
              } else {
                
                await updateDoc(docRef, {
                  reactions: {
                    ...existingReactions,
                    [reactionKey]: 1
                  }
                });
              }

              await updateDoc(docRef, {
                "reactionCount": increment(1) 
              });

            } else {
              console.error('Document not found');
            }


          } catch (error) {
            console.error('Error updating reaction:', error);
            
          }
    };

    const collectEmoji = (emojiObject : any) => {
        
        const key = emojiObject.unified;

        updateReaction('comments',id,key)
        .then(() => {
            setRenderComments(prevKey => prevKey + 1);
            toggleComponent();
        })
        .catch(error => console.error('Error updating reaction:', error));

    }

    const triggerCancel = () => {
        setShowReplyOption(false);
    }

    const getTimeFromSeconds = (time : number) => {
        if(time <= 60){
            return (
                `${time} sec`
            )
        } else if(time <= 3600){
            time = Math.floor(time/60);
            return (
                `${time} min`
            )
        } else if(time <= 86400) {
            time = Math.floor(time/3600);
            return (
                `${time} hour`
            )
        } else {
            time = Math.floor(time/86400);
            return (
                `${time} day`
            )
        }
    }
    
    return (
        <div>
            
            <div className='flex items-center mt-5'>
                <img className='rounded-full h-8 w-8 mr-1 border border-black' src={picture}></img>
                <div className='font-bold ml-2'>{name}</div>
            </div>

            {/* <div
                ref={textRef}
                className={`w-full ${showFullText ? '' : 'max-h-[7.5em]'} leading-[1.5em] overflow-hidden text-gray-500 mt-4`}
            > */}
                
                <div ref={textRef} className={`w-full ${showFullText ? '' : 'max-h-[7.5em]'} leading-[1.5em] overflow-hidden text-gray-500 mt-4`} dangerouslySetInnerHTML={createMarkup(text)} />
        {/* </div> */}

            {isOverflowing && !showFullText && (
                <button
                    className="text-blue-500 mt-2"
                    onClick={() => setShowFullText(true)}
                >
                    Show More
                </button>
            )}

            {showFullText && (
                <button
                    className="text-blue-500 mt-2"
                    onClick={() => setShowFullText(false)}
                >
                    Show Less
                </button>
            )}

            {attachmentsURLs && attachmentsURLs.length > 0 && (
                <ImageRenderer attachmentsURLs={attachmentsURLs}></ImageRenderer>
            )}
            

            <div className="flex items-center text-xs mt-2 ">
                <div className="mr-3 cursor-pointer" onClick={() => {setShowEmojiPicker(!showEmojiPicker)}}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.182 15.182a4.5 4.5 0 0 1-6.364 0M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Z" />
                    </svg>
                </div>

                <div className="flex font-bold">
                    {Object.entries(reactions).map(([key, value]) => (
                        <div key={key} className="px-2 py-1 rounded-xl mr-1 border">
                        {String.fromCodePoint(parseInt(key, 16))} {value}
                        </div>
                    ))}
                </div>
                

                <span className="mr-3">|</span>
                <div className="mr-3 cursor-pointer" onClick={() => {setShowReplyOption(true)}}>
                    Reply
                </div>

                <span className="mr-3">|</span>
                <div>
                    {getTimeFromSeconds(currentTime)}
                </div>

                
            </div>
            <div className="reactions">
                <EmojiPicker open={showEmojiPicker} onEmojiClick={collectEmoji}/>
            </div>
                 
            {showReplyOption && (
                <div className="ml-8 border-l-4 border-black-800">
                    <div className="ml-9">
                        <CommentInput pID={id} showCancelBtn={true} triggerCancel={triggerCancel} toggleComponent={toggleComponent}></CommentInput>
                    </div>
                </div>
            )}
            
            
            <div className="ml-10">
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
                        noOfComment={noOfComment}
                        toggleComponent={toggleComponent}
                        fetchByLatest={fetchByLatest}
                    />

                    </div>
                ))}
            </div>
          </div>
    )
}

export default CommentUI;