import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function NotFoundPage() {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center">
      <p className="p-8 text-center text-5xl font-semibold">
        404: Not Found! <br />
        There&apos;s nothing here...
      </p>
      <button onClick={() => navigate('/')} className="btn btn-primary">
        Back to Home
      </button>
    </div>
  );
}
