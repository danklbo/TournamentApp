'use client'
import { GroupTable } from '@/components/GroupTable';
import { useStore } from '@/lib/store';

export default function Home() {
  const { groups } = useStore();
  
  return (
    <main className="min-h-screen p-8 grid grid-cols-2 gap-8">
      {groups.map((group) => (
        <div key={group.name} className="space-y-4">
          <GroupTable group={group} />
        </div>
      ))}
    </main>
  );
}