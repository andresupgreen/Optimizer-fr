import React, { useContext, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { SideMenu } from './SideMenu';
import { useNavigate } from 'react-router-dom';
import { ManageContext } from '../index.js';

import './successmessage.css';

export const SuccessMessage = () => {
  const navigate = useNavigate();
  const { updateLastTableElement } = useContext(ManageContext);

  useEffect(() => {
    updateLastTableElement();
  }, [updateLastTableElement]);

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
          <h1>PROJECT SUCCESSFULLY CREATED</h1>
          <h4>Return to<button id='success_page_btn' onClick={goToDashboard}>Dashboard</button></h4>
        </Col>
      </Row>
    </Container>

  )

}