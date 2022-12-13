import React, { useContext, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { SideMenu } from './SideMenu';
import { useNavigate } from 'react-router-dom';
import { ManageContext } from '../index.js';
import HomeIcon from '@mui/icons-material/Home';

import './successmessage.css';

export const UploadProductSuccess = () => {
  const navigate = useNavigate();
  const { updateLastTableElement } = useContext(ManageContext);

  const goToDashboard = () => {
    navigate('/dashboard');
  }

  return (
    <Container fluid>
      <Row>
        <Col md={2} id='dashboard_menu'>
          <SideMenu />
        </Col>
        <Col md={10} id='success_message_page'>
          <h1>PRICE LIST UPLOADED SUCCESSFULLY!</h1>
          <p>Your price list has been uploaded. It is currently under review. <br></br>You will receive an email when the information is validated and approved by a member of the Lummify team.</p>
          <br></br>
          <button className='success_page_btn' onClick={goToDashboard}><HomeIcon id='add_icon' />Return to Dashboard</button>
        </Col>
      </Row>
    </Container>

  )

}