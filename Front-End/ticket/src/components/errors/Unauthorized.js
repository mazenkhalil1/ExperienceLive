import React from 'react';
import { Link } from 'react-router-dom';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

export default function Unauthorized() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        <div>
          <ExclamationTriangleIcon className="mx-auto h-12 w-12 text-yellow-400" />
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Access Denied
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            You don't have permission to access this page.
          </p>
        </div>
        <div className="space-y-4">
          <Link
            to="/"
            className="btn-primary w-full"
          >
            Return to Home
          </Link>
          <Link
            to="/login"
            className="btn-secondary w-full"
          >
            Sign in with a different account
          </Link>
        </div>
      </div>
    </div>
  );
} 