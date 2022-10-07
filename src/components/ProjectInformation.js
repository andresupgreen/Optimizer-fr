import React, { useState, useContext, useEffect }  from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { MapComponent } from './MapComponent';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import Popup from 'reactjs-popup';
import { ManageContext } from '../index.js';

import './projectinformation.css'

export const ProjectInformation = () => {
  const [isPopupOpen, setisPopupOpen] = useState(false);

  const [customerFirstName, setCustomerFirstName] = useState('');
  const [customerLastName, setCustomerLastName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerCompanyName, setCustomerCompanyName] = useState('');
  const [customerJobTitle, setCustomerJobTitle] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [customers, setCustomers] = useState([]);
  const [disableInputs, setDisableInputs] = useState([false, false, false, false, false, false, false, false]);
  const [checked, setChecked] = useState(false);
  const [depreciation, setDepreciation] = useState(true);
  const { handleNoGrid, handleLowVoltage, handleMediumVoltage, gridType, handleBasicProjectInfo, basicProjectInfo, handleAdvancedProjectInfo, advancedProjectInfo } = useContext(ManageContext);

  // Get Customer data from database
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/v1/customers');
        const data = await response.json();
        setCustomers(data);
      } catch(err) {
        console.log(err);
      }
    }
    fetchData();
  }, []);

  const addNewCustomer = () => {
    setisPopupOpen(true);
  }

  const closePopup = () => {
    setisPopupOpen(!isPopupOpen);
  }
  
  // Set customer data from user input
  const handleFirstName = (event) => {
    setCustomerFirstName(event.target.value);
  }
  const handleLastName = (event) => {
    setCustomerLastName(event.target.value);
  }
  const handleEmail = (event) => {
    setCustomerEmail(event.target.value);
  }
  const handlePhoneNumber = (event) => {
    setCustomerPhone(event.target.value);
  }
  const handleCompanyName = (event) => {
    setCustomerCompanyName(event.target.value);
  }
  const handleJobTitle = (event) => {
    setCustomerJobTitle(event.target.value);
  }
  const handleAddress = (event) => {
    setCustomerAddress(event.target.value);
  }
  
  let customerData = {
    firstName: customerFirstName,
    lastName: customerLastName,
    email: customerEmail,
    phoneNumber: customerPhone,
    companyName: customerCompanyName,
    jobTitle: customerJobTitle,
    address: customerAddress
  };
  
  // Send new customer data to database
  const saveCustomer = async (event) => {
    event.preventDefault();
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(customerData)
    };
    const response = await fetch('/api/v1/customers', requestOptions);
    const data = response;
    console.log(data);

    setCustomers([...customers, customerData])
    closePopup();
  }

  // Handle export grid checkbox
  const handleCheckbox = () => {
    setChecked(!checked);
  }

  const handleDepreciation = (event) => {
    if (event.target.value === 'yes') {
      setDepreciation(true);
    }
    else {
      setDepreciation(false);
    }
  }

  // Disable inputs based on grid type 
  useEffect(() => {
    if (gridType === 'none') {
      setDisableInputs([true, true, true, true, true, true, true, true]);
    }
    if (gridType === 'low') {
      setDisableInputs([true, true, true, false, false, false, false, false]);
    }
    if (gridType === 'medium') {
      setDisableInputs([false, false, false, false, false, false, false, false]);
    }
  }, [gridType]);

  console.log(basicProjectInfo);

  return (
    <Container fluid>
          <Row className='create_project_subheader'>
            <Col>
              <h4>Basic Info</h4>
            </Col>
            <Col className='right_col_header'>
              <button id='save_btn'>SAVE</button>
            </Col>
          </Row>
          
          <Row>
            <Col md={4}>
              <label htmlFor='project_name'>Project Name *</label>
              <input type='text' placeholder='' id='project_name' className='basic_info' name='projectName' value={basicProjectInfo.projectName} onChange={(event) => handleBasicProjectInfo(event)} required></input>
            </Col>
            <Col md={4}>
              <label htmlFor="project_type">Project Type *</label>
              <select id="project_type" name="projectType" className='basic_info' value={basicProjectInfo.projectType} onChange={(event) => handleBasicProjectInfo(event)}>
                <option default value='Net Metering'>Net Metering</option>
                <option value='Self-consumption with Backup'>Self-consumption with Backup</option>
                <option value='Off-grid'>Off-grid</option>
                <option value='Microgrid'>Microgrid</option>
                <option value='Energy Storage System (ESS)'>Energy Storage System (ESS)</option>
                <option value='Power Generation'>Power Generation</option>
                <option value='Net Billing'>Net Billing</option>
              </select>            
            </Col>
            <Col md={4}>
              <label htmlFor='project_stage'>Project Stage *</label>
              <select id='project_stage' name='projectStage' className='basic_info' value={basicProjectInfo.projectStage} onChange={(event) => handleBasicProjectInfo(event)}>
                <option default value='New'>New</option>
                <option value='Offered'>Offered</option>
                <option value='Planning'>Planning</option>
                <option value='Design'>Design</option>
                <option value='Procurement'>Procurement</option>
                <option value='Commissioned'>Commissioned</option>
                <option value='Lost'>Lost</option>
                <option value='Postponed'>Postponed</option>
              </select>
            </Col>
          </Row>

          <Row>
            <Col md={5}>
              <label htmlFor="customer">Customer *</label>
              <select id="customer" name="projectContact" className='basic_info' value={basicProjectInfo.projectContact} onChange={(event) => handleBasicProjectInfo(event)}>
                {customers.map(customer => {
                  return (
                    <option key={customer.id} value={customer.firstName + " " + customer.lastName}>{customer.firstName + " " + customer.lastName}</option>
                  )
                }) }
              </select>
              <button id='add_customer_icon' onClick={addNewCustomer}><AddCircleIcon  /> Add new Customer</button>
            </Col>      
          </Row>

          <Popup open={isPopupOpen} closeOnDocumentClick={false}>
            <div>
              <h3>Customer Details</h3>
              <hr></hr>
              <form onSubmit={saveCustomer} method='post'>
                <div className='popup_table'>
                  <div className='popup_cells'>
                    <label htmlFor="fname">First Name *</label>
                    <input type="text" name="fname" className='left_input' required onChange={handleFirstName}></input>
                    <label htmlFor="email">Email *</label>
                    <input type="email" name="email" className='left_input' required onChange={handleEmail}></input>
                    <label htmlFor="company">Company</label>
                    <input type="text" name="company" className='left_input' onChange={handleCompanyName}></input>
                    <label htmlFor="address">Address</label>
                    <input type="text" name="address" onChange={handleAddress}></input>
                  </div>
                  <div className='popup_cells'>
                    <label htmlFor="lname">Last Name *</label>
                    <input type="text" name="lname" required onChange={handleLastName}></input>
                    <label htmlFor="phone">Phone Number *</label>
                    <input type="tel" name="phone" required onChange={handlePhoneNumber}></input>
                    <label htmlFor="job">Job Title</label>
                    <input type="text" name="job" onChange={handleJobTitle}></input>
                  </div>
                </div>

                  <input type="submit" value="Save" id="save_btn_popup"></input>
                  <input type="button" value="Cancel" id="cancel_btn" onClick={closePopup}></input>
              </form>
              </div>
          </Popup>

          <Row className='bottom_margin'>
            <Col md={12}>
              <h5><ArrowRightIcon />Location of the site *</h5>
            </Col>
            <Col md={12}>
              <MapComponent />
            </Col>
          </Row>

          <Row>
            <h5><ArrowRightIcon />Grid Interaction</h5>
          </Row>

          <Row className='bottom_margin'>
            <Col className='left_padding'>
              {gridType === 'none' && <button className='grid_btn' style={{backgroundColor: '#5cf0aa'}}>No Grid Available</button>}
              {gridType !== 'none' && <button className='grid_btn' onClick={handleNoGrid}>No Grid Available</button>}
              {gridType === 'low' && <button className='grid_btn' style={{backgroundColor: '#5cf0aa'}}>Low Voltage</button>}
              {gridType !== 'low' && <button className='grid_btn' onClick={handleLowVoltage}>Low Voltage</button>}
              {gridType === 'medium' && <button className='grid_btn' style={{backgroundColor: '#5cf0aa'}}>Medium Voltage</button>}
              {gridType !== 'medium' && <button className='grid_btn' onClick={handleMediumVoltage}>Medium Voltage</button>}
            </Col>
            <Col>
              <div className='popup_table'>
                <div className='popup_cells'>
                  <input type='radio' id='centralized' className='inline_block' name='inverterType' onChange={(event) => handleBasicProjectInfo(event)} value='centralized' defaultChecked checked={basicProjectInfo.inverterType === 'centralized'} disabled={disableInputs[0]}></input>
                  <label htmlFor='centralized' className='inline_block'>Centralized Inverter</label>
                </div>
                <div className='popup_cells'>
                  <input type='radio' id='decentralized' className='inline_block' name='inverterType' value='decentralized' checked={basicProjectInfo.inverterType === 'decentralized'} onChange={(event) => handleBasicProjectInfo(event)} disabled={disableInputs[1]}></input>
                  <label htmlFor='decentralized' className='inline_block'>Decentralized Inverter</label>
                </div>
              </div>
            </Col>
          </Row>

          <Row className='bottom_margin'>
            <Col md={4} className='left_padding'>
              <label htmlFor='voltage'>Medium Voltage</label>
              <input type='number' step='1' id='voltage' className='stepper_input' name='mediumVoltage' min='1' max='99' value={basicProjectInfo.mediumVoltage} onChange={(event) => handleBasicProjectInfo(event)} disabled={disableInputs[2]}></input> kV
            </Col>
            <Col md={4}>
              <input type="checkbox" name="transformerOwned" id='step_transformer_checkbox' className='inline_block' onChange={(event) => handleBasicProjectInfo(event)} disabled={disableInputs[3]}></input>
              <label htmlFor="stepdown" id='stepdown_label' className='inline_block'>Step-down transformer owned by customer?</label>
            </Col>
            <Col md={3}>
              <label htmlFor='inverter_grid'>Connection Voltage</label>
              <select id='inverter_grid' className='basic_info' name='connectionVoltage' value={basicProjectInfo.connectionVoltage} onChange={(event) => handleBasicProjectInfo(event)} disabled={disableInputs[4]}>
                <option value='1'>1 x 110V</option>
                <option value='2'>1 x 115V</option>  
                <option value='3'>1 x 120V</option>  
                <option value='4'>1 x 220V</option>  
                <option value='5'>1 x 230V</option>  
                <option value='6'>1 x 240V</option>  
                <option value='7'>1 x 110/220V</option>  
                <option value='8'>1 x 115/230V</option>  
                <option value='9'>1 x 120/240V</option>  
                <option value='10'>1 x 208V</option>  
                <option value='11'>3 x 460V</option>  
                <option value='12'>3 x 480V</option>  
                <option value='13'>3 x 550V</option>  
                <option value='14'>3 x 575V</option>  
                <option value='15'>3 x 600V</option>  
                <option value='16'>3 x 120/208V</option>  
                <option value='17'>3 x 277/480V</option>  
              </select>           
            </Col>
          </Row>

          <Row className='bottom_margin'>
            <Col md={4} className='left_padding'>
              <label htmlFor='max_demand'>Maximum Demand from the Grid</label>
              <input type='number' step='1' id='max_demand' className='stepper_input' name='maxDemandFromGrid' min='1' max='99' value={basicProjectInfo.maxDemandFromGrid} onChange={(event) => handleBasicProjectInfo(event)} disabled={disableInputs[5]}></input> kW           
            </Col>
            <Col md={4}>
              <input type="checkbox" id='export_grid_checkbox' className='inline_block' name='exportToGrid' onChange={handleCheckbox} disabled={disableInputs[6]}></input>
              <label htmlFor="export" id='export_grid_label' className='inline_block'>Export to grid if available</label>
            </Col>
            <Col md={3}>
              <label htmlFor='export_limit' >Export Limit (%)</label>
              <input type='number' step='1' id='export_limit' className='stepper_input' name='exportLimit' min='0' max='100' value={basicProjectInfo.exportLimit} onChange={(event) => handleBasicProjectInfo(event)} disabled={!checked}></input>  
            </Col>
          </Row>

          <Row>
            <h4 className='create_project_subheader'>Advanced Info</h4>
          </Row>

          <Row>
            <h5><ArrowRightIcon />Financing</h5>
          </Row>
          <Row className='bottom_margin'>
            <Col md={4} className='left_padding'>
              <label htmlFor='project_life'>Project Life (years)</label>
              <input type='number' step='1' min='1' max='50' name='projectLife' id='project_life' className='basic_info'  value={advancedProjectInfo.projectLife} onChange={(event) => handleAdvancedProjectInfo(event)}></input>   
            </Col>
            <Col md={3}>
              <label htmlFor='financing_type'>Financing Type</label>
              <select id='financing_type' name='financingType' className='basic_info' value={advancedProjectInfo.financingType} onChange={(event) => handleAdvancedProjectInfo(event)}>
                <option default value='loan'>Loan</option>
                <option value='leasing'>Leasing</option>
                <option value='ppa'>PPA</option>
                <option value='cash'>Cash</option>
              </select>
            </Col>
            <Col md={3}>
              <label htmlFor='debt_ratio'>Debt Ratio (%)</label>
              <input type='number' step='1' min='0' max='100' name='debtRatio' value={advancedProjectInfo.debtRatio}id='debt_ratio' className='basic_info' onChange={(event) => handleAdvancedProjectInfo(event)}></input>   
            </Col>
          </Row>
          <Row className='bottom_margin'>
          <Col md={4} className='left_padding'>
            <label htmlFor='escalation_rate'>Escalation Rate of Electricity Price (%)</label>
            <input type='number' step='1' min='0' max='100' name='escalationRate' value={advancedProjectInfo.escalationRate} id='escaltation_rate' className='basic_info' onChange={(event) => handleAdvancedProjectInfo(event)}></input>   
          </Col>
          <Col md={3}>
            <label htmlFor='inflation_rate'>Inflation Rate (%)</label>
            <input type='number' step='1' min='0' max='100' name='inflationRate' value={advancedProjectInfo.inflationRate} id='inflation_rate' className='basic_info' onChange={(event) => handleAdvancedProjectInfo(event)}></input>             
          </Col>
          <Col md={3}>
            <label htmlFor='tax_rate'>Income Tax Rate (%)</label>
            <input type='number' step='1' min='0' max='100' name='incomeTaxRate' value={advancedProjectInfo.incomeTaxRate} id='tax_rate' className='basic_info' onChange={(event) => handleAdvancedProjectInfo(event)}></input>           
          </Col>
          </Row>
          <Row className='bottom_margin'>
          <Col md={4} className='left_padding'>
            <label htmlFor='depreciation'>Depreciation?</label>
            <select id='depreciation' name='depreciation' className='basic_info' onChange={handleDepreciation}>
              <option default value='yes'>Yes</option>
              <option value='no'>No</option>
            </select>          
          </Col>
          <Col md={3}>
            <label htmlFor='depreciation_rate'>Depreciation Rate (%)</label>
            <input type='number' step='1' min='0' max='100' name='depreciationRate' value={advancedProjectInfo.depreciationRate} id='depreciation_rate' className='basic_info' disabled={!depreciation} onChange={(event) => handleAdvancedProjectInfo(event)}></input>               
          </Col>
          </Row>
    </Container>
  )
  

}