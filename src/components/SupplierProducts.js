import React, { useEffect, useState, useContext } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { ManageContext } from '../index.js';
import search_icon from '../assets/search-icon.png';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { TablePagination } from 'react-pagination-table';
import { SideMenu } from './SideMenu';

import './supplierproducts.css';

export const SupplierProducts = (props) => {

  const [search, setSearch] = useState('');
  const { getProducts } = useContext(ManageContext);
  const [selectedFilter, setSelectedFilter] = useState('sku');
  const { t } = useTranslation();
  const navigate = useNavigate();

  const updateProducts = () => {
    navigate('/dashboard/products/update');
  }

  const handleSearch = (event) => {
    setSearch(event.target.value);
  }

  const handleFilter = (event) => {
    setSelectedFilter(event.target.value);
  }

  // Filter table data based on project or stage
  let filterProductTable = item =>
    item[selectedFilter]
      .toLowerCase()
      .match(search.toLowerCase());

  let filteredProducts = props.productData.filter(filterProductTable);

  return (
    <Container fluid id='dashboard_page'>
      <Row id='dashboard'>
        <Col md={2} id='dashboard_menu'>
          <SideMenu />
        </Col>
        
        <Col md={10} id='dashboard_table' className='bottom_margin'>
          <Row>
            <Col>
              <button id='update_products_btn' onClick={updateProducts}>UPDATE PRODUCTS</button>
            </Col>
          </Row>
          <Row>
            <Col id='search_section'>
              <input id='search_dashboard' type='text' placeholder={'Search products'} onChange={handleSearch} />
              <button type='submit' id='search_btn_dashboard'><img src={search_icon} id='search_img' alt='magnifying glass'></img></button>         
            </Col>
            <Col id='filter_section'>
              <label className='inline_block' id='stage_label'>Search by:</label>
              <select name='stages' id='stages' defaultValue='sku' onChange={handleFilter}>
                <option value='sku'>SKU</option>
                <option value='mpn'>MPN</option>
                <option value='manufacturerModel'>Manufacturer Model</option>
                <option value='warehouseId'>Warehouse</option>
              </select>
            </Col>
          </Row>

          <TablePagination
            headers={ ['SKU', 'Description', 'MPN', 'Manufacturer Model', 'Price', 'Qty', 'Warehouse', 'Actions'] }
            data={ filteredProducts }
            columns="sku.description.mpn.manufacturerModel.price.quantityInStock.warehouseId.actions"
            perPageItemCount={ 5 }
            totalCount={ props.productData.length }
            nextPageText={<ArrowForwardIcon />}
            prePageText={<ArrowBackIcon />}
          />

          <button id='invite_customer_btn'>INVITE CUSTOMERS</button>
        </Col>
      </Row>
    </Container>
  )
}