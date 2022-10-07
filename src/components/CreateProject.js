import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { StepProgress } from "./StepProgress";
import { SideMenu } from './SideMenu';

import './createproject.css'

export const CreateProject = () => {
  return (
    <Container fluid id='create_project_page'>
      <Row>
        <Col md={2} id='dashboard_menu'>
          <SideMenu />
        </Col>
        <Col md={10} id='create_project_section'>
          <StepProgress />
        </Col>
      </Row>
    </Container>
  )
}