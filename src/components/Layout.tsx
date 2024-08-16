import CommentSection from "./Body/CommentSection";
import AuthSection from "./Header/AuthSection";

const Layout: React.FC = () => {

    return (
        
        <div className="m-5">
            <AuthSection></AuthSection>
            <CommentSection></CommentSection>
        </div>
            
    )
}

export default Layout;