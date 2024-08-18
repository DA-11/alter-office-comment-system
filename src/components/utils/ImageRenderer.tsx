import React from "react";

interface ImageGalleryProps {
    attachmentsURLs: string[];
}

const ImageRenderer :React.FC<ImageGalleryProps> = ({ attachmentsURLs }) => {

    return (
        <div className="grid grid-cols-2 gap-4">
        {attachmentsURLs.map((url, index) => (
            <img 
                key={index} 
                src={url} 
                alt={`Attachment ${index + 1}`} 
                className="object-contain w-full h-auto rounded shadow-md " 
            />
        ))}
    </div>
    )
}

export default ImageRenderer;