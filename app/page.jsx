'use client'
import { useState } from 'react';
import { GroupTable } from '@/components/GroupTable';
import { useStore } from '@/lib/store';
import { BracketPage } from '@/components/BracketPage';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

export default function Home() {
  const { groups, resetTournament } = useStore();
  const [showBrackets, setShowBrackets] = useState(false);
  const [resetModalOpen, setResetModalOpen] = useState(false);

  
  return (
    <main className="min-h-screen">
      {!showBrackets ? (
        <div className='p-8'>
          <div className="grid grid-cols-2 gap-4 mb-6">
              {groups.map((group) => (
                <div key={group.name} className="space-y-4">
                  <GroupTable group={group} />
                </div>
              ))}
          </div>
          <div className="mb-8 flex justify-center gap-8">                
            <Button 
              onClick={() => setShowBrackets(true)}
              className="text-lg py-6 px-8">
              🏁 Finalize Group Stage & Start Brackets
            </Button>

            <Dialog open={resetModalOpen} onOpenChange={setResetModalOpen}>
              <DialogTrigger asChild>
                <Button 
                  variant="destructive"
                  className="text-lg py-6 px-8"
                >
                  🗑 Reset Tournament
                </Button>
              </DialogTrigger>

              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Confirm Tournament Reset</DialogTitle>
                  <DialogDescription>
                    This action cannot be undone. All teams, matches, and scores will be permanently removed.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter className="sm:justify-end">
                  <Button 
                    type="button"
                    variant="outline"
                    onClick={() => setResetModalOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="button"
                    variant="destructive"
                    onClick={() => {
                      resetTournament();
                      setResetModalOpen(false);
                    }}
                  >
                    Confirm Reset
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            </div>

        </div>
      ) : (
        <BracketPage />
      )}
    </main>
  );
}