'use client';
import { useStore } from '@/lib/store';

export default function BracketPage() {
  const { groups } = useStore();
  
  // Calculate standings using the same logic as groups screen
  const calculateStandings = (group) => {
    if (!group) return [];
    return [...group.teams].sort((a, b) => {
      // 1. Points (descending)
      if (b.points !== a.points) return b.points - a.points;
      
      // 2. Head-to-head result
      const match = group.matches.find(m => {
        const teamsInMatch = [m.team1, m.team2];
        return teamsInMatch.includes(a.id) && teamsInMatch.includes(b.id);
      });

      if (match) {
        // Calculate sets won in their direct match
        let aSets = 0, bSets = 0;
        match.sets.forEach(set => {
          const isATeam1 = match.team1 === a.id;
          const setWinner = set.team1 > set.team2 ? 
                          (isATeam1 ? 'a' : 'b') : 
                          (isATeam1 ? 'b' : 'a');
          
          if (setWinner === 'a') aSets++;
          else bSets++;
        });

        if (aSets !== bSets) return bSets - aSets;
        
        // 3. Points difference in their match
        let aPoints = 0, bPoints = 0;
        match.sets.forEach(set => {
          if (match.team1 === a.id) {
            aPoints += set.team1;
            bPoints += set.team2;
          } else {
            aPoints += set.team2;
            bPoints += set.team1;
          }
        });
        return (bPoints - aPoints);
      }
      
      return 0;
    });
  };

  const sortedA = calculateStandings(groups.find(g => g.name === 'A'));
  const sortedB = calculateStandings(groups.find(g => g.name === 'B'));

  return (
    <div className="h-screen w-screen p-4 bg-gray-50 overflow-auto">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">Tournament Bracket</h1>
        
        {/* Final Match */}
        <div className="flex justify-center mb-12">
          <BracketMatch 
            title="Final" 
            team1={sortedA[0]?.name || '1A'} 
            team2={sortedB[0]?.name || '1B'} 
            level="championship"
          />
        </div>

        <div className="grid grid-cols-2 gap-8 mb-8">
          {/* Semifinal 1 (A1 vs B2) */}
          <div className="flex flex-col items-end space-y-16">
            <BracketMatch 
              team1={sortedA[0]?.name || '1A'} 
              team2={sortedB[1]?.name || '2B'} 
            />
            <div className="relative">
              <div className="absolute top-1/2 right-0 h-1 w-8 bg-gray-300 -translate-y-1/2"></div>
              <div className="absolute top-1/2 right-8 h-16 w-1 bg-gray-300 -translate-y-1/2"></div>
            </div>
          </div>
          
          {/* Semifinal 2 (A2 vs B1) */}
          <div className="flex flex-col items-start space-y-16">
            <BracketMatch 
              team1={sortedA[1]?.name || '2A'} 
              team2={sortedB[0]?.name || '1B'} 
            />
            <div className="relative">
              <div className="absolute top-1/2 left-0 h-1 w-8 bg-gray-300 -translate-y-1/2"></div>
              <div className="absolute top-1/2 left-8 h-16 w-1 bg-gray-300 -translate-y-1/2"></div>
            </div>
          </div>
        </div>

        {/* 3rd Place Match */}
        <div className="flex justify-center mb-12">
          <BracketMatch 
            title="3rd Place" 
            team1="Loser SF1" 
            team2="Loser SF2" 
            level="consolation"
          />
        </div>

        {/* Quarterfinals (5th-8th places) */}
        <div className="grid grid-cols-2 gap-8 mb-8">
          {/* Left Side (A3 vs B4) */}
          <div className="flex flex-col items-end space-y-16">
            <BracketMatch 
              team1={sortedA[2]?.name || '3A'} 
              team2={sortedB[3]?.name || '4B'} 
              level="secondary"
            />
            <div className="relative">
              <div className="absolute top-1/2 right-0 h-1 w-8 bg-gray-300 -translate-y-1/2"></div>
              <div className="absolute top-1/2 right-8 h-16 w-1 bg-gray-300 -translate-y-1/2"></div>
            </div>
          </div>
          
          {/* Right Side (A4 vs B3) */}
          <div className="flex flex-col items-start space-y-16">
            <BracketMatch 
              team1={sortedA[3]?.name || '4A'} 
              team2={sortedB[2]?.name || '3B'} 
              level="secondary"
            />
            <div className="relative">
              <div className="absolute top-1/2 left-0 h-1 w-8 bg-gray-300 -translate-y-1/2"></div>
              <div className="absolute top-1/2 left-8 h-16 w-1 bg-gray-300 -translate-y-1/2"></div>
            </div>
          </div>
        </div>

        {/* 5th & 7th Place Matches */}
        <div className="flex justify-center space-x-16 mb-12">
          <BracketMatch 
            title="5th Place" 
            team1="Winner QF1" 
            team2="Winner QF2" 
            level="secondary"
          />
          <BracketMatch 
            title="7th Place" 
            team1="Loser QF1" 
            team2="Loser QF2" 
            level="secondary"
          />
        </div>

        {/* 9th Place Match */}
        <div className="flex justify-center">
          <BracketMatch 
            title="9th Place" 
            team1={sortedA[4]?.name || '5A'} 
            team2={sortedB[4]?.name || '5B'} 
            level="secondary"
          />
        </div>
      </div>
    </div>
  );
}

function BracketMatch({ title, team1, team2, level = 'primary' }) {
  const bgColor = level === 'championship' ? 'bg-blue-50 border-blue-200' :
                  level === 'consolation' ? 'bg-purple-50 border-purple-200' :
                  'bg-gray-50 border-gray-200';
  
  const textColor = level === 'championship' ? 'text-blue-800' :
                    level === 'consolation' ? 'text-purple-800' :
                    'text-gray-800';

  return (
    <div className={`border-2 rounded-lg p-3 w-64 ${bgColor}`}>
      {title && (
        <div className={`font-bold text-center mb-2 ${textColor}`}>
          {title}
        </div>
      )}
      <div className="text-center font-medium py-1">{team1}</div>
      <div className="text-center py-1">vs</div>
      <div className="text-center font-medium py-1">{team2}</div>
    </div>
  );
}