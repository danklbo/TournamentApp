'use client';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { MatchForm } from '@/components/MatchForm';
import { Group } from '@radix-ui/react-select';


export const GroupTable = ({ group }) => {
  const calculateStandings = (group) => {
    return group.teams.sort((a, b) => {
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
      
      // 4. If no head-to-head, maintain current order
      return 0;
    });
  };  
  return (
    <div className="rounded-md border h-full flex flex-col">
      <div className="flex justify-between items-stretch border-b">
        <h2 className="p-6 text-4xl font-bold  flex items-center">
          {group.name}
        </h2>
        <MatchForm group={group} />
      </div>  
      <div className="flex-1 overflow-auto">
        <Table className="h-full">
          <TableHeader className="sticky top-0 bg-white z-10">
            <TableRow className="hover:bg-transparent">
              <TableHead className="text-3xl px-2 py-6 w-[20%]">Poradie</TableHead>
              <TableHead className="text-3xl px-6 py-6 w-[55%]">Team</TableHead>
              <TableHead className="text-3xl px-3 py-6 w-[25%]">Body</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {calculateStandings(group).map((team, index) => (
              <TableRow key={team.id} className="hover:bg-slate-50 h-20">
                <TableCell className="text-3xl px-8 py-6 font-bold">
                  {index + 1}
                </TableCell>
                <TableCell className="text-3xl px-8 py-6 font-medium">
                  {team.name}
                </TableCell>
                <TableCell className="text-3xl px-8 py-6 font-bold">
                  {team.points}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};