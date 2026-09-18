import React from 'react';
import { Navbar } from './Navbar';
import { HealthResponse } from '../types';

interface HeaderProps {
  health: HealthResponse | null;
}

export const Header: React.FC<HeaderProps> = ({ health }) => {
  return <Navbar health={health} />;
};
