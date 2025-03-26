import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const initialGroups = [
  {
    name: 'A',
    teams: [
      { id: 'A1', name: 'Team Alpha', points: 0 },
      { id: 'A2', name: 'Team Bravo', points: 0 },
      { id: 'A3', name: 'Team Charlie', points: 0 },
      { id: 'A4', name: 'Team Delta', points: 0 },
      { id: 'A5', name: 'Team Echo', points: 0 }
    ],
    matches: []
  },
  {
    name: 'B',
    teams: [
      { id: 'B1', name: 'Team Foxtrot', points: 0 },
      { id: 'B2', name: 'Team Golf', points: 0 },
      { id: 'B3', name: 'Team Hotel', points: 0 },
      { id: 'B4', name: 'Team India', points: 0 },
      { id: 'B5', name: 'Team Juliet', points: 0 }
    ],
    matches: []
  }
];

export const useStore = create(
  persist(
    (set) => ({
      groups: initialGroups,
      
      addMatchResult: (groupName, team1Id, team2Id, sets) => set(state => {
        return {
          groups: state.groups.map(group => {
            if (group.name !== groupName) return group;
            
            // Calculate match outcome
            let team1Wins = 0, team2Wins = 0;
            sets.forEach(set => {
              if (set.team1 > set.team2) team1Wins++;
              else if (set.team1 < set.team2) team2Wins++;
            });

            const result = team1Wins > team2Wins ? 1 : team2Wins > team1Wins ? 2 : 0;
            
            // Update teams
            const updatedTeams = group.teams.map(team => {
              if (team.id === team1Id) {
                return { 
                  ...team, 
                  points: team.points + (result === 1 ? 3 : result === 0 ? 1 : 0) 
                };
              }
              if (team.id === team2Id) {
                return { 
                  ...team, 
                  points: team.points + (result === 2 ? 3 : result === 0 ? 1 : 0) 
                };
              }
              return team;
            });
            
            // Add match to history
            const newMatch = {
              id: Date.now(),
              team1: team1Id,
              team2: team2Id,
              sets,
              result,
              timestamp: new Date().toISOString()
            };
            
            return {
              ...group,
              teams: updatedTeams,
              matches: [...group.matches, newMatch]
            };
          })
        };
      }),
      
      resetTournament: () => set({ groups: initialGroups })
    }),
    {
      name: 'tournament-storage',
      partialize: (state) => ({ groups: state.groups })
    }
  )
);