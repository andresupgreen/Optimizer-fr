import React, { useEffect, useState, useContext, useRef } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { SideMenu } from './SideMenu';
import { ManageContext } from '../index.js';
import DownloadIcon from '@mui/icons-material/Download';
import * as XLSX from 'xlsx';
import * as Excel from 'exceljs';
import { saveAs } from "file-saver";
import templateFile from '../assets/upload_products_template.xlsx';

import './updatesupplierproducts.css';

export const UpdateSupplierProducts = () => {

  const navigate = useNavigate();
  const { userData } = useContext(ManageContext);
  const [excelFile, setExcelFile] = useState(null);
  const warehouseData = useRef([]);
  const productData = useRef([]);
  const [updatedProductData, setUpdatedProductData] = useState([]);
  const [updatedWarehouseData, setUpdatedWarehouseData] = useState([]);
  const incompleteData = useRef(false);
  const termsAndConditions = `1. NON DISCLOSURE\n2. ACCURACY\n3. DISCLAIM\n4. DATA PROTECTION`;

  // Fetch warehouse data of company and store in excel file
  const getWarehouseData = async () => {
    let businessNumber = await getBusinessNumber();
    let warehouseInfo = [];

    const response = await fetch(`/api/v1/warehouses/${businessNumber}`);
    const data = await response.json();

    for (let i = 0; i < data.length; i++) {
      warehouseInfo[i] = [data[i].warehouseName, data[i].address];
    }
    
    return warehouseInfo;
  }

  const getProductsData = async () => {
    let businessNumber = await getBusinessNumber();
    let productInfo = [];

    const response = await fetch(`/api/v1/products/${businessNumber}`);
    const data = await response.json();

    for (let i = 0; i < data.length; i++) {
      // Get date from ISO 8601 representation
      let date = (data[i].lastUpdated).substring(0, 10);

      let price = (data[i].price).toFixed(2);

      productInfo[i] = [data[i].sku, data[i].manufacturerId, data[i].manufacturerModel, data[i].mpn, data[i].elementId, data[i].description, data[i].minNumberOfUnits, data[i].unitOfMeasure, price, data[i].currencyType, data[i].warehouseId, data[i].quantityInStock, data[i].shippingHeight, data[i].shippingLength, data[i].shippingWidth, data[i].shippingWeight, data[i].unitOfWeight, data[i].deliveryTime, data[i].commercialConditions, data[i].deliveryIncluded, date];
    }

    return productInfo;

  }

  // Fetch data on page render
  useEffect(() => { (async() => {
    // Fetch warehouse data from API endpoint
    let warehouseInfo = await getWarehouseData();
    warehouseData.current = warehouseInfo;

    // Fetch products data from API endpoint
    let productInfo = await getProductsData();
    productData.current = productInfo;
  })(); }, []);

  // Download excel template
  const downloadTemplate = async () => {
    // Fetch and read excel template file
    let productsTemplateFile = await (await fetch(templateFile)).arrayBuffer();

    let workbook = new Excel.Workbook();
    await workbook.xlsx.load(productsTemplateFile)
      .then(() => {
        let warehousesSheet = workbook.getWorksheet('Warehouses');
        let productsSheet = workbook.getWorksheet('Products');

        // Add warehouse data of company to file
        let warehouses = warehouseData.current;
        let NumOfWarehouses = warehouses.length;
        
        if (NumOfWarehouses > 0) {
          for (let i = 0; i < NumOfWarehouses; i++) {
            let row = warehousesSheet.getRow(i + 2);

            row.getCell(1).fill = { 
              type: 'pattern', 
              pattern: 'solid', 
              fgColor: { argb: 'e3f2fd' }, 
            };
            row.getCell(2).fill = { 
              type: 'pattern', 
              pattern: 'solid', 
              fgColor: { argb: 'e3f2fd' }, 
            };

            row.getCell(1).value = warehouses[i][0];
            row.getCell(2).value = warehouses[i][1];

            row.font = { size: 10 };
          }
        }

        // Add product data of company to file
        let products = productData.current;
        let NumOfProducts = products.length;

        if (NumOfProducts > 0) {
          for (let i = 0; i < NumOfProducts; i++) {
            let row = productsSheet.getRow(i + 3);
            
            // Set appropriate value for each column
            row.values = products[i];
            row.alignment = { horizontal: 'left' };
            row.font = { size: 11, name: 'Calibri' };

            for (let col = 1; col <= 21; col++) {
              // Fill data cells with background colour
              row.getCell(col).fill = {
                type: 'pattern', 
                pattern: 'solid', 
                fgColor: { argb: 'e3f2fd' }, 
              };
            };
          } 
        }
      });
    
    const buffer = await workbook.xlsx.writeBuffer();
    const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
    const fileExtension = '.xlsx';

    const blob = new Blob([buffer], {type: fileType});

    saveAs(blob, 'upload_products' + fileExtension);
  }

  const fileHandler = (event) => {
    let selectedFile = event.target.files[0];

    if (selectedFile) {
      let reader = new FileReader();
      reader.readAsArrayBuffer(selectedFile);
      reader.onload = (event) => {
        setExcelFile(event.target.result);
      } 
    }           
  }

  useEffect(() => {
    const readOpts = { // <--- need these settings in readFile options
      cellText: false, 
      cellDates: true,
      type: 'buffer'
    };
    
    const jsonOpts = {
      range: 1,
      blankrows: false,
      raw: false,
      dateNF: 'yyyy-m-d' // <--- need dateNF in sheet_to_json options
    }
    if (excelFile !== null) {
      const workbook = XLSX.read(excelFile, readOpts);

      // Get warehouse data from sheet and convert to JSON
      const worksheetName1 = workbook.SheetNames[1];
      const worksheet1 = workbook.Sheets[worksheetName1];
      const data1 = XLSX.utils.sheet_to_json(worksheet1);
      setUpdatedWarehouseData(data1);

      // Get product data from sheet and convert to JSON
      const worksheetName2 = workbook.SheetNames[2];
      const worksheet2 = workbook.Sheets[worksheetName2];
      const data2 = XLSX.utils.sheet_to_json(worksheet2, jsonOpts);
      setUpdatedProductData(data2);
    }
  }, [excelFile]);

  const getBusinessNumber = async () => {
    let businessNumber = '';

    const response = await fetch(`/api/v1/users/${userData.email}`);
    const data = await response.json();
    // Get business number of user's company 
    businessNumber = data.businessNumber;

    return businessNumber;
  };

  let processedWarehouseData = [];
  const updateWarehouseData = async () => {
    let latitude = 0;
    let longitude = 0;
    let country = '';
    let businessNumber = await getBusinessNumber();

    try {
      const response = await fetch(`/api/v1/companies/${businessNumber}`);
      const data = await response.json();
      // Get company country/region with business number
      country = data.branchOfficeCountry;
    } catch(err) {
      console.log(err);
    }

    if (updatedWarehouseData.length > 0) {
      for (let index = 0; index < updatedWarehouseData.length; index++) {
        let address = updatedWarehouseData[index]['Address'];
        let warehouseName = updatedWarehouseData[index]['Warehouse Name'];

        // Get latitude and longitude of warehouse address(es)
        try {
          await fetch(`https://www.mapquestapi.com/geocoding/v1/address?key=AyGvIJDYzA1lHsy5ijQgyHjL7OKwknYD&location=${address}`)
          .then(response => response.json())
          .then(data => {
            latitude = data.results[0].locations[0].latLng.lat;
            longitude = data.results[0].locations[0].latLng.lng;
          });
        } catch(err) {
          console.log(err);
        }

        processedWarehouseData[index] =  {
          businessNumber: businessNumber,
          latitude: latitude,
          longitude: longitude,
          address: address,
          country: country,
          warehouseName: warehouseName
        }
      }
    }
  }
  let processedProductData = [];
  const updateProductData = async () => {
    let businessNumber = await getBusinessNumber();

    if (updatedProductData.length > 0) {
      for (let index = 0; index < updatedProductData.length; index++) {
        let date = new Date(updatedProductData[index]['Update on'] + 'EST');

        processedProductData[index] =  {
          warehouseId: updatedProductData[index]['Warehouse'],
          elementId: updatedProductData[index]['Category'],
          manufacturerModel: updatedProductData[index]['Manufacturer Model'],
          manufacturerId: updatedProductData[index]['Manufacturer'],
          mpn: updatedProductData[index]['Manufacturer Part Number'],
          description: updatedProductData[index]['Description'],
          minNumberOfUnits: updatedProductData[index]['MOQ (Minimum Order Quantity)'],
          sku: updatedProductData[index]['SKU'],
          unitOfMeasure: updatedProductData[index]['Unit of Measure'],
          price: updatedProductData[index]['Price List'],
          currencyType: updatedProductData[index]['Currency'],
          quantityInStock: updatedProductData[index]['Inventory'],
          shippingHeight: updatedProductData[index]['Shipping Height'],
          shippingLength: updatedProductData[index]['Shipping Length'],
          shippingWidth: updatedProductData[index]['Shipping Width'],
          shippingWeight: updatedProductData[index]['Shipping Weight'],
          unitOfWeight: updatedProductData[index]['Unit of Weight'],
          deliveryTime: updatedProductData[index]['Delivery time within the country (days)'],
          commercialConditions: updatedProductData[index]['Commercial Conditions'],
          deliveryIncluded: updatedProductData[index]['Delivery Included?'],
          lastUpdated: date,
          businessNumber: businessNumber
        }
      }
    }

  }

  useEffect(() => {
    updateWarehouseData();
  }, [updatedWarehouseData]);

  useEffect(() => {
    updateProductData();

    incompleteData.current = false;
    
    // Check for null/undefined required fields in product data
    for (let i = 0; i < updatedProductData.length; i++) {
      if (updatedProductData[i]['SKU'] === undefined || updatedProductData[i]['Manufacturer'] === undefined || updatedProductData[i]['Manufacturer Model'] === undefined || updatedProductData[i]['Category'] === undefined || updatedProductData[i]['MOQ (Minimum Order Quantity)'] === undefined || updatedProductData[i]['Unit of Measure'] === undefined || updatedProductData[i]['Price List'] === undefined || updatedProductData[i]['Currency'] === undefined || updatedProductData[i]['Warehouse'] === undefined || updatedProductData[i]['Inventory'] === undefined || updatedProductData[i]['Delivery Included?'] === undefined || updatedProductData[i]['Update on'] === undefined) {
        incompleteData.current = true;
        console.log(i);
        break;
      }
    }
  }, [updatedProductData]);

  // Delete supplier data from the database
  const deleteSupplierData = async (category) => {
    let businessNumber = await getBusinessNumber();

    const response = await fetch(`/api/v1/${category}/${businessNumber}`, { method: 'DELETE' });
    console.log(response);
  };

  // Store supplier data to database
  const addSupplierData = async (category, data) => {
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    };
    const response = await fetch(`/api/v1/${category}`, requestOptions);
    return response;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (incompleteData.current === true) {
      alert('Please fill in the required fields');
    }
    else {
      // Update warehouse data
      const saveWarehouseData = await addSupplierData('warehouses', processedWarehouseData);
    
      // Update product data 
      const saveProductData = await addSupplierData('products', processedProductData);
      
      if (saveWarehouseData.status === 200 && saveProductData.status === 200) {
        navigate('/dashboard/products/update/success');
      }
      else {
        alert('Unable to update price list. Please try again');
      }
    }
  };

  return (
    <Container fluid id='dashboard_page'>
      <Row id='dashboard'>
        <Col md={2} id='dashboard_menu'>
          <SideMenu />
        </Col>
        
        <Col md={10} className='left_padding bottom_margin'>
          <Row>
            <p className='nav_subtitle'>HOME {'>'} PRODUCTS</p>
          </Row>
          <Row className='bottom_margin'>
            <h5>Step 1. Download the Template</h5>
            <button id='download_template_btn' onClick={downloadTemplate}>
              <DownloadIcon />
              Sample Products Template
            </button>
          </Row>
          <form onSubmit={handleSubmit}>
            <Row className='bottom_margin'>
              <h5>Step 2. Upload New Price List</h5>
              <input type='file' id='upload_pricelist_btn' accept='.xls,.xlsx' onChange={(event) => fileHandler(event)} required>
              </input>
            </Row>
            <Row>
              <h5>Step 3. Submit</h5>
            </Row>
            <Row className='bottom_margin'>
              <div>
                <input type='checkbox' id='terms_conditions' className='registration_checkbox' name='terms_conditions' required></input>
                <label htmlFor='terms_conditions' className='inline_block'>I accept the privacy policies and the following terms and conditions</label>
              </div>
            </Row>
            <Row className='bottom_margin'>
              <div>
                <label id='terms_conditions_label'>TERMS AND CONDITIONS</label>
                <textarea type='text' id='terms_conditions_textbox' value={termsAndConditions} rows='5' cols='100' readOnly></textarea>
              </div>
            </Row>
            <Row>
              <Col lg={1}></Col>
              <Col lg={2}>
                <input type='submit' id='upload_products_btn' value='SUBMIT'></input>
              </Col>
            </Row>
          </form>
        </Col>
      </Row>
    </Container>
  )
}