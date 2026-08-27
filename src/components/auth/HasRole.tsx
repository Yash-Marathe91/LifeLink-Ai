'use client';

import React from 'react';
import { useAuth } from '@/context/AuthContext';

interface HasRoleProps {
  requiredRole: string | string[];
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

export const HasRole: React.FC<HasRoleProps> = ({ requiredRole, fallback = null, children }) => {
  const { user, hasRole } = useAuth();

  if (!user) {
    return <>{fallback}</>;
  }

  const rolesToCheck = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
  const isAllowed = rolesToCheck.some((role) => hasRole(role));

  if (!isAllowed) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};
