'use client';
import { useEffect, useState } from 'react';
import { useStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export const BracketPage = () => {
  const {
    groups,
    bracketMatches = {},
    updateBracketMatch,
    advanceTeam,
    initializeBracket,
  } = useStore();


  const [activeMatch, setActiveMatch] = useState(null);
  const [scores, setScores] = useState([{ team1: '', team2: '' }]);

  // Initialize bracket when groups change
  useEffect(() => {
    initializeBracket();
  }, [groups, initializeBracket]);

  const getTeamName = (teamId) => {
    const allTeams = groups?.flatMap(group => group.teams) || [];
    return allTeams.find(t => t.id === teamId)?.name || teamId;
  };

  const handleSubmit = () => {
    if (!activeMatch) return;

    const currentMatch = bracketMatches[activeMatch];
    if (!currentMatch) return;

    const team1Wins = scores.filter(s => Number(s.team1) > Number(s.team2)).length;
    const team2Wins = scores.length - team1Wins;
    const winner = team1Wins > team2Wins ? currentMatch.team1 : currentMatch.team2;
    const loser = team1Wins > team2Wins ? currentMatch.team2 : currentMatch.team1;

    updateBracketMatch(activeMatch, {
      sets: scores.map(s => ({ team1: Number(s.team1), team2: Number(s.team2) })),
      completed: true,
      team1Sets: team1Wins,
      team2Sets: team2Wins
    });

    const advancementRules = {
      semifinal1: { win: 'final', lose: 'thirdPlace' },
      semifinal2: { win: 'final', lose: 'thirdPlace' },
      consolation1: { win: 'fifthPlace', lose: 'seventhPlace' },
      consolation2: { win: 'fifthPlace', lose: 'seventhPlace' }
    };

    if (advancementRules[activeMatch]) {
      advanceTeam(advancementRules[activeMatch].win, winner);
      advanceTeam(advancementRules[activeMatch].lose, loser);
    }

    setActiveMatch(null);
    setScores([{ team1: '', team2: '' }]);
  };

  return (
    <div className="h-screen w-screen p-4 bg-slate-50 grid grid-cols-2 gap-4 overflow-hidden">
      {/* Left Column - Main Bracket */}
      <div className="h-full flex flex-col">
        <h2 className="text-xl font-bold text-slate-700 mb-2">Main Bracket</h2>
        <div className="grid grid-rows-[1fr,1fr,2fr] gap-2 flex-1">
          {/* Semifinals */}
          <div className="grid gap-2">
            <MatchCard
              match={bracketMatches?.semifinal1}
              title="Semifinal 1"
              getTeamName={getTeamName}
              className="h-full border-blue-300"
              onAddScore={() => setActiveMatch('semifinal1')}
            />
            <MatchCard
              match={bracketMatches?.semifinal2}
              title="Semifinal 2"
              getTeamName={getTeamName}
              className="h-full border-blue-300"
              onAddScore={() => setActiveMatch('semifinal2')}
            />
          </div>
  
          {/* Consolation Matches */}
          <div className="grid gap-2 pt-2">
            <MatchCard
              match={bracketMatches?.consolation1}
              title="5th Place Semi 1"
              getTeamName={getTeamName}
              className="h-full border-green-300"
              onAddScore={() => setActiveMatch('consolation1')}
            />
            <MatchCard
              match={bracketMatches?.consolation2}
              title="5th Place Semi 2"
              getTeamName={getTeamName}
              className="h-full border-green-300"
              onAddScore={() => setActiveMatch('consolation2')}
            />
          </div>
        </div>
      </div>
  
      {/* Right Column - Placement Matches */}
      <div className="h-full flex flex-col">
        <h2 className="text-xl font-bold text-slate-700 mb-2">Placements</h2>
        <div className="grid grid-rows-[1.5fr,1fr,1fr,1fr,1fr] gap-2 flex-1">
          <MatchCard
            match={bracketMatches?.final}
            title="🏆 FINAL"
            getTeamName={getTeamName}
            className="border-amber-400 bg-amber-50"
            onAddScore={() => setActiveMatch('final')}
          />
          <MatchCard
            match={bracketMatches?.thirdPlace}
            title="🥉 3rd Place"
            getTeamName={getTeamName}
            className="border-purple-300 bg-purple-50"
            onAddScore={() => setActiveMatch('thirdPlace')}
          />
          <MatchCard
            match={bracketMatches?.fifthPlace}
            title="5th Place"
            getTeamName={getTeamName}
            className="border-emerald-300"
            onAddScore={() => setActiveMatch('fifthPlace')}
          />
          <MatchCard
            match={bracketMatches?.seventhPlace}
            title="7th Place"
            getTeamName={getTeamName}
            className="border-rose-300"
            onAddScore={() => setActiveMatch('seventhPlace')}
          />
          <MatchCard
            match={bracketMatches?.ninthPlace}
            title="9th Place"
            getTeamName={getTeamName}
            className="border-pink-300"
            onAddScore={() => setActiveMatch('ninthPlace')}
          />
        </div>
      </div>
      {activeMatch && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
            <div className="bg-white p-4 rounded-lg w-96 relative">
            <button 
                onClick={() => setActiveMatch(null)}
                className="absolute top-2 right-2 p-1 hover:bg-gray-100 rounded-full text-xl"
            >
                &times;
            </button>
            <h3 className="text-xl font-bold mb-4">Enter Scores for {activeMatch}</h3>
            {scores.map((score, index) => (
                <div key={index} className="flex gap-2 mb-2">
                <Input
                    type="number"
                    placeholder="Team 1"
                    value={score.team1}
                    onChange={(e) => {
                    const newScores = [...scores];
                    newScores[index].team1 = e.target.value;
                    setScores(newScores);
                    }}
                />
                <Input
                    type="number"
                    placeholder="Team 2"
                    value={score.team2}
                    onChange={(e) => {
                    const newScores = [...scores];
                    newScores[index].team2 = e.target.value;
                    setScores(newScores);
                    }}
                />
                </div>
            ))}
            <div className="flex gap-2 mt-4">
                <Button onClick={() => setScores([...scores, { team1: '', team2: '' }])}>
                Add Set
                </Button>
                <Button onClick={handleSubmit}>
                Save Scores
                </Button>
            </div>
            </div>
        </div>
        )}
        </div>
    );
}
  
