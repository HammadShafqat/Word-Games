import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { GameStatsProvider } from "./GameStatsContext"; 
import Menu from "./Components/Menu";
import Wordle from "./Components/Wordle";
import Hangman from "./Components/Hangman";
import NotFound from "./Components/NotFound";

function App() {
    return (
        <GameStatsProvider>
            <Router>
                <Routes>
                    <Route path="/" element={<Menu />} />
                    <Route path="/wordle" element={<Wordle />} />
                    <Route path="/hangman" element={<Hangman />} />
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </Router>
        </GameStatsProvider>
    );
}

export default App;
