'use client';
import { useStore } from '@/lib/store';
import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export default function MatchesPage() {
  const { groups } = useStore();
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  if (!isHydrated) {
    return (
      <div className="h-screen w-screen flex items-center justify-center">
        <div className="text-2xl">Loading matches...</div>
      </div>
    );
  }

  const groupA = groups.find(group => group.name === 'A');
  const groupB = groups.find(group => group.name === 'B');

  return (
    <div className="h-screen w-screen p-4 grid grid-cols-2 gap-4 bg-gray-50">
      {/* Group A Matches */}
      <div className="h-full flex flex-col border rounded-lg bg-white overflow-hidden">
        <div className="p-4 border-b">
          <h2 className="text-2xl font-semibold">Group A Matches</h2>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-2">
          {groupA?.matches?.length > 0 ? (
            groupA.matches.map((match) => (
              <CompactMatchCard 
                key={match.id}
                match={match}
                teams={groupA.teams}
              />
            ))
          ) : (
            <div className="h-full flex items-center justify-center p-4">
              <div className="text-gray-500 text-center">
                No matches recorded yet
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Group B Matches */}
      <div className="h-full flex flex-col border rounded-lg bg-white overflow-hidden">
        <div className="p-4 border-b">
          <h2 className="text-2xl font-semibold">Group B Matches</h2>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-2">
          {groupB?.matches?.length > 0 ? (
            groupB.matches.map((match) => (
              <CompactMatchCard 
                key={match.id}
                match={match}
                teams={groupB.teams}
              />
            ))
          ) : (
            <div className="h-full flex items-center justify-center p-4">
              <div className="text-gray-500 text-center">
                No matches recorded yet
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function CompactMatchCard({ match, teams }) {
  const team1 = teams.find(t => t.id === match.team1);
  const team2 = teams.find(t => t.id === match.team2);
  
  // Calculate match outcome
  let team1Sets = 0;
  let team2Sets = 0;

  match.sets.forEach(set => {
    if (set.team1 > set.team2) team1Sets++;
    else if (set.team1 < set.team2) team2Sets++;
  });

  const result = team1Sets > team2Sets ? `${team1?.name} won` :
                 team2Sets > team1Sets ? `${team2?.name} won` :
                 'Draw';

  return (
    <Card className="p-3 hover:bg-gray-50 transition-colors">
      <CardHeader className="p-2">
        <CardTitle className="text-xl flex justify-between">
          <span className="truncate max-w-[40%]">{team1?.name}</span>
          <span className="mx-2">vs</span>
          <span className="truncate max-w-[40%] text-right">{team2?.name}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-2">
        <div className="flex flex-wrap gap-2">
          {match.sets.map((set, index) => (
            <div key={index} className="text-sm px-2 py-1 bg-gray-100 rounded">
              Set {index+1}: {set.team1}-{set.team2}
            </div>
          ))}
        </div>
        <div className="mt-2 pt-2 border-t text-sm flex justify-between">
          <span>Result: {result}</span>
          <span className="text-gray-500">
            {new Date(match.timestamp).toLocaleTimeString()}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}