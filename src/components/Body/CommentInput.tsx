import React, { useState } from 'react';

import {collection, addDoc } from "firebase/firestore";
import { useUser } from '../../UserContext';

import { db } from '../../App';

interface Reactions {
    [key: string]: number;
}

const reactions: Reactions = {}; 

interface CommentInputProps {
    pID: string | null,
    showCancelBtn : boolean,
    toggleComponent :() => void; 
}

const CommentInput: React.FC<CommentInputProps> = ({ pID,showCancelBtn,toggleComponent }) => {

    const{user,setUser} = useUser();

    const [isBold, setIsBold] = useState(false);
    const [isItalic, setIsItalic] = useState(false);
    const [isUnderline, setIsUnderline] = useState(false);
    const [text, setText] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

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
        e.preventDefault();
        setLoading(true);
        setError('');

        try {

            await addDoc(collection(db, 'comments'), {
                name: getUserName(),
                text: text,
                email: getUserEmail(),
                pid: documentPID,  
                reactions: reactions,
                picture: getUserPictureURL(),
                attachmentsURLs:[],
                createdAt: new Date()    
            });
            
            setText('');
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

    const getFormattedInputStyle = () => {
        let style = '';
        if (isBold) style += 'font-bold ';
        if (isItalic) style += 'italic ';
        if (isUnderline) style += 'underline ';
        return style;
    };

    const handleSendClick = () => {
        // Display the formatted text (you can customize this further)
        const formattedText = `${isBold ? '**' : ''}${isItalic ? '*' : ''}${isUnderline ? '__' : ''}${text}${isUnderline ? '__' : ''}${isItalic ? '*' : ''}${isBold ? '**' : ''}`;
        console.log('Formatted Text:', formattedText);
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
            
            <form onSubmit={handleSubmit}>
            <div className="flex flex-col items-center justify-center mt-2">
            <div className="flex flex-col w-full items-center border-2 border-gray-300 p-2 rounded-lg">
                <input
                type="text"
                value={text}
                onChange={handleInputChange}
                placeholder=""
                className={`w-full outline-none text-sm ${getFormattedInputStyle()}`}
                />

                <div className='w-full border-t-2 border-black-500 mt-10 mb-3'></div>
                
                <div className="flex justify-between w-full items-center">
                    <div className='flex'>
                        <button onClick={handleBoldClick} className={isBold ? 'font-bold mr-3 text-xl' : 'mr-3 text-xl'}>
                            B
                        </button>
                        <button onClick={handleItalicClick} className={isItalic ? 'italic mr-3 ' : 'mr-3 text-xl'}>
                            I
                        </button>
                        <button onClick={handleUnderlineClick} className='underline text-xl mr-3'>
                            U
                        </button>

                        <div>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m18.375 12.739-7.693 7.693a4.5 4.5 0 0 1-6.364-6.364l10.94-10.94A3 3 0 1 1 19.5 7.372L8.552 18.32m.009-.01-.01.01m5.699-9.941-7.81 7.81a1.5 1.5 0 0 0 2.112 2.13" />
                            </svg>
                        </div>
                    </div>

                    <div>
                        {showCancelBtn && (
                            <button onClick={() => toggleComponent()} className="bg-gray-200 text-black border border-black rounded px-2 py-1 ml-auto text-xl mr-2">
                                Cancel
                            </button>
                        )}

                        <button type='submit' className="bg-black text-gray-200 rounded p-1 ml-auto text-xl">
                            Send
                        </button>

                    </div>
                
                </div>
            </div>
        </div>
        </form>
    </div>
    )
    };

    export default CommentInput;

