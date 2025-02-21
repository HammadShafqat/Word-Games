import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Hangman() {
    const [word, setWord] = useState("");
    const [revealedLetters, setRevealedLetters] = useState([]);
    const [lives, setLives] = useState(5);
    const [clickedLetters, setClickedLetters] = useState(new Set());
    const [hintsLeft, setHintsLeft] = useState(3);
    
    const alphabets = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ-'.split('');
    const navigate = useNavigate();

    const handleHomeClick = () => {
        navigate("/");
    };

    const fetchData = async () => {
        try {
            const response = await fetch('https://random-word-api.herokuapp.com/word?length=7');
            const json = await response.json();
            const fetchedWord = json[0].toUpperCase();
            console.log(fetchedWord);
            setWord(fetchedWord);
            setRevealedLetters(new Array(fetchedWord.length).fill("_"));
            setLives(5);
            setHintsLeft(3);
            setClickedLetters(new Set());
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    const matchResult = (letter) => {
        if (lives === 0 || clickedLetters.has(letter)) return;

        setClickedLetters(prev => new Set(prev).add(letter));
        let isCorrect = false;

        const updatedRevealed = word.split("").map((char, index) => {
            if (char === letter) {
                isCorrect = true;
                return letter;
            }
            return revealedLetters[index];
        });

        setRevealedLetters(updatedRevealed);

        if (!isCorrect) {
            setLives(prevLives => Math.max(0, prevLives - 1));
        }
    };

    const useHint = () => {
        if (hintsLeft > 0) {
            const unrevealedIndexes = word.split("").map((char, index) => revealedLetters[index] === "_" ? index : null).filter(index => index !== null);
            if (unrevealedIndexes.length > 0) {
                const randomIndex = unrevealedIndexes[Math.floor(Math.random() * unrevealedIndexes.length)];
                const hintLetter = word[randomIndex];

                setRevealedLetters(prev => prev.map((char, index) => index === randomIndex ? hintLetter : char));
                setClickedLetters(prev => new Set(prev).add(hintLetter));
                setHintsLeft(prev => prev - 1);
            }
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        const handleKeyPress = (event) => {
            const key = event.key.toUpperCase();
            if (alphabets.includes(key)) {
                matchResult(key);
            }
        };
        window.addEventListener("keydown", handleKeyPress);
        return () => window.removeEventListener("keydown", handleKeyPress);
    }, [clickedLetters, lives, word]);

    const isGameWon = word.length > 0 && revealedLetters.join("") === word;

    return (
        <div className="h-screen bg-[url('/src/assets/hangman-background.jpeg')] bg-cover bg-center pt-15 pb-15 pl-30 pr-30 text-white">
            <div className="h-15 flex items-center justify-between pl-10 pr-10">
                <span className="h-full flex items-center">
                    <div className="h-10 w-10 rounded-full bg-purple-600 hover:bg-purple-400 cursor-pointer flex items-center justify-center text-lg" onClick={handleHomeClick}>
                        <i className="fa-solid fa-house"></i>
                    </div>
                    <h2 className="ml-5 text-2xl font-bold">Hangman</h2>
                </span>
                <span className="h-full flex items-center text-xl">
                    <div className="h-4 w-35 bg-white rounded-2xl p-1 mr-3 relative overflow-hidden">
                        <div 
                            className="h-full rounded-2xl bg-blue-700 transition-all duration-500"
                            style={{ width: `${(lives / 5) * 100}%` }}
                        ></div>
                    </div>
                    <i className="fa-solid fa-heart text-purple-600"></i>
                </span>
            </div>

            <div className="h-15 ml-50 mr-50 mt-10 flex justify-center gap-2">
                {revealedLetters.map((char, index) => (
                    <div key={index} className="w-12 h-12 bg-blue-200 text-black font-bold text-xl flex items-center justify-center rounded-2xl">
                        {char}
                    </div>
                ))}
            </div>

            <div className="flex justify-center mt-10 ">
                <button 
                    className={`px-6 py-2 text-lg font-bold cursor-pointer text-white rounded-xl transition-all duration-300 ${
                        hintsLeft > 0 ? "bg-orange-500 hover:bg-orange-400" : "bg-gray-500 cursor-not-allowed"
                    }`} 
                    onClick={useHint}
                    disabled={hintsLeft === 0}
                >
                    Use Hint ({hintsLeft} left)
                </button>
            </div>

            <div className="grid grid-cols-9 ml-50 mr-50 gap-2 mt-5">
                {alphabets.map((letter, index) => {
                    const isClicked = clickedLetters.has(letter);
                    const isCorrect = word.includes(letter);
                    return (
                        <div 
                            key={index} 
                            className={`h-12 w-12 rounded-2xl flex items-center justify-center text-black font-bold text-xl cursor-pointer transition-all duration-300
                                ${lives === 0 ? "bg-gray-500 cursor-not-allowed" : isClicked ? (isCorrect ? "bg-green-500" : "bg-gray-400 cursor-not-allowed") : "bg-white hover:bg-gray-300"}`}
                            onClick={() => matchResult(letter)}
                        >
                            {letter}
                        </div>
                    );
                })}
            </div>


            {lives === 0 && (
                <div className="mt-3 text-center text-2xl font-bold text-red-600">
                    Game Over! The word was: <span className="text-white">{word}</span>
                </div>
            )}
            {isGameWon && (
                <div className="mt-3 text-center text-2xl  font-bold text-green-600">
                    Congratulations! You won! The word was: <span className="text-white">{word}</span>
                </div>
            )}
        </div>
    );
}

export default Hangman;
