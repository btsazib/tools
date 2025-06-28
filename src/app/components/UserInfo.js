'use client';

import { useSession } from 'next-auth/react';

export default function UserInfo() {
  const { data: session, status } = useSession();
console.log('Session data:', session)

  

  if (status === 'loading') return <p>Loading...</p>;
  if (!session) return <p></p>;

  return (
    <div className='relative group'>
      <div className='absolute -bottom-24 -left-5 hidden group-hover:block bg-white border border-gray-400 p-5 rounded-xl'>
      <p>Name: {session.user.name}</p>
      <p className='whitespace-nowrap'>Email: {session.user.email}</p>
      </div>
      <img src={session.user.image} alt="Profile" className='w-14 h-14 object-cover border rounded-full cursor-pointer' />
    </div>
  );
}
