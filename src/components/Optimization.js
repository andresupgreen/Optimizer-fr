import React from 'react';
import { OptimizationParameters } from './OptimizationParameters';
import { OptimizationProperties } from './OptimizationProperties';
import { ManageContext } from '../index.js';

export const Optimization = () => {

  return (
    <div>
      <OptimizationProperties/>
      <OptimizationParameters />
    </div>
  )

}