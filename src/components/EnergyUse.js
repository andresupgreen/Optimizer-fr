import React from 'react';
import { EnergyRates } from './EnergyRates';
import { LoadProfile } from './LoadProfile';

export const EnergyUse = () => {

  return (
    <div>
      <LoadProfile />
      <EnergyRates />
    </div>
  )

}