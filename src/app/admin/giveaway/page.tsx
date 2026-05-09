'use client';

import { GiveawayWheel } from '@/components/admin/GiveawayWheel';

export default function AdminGiveaway() {
  return (
    <div className="max-w-5xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Run Giveaway</h1>
          <p className="text-gray-600 mt-1">Conduct the monthly giveaway draw</p>
        </div>
        <GiveawayWheel />
      </div>
  );
}
