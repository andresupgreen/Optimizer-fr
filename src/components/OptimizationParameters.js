import React, { useState, useContext, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import { ManageContext } from '../index.js';

import './optimizationparameters.css';

export const OptimizationParameters = () => {
  const [energyStorage, setEnergyStorage] = useState(false);
  const { gridType, optimizationType, handleROI, handleLCOE, handleInvestment, handleOffset, handleOptimizationParameters, optimizationParameters } = useContext(ManageContext);
  
  // Disable energy storage system (ESS) inputs based on load/generation type
  useEffect(() => {
    if (optimizationParameters.loadGenerationType === 'Net Metering' || optimizationParameters.loadGenerationType === 'Power Generation' || optimizationParameters.loadGenerationType === 'Net Billing') {
      setEnergyStorage(false);
    }
    else {
      setEnergyStorage(true);
    }
  }, [optimizationParameters.loadGenerationType])

  return (
    <Container fluid>
      <Row className='create_project_subheader'>
        <Col>
          <h4>Optimization Parameters</h4>
        </Col>
      </Row>

      <Row>
        <h5><ArrowRightIcon />Load/Generation</h5>
      </Row>
      <Row className='left_padding'>
        <Col lg={6}>
          <label htmlFor='load_generation_type'>Load/Generation Type</label>
          <select type='text' id='load_generation_type' className='basic_info' name='loadGenerationType' value={optimizationParameters.loadGenerationType} onChange={(event) => handleOptimizationParameters(event)} required>
            <option default value='Net Metering'>Net Metering</option>
            <option value='Self-consumption with Backup'>Self-consumption with Backup</option>
            <option value='Off-grid'>Off-grid</option>
            <option value='Microgrid'>Microgrid</option>
            <option value='Energy Storage System (ESS)'>Energy Storage System (ESS)</option>
            <option value='Power Generation'>Power Generation</option>
            <option value='Net Billing'>Net Billing</option>
          </select>
        </Col>
      </Row>

      <Row>
        <h5><ArrowRightIcon />Energy Storage System (ESS)</h5>
      </Row>
      <Row className='left_padding'>
        <Col lg={3}>
          <label htmlFor='ess_coupling'>ESS Coupling</label>
          <select type='text' id='ess_coupling' className='basic_info' name='ess_coupling' disabled={!energyStorage}>
            <option value='ac coupled'>AC Coupled</option>
            <option value='dc coupled'>DC Coupled</option>
            <option value='no preference'>No preference</option>
          </select>
        </Col>
        <Col lg={4}>
          <label htmlFor='load_generation_type'>ESS Charging Requirements</label>
          <select type='text' id='ess_charging_requirements' className='basic_info' name='ess_charging_requirements' disabled={!energyStorage}>
            <option value='only from solar PV'>Only from Solar PV</option>
            <option value='no charging restrictions' disabled={gridType === 'none'}>No charging restrictions</option>
            <option value='minimize TOU cost' disabled={gridType === 'none'}>Minimize TOU Cost (no grid charging)</option>
          </select>
        </Col>
        <Col lg={3}>
          <label htmlFor='hours_autonomy'>Hours Autonomy</label>
          <input type='number' id='hours_autonomy' className='basic_info' min='0' max='36' defaultValue='0' disabled={!energyStorage}></input> hours
        </Col>
      </Row>
      <Row className='left_padding bottom_margin'>
        <table id='ess_table' className='center_items'>
          <tr>
            <th>Control Settings</th>
            <th>Start Hour</th>
            <th>Stop Hour</th>
            <th>Start Month</th>
            <th>Stop Month</th>
            <th>Stop SOC (%)</th>
          </tr>
          <tr>
            <td>
              <div className='inline_block ess_control_leftcol'>
                <p>Charging</p>
              </div>
              <div className='ess_control_rightcol inline_block'>
                <select type='text' id='charging' className='basic_info ess_table_input' name='charging' disabled={!energyStorage}>
                  <option value='from grid and solar'>From Grid and Solar</option>
                  <option value='only from solar'>Only from Solar</option>
                </select>  
              </div>


            </td>
            <td><input type='time' defaultValue='00:00' className='basic_info ess_table_input' disabled={!energyStorage}></input></td>
            <td><input type='time' defaultValue='05:00' className='basic_info ess_table_input' disabled={!energyStorage}></input></td>
            <td>
              <select type='text' id='start_month' className='basic_info ess_table_input' name='start_month' disabled={!energyStorage}>
                <option selected value='january'>January</option>
                <option value='february'>February</option>
                <option value='march'>March</option>
                <option value='april'>April</option>
                <option value='may'>May</option>
                <option value='june'>June</option>
                <option value='july'>July</option>
                <option value='august'>August</option>
                <option value='september'>September</option>
                <option value='october'>October</option>
                <option value='november'>November</option>
                <option value='december'>December</option>
              </select>              
            </td>
            <td>
              <select type='text' id='stop_month' className='basic_info ess_table_input' name='stop_month' disabled={!energyStorage}>
                <option value='january'>January</option>
                <option value='february'>February</option>
                <option value='march'>March</option>
                <option value='april'>April</option>
                <option value='may'>May</option>
                <option value='june'>June</option>
                <option value='july'>July</option>
                <option value='august'>August</option>
                <option value='september'>September</option>
                <option value='october'>October</option>
                <option value='november'>November</option>
                <option selected value='december'>December</option>
              </select>   
            </td>
            <td><input type='number' min='0' max='100' defaultValue='95' className='basic_info ess_table_input center_items' disabled={!energyStorage}></input>
            </td>
          </tr>
          <tr>
            <td>
              <div className='inline_block ess_control_leftcol'>
                <p>Discharging</p>
              </div>
              <div className='ess_control_rightcol inline_block'>
                <select type='text' id='discharging' className='basic_info ess_table_input' name='discharging' disabled={!energyStorage}>
                  <option value='to loads'>To Loads</option>
                  <option value='to grid'>To Grid</option>
                </select>  
              </div>

            </td>
            <td><input type='time' defaultValue='06:00' className='basic_info ess_table_input' disabled={!energyStorage}></input></td>
            <td><input type='time' defaultValue='21:00' className='basic_info ess_table_input' disabled={!energyStorage}></input></td>
            <td>
              <select type='text' id='start_month' className='basic_info ess_table_input' name='start_month' disabled={!energyStorage}>
                <option selected value='january'>January</option>
                <option value='february'>February</option>
                <option value='march'>March</option>
                <option value='april'>April</option>
                <option value='may'>May</option>
                <option value='june'>June</option>
                <option value='july'>July</option>
                <option value='august'>August</option>
                <option value='september'>September</option>
                <option value='october'>October</option>
                <option value='november'>November</option>
                <option value='december'>December</option>
              </select>   
            </td>
            <td>
              <select type='text' id='stop_month' className='basic_info ess_table_input' name='stop_month' disabled={!energyStorage}>
                <option value='january'>January</option>
                <option value='february'>February</option>
                <option value='march'>March</option>
                <option value='april'>April</option>
                <option value='may'>May</option>
                <option value='june'>June</option>
                <option value='july'>July</option>
                <option value='august'>August</option>
                <option value='september'>September</option>
                <option value='october'>October</option>
                <option value='november'>November</option>
                <option selected value='december'>December</option>
              </select>   
            </td>
            <td><input type='number' min='0' max='100' defaultValue='40' className='basic_info ess_table_input center_items' disabled={!energyStorage}></input></td>
          </tr>
        </table>
      </Row>

      <Row>
        <h5><ArrowRightIcon />Filters</h5>
      </Row>
      <Row className='left_padding bottom_margin'>
        <Col lg={4}>
          <label htmlFor='maximum_eta'>Maximum ETA on Hardware</label>
          <select type='text' id='maximum_eta' className='basic_info' name='maximumETA' value={optimizationParameters.maximumETA} onChange={(event) => handleOptimizationParameters(event)} required>
            <option default value='within one week'>Within one week</option>
            <option value='2 to 4 weeks'>2 to 4 weeks</option>
            <option value='1 to 3 months'>1 to 3 months</option>
            <option value='more than 3 months'>More than 3 months</option>
          </select>
        </Col>
        <Col lg={4}>
          <label htmlFor='pv_inverter_technology'>PV Inverter Technology</label>
          <select type='text' id='pv_inverter_technology' className='basic_info' name='inverterTechnology' value={optimizationParameters.inverterTechnology} onChange={(event) => handleOptimizationParameters(event)} required>
            <option default value='microinverter'>Microinverter</option>
            <option value='optimizer'>Optimizer</option>
            <option value='string'>String</option>
          </select>          
        </Col>
      </Row>

      <Row className='bottom_margin'>
        <Col className='center_items'>
          {optimizationType === 'roi' && <button className='optimize_btn' style={{backgroundColor: '#5cf0aa'}}>ROI</button>}
          {optimizationType !== 'roi' && <button className='optimize_btn' onClick={handleROI}>ROI</button>}
          {optimizationType === 'lcoe' && <button className='optimize_btn' style={{backgroundColor: '#5cf0aa'}}>LCOE</button>}
          {optimizationType !== 'lcoe' && <button className='optimize_btn' onClick={handleLCOE}>LCOE</button>}
          {optimizationType === 'investment' && <button className='optimize_btn' style={{backgroundColor: '#5cf0aa'}}>Investment ($)</button>}
          {optimizationType !== 'investment' && <button className='optimize_btn' onClick={handleInvestment}>Investment ($)</button>}
          {optimizationType === 'offset' && <button className='optimize_btn' style={{backgroundColor: '#5cf0aa'}}>Offset %</button>}
          {optimizationType !== 'offset' && <button className='optimize_btn' onClick={handleOffset}>Offset %</button>}      
        </Col>
      </Row>
    </Container>
  )

}