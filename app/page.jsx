'use client'
import { useState } from 'react';
import { GroupTable } from '@/components/GroupTable';
import { useStore } from '@/lib/store';
import { BracketPage } from '@/components/BracketPage';
import { Button } from '@/components/ui/button';

export default function Home() {
  const { groups } = useStore();
  const [showBrackets, setShowBrackets] = useState(false);

  
  return (
    <main className="min-h-screen grid">
      {!showBrackets ? (
        <div className="mt-5 p-8" >
          <div className="grid grid-cols-2 gap-8 mb-10 ">
            {groups.map((group) => (
              <div key={group.name} className="space-y-4">
                <GroupTable group={group} />
              </div>
            ))}
          </div>
          <div className="mb-8 flex justify-left">
            <Button 
              onClick={() => setShowBrackets(true)}
              className="text-lg py-6 px-8"
            >
              🏁 Finalize Group Stage & Start Brackets
            </Button>
          </div>

        </div>
      ) : (
        <BracketPage />
      )}
    </main>
  );
}