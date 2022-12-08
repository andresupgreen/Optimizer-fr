import React, { useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import search_icon from '../assets/search-icon.png';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { TablePagination } from 'react-pagination-table';

import './supplierdashboard.css';
import { SideMenu } from './SideMenu';

export const SupplierDashboard = (props) => {

  const [search, setSearch] = useState('');
  const [selectedStage, setSelectedStage] = useState('');
  const { t } = useTranslation();
  const navigate = useNavigate();

  // Get the product data on page render
  useEffect(() => {
    props.getProducts();
  }, []);

  const handleSearch = (event) => {
    setSearch(event.target.value);
  }

  const handleStageFilter = (event) => {
    setSelectedStage(event.target.value);
  }

  // Filter table data based on project or stage
  let filterProjectTable = item =>
    item.projectName
      .toLowerCase()
      .match(search.toLowerCase()) &&
    item.stage
      .toLowerCase()
      .match(selectedStage);

  if (selectedStage === 'any' && search !== '') {
    filterProjectTable = item => item.projectName.toLowerCase().match(search.toLowerCase());
  }

  let filteredProjects = props.projectData.filter(filterProjectTable);

  // Reset table filter on selecting default value
  if (selectedStage === 'any' && search === '') {
    filteredProjects = props.projectData;
  }

  return (
    <Container fluid id='dashboard_page'>
      <Row id='dashboard'>
        <Col md={2} id='dashboard_menu'>
          <SideMenu />
        </Col>
        
        <Col md={10} id='dashboard_table' className='bottom_margin'>
          <Row>
            <Col id='search_section'>
              <input id='search_dashboard' type='text' placeholder={t('search_projects')} onChange={handleSearch} />
              <button type='submit' id='search_btn_dashboard'><img src={search_icon} id='search_img' alt='magnifying glass'></img></button>         
            </Col>
            <Col id='filter_section'>
              <label className='inline_block' id='stage_label'>Stage</label>
              <select name='stages' id='stages' defaultValue='any' onChange={handleStageFilter}>
                <option value='any'>Any</option>
                <option value='new'>New</option>
                <option value='offered'>Offered</option>
                <option value='planning'>Planning</option>
                <option value='design'>Design</option>
                <option value='procurement'>Procurement</option>
                <option value='commissioned'>Commissioned</option>
                <option value='lost'>Lost</option>
                <option value='postponed'>Postponed</option>
              </select>
            </Col>
          </Row>

          <TablePagination
            headers={ [t('type'), t('project_name'), t('address'), t('contact'), t('stage'), t('actions')] }
            data={ filteredProjects }
            columns="projectType.projectName.address.contactName.stage.actions"
            perPageItemCount={ 5 }
            totalCount={ filteredProjects.length }
            nextPageText={<ArrowForwardIcon />}
            prePageText={<ArrowBackIcon />}
          />

          <button id='invite_customer_btn'>INVITE CUSTOMERS</button>
        </Col>
      </Row>
    </Container>
  )
}