import React, { useContext, useState, useRef } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { ManageContext } from '../index.js';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import ClearIcon from '@mui/icons-material/Clear';
import HelpIcon from '@mui/icons-material/Help';
import { Chart as ChartJS } from 'chart.js/auto';
import { Bar } from 'react-chartjs-2';

import './loadprofile.css';
import Popup from 'reactjs-popup';

const billData = [
  { id: 0, startDate: 'mm/dd/yyyy', endDate: 'mm/dd/yyyy', billMonth: 0, billedDays: '', consumption: '' }
];

export const LoadProfile = () => {
  const { projectLocation, handleElectricalLoadInfo, electricalLoadInfo } = useContext(ManageContext);
  const [startDates, setStartDates] = useState([]);
  const [endDates, setEndDates] = useState([]);
  const [energyBills, setEnergyBills] = useState(billData);
  const [billId, setBillId] = useState(energyBills.length);
  const [annualConsumption, setAnnualConsumption] = useState(0);
  const [consumptionValues, setConsumptionValues] = useState([]);
  const [hover, setHover] = useState(false);
  const monthOfBill = useRef(0);

  // Handle hover over information dialog
  const onHover = () => {
    setHover(true);
  }

  const onLeave = () => {
    setHover(false);
  }

  // Validate date range selected by user
  const incorrectDateRange = (startDate, endDate) => {
    if (Date.parse(startDate) >= Date.parse(endDate)) {
      return true;
    }
  }

  // Get the difference in days between start and end date
  const dateDifference = (id) => {
    let date1 = new Date(energyBills[id].startDate);
    let date2 = new Date(energyBills[id].endDate);
    let differenceInTime = date2.getTime() - date1.getTime();

    if (incorrectDateRange(date1, date2)) {
      alert("Invalid date range. Please select the correct start and end date.");
      let rows = energyBills;
      rows[id].billedDays = 0;
      setEnergyBills([...rows]);
    };

    // Take the difference between the dates and divide by milliseconds per day.
    let differenceInDays = differenceInTime / (1000 * 60 * 60 * 24);

    // Round to nearest whole number to deal with DST.
    return Math.round(differenceInDays);
  }

  // Handle start date input
  const changeStartDate = (event, id) => {
    let date = event.target.value;
    let selectedDate = new Date(date + 'T03:24:00');
    monthOfBill.current = selectedDate.getMonth();

    let rows = energyBills
    rows[id].startDate = event.target.value;
    rows[id].billedDays = dateDifference(id);
    rows[id].billMonth = monthOfBill.current;

    if (rows[id].billedDays < 0) {
      rows[id].billedDays = 0;
    }
    setEnergyBills([...rows]);

    let dates = startDates;
    dates[id] = event.target.value;
    setStartDates(dates);
  }

  // Handle end date input
  const changeEndDate = (event, id) => {
    let rows = energyBills;
    rows[id].endDate =  event.target.value;
    rows[id].billedDays = dateDifference(id);
    
    if (rows[id].billedDays < 0) {
      rows[id].billedDays = 0;
    }
    setEnergyBills([...rows]);

    let dates = endDates;
    dates[id] = event.target.value;
    setEndDates(dates);
  }
  
  const handleConsumption = (event, id) => {
    let rows = energyBills;
    rows[id].consumption = event.target.value;
    setEnergyBills(rows);

    // Store consumption values from energy bills
    let values = consumptionValues;
    values[rows[id].billMonth] = event.target.value;
    setConsumptionValues(values);

    // Calculate annual consumption
    let annualSum = 0;
    for (let bill = 0; bill < energyBills.length; bill++) {
      annualSum = Number(annualSum) + Number(energyBills[bill].consumption);
    }
    setAnnualConsumption(annualSum);
  }

  const addBill = () => {
    let rows = energyBills;
    let numberOfBills = energyBills.length;
    if (numberOfBills < 12) {
      rows.push({ id: billId, startDate: 'mm/dd/yyyy', endDate: 'mm/dd/yyyy', billMonth: 0, billedDays: '', consumption: '' });
      setEnergyBills(rows);
    }
    setBillId(numberOfBills + 1);
  };

  const deleteBill = (id) => {
    let rows = energyBills;
    let numberOfBills = energyBills.length;
    let values = consumptionValues;
    let annualSum = annualConsumption;

    if (numberOfBills > 1) {
      setBillId(numberOfBills - 1);
      
      // Decrease annual consumption on removal of bill 
      annualSum = annualSum - values[rows[id].billMonth];
      setAnnualConsumption(annualSum);

      // Remove bar from graph on removal of bill
      values[rows[id].billMonth] = 0;
      setConsumptionValues(values);

      // Delete bill row from table
      rows.splice(id, 1);
      for (let i = 1; i <= rows.length; i++) {
        rows[i].id = i;
      }
      setEnergyBills(rows);
    }
  }

  if (isNaN(annualConsumption)) {
    setAnnualConsumption(0);
  }

  // Build graph of electricity consumption
  const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false
      },
    },
    scales: {
      yAxes: {
        grid: {
          display: false,
          borderColor: 'white'
        },
        title: {
          display: true,
          text: 'kWh',
          
        }
      },
      xAxes: {
        grid: {
          display: false,
          borderColor: 'white'
        },
        title: {
          display: true,
          text: 'Billing period'
        }
      },
    }  
  };

  const data = {
    labels,
    datasets: [
      {
        label: 'Energy Consumption',
        data: consumptionValues,
        yAxisID: 'yAxes',
        xAxisID: 'xAxes',
        backgroundColor: '#5cf0aa',
        borderColor: 'black',
        borderWidth: 1
      },
    ],
  };
  
  return (
    <Container fluid>
      <Row className='create_project_subheader'>
        <Col>
          <h4>Electrical Load</h4>
        </Col>
        <Col className='right_col_header'>
          <button id='save_btn'>SAVE</button>
        </Col>
      </Row>

      <Row className='bottom_margin'>
        <Col md={3}>
          <label htmlFor='meter_id'>Meter ID</label>
          <input type='text' placeholder='' id='meter_id' className='basic_info' name='meterId' value={electricalLoadInfo.meterId} onChange={(event) => {handleElectricalLoadInfo(event)}} required></input>
        </Col>
        <Col md={4}>
          <label htmlFor='meter_location'>Meter Location</label>
          <input type='text' defaultValue={projectLocation} id='meter_location' className='basic_info' required></input>
        </Col>
      </Row>

      <Row>
        <Col md={2}>
          <h5><ArrowRightIcon />Load Profile</h5>
        </Col>
        <Col>
          <button id='add_load_profile'><AddCircleOutlineIcon id='add_icon'/>UPLOAD LOAD PROFILE</button>
          <button onMouseEnter={onHover} id='info_btn'><HelpIcon id='help_icon'/></button>
          <Popup className='info_popup' open={hover} onClose={onLeave}> 
            <p className='info_dialog_text'>Please upload one year (January through December) of hourly in kW. NOTE - do not include commas in numeric data.</p>
            <p className='info_dialog_text'>The file should be formatted as a column of 8760 rows. If the available data is for a leap year, delete the data for December 31 to shorten the file length to 8,760</p>
            <p className='info_dialog_text'><b>This upload is required if the percent or build options are not chosen.</b></p>
          </Popup> 
        </Col>
      </Row>
      <Row className='bottom_margin'>
        <Col md={2}></Col>
        <Col>
          <a id='sample_load_profile' href="https://docs.google.com/spreadsheets/d/e/2PACX-1vQt3aq_z6ZpbcOe5Jceann6rEvkIp8n7bIEycbRzA3PnWGe0nXWUrHz2S_EZzEbKAJZriBSjMQQCPAB/pub?gid=1574748480&single=true&output=csv" download>Sample load profile</a>    
        </Col>
      </Row>

      <Row className='bottom_margin'>
        <Col md={3} className='left_padding'>
          <label htmlFor='load_profile_name'>Load Profile Name</label>
          <input type='text' id='load_profile_name' className='basic_info' name='loadProfileName' value={electricalLoadInfo.loadProfileName} onChange={(event) => {handleElectricalLoadInfo(event)}} required></input>      
        </Col>
        <Col md={3}>
          <label htmlFor="facility_type">Facility Type</label>
            <select id="facility_type" name="facilityType" value={electricalLoadInfo.facilityType} onChange={(event) => {handleElectricalLoadInfo(event)}}className='basic_info'>
              <option value="House">House</option>
              <option value="Small Office">Small Office</option>
              <option value="Medium Office">Medium Office</option>
              <option value="Warehouse">Warehouse</option>
              <option value="Stand-alone Retail">Stand-alone Retail</option>
              <option value="Strip Mall">Strip Mall</option>
              <option value="Primary School">Primary School</option>
              <option value="Secondary School">Secondary School</option>
              <option value="Supermarket">Supermarket</option>
              <option value="Quick Service Restaurant">Quick Service Restaurant</option>
              <option value="Full Service Restaurant">Full Service Restaurant</option>
              <option value="Hospital">Hospital</option>
              <option value="Outpatient Health Care">Outpatient Health Care</option>
              <option value="Small Hotel">Small Hotel</option>
              <option value="Large Hotel">Large Hotel</option>
              <option value="Midrise Apartment">Midrise Apartment</option>
            </select>       
        </Col>
        <Col md={3}>
        <label htmlFor="weather_type">Weather Type</label>
            <select id="weather_type" name="weatherType" className='basic_info' value={electricalLoadInfo.weatherType} onChange={(event) => {handleElectricalLoadInfo(event)}}>
              <option value="House">Hot-humid</option>
              <option value="Small Office">Mixed-humid</option>
              <option value="Medium Office">Hot-dry</option>
              <option value="Warehouse">Mixed-dry</option>
              <option value="Stand-alone Retail">Cold</option>
              <option value="Strip Mall">Very Cold</option>
              <option value="Primary School">Subarctic</option>
              <option value="Secondary School">Marine</option>
            </select>  
        </Col>
      </Row>

      <Row className='bottom_margin'>

        <Col className='left_padding'>
          <table id='energy_bill_table'>
            <tr>
              <th>BILL</th>
              <th>PERIOD</th>
              <th>BILLED DAYS</th>
              <th>CONSUMPTION</th>
            </tr>
            {energyBills.map((bill) => {
              return (
                <tr key={bill.id}>
                  <td>#{bill.id + 1}</td>
                  <td>
                    <label for="start_date" className='inline_block'>Start date:</label>
                    <input type="date" id="start_date" className='inline_block' defaultValue='mm/dd/yyyy' onChange={(event) => changeStartDate(event, bill.id)}></input>
                    <label for="end_date" className='inline_block'>End date:</label>
                    <input type="date" id="end_date" className='inline_block' defaultValue='mm/dd/yyyy' onChange={(event) => changeEndDate(event, bill.id)}></input>
                  </td>
                  <td><input type='number' min='0' id='bill_days' value={bill.billedDays}></input></td>
                  <td><input type='number' min='0' id='bill_consumption' onChange={(event) => handleConsumption(event, bill.id)}></input> kWh</td>
                  { energyBills.length > 1 && <td id='delete_bill_row'><button id='delete_bill_btn' onClick={() => deleteBill(bill.id)}><ClearIcon /></button></td> }
                </tr>
              )
            })}
          </table>
        </Col>
      </Row>
      <Row className='bottom_margin'>
        <button id='add_bill' onClick={addBill}><AddCircleOutlineIcon id='add_icon'/>ADD BILL</button>  
      </Row>
      <Row className='bottom_margin'>
        <p id='annual_usage'>Annual Usage: {annualConsumption} kWh</p>
        <Bar options={options} data={data} className='left_padding' />
      </Row>
    </Container>
  )

}