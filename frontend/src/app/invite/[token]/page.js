'use client';

import { useEffect } from 'react';
import { useParams } from 'next/navigation';

export default function InviteRedirectPage() {
  const { token } = useParams();

  useEffect(() => {
    // hit backend directly (browser redirect)
    window.location.href = `${process.env.NEXT_PUBLIC_API_BASE_URL}/invite/${token}`;
  }, [token]);

  return (
    <div style={{ padding: 40 }}>
      <h2>Processing invitation...</h2>
      <p>Please wait.</p>
    </div>
  );
}
