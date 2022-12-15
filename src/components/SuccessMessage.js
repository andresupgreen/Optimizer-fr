import React, { useContext, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { SideMenu } from './SideMenu';
import { useNavigate } from 'react-router-dom';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import HomeIcon from '@mui/icons-material/Home';
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

  const goToPurchases = () => {
    navigate('/dashboard/purchases/in-process');
  }

  return (
    <Container fluid>
      <Row>
        <Col md={2} id='dashboard_menu'>
          <SideMenu />
        </Col>
        <Col md={10} id='success_message_page'>
          <h1>WE'VE RECEIVED YOUR PURCHASE ORDER!</h1>
          <p id='purchase'>Thank you for using Lummify. You have submitted the PO # LUM-SOLST-1235 Jane. <br></br>Visit your Purchase Orders page to check the progress of your order.</p>

          <div className='inline_block success_page_div'>
            <button className='success_page_btn' onClick={goToPurchases}><ShoppingCartIcon id='add_icon' />View Purchase Orders</button>
          </div>
          <div className='inline_block success_page_div'>
            <button className='success_page_btn' onClick={goToDashboard}><HomeIcon id='add_icon' />Return to Dashboard</button>
          </div>
        </Col>
      </Row>
    </Container>

  )

}