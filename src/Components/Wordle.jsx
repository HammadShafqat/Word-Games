import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useGameStats } from "../GameStatsContext";

function Wordle() {
    const alphabets = "ABCDEFGHIJKLMNOPQRSTUVWXYZ-".split("");
    const { stats, updateStats } = useGameStats();
    const [word, setWord] = useState("");
    const [guesses, setGuesses] = useState([]);
    const [currentGuess, setCurrentGuess] = useState("");
    const [gameOver, setGameOver] = useState(false);
    const [won, setWon] = useState(false);
    const maxGuesses = 6;
    const navigate = useNavigate();

    useEffect(() => {
        if (gameOver) {
            updateStats(won);
        }
    }, [gameOver]);

    const handleHomeClick = () => {
        navigate("/");
    };

    const fetchRandomWord = async () => {
        try {
            const response = await fetch("https://random-word-api.herokuapp.com/word?length=5");
            const data = await response.json();
            if (data && data[0]) {
                setWord(data[0].toUpperCase());
                console.log("Fetched word:", data[0].toUpperCase());
                setGuesses([]);
                setCurrentGuess("");
                setGameOver(false);
                setWon(false);
            }
        } catch (error) {
            console.error("Error fetching word:", error);
        }
    };

    useEffect(() => {
        fetchRandomWord();
    }, []);

    const handleKeyPress = (letter) => {
        if (currentGuess.length < word.length && !gameOver) {
            setCurrentGuess((prev) => prev + letter);
        }
    };

    useEffect(() => {
        const handleKeyDown = (event) => {
            const key = event.key.toUpperCase();

            if (!gameOver) {
                if (alphabets.includes(key) && currentGuess.length < word.length) {
                    setCurrentGuess((prev) => prev + key);
                } else if (event.key === "Backspace" && currentGuess.length > 0) {
                    setCurrentGuess((prev) => prev.slice(0, -1));
                } else if (event.key === "Enter" && currentGuess.length === word.length) {
                    handleSubmitGuess();
                }
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [currentGuess, gameOver]);

    const handleSubmitGuess = () => {
        if (currentGuess.length === word.length && !gameOver) {
            setGuesses((prev) => [...prev, currentGuess]);
            setCurrentGuess("");

            if (currentGuess === word) {
                setWon(true);
                setGameOver(true);
            } else if (guesses.length + 1 === maxGuesses) {
                setGameOver(true);
            }
        }
    };

    const getLetterColor = (letter, index, guessIndex) => {
        if (guessIndex === guesses.length) return "";
        if (word[index] === letter) return "bg-green-500";
        if (word.includes(letter)) return "bg-yellow-500";
        return "bg-gray-500";
    };

    return (
        <div className="min-h-screen  bg-[url('/src/assets/wordle-background.jpg')] bg-cover bg-center pt-2 pb-2 pl-30 pr-30 text-white">
            
            <div className="h-10 flex items-center justify-between pl-10 pr-10">
                <span className="h-full flex items-center">
                    <div className="h-10 w-10 rounded-full bg-red-600 hover:bg-red-400 cursor-pointer flex items-center justify-center text-lg" onClick={handleHomeClick}>
                        <i className="fa-solid fa-house"></i>
                    </div>
                    <h2 className="ml-5 text-2xl font-bold">Wordle</h2>
                </span>
                <span className="h-full flex items-center text-xl">
                    <p className="mr-5">
                        Wins: <span className="text-green-400">{stats.wins}</span> Losses: <span className="text-red-400">{stats.losses}</span>
                    </p>
                    <div className="h-4 w-35 bg-white rounded-2xl p-1 mr-3 relative overflow-hidden">
                        <div className="h-full rounded-2xl bg-red-600 transition-all duration-500" style={{ width: `${(guesses.length / maxGuesses) * 100}%` }}></div>
                    </div>
                    <i className="fa-solid fa-heart text-red-600"></i>
                </span>
            </div>
            
            <div className="h-45 ml-50 mr-50 mb-35 flex flex-col items-center gap-2">
                {Array.from({ length: maxGuesses }).map((_, rowIndex) => (
                    <div key={rowIndex} className="flex gap-2">
                        {Array.from({ length: word.length }).map((_, index) => {
                            let letter = guesses[rowIndex]?.[index] || "";
                            let colorClass = guesses[rowIndex] ? getLetterColor(letter, index, rowIndex) : "";

                            if (rowIndex === guesses.length && index < currentGuess.length) {
                                letter = currentGuess[index];
                            }

                            return (
                                <div 
                                    key={index} 
                                    className={`h-11 w-11 rounded-lg flex items-center justify-center text-white font-bold text-xl border border-white ${colorClass}`}
                                >
                                    {letter}
                                </div>
                            );
                        })}
                    </div>
                ))}
            </div>

            {gameOver && (
                <div className="text-center text-2xl font-bold">
                    {won ? (
                        <p className="text-green-600">Congratulations! You won! The word was: <span className="text-white">{word}</span></p>
                    ) : (
                        <p className="text-red-600">Game Over! The word was: <span className="text-white">{word}</span></p>
                    )}
                    <button className="mt-3 px-6 py-2 cursor-pointer bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl" onClick={fetchRandomWord}>
                        Play Again
                    </button>
                </div>
            )}

            <div className="grid grid-cols-9 ml-50 mt-10 mr-50 gap-1">
                {alphabets.map((letter, index) => (
                    <div
                        key={index}
                        className="h-11 w-11 rounded-2xl flex items-center justify-center text-black font-bold text-xl cursor-pointer transition-all bg-white hover:bg-gray-300"
                        onClick={() => handleKeyPress(letter)}
                    >
                        {letter}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Wordle;
