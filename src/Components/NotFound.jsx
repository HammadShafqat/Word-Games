import { useNavigate } from "react-router-dom";

function NotFound() {

    const navigate = useNavigate();

    const handleHomeClick = ()=>{
        navigate("/");
    }

    return (
        <div className="h-screen bg-[url('/src/assets/hangman-background.jpeg')] bg-cover bg-center pt-15 pb-15 pl-30 pr-30 text-white flex justify-center items-center">
            <div>
                <h1 className=" text-9xl font-bold">
                404 
            </h1>
            <h2 className="text-4xl font-bold">
                Not Found!!!
            </h2>
            </div>
            
        </div>
    );
}

export default NotFound;
