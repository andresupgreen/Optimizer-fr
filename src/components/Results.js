import React, { Fragment, useContext, useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import EqualizerIcon from '@mui/icons-material/Equalizer';
import ShoppingCart from '@mui/icons-material/ShoppingCart';
import { ManageContext } from '../index.js';

import './results.css';

export const Results = () => {
  const {  projectLocation, projectType } = useContext(ManageContext);
  const [designRank, setDesignRank] = useState(1);

  let bestOptimizedResults = [
    {rank: 1, solarPVModule: 'LG450W-AG', solarPVModuleQty: 56, pvInverter: 'N/A', pvInverterQty: 0, 
    hybridInverter: 'SE10000 Energy Hub', hybridInverterQty: 2, batteries: 'LG Chem 10', batteriesQty: 2,
    totalCost: '$95,408 CAD', ROI: '6.8 years'},
    {rank: 2, solarPVModule: 'LG450W-AG', solarPVModuleQty: 56, pvInverter: 'N/A', pvInverterQty: 0, 
    hybridInverter: 'SE10000 Energy Hub', hybridInverterQty: 2, batteries: 'LG Chem 10', batteriesQty: 2,
    totalCost: '$95,408 CAD', ROI: '6.8 years'},
    {rank: 3, solarPVModule: 'LG450W-AG', solarPVModuleQty: 56, pvInverter: 'N/A', pvInverterQty: 0, 
    hybridInverter: 'SE10000 Energy Hub', hybridInverterQty: 2, batteries: 'LG Chem 10', batteriesQty: 2,
    totalCost: '$95,408 CAD', ROI: '6.8 years'},
    {rank: 4, solarPVModule: 'LG450W-AG', solarPVModuleQty: 56, pvInverter: 'N/A', pvInverterQty: 0, 
    hybridInverter: 'SE10000 Energy Hub', hybridInverterQty: 2, batteries: 'LG Chem 10', batteriesQty: 2,
    totalCost: '$95,408 CAD', ROI: '6.8 years'},
    {rank: 5, solarPVModule: 'LG450W-AG', solarPVModuleQty: 56, pvInverter: 'N/A', pvInverterQty: 0, 
    hybridInverter: 'SE10000 Energy Hub', hybridInverterQty: 2, batteries: 'LG Chem 10', batteriesQty: 2,
    totalCost: '$95,408 CAD', ROI: '6.8 years'}
  ];
  
  const selectDesign = (rank) => {
    setDesignRank(rank);
  }

  console.log(designRank);
  
  return (
    <Container fluid>
      <Row id='optimization_header' className='bottom_margin'>
        <Col lg={2}>
          <h4>Optimization</h4>
        </Col>
        <Col lg={8}>
          <h4 id='property_desc'>{projectLocation} - {projectType}</h4>
        </Col>
        <Col className='right_col_header' lg={2}>
          <button id='save_btn_optimization'>SAVE</button>
        </Col>
      </Row>
      <Row>
        <h5 className='left_margin'><ArrowRightIcon />Optimized solutions based on ROI</h5>
      </Row>
      <Row className='bottom_margin'>
        <table id='optimized_results_table' className='center_items'>
          <tr>
            <th>Design</th>
            <th>
              <Row>
                <Col lg={9}>Solar PV Module</Col>
                <Col lg={3} className='qty_header'>Qty</Col>
              </Row>
            </th>
            <th>
              <Row>
                <Col lg={9}>PV Inverter</Col>
                <Col lg={3} className='qty_header'>Qty</Col>
              </Row>
            </th>
            <th>
              <Row>
                <Col lg={9}>Hybrid Inverter</Col>
                <Col lg={3} className='qty_header'>Qty</Col>
              </Row>
            </th>
            <th>
              <Row>
                <Col lg={9}>Batteries</Col>
                <Col lg={3} className='qty_header'>Qty</Col>
              </Row>
            </th>
            <th>Total Price</th>
            <th>ROI</th>    
          </tr>
          {bestOptimizedResults.map((design) => {
            if (designRank === design.rank) {
              return (
                <Fragment>
                  <tr className='optimized_table_rows'>
                    <td className='design_id'>{design.rank}</td>
                    <td style={{backgroundColor: '#EAEAEA'}}>
                      <Row>
                        <Col lg={9}>{design.solarPVModule}</Col>
                        <Col lg={3} className='qty_header'>{design.solarPVModuleQty}</Col>
                      </Row>
                    </td>
                    <td style={{backgroundColor: '#EAEAEA'}}>
                      <Row>
                        <Col lg={9}>{design.pvInverter}</Col>
                        <Col lg={3} className='qty_header'>{design.pvInverterQty}</Col>
                      </Row>
                    </td>
                    <td style={{backgroundColor: '#EAEAEA'}}>
                      <Row>
                        <Col lg={9}>{design.hybridInverter}</Col>
                        <Col lg={3} className='qty_header'>{design.hybridInverterQty}</Col>
                      </Row>
                    </td>
                    <td style={{backgroundColor: '#EAEAEA'}}>
                      <Row>
                        <Col lg={9}>{design.batteries}</Col>
                        <Col lg={3} className='qty_header'>{design.batteriesQty}</Col>
                      </Row>
                    </td>
                    <td style={{backgroundColor: '#EAEAEA'}}>{design.totalCost}</td>
                    <td style={{backgroundColor: '#EAEAEA'}}>{design.ROI}</td>
                  </tr>
                  <tr className='optimize_icon_section'>
                    <td style={{border: 'none'}}></td>
                    <td style={{border: 'none'}}></td>
                    <td style={{border: 'none'}}>
                      <button className='optimize_icon_btn'><i><EqualizerIcon className='optimize_icon'/>
                      </i>Energy Flow</button>
                    </td >
                    <td style={{border: 'none'}}>
                      <button className='optimize_icon_btn' onClick={() => selectDesign(design.rank)}>
                      <i><ShoppingCart className='optimize_icon'/></i>Configure</button> 
                    </td>
                  </tr>
                </Fragment>
              )
            }
            else {
              return (
                <Fragment>
                  <tr className='optimized_table_rows'>
                    <td className='design_id'>{design.rank}</td>
                    <td>
                      <Row>
                        <Col lg={9}>{design.solarPVModule}</Col>
                        <Col lg={3} className='qty_header'>{design.solarPVModuleQty}</Col>
                      </Row>
                    </td>
                    <td>
                      <Row>
                        <Col lg={9}>{design.pvInverter}</Col>
                        <Col lg={3} className='qty_header'>{design.pvInverterQty}</Col>
                      </Row>
                    </td>
                    <td>
                      <Row>
                        <Col lg={9}>{design.hybridInverter}</Col>
                        <Col lg={3} className='qty_header'>{design.hybridInverterQty}</Col>
                      </Row>
                    </td>
                    <td>
                      <Row>
                        <Col lg={9}>{design.batteries}</Col>
                        <Col lg={3} className='qty_header'>{design.batteriesQty}</Col>
                      </Row>
                    </td>
                    <td>{design.totalCost}</td>
                    <td>{design.ROI}</td>
                  </tr>
                  <tr className='optimize_icon_section'>
                    <td style={{border: 'none'}}></td>
                    <td style={{border: 'none'}}></td>
                    <td style={{border: 'none'}}>
                      <button className='optimize_icon_btn'><i><EqualizerIcon className='optimize_icon'/>
                      </i>Energy Flow</button>
                    </td>
                    <td style={{border: 'none'}}>
                      <button className='optimize_icon_btn' onClick={() => selectDesign(design.rank)}>
                      <i><ShoppingCart className='optimize_icon'/></i>Configure</button> 
                    </td>
                  </tr>
                </Fragment>
              )              
            }
          })}
        </table>
      </Row>
      <Row>
        <h5 className='left_margin'><ArrowRightIcon />Customized Solutions</h5>
      </Row>
    </Container>
  )

}