import {useState, useEffect} from 'react';
import {Check, CheckCheck} from "lucide-react";
import "./Leaderboard.css"

interface Member {
    id: number;
    name: string;
    stars: number;
    local_score: number;
    last_star_ts: number;
    completion_day_level: {
        [day: string]: {
            "1"?: { get_star_ts: number };
            "2"?: { get_star_ts: number };
        };
    };
}

interface LeaderboardData {
    members: { [id: string]: Member };
    event: string;
}

const Leaderboard = () => {
    const [data, setData] = useState<LeaderboardData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string>('');
    const [year, setYear] = useState(2024);

    useEffect(() => {
        const fetchLeaderboard = async () => {
            setLoading(true);
            setError('');
            try {
                const response = await fetch(`http://localhost:3001/api/leaderboard?year=${year}`);
                const jsonData = await response.json();
                setData(jsonData);
                setLoading(false);
            } catch (err) {
                setError('Failed to fetch leaderboard data');
                setLoading(false);
            }
        };

        fetchLeaderboard();
    }, [year]);

    if (loading) {
        return <div className="p-8 text-center">Loading...</div>;
    }

    if (error) {
        return <div className="p-8 text-center text-red-500">Error: {error}</div>;
    }

    if (!data) return null;

    const sortedMembers = Object.values(data.members).sort(
        (a, b) => b.local_score - a.local_score
    );

    const getDayStatus = (member: Member, day: number) => {
        const dayData = member.completion_day_level[day];
        if (!dayData) return 'none';
        if (dayData["2"]) return 'both';
        if (dayData["1"]) return 'one';
        return 'none';
    };

    const getRankClass = (index: number) => {
        const base = index % 2 === 0 ? 'bg-slate-800' : '';

        if (index === 0) {
            return `${base} rank-1 text-yellow-300 font-bold`;
        }
        if (index === 1) {
            return `${base} rank-2 text-slate-300 font-bold`;
        }
        if (index === 2) {
            return `${base} rank-3 text-amber-600 font-bold`;
        }
        return base;
    };

    return (
        <div className="p-4">
            <div className="mb-4 flex justify-between items-center">
                <h1 className="text-2xl font-bold">Advent of Code {year}</h1>
            </div>

            <div className="">
                <table className="w-full border-collapse">
                    <thead>
                    <tr className="border-b">
                        <th className="p-2 text-left">Rank</th>
                        <th className="p-2 text-center">Navn</th>
                        <th className="p-2 text-center">Sterner</th>
                        <th className="p-2 text-center">Score</th>
                        {Array.from({length: 25}, (_, i) => i + 1).map(day => (
                            <th key={day} className="p-2 text-center text-sm w-8">{day}</th>
                        ))}
                    </tr>
                    </thead>
                    <tbody>
                    {sortedMembers.map((member, index) => (
                        <tr key={member.id} className={`${getRankClass(index)} relative`}>
                            <td className="p-2">{index + 1}</td>
                            <td className="p-2 font-medium">{member.name || 'Anonymous'}</td>
                            <td className="p-2 text-center">{member.stars}</td>
                            <td className="p-2 text-center">{member.local_score}</td>
                            {Array.from({length: 25}, (_, i) => i + 1).map(day => {
                                const status = getDayStatus(member, day);
                                return (
                                    <td key={day} className="p-1 text-center">
                                        {status === 'both' &&
                                            <span className="text-yellow-500 text-2xl text-center"><CheckCheck/></span>}
                                        {status === 'one' && <span className="text-slate-400 text-2xl"><Check/></span>}
                                        {status === 'none' && <span className="text-gray-300 text-2xl text-center">-</span>}
                                    </td>
                                );
                            })}
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default Leaderboard;
