import React, { useContext, useEffect, useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import GooglePlacesAutocomplete from 'react-google-places-autocomplete';
import { ManageContext } from '../index.js';

import './energyrates.css'

export const EnergyRates = () => {
  const [utilityRates, setUtilityRates] = useState([]);
  const [existingEnergyRate, setExistingEnergyRate] = useState("");
  const [energyRateStructure, setEnergyRateStructure] = useState([]);
  const [energyWeekdaySchedule, setEnergyWeekdaySchedule] = useState([]);
  const [energyWeekendSchedule, setEnergyWeekendSchedule] = useState([]);
  const [value, setValue] = useState('');
  const [regionState, setRegionState] = useState('');
  const [regionCountry, setRegionCountry] = useState('');
  const { handleEnergyRatesInfo, energyRatesInfo } = useContext(ManageContext);

  // Get utility rates from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://api.openei.org/utility_rates?version=7&format=json&api_key=WyItnQ1n8Zup5gtGpgMGgzag4Nk1GY0o4x5SQdLn&detail=full');
        const data = await response.json();

        // Add utility rates to array
        let rates = []
        
        for (let i = 0; i < data.items.length; i++) {
          if (data.items[i] !== undefined) {
            rates[i] = {
              name: data.items[i].utility + " " + data.items[i].name, 
              ratestructure: data.items[i].energyratestructures,
              weekdayschedule: data.items[i].energyweekdayschedule,
              weekendschedule: data.items[i].energyweekendschedule
            };
          }          
        }
        setUtilityRates(rates);
        
      } catch(err) {
        console.log(err);
      }
    }
    fetchData();
  }, []);

  // Get latitude and longitude based on state,city filter
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`https://api.opencagedata.com/geocode/v1/json?q=${value.label}&key=9e71eaa7b6e745609d665a2284c23762`);
        const data = await response.json();

        setRegionState(data.results[0].components.state);
        setRegionCountry(data.results[0].components.country);

      } catch(err) {
        console.log(err);
      }
    }
    fetchData();
  }, [value.label]);
  
  // Get utility rates based on location
  useEffect(() => {
    const fetchData = async () => {
      
      try {
        let response = {};

        // Display all Colombian rates when filtered to a Colombian location
        if (regionCountry === 'Colombia') {
          response = await fetch(`https://api.openei.org/utility_rates?&country=COL&version=7&format=json&api_key=WyItnQ1n8Zup5gtGpgMGgzag4Nk1GY0o4x5SQdLn&detail=full`);       
        }
        // Display Quebec rates when filtered to a Quebec location
        else if (regionState === 'Quebec') {
          response = await fetch(`https://api.openei.org/utility_rates?&ratesforutility=Hydro%20Quebec&version=7&radius=25&format=json&api_key=WyItnQ1n8Zup5gtGpgMGgzag4Nk1GY0o4x5SQdLn&detail=full`);          
        }
        else {
          response = await fetch(`https://api.openei.org/utility_rates?&address=${value.label}&version=7&radius=25&format=json&api_key=WyItnQ1n8Zup5gtGpgMGgzag4Nk1GY0o4x5SQdLn&detail=full`);
        }

        const data = await response.json();

        // Add utility rates to array
        let rates = [];

        for (let i = 0; i < data.items.length; i++) {
          if (data.items[i] !== undefined) {
            rates[i] = {
              name: data.items[i].utility + " " + data.items[i].name, 
              ratestructure: data.items[i].energyratestructure,
              weekdayschedule: data.items[i].energyweekdayschedule,
              weekendschedule: data.items[i].energyweekendschedule
            };
          }
        }
        setUtilityRates(rates);

      } catch(err) {
        console.log(err);
      }
    }
    fetchData();
  }, [value, regionCountry, regionState]);

  // Get value of selected existing electricty rate
  const handleElectricityRate = (event) => {
    setExistingEnergyRate(event.target.value);
  }

  // Filter Utility Rates data to get required data for user selected rate
  useEffect(() => {
    let energyRateData = utilityRates.filter(rate => rate.name === existingEnergyRate);
    if (existingEnergyRate !== '') {
      setEnergyRateStructure(energyRateData[0].ratestructure);
      setEnergyWeekdaySchedule(energyRateData[0].weekdayschedule);
      setEnergyWeekendSchedule(energyRateData[0].weekendschedule);
    }
  }, [existingEnergyRate]);

  return (
    <Container fluid>
      <Row className='create_project_subheader'>
        <Col>
          <h4>Energy Rates</h4>
        </Col>
        <Col className='right_col_header'>
          <button id='save_btn'>SAVE</button>
        </Col>
      </Row>

      <Row className='bottom_margin'>
        <Col lg={3}>
          <label htmlFor='comp_mechanism'>Compensation Mechanism</label>
          <select type='text' id='comp_mechanism' className='basic_info' name='compensationMechanism' value={energyRatesInfo.compensationMechanism} onChange={(event) => {handleEnergyRatesInfo(event)}} required>
            <option value='net metering'>Net Energy Metering</option>
            <option value='net billing'>Net Billing</option>
            <option value='buy sell all'>Buy all / Sell all</option>
            <option value='n/a'>N/A</option>
          </select>
        </Col>
        <Col lg={4}>
          <label htmlFor='comp_rate'>Compensation Rate for net excess</label>
          <input type='number' min='0' id='comp_rate' className='basic_info' name='compensationRate' value={energyRatesInfo.compensationRate} onChange={(event) => {handleEnergyRatesInfo(event)}} required></input> $/kWh
        </Col>
      </Row>

      <Row>
        <h5><ArrowRightIcon />Existing Energy Rates</h5>
      </Row>

      <Row className='left_padding'>
        <Col lg={3}>
          <label htmlFor='filter'>Filter</label>
          <GooglePlacesAutocomplete 
          selectProps={{
            value,
            onChange: setValue,
            placeholder: 'Address, City, State/Province',
            styles: {
              input: (provided) => ({
                ...provided,
                color: 'black',
                padding: '5px 0px',
              }),
              option: (provided) => ({
                ...provided,
                color: 'black',
              }),
              singleValue: (provided) => ({
                ...provided,
                color: 'black',
              }),
              control: (base) => ({
                ...base,
                '&:hover': { borderColor: 'black' }, 
                border: '1px solid black', 
                boxShadow: 'none',
            }),
            },
          }}
        />      
        </Col>
        <Col lg={8}>
          <label htmlFor='existing_electricity_rate'>Existing Electricity Rate</label>
          <select id='existing_electricity_rate' name='existing_electricity_rate' className='basic_info' onChange={handleElectricityRate}>
          {utilityRates.map(rate => {
            return (
              <option value={rate.name}>{rate.name}</option>
            )
          })}
          </select>
        </Col>
      </Row>
    </Container>
  )
}