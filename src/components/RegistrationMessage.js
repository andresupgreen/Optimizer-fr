import React, { useContext } from 'react';
import { Container, Row } from 'react-bootstrap';
import { ManageContext } from '../index.js';

import './registrationmessage.css';

export const RegistrationMessage = () => {
  const { accountType } = useContext(ManageContext);

  return (
    <Container fluid id='registration_success_page'>
      <Row id='registration_success_message'>
        <h2 className='bottom_margin' id='registration_success_title'>Your account has been created!</h2>
        <p className='bottom_margin' id='registration_success_text'>You have registered as a {accountType}.</p>
        <p className='bottom_margin' id='registration_success_text'>Your registration is currently being processed. Once completed, our team will contact <br></br>you on how to get started with Lummify.</p>
        <a href='/'>Return to homepage</a>
      </Row>
    </Container>

  )

}