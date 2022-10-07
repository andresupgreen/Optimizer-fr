import React, { useContext, useEffect, useRef, useState } from 'react';
import StepProgressBar from './stepper/Stepper';
import { ProjectInformation } from './ProjectInformation';
import { EnergyUse } from './EnergyUse';
import { Optimization } from './Optimization';
import { Results } from './Results';
import { ManageContext } from '../index.js';
import { useNavigate } from 'react-router-dom';

import 'react-step-progress/dist/index.css';
import './stepprogress.css';
import { PurchaseOrder } from './PurchaseOrder';

export const StepProgress = (props) => {
  const { addNewProject, projectName, projectLocation } = useContext(ManageContext);
  const navigate = useNavigate();
  const [isStepValid, setIsStepValid] = useState(false);
  const isValid = useRef(isStepValid);
  isValid.current = isStepValid;

  // setup the step content
  const step1Content = <ProjectInformation latitude={props.latitude} longitude={props.longitude} />;
  const step2Content = <EnergyUse />;
  const step3Content = <Optimization />;
  const step4Content = <Results />;
  const step5Content = <PurchaseOrder />;

  useEffect(() => {
    if (projectName !== '' && projectLocation !== '') {
      setIsStepValid(true);
    }
  }, [projectName, projectLocation]);

  function step1Validator() {
    if (isValid.current === false) {
      alert("Please fill in the required fields");
    }
    return isValid.current;
  }

  function step2Validator() {
    return true;
  }

  function step3Validator() {
    return true;
  }

   function step4Validator() {
    return true;
   }

  function onFormSubmit() {
    addNewProject();
    navigate('/dashboard/create-project/success');
  }

  return (
    <StepProgressBar
      startingStep={0}
      onSubmit={onFormSubmit}
      steps={[
        {
          label: 'Project Info',
          name: 'step 1',
          content: step1Content,
          validator: step1Validator
        },
        {
          label: 'Energy Use',
          name: 'step 2',
          content: step2Content,
          validator: step2Validator
        },
        {
          label: 'Optimization',
          name: 'step 3',
          content: step3Content,
          validator: step3Validator
        },
        {
          label: 'Results',
          name: 'step 4',
          content: step4Content,
          validator: step4Validator
        },
        {
          label: 'Purchase',
          name: 'step 5',
          content: step5Content
        }
      ]}
      wrapperClass={'step_progress_section'}
      contentClass={'step_progress_content'}
      primaryBtnClass={'step_progress_primary'}
      secondaryBtnClass={'step_progress_secondary'}
    />
  )

}

