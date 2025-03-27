'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';

export const BracketMatchForm = ({ 
  activeMatch, 
  setActiveMatch,
  scores,
  setScores,
  handleSubmit
}) => {
  return (
    <Dialog open={!!activeMatch} onOpenChange={(open) => !open && setActiveMatch(null)}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{activeMatch} - Enter Scores</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {scores.map((score, index) => (
            <div key={index} className="flex gap-2 items-center">
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
              {scores.length > 1 && (
                <Button
                  variant="destructive"
                  onClick={() => setScores(scores.filter((_, i) => i !== index))}
                >
                  Remove
                </Button>
              )}
            </div>
          ))}

          <div className="flex gap-2">
            <Button
              variant="secondary"
              onClick={() => setScores([...scores, { team1: '', team2: '' }])}
            >
              Add Set
            </Button>
            <Button onClick={handleSubmit}>
              Save Scores
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};