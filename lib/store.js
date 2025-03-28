import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const initialGroups = [
  {
    name: 'A',
    teams: [
      { id: 'A1', name: 'Shori no kaeru', points: 0 },
      { id: 'A2', name: 'Lokomotiva Bratislava 1985', points: 0 },
      { id: 'A3', name: 'Beauties and beasts', points: 0 },
      { id: 'A4', name: 'Adlati', points: 0 },
      { id: 'A5', name: 'Turbonafta Slovnaft', points: 0 }
    ],
    matches: []
  },
  {
    name: 'B',
    teams: [
      { id: 'B1', name: 'Outy nedavame', points: 0 },
      { id: 'B2', name: 'Gumkači', points: 0 },
      { id: 'B3', name: 'Lokomotiva Bratislava 2010', points: 0 },
      { id: 'B4', name: '20cm', points: 0 },
      { id: 'B5', name: 'Fireballs', points: 0 }
    ],
    matches: []
  }

];

const initialBracketMatches = {
  semifinal1: { 
    id: 'semifinal1',
    team1: null, 
    team2: null, 
    sets: [],
    completed: false 
  },
  semifinal2: { 
    id: 'semifinal2',
    team1: null, 
    team2: null, 
    sets: [],
    completed: false 
  },
  consolation1: { 
    id: 'consolation1',
    team1: null, 
    team2: null, 
    sets: [],
    completed: false 
  },
  consolation2: { 
    id: 'consolation2',
    team1: null, 
    team2: null, 
    sets: [],
    completed: false 
  },

  final: { 
    id: 'final',
    team1: null, 
    team2: null, 
    sets: [],
    completed: false 
  },
  thirdPlace: { 
    id: 'thirdPlace',
    team1: null, 
    team2: null, 
    sets: [],
    completed: false 
  },
  fifthPlace: { 
    id: 'fifthPlace',
    team1: null, 
    team2: null, 
    sets: [],
    completed: false 
  },
  seventhPlace: { 
    id: 'seventhPlace',
    team1: null, 
    team2: null, 
    sets: [],
    completed: false 
  },
  ninthPlace: { 
    id: 'ninthPlace',
    team1: null, 
    team2: null, 
    sets: [],
    completed: false 
  }
};


export const useStore = create(
  persist(
    (set) => ({
      groups: initialGroups,
      bracketMatches: initialBracketMatches,
      
      addMatchResult: (groupName, team1Id, team2Id, sets) => set(state => {
        return {
          groups: state.groups.map(group => {
            if (group.name !== groupName) return group;
            
            // Calculate match outcome
            let team1Wins = 0, team2Wins = 0;
            sets.forEach(set => {
              const setTeam1 = parseInt(set.team1)
              const setTeam2 = parseInt(set.team2)
              
              if (setTeam1 > setTeam2) team1Wins++;
              else if (setTeam1 < setTeam2) team2Wins++;
            });

            const result = team1Wins > team2Wins ? 1 : team2Wins > team1Wins ? 2 : 0;
            
            // Update teams
            const updatedTeams = group.teams.map(team => {
              if (team.id === team1Id) {
                return { 
                  ...team, 
                  points: team.points + (result === 1 ? 2 : result === 0 ? 1 : 0) 
                };
              }
              if (team.id === team2Id) {
                return { 
                  ...team, 
                  points: team.points + (result === 2 ? 2 : result === 0 ? 1 : 0) 
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
      updateBracketMatch: (matchId, updates) => set(state => ({
        bracketMatches: {
          ...state.bracketMatches,
          [matchId]: { 
            ...state.bracketMatches[matchId],
            ...updates 
          }
        }
      })),
      
      // Team advancement logic
      advanceTeam: (targetMatchId, teamId) => set(state => {
        const targetMatch = state.bracketMatches[targetMatchId];
        return {
          bracketMatches: {
            ...state.bracketMatches,
            [targetMatchId]: {
              ...targetMatch,
              team1: targetMatch.team1 || teamId,
              team2: targetMatch.team1 ? teamId : targetMatch.team2
            }
          }
        };
      }),
      
      // Initialize bracket with group winners
      initializeBracket: () => set(state => {
        const groupA = state.groups.find(g => g.name === 'A');
        const groupB = state.groups.find(g => g.name === 'B');
        
        const sortedA = calculateStandings(groupA);
        const sortedB = calculateStandings(groupB);

        return {
          bracketMatches: {
            ...state.bracketMatches,
            semifinal1: {
              ...state.bracketMatches.semifinal1,
              team1: sortedA[0]?.id,
              team2: sortedB[1]?.id
            },
            semifinal2: {
              ...state.bracketMatches.semifinal2,
              team1: sortedB[0]?.id,
              team2: sortedA[1]?.id
            },
            consolation1: {
              ...state.bracketMatches.consolation1,
              team1: sortedA[2]?.id,
              team2: sortedB[3]?.id
            },
            consolation2: {
              ...state.bracketMatches.consolation2,
              team1: sortedB[2]?.id,
              team2: sortedA[3]?.id
            },

            ninthPlace: {
              ...state.bracketMatches.ninthPlace,
              team1: sortedA[4]?.id,
              team2: sortedB[4]?.id
            }
          }
        };
      }),
      
      resetTournament: () => set({ 
        groups: initialGroups,
        bracketMatches: initialBracketMatches
      })
    }),

    {
      name: 'tournament-storage',
      partialize: (state) => ({
        groups: state.groups,
        bracketMatches: state.bracketMatches
      })
    }
  ) 
);

const calculateStandings = (group) => {
  return group.teams.sort((a, b) => {
    // 1. Points (descending)
    const pointsA = parseInt(a.points)
    const pointsB = parseInt(b.points)

    if (pointsB !== pointsA) return pointsB - pointsA;
    
    // 2. Head-to-head result
    const match = group.matches.find(m => {
      const teamsInMatch = [m.team1, m.team2];
      return teamsInMatch.includes(a.id) && teamsInMatch.includes(b.id);
    });

    if (match) {
      let aSets = 0, bSets = 0;
      match.sets.forEach(set => {
        const isATeam1 = match.team1 === a.id;
        const setWinner = parseInt(set.team1) > parseInt(set.team2) ? 
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
          aPoints += parseInt(set.team1);
          bPoints += parseInt(set.team2);
        } else {
          aPoints += parseInt(set.team2);
          bPoints += parseInt(set.team1);
        }
      });
      return (bPoints - aPoints);
    }
    
    // 4. If no head-to-head, maintain current order
    return 0;
  });
}; 

