import React, { useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import search_icon from '../assets/search-icon.png';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { TablePagination } from 'react-pagination-table';

import './dashboard.css';
import { SideMenu } from './SideMenu';

export const Dashboard = (props) => {

  const [search, setSearch] = useState('');
  const [selectedStage, setSelectedStage] = useState('');
  const { t } = useTranslation();
  const navigate = useNavigate();

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

  if (selectedStage === 'stage' && search !== '') {
    filterProjectTable = item => item.projectName.toLowerCase().match(search.toLowerCase());
  }

  let filteredProjects = props.projectData.filter(filterProjectTable);

  // Reset table filter on selecting default value
  if (selectedStage === 'stage' && search === '') {
    filteredProjects = props.projectData;
  }

  // Redirect to create project page
  const createProject = () => {
    if (props.userData.creationRights === 'TRUE') {
      navigate("/dashboard/create-project");
    }
    else {
      alert('Access Denied: This feature requires creation rights');
    }
  }
  
  return (
    <Container fluid id='dashboard_page'>
      <Row id='dashboard'>
        <Col md={2} id='dashboard_menu'>
          <SideMenu />
        </Col>
        
        <Col md={10} id='dashboard_table'>
          <Row>
            <Col id='search_section'>
              <input id='search_dashboard' type='text' placeholder={t('search_projects')} onChange={handleSearch} />
              <button type='submit' id='search_btn_dashboard'><img src={search_icon} id='search_img' alt='magnifying glass'></img></button>         
            </Col>
            <Col id='filter_section'>
              <select name='stages' id='stages' defaultValue='stage' onChange={handleStageFilter}>
                <option value='stage'>{t('stage')}</option>
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

          <button id='create_project_btn' onClick={createProject}><AddCircleIcon id='add_icon' />{t('create_new_project')}</button>
        </Col>
      
      </Row>
    </Container>
  )
}