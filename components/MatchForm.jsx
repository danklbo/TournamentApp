'use client';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useStore } from '@/lib/store'

export const MatchForm = ({ group }) => {
  const [open, setOpen] = useState(false);
  const [selectedTeam1, setSelectedTeam1] = useState('');
  const [selectedTeam2, setSelectedTeam2] = useState('');
  const [sets, setSets] = useState([{ team1: '', team2: '' }]);
  const { addMatchResult } = useStore();
  const [formError, setFormError] = useState('');
  const [prevSelections, setPrevSelections] = useState({
    team1: '',
    team2: ''
  });

  useEffect(() => {
    if (selectedTeam1 && selectedTeam1 === selectedTeam2) {
      setFormError('Teams must be different');
      // Roll back to previous valid selection
      setSelectedTeam2(prevSelections.team2);
    } else {
      setFormError('');
      setPrevSelections({
        team1: selectedTeam1,
        team2: selectedTeam2
      });
    }
  }, [selectedTeam1, selectedTeam2]);

  const handleSubmit = () => {
    addMatchResult(
      group.name,
      selectedTeam1,
      selectedTeam2,
      sets,
    );
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
    <DialogTrigger asChild>
        <Button variant="outline" className="text-3xl h-[100%]">
          Add Match
        </Button>
        </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add Match Result</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          {formError && (
            <div className="text-red-500 text-sm font-medium">{formError}</div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <Select 
              onValueChange={setSelectedTeam1} 
              value={selectedTeam1}
              disabled={!!formError}
            >
              <SelectTrigger className={formError ? 'border-red-500' : ''}>
                <SelectValue placeholder="Select Team 1" />
              </SelectTrigger>
              <SelectContent>
                {group.teams
                  .filter(team => team.id !== selectedTeam2)
                  .map(team => (
                    <SelectItem key={team.id} value={team.id}>
                      {team.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>

            <Select 
              onValueChange={setSelectedTeam2} 
              value={selectedTeam2}
              disabled={!!formError}
            >
              <SelectTrigger className={formError ? 'border-red-500' : ''}>
                <SelectValue placeholder="Select Team 2" />
              </SelectTrigger>
              <SelectContent>
                {group.teams
                  .filter(team => team.id !== selectedTeam1)
                  .map(team => (
                    <SelectItem key={team.id} value={team.id}>
                      {team.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>

          {sets.map((set, index) => (
            <div key={index} className="flex gap-2 items-center">
              <Input
                type="number"
                placeholder="Team 1 Points"
                value={set.team1}
                onChange={(e) => {
                  const newSets = [...sets];
                  newSets[index].team1 = e.target.value;
                  setSets(newSets);
                }}
              />
              <Input
                type="number"
                placeholder="Team 2 Points"
                value={set.team2}
                onChange={(e) => {
                  const newSets = [...sets];
                  newSets[index].team2 = e.target.value;
                  setSets(newSets);
                }}
              />
              {sets.length > 1 && (
                <Button
                  variant="destructive"
                  onClick={() => setSets(sets.filter((_, i) => i !== index))}
                >
                  Remove
                </Button>
              )}
            </div>
          ))}

          <Button
            variant="secondary"
            onClick={() => setSets([...sets, { team1: '', team2: '' }])}
          >
            Add Set
          </Button>

          <Button onClick={handleSubmit}>Save Result</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};