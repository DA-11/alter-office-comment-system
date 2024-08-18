import React, { useState } from 'react';

import {collection, addDoc } from "firebase/firestore";
import { useUser } from '../../UserContext';

import { db } from '../../App';
import FileUploader from '../utils/ImageUploader';

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
    const [attachmentsURLs, setAttachmentsURLs] = useState<string[]>([]);

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
                attachmentsURLs: attachmentsURLs,
                createdAt: new Date()    
            });
            
            setText('');
            toggleComponent();
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
        console.log('under bold')
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
        //console.log('Formatted Text:', formattedText);
    };

    const handleImageUpload = (url: string) => {
       
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

                <div className='w-full border-t-2 border-black-500 mb-3'></div>
                
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
                            <FileUploader onUpload={handleImageUpload} />
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

