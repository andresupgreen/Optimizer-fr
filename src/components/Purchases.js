import React, { useEffect, useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import search_icon from '../assets/search-icon.png';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import { TablePagination } from 'react-pagination-table';

import './dashboard.css';
import { SideMenu } from './SideMenu';

export const Purchases = (props) => {
  const [search, setSearch] = useState('');
  const [selectedStage, setSelectedStage] = useState('');
  const { t } = useTranslation();

  useEffect(() => {
    props.getPurchaseOrders();
  }, []);

  const handleSearch = (event) => {
    setSearch(event.target.value);
  }

  const handleStatusFilter = (event) => {
    setSelectedStage(event.target.value);
  }

  // Filter table data based on project or stage
  let filterPurchaseOrderTable = item =>
    (item.projectName
      .toLowerCase()
      .match(search.toLowerCase()) &&
    item.status
      .toLowerCase()
      .match(selectedStage)) || 
    (item.purchaseOrderNumber
      .toLowerCase()
      .match(search.toLowerCase()) &&
    item.status
      .toLowerCase()
      .match(selectedStage));

  if (selectedStage === 'any' && search !== '') {
    filterPurchaseOrderTable = item => item.projectName.toLowerCase().match(search.toLowerCase());
  }

  let filteredPurchaseOrders = props.purchaseOrderData.filter(filterPurchaseOrderTable);

  // Reset table filter on selecting default value
  if (selectedStage === 'any' && search === '') {
    filteredPurchaseOrders = props.purchaseOrderData;
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
              <input id='search_dashboard' type='text' placeholder='Search by PO number or project name' onChange={handleSearch} />
              <button type='submit' id='search_btn_dashboard'><img src={search_icon} id='search_img' alt='magnifying glass'></img></button>         
            </Col>
            <Col id='filter_section'>
              <label className='inline_block' id='stage_label'>Status</label>
              <select name='status' id='stages' defaultValue='any' onChange={handleStatusFilter}>
                <option value='any'>Any</option>
                <option value='sent'>Sent</option>
                <option value='pending'>Pending Fulfillment</option>
                <option value='backorder'>Backorder</option>
                <option value='shipped out'>Shipped out</option>
                <option value='delivered'>Delivered</option>
                <option value='billed'>Billed</option>
              </select>
            </Col>
          </Row>

          <TablePagination
            headers={ ['Submission Date', 'PO Number', 'Project Name', 'Supplier', 'Status', 'Total Cost', 'Actions'] }
            data={ filteredPurchaseOrders }
            columns="submissionDate.purchaseOrderNumber.projectName.supplier.status.totalCost.actions"
            perPageItemCount={ 5 }
            totalCount={ filteredPurchaseOrders.length }
            nextPageText={<ArrowForwardIcon />}
            prePageText={<ArrowBackIcon />}
          />
        </Col>
      
      </Row>
    </Container>
  )
}