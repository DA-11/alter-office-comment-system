import React, { useState } from 'react';
import {collection, addDoc } from "firebase/firestore";
import { useUser } from '../../UserContext';

import { db } from '../../App';
import FileUploader from '../utils/FileUploader';
import ImageRenderer from '../utils/ImageRenderer';

interface Reactions {
    [key: string]: number;
}

const reactions: Reactions = {}; 

interface CommentInputProps {
    pID: string | null,
    showCancelBtn : boolean,
    triggerCancel :() => void; 
    toggleComponent : () => void;
}

const CommentInput: React.FC<CommentInputProps> = ({ pID,showCancelBtn,triggerCancel,toggleComponent }) => {

    const{user,setUser} = useUser();

    const [isBold, setIsBold] = useState(false);
    const [isItalic, setIsItalic] = useState(false);
    const [isUnderline, setIsUnderline] = useState(false);
    const [text, setText] = useState('');
    const [attachmentsURLs, setAttachmentsURLs] = useState<string[]>([]);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showWarningFlag,setShowWarningFlag] = useState<boolean>(false);
    const[cancelBtn,setCancelBtn] = useState<boolean>(true);

    const getUserName = () => {
        return user?.name || 'Unknown User';
    };

    const getUserPictureURL = () => {
        return user?.picture || 'https://res.cloudinary.com/dfcsc86hq/image/upload/v1710148876/udyyvroza4g9oyct0kvf.png';
    };

    const getUserEmail = () => {
        return user?.email || 'unknown@example.com';
    };
    
    const documentPID = pID !== null ? pID : ""; 

    const handleSubmit = async (e : React.FormEvent<HTMLFormElement>) => {

        // if(user && user.name == ""){
        //     setError("Please login to comment");
        //     setShowWarningFlag(true);

        //     return;
        // }

        e.preventDefault();
        setLoading(true);
        
        if(text.length == 0 && attachmentsURLs.length == 0){
            setError("Please enter some text to comment or add some file")
            setShowWarningFlag(true);
            setLoading(false);
            return;
        }

        try {

            await addDoc(collection(db, 'comments'), {
                name: getUserName(),
                text: formatText(text),
                email: getUserEmail(),
                pid: documentPID,  
                reactions: reactions,
                picture: getUserPictureURL(),
                attachmentsURLs: attachmentsURLs,
                createdAt: new Date(),
                reactionCount : 0    
            });
            
            setText('');
            setAttachmentsURLs([]);
            triggerCancel();
            toggleComponent();

            console.log("document created")
        } catch (err) {
            console.log(err);
            setError('Failed to submit comment.');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.value.length <= 250) {
            setText(event.target.value);
        }
    };

    const handleBoldClick = () => {
        setIsBold(!isBold);
    };

    const handleItalicClick = () => {
        setIsItalic(!isItalic);
    };

    const handleUnderlineClick = () => {
        setIsUnderline(!isUnderline);
    };

    const formatText = (inputText: string) => {
        let formattedText = inputText;
    
        if (isBold) formattedText = `<b>${formattedText}</b>`;
        if (isItalic) formattedText = `<i>${formattedText}</i>`;
        if (isUnderline) formattedText = `<u>${formattedText}</u>`;
    
        return formattedText;
    };

    const getFormattedInputStyle = () => {
        let style = '';
        if (isBold) style += 'font-bold ';
        if (isItalic) style += 'italic ';
        if (isUnderline) style += 'underline ';
        return style;
    };

    const handleFileUpload = (url: string) => {
       
        setAttachmentsURLs(prev => [...prev, url]);
    };

    if(!cancelBtn){
        return (
            <></>
        )
    }

    return (
        <div>
            {showCancelBtn && (
                <div className='w-full border-t-2 border-black-500 mt-2 mb-4'></div>
            )}
            
            {showWarningFlag && (
                <div className="inline-flex border-2 p-1 rounded-xl">
                    <div className='p-2 text-red-300'>
                        {error}
                    </div>
                    <div onClick={() => {setShowWarningFlag(false)}}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                        </svg>
                    </div>
                </div>
            )}

            <form onSubmit={handleSubmit}>
            <div className="flex flex-col items-center justify-center mt-2">
            <div className="flex flex-col w-full items-center border-2 border-gray-300 p-2 rounded-lg">
                <input
                    type="text"
                    value={text}
                    onChange={handleInputChange}
                    placeholder=""
                    className={`w-full outline-none text-sm pb-10 ${getFormattedInputStyle()}`}
                />

                {attachmentsURLs && attachmentsURLs.length > 0 && (
                    <ImageRenderer attachmentsURLs={attachmentsURLs}></ImageRenderer>
                )}

                <div className='w-full border-t-2 border-black-500 mb-3'></div>
                
                <div className="flex justify-between w-full items-center">
                    <div className='flex'>
                        {/* <div onClick={handleBoldClick} className={isBold ? 'font-bold mr-3 text-xl' : 'mr-3 text-xl'}>
                            B
                        </div>
                        <div onClick={handleItalicClick} className={isItalic ? 'italic mr-3 ' : 'mr-3 text-xl'}>
                            I
                        </div>
                        <div onClick={handleUnderlineClick} className='underline text-xl mr-3'>
                            U
                        </div> */}

                        <div onClick={handleBoldClick} className={isBold ? 'font-bold mr-3 text-xl' : 'mr-3 text-xl'}>
                            B
                        </div>
                        <div onClick={handleItalicClick} className={isItalic ? 'italic mr-3 ' : 'mr-3 text-xl'}>
                            I
                        </div>
                        <div onClick={handleUnderlineClick} className='underline text-xl mr-3'>
                            U
                        </div>

                        <div>
                            <FileUploader onUpload={handleFileUpload} loading={loading} setLoading={setLoading}/>
                        </div>
                    </div>

                    <div>
                        {showCancelBtn && (
                            <button onClick={() => triggerCancel()} className="bg-gray-200 text-black border border-black rounded px-2 py-1 ml-auto text-xl mr-2">
                                Cancel
                            </button>
                        )}

                        {!loading && (
                            <button type='submit' className="bg-black text-gray-200 rounded p-1 ml-auto text-xl">
                                Send
                            </button>
                        )}

                        

                    </div>
                
                </div>
            </div>
        </div>
        </form>
    </div>
    )
    };

    export default CommentInput;