function MatchCard({ match, title, getTeamName, className = '', onAddScore }) {
    // Determine winner and loser
    const isCompleted = match?.completed;
    const team1Wins = match?.team1Sets || 0;
    const team2Wins = match?.team2Sets || 0;
    const winner = team1Wins > team2Wins ? 1 : team2Wins > team1Wins ? 2 : null;
  
    return (
      <div className={`relative p-2 border-l-4 rounded-r bg-white shadow-sm h-full flex flex-col ${className}`}>
        <div className="flex justify-between items-center mb-[2px]">
          <h3 className="text-sm font-semibold truncate">{title}</h3>
          <div className="flex items-center gap-1">
            {isCompleted && (
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 text-gray-500 hover:bg-gray-100"
                onClick={onAddScore}
              >
                ×
              </Button>
            )}
            {isCompleted && (
              <span className="text-xs bg-green-100 text-green-800 px-1 rounded">✓</span>
            )}
          </div>
        </div>
  
        <div className="flex flex-col justify-center flex-1">
        {/* Team 1 */}
        <div className="flex justify-between items-center bg-white rounded-lg">
          <span className={`truncate ${
            match?.completed ? 
              (team1Wins ? 'font-bold' : 'text-gray-500') 
              : 'font-medium'
          }`}>
            {match?.team1 ? getTeamName(match.team1) : 'TBD'}
          </span>
          <span className={`font-mono ml-2 ${
            team1Wins ? 'text-blue-600' : 'text-gray-500'
          }`}>
            {match?.team1Sets || 0}
          </span>
        </div>

        {/* Team 2 */}
        <div className="flex justify-between items-center bg-white rounded-lg">
          <span className={`truncate ${
            match?.completed ? 
              (team2Wins ? 'font-bold' : 'text-gray-500') 
              : 'font-medium'
          }`}>
            {match?.team2 ? getTeamName(match.team2) : 'TBD'}
          </span>
          <span className={`font-mono ml-2 ${
            team2Wins ? 'text-blue-600' : 'text-gray-500'
          }`}>
            {match?.team2Sets || 0}
          </span>
        </div>
      </div>

  
        {isCompleted && (
          <div className="mt-1 text-center text-sm text-slate-500">
            {match.sets?.map((set, i) => (
              <span key={i} className="mx-1 font-mono bg-slate-100 px-2 py-1 rounded">
                {set.team1}-{set.team2}
              </span>
            ))}
          </div>
        )}
  
        {!isCompleted && match?.team1 && match?.team2 && (
          <Button
            variant="outline"
            className="w-full mt-2 h-8 text-sm hover:bg-white hover:shadow"
            onClick={onAddScore}
          >
            ✏️ Enter Scores
          </Button>
        )}
      </div>
    );
  }