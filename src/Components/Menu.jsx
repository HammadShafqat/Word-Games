import { Link } from 'react-router-dom';

function Menu() {
    return (
        <div className="h-screen bg-[url('/src/assets/wordle-background.jpg')] text-white flex flex-col items-center justify-center">
            <h1 className="text-4xl font-bold mb-8">Welcome to the Game Menu</h1>
            <div className="flex flex-col gap-4">
                <Link to="/wordle">
                    <button className="w-40 cursor-pointer bg-blue-500 text-white text-xl p-4 rounded-lg hover:bg-blue-700 transition-all duration-300">
                        Play Wordle
                    </button>
                </Link>
                <Link to="/hangman">
                    <button className=" w-40 cursor-pointer bg-green-500 text-white text-xl p-4 rounded-lg hover:bg-green-700 transition-all duration-300">
                        Play Hangman
                    </button>
                </Link>
            </div>
        </div>
    );
}

export default Menu;
