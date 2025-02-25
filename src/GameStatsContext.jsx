import { createContext, useContext, useState } from "react";

const GameStatsContext = createContext();

export function GameStatsProvider({ children }) {
    const [stats, setStats] = useState({
        totalGames: 0,
        wins: 0,
        losses: 0,
    });

    const updateStats = (win) => {
        setStats(prevStats => ({
            totalGames: prevStats.totalGames + 1,
            wins: win ? prevStats.wins + 1 : prevStats.wins,
            losses: win ? prevStats.losses : prevStats.losses + 1,
        }));
    };

    return (
        <GameStatsContext.Provider value={{ stats, updateStats }}>
            {children}
        </GameStatsContext.Provider>
    );
}

export function useGameStats() {
    return useContext(GameStatsContext);
}
