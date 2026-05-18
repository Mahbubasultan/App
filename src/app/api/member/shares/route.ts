import { NextResponse } from 'next/server';

interface ShareRecord {
  id: string;
  name: string;
  memberEmail: string;
  status: 'active' | 'pending' | 'suspended';
  createdAt: string;
}

const SHARES: ShareRecord[] = [
  {
    id: 'share_01',
    name: 'Core Savings Share',
    memberEmail: 'member@example.com',
    status: 'active',
    createdAt: '2024-02-15',
  },
  {
    id: 'share_02',
    name: 'Growth Equity Share',
    memberEmail: 'member@example.com',
    status: 'active',
    createdAt: '2024-03-05',
  },
  {
    id: 'share_03',
    name: 'Community Investment Share',
    memberEmail: 'member2@example.com',
    status: 'pending',
    createdAt: '2024-04-12',
  },
];

export async function GET(request: Request) {
  const url = new URL(request.url);
  const email = url.searchParams.get('email')?.toLowerCase() || '';
  const filteredShares = email
    ? SHARES.filter((share) => share.memberEmail.toLowerCase() === email)
    : SHARES;

  const shares = filteredShares.length > 0 ? filteredShares : SHARES;

  return NextResponse.json({ shares });
}
