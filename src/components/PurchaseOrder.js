import React, { Fragment, useContext } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import ClearIcon from '@mui/icons-material/Clear';
import { ManageContext } from '../index.js';

import './purchaseorder.css';

export const PurchaseOrder = () => {
  const {  projectLocation, projectType, optimizationParameters, billOfMaterials, updateQuantity, deleteProduct } = useContext(ManageContext);

  return (
    <Container fluid>
      <Row id='optimization_header' className='bottom_margin'>
        <Col lg={2}>
          <h4>Purchase Order</h4>
        </Col>
        <Col lg={8}>
          <h4 id='property_desc'>{projectLocation} - {projectType}</h4>
        </Col>
        <Col className='right_col_header' lg={2}>
          <button id='save_btn_optimization'>SAVE</button>
        </Col>
      </Row>
      <Row>
        <h5 className='left_margin'><ArrowRightIcon />Create your purchase order HERE:</h5>
      </Row>
      {billOfMaterials.pvArray.length > 0 && 
        <Fragment>
          <Row><h5>PV Array</h5></Row>
          <Row className='bottom_margin'>
            <table className='customize_design_table'>
              <tr>
              <th>Product</th>
              <th>Manufacturer Model</th>
              <th>Description</th>
              <th>Supplier</th>
              <th>SKU</th>
              <th>Unit Cost</th>
              <th>Qty</th>
              <th>Total Cost</th>
              </tr>
              {billOfMaterials.pvArray.map((material, id) => {
                return (
                  <tr key={id}>
                    <td className='product_name'>{material.product}</td>
                    <td>
                      <select className='customize_design_dropdown'>
                        {material.manufacturerModel.map((model) => {
                          return (
                            <option value={model}>{model}</option>
                          )
                        })}
                      </select>
                    </td>
                    <td className='static_col'>{material.description}</td>
                    <td>
                      <select className='customize_design_dropdown'>
                        {material.supplier.map((supplier) => {
                          return (
                            <option value={supplier}>{supplier}</option>
                          )
                        })}
                      </select>
                    </td>
                    <td className='static_col'>{material.sku}</td>
                    <td className='static_col'>${material.unitCost} CAD</td>
                    <td className='customize_design_qty'>
                      <input type='number' name='pvArray' defaultValue={material.qty} min='0' 
                      className='customize_design_input' onChange={(event) => updateQuantity(event, id)}>
                      </input>
                    </td>
                    <td className='static_col'>${material.totalCost} CAD</td>
                    <td>
                      <button className='delete_product_btn' id='pvArray' onClick={(event) => deleteProduct(event, id)}>
                      <ClearIcon />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </table>
          </Row>
        </Fragment>
      }

      {billOfMaterials.hybridInverter.length > 0 && 
      (optimizationParameters.loadGenerationType === 'Self-consumption with Backup' ||
      optimizationParameters.loadGenerationType === 'Off-grid' ||
      optimizationParameters.loadGenerationType === 'Microgrid' ||
      optimizationParameters.loadGenerationType === 'Energy Storage System (ESS)') &&
        <Fragment>
          <Row><h5>Hybrid Inverter</h5></Row>
          <Row className='bottom_margin'>
            <table className='customize_design_table'>
              <tr>
              <th>Product</th>
              <th>Manufacturer Model</th>
              <th>Description</th>
              <th>Supplier</th>
              <th>SKU</th>
              <th>Unit Cost</th>
              <th>Qty</th>
              <th>Total Cost</th>
              </tr>
              {billOfMaterials.hybridInverter.map((material, id) => {
                return (
                  <tr key={id}>
                    <td className='product_name'>{material.product}</td>
                    <td>
                      <select className='customize_design_dropdown'>
                        {material.manufacturerModel.map((model) => {
                          return (
                            <option value={model}>{model}</option>
                          )
                        })}
                      </select>
                    </td>
                    <td className='static_col'>{material.description}</td>
                    <td>
                      <select className='customize_design_dropdown'>
                        {material.supplier.map((supplier) => {
                          return (
                            <option value={supplier}>{supplier}</option>
                          )
                        })}
                      </select>
                    </td>
                    <td className='static_col'>{material.sku}</td>
                    <td className='static_col'>${material.unitCost} CAD</td>
                    <td className='customize_design_qty'>
                      <input type='number' name='hybridInverter' defaultValue={material.qty} min='0' 
                      className='customize_design_input' onChange={(event) => updateQuantity(event, id)}>
                      </input>
                    </td>
                    <td className='static_col'>${material.totalCost} CAD</td>
                    <td>
                      <button className='delete_product_btn' id='hybridInverter' onClick={(event) => deleteProduct(event, id)}>
                      <ClearIcon />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </table>
          </Row>              
        </Fragment>
      }
   
      {billOfMaterials.pvInverter.length > 0 &&
        <Fragment>
          <Row><h5>PV Inverter</h5></Row>
          <Row className='bottom_margin'>
            <table className='customize_design_table'>
              <tr>
              <th>Product</th>
              <th>Manufacturer Model</th>
              <th>Description</th>
              <th>Supplier</th>
              <th>SKU</th>
              <th>Unit Cost</th>
              <th>Qty</th>
              <th>Total Cost</th>
              </tr>
              {billOfMaterials.pvInverter.map((material, id) => {
                return (
                  <tr key={id}>
                    <td className='product_name'>{material.product}</td>
                    <td>
                      <select className='customize_design_dropdown'>
                        {material.manufacturerModel.map((model) => {
                          return (
                            <option value={model}>{model}</option>
                          )
                        })}
                      </select>
                    </td>
                    <td className='static_col'>{material.description}</td>
                    <td>
                      <select className='customize_design_dropdown'>
                        {material.supplier.map((supplier) => {
                          return (
                            <option value={supplier}>{supplier}</option>
                          )
                        })}
                      </select>
                    </td>
                    <td className='static_col'>{material.sku}</td>
                    <td className='static_col'>${material.unitCost} CAD</td>
                    <td className='customize_design_qty'>
                      <input type='number' name='pvInverter' defaultValue={material.qty} min='0' 
                      className='customize_design_input' onChange={(event) => updateQuantity(event, id)}>
                      </input>
                    </td>
                    <td className='static_col'>${material.totalCost} CAD</td>
                    <td>
                      <button className='delete_product_btn' id='pvInverter' onClick={(event) => deleteProduct(event, id)}>
                      <ClearIcon />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </table>
          </Row>
        </Fragment>
      }

      {billOfMaterials.energyStorageSystem.length > 0 && 
      (optimizationParameters.loadGenerationType === 'Self-consumption with Backup' ||
      optimizationParameters.loadGenerationType === 'Off-grid' ||
      optimizationParameters.loadGenerationType === 'Microgrid' ||
      optimizationParameters.loadGenerationType === 'Energy Storage System (ESS)') &&
        <Fragment>
          <Row><h5>Energy Storage System (ESS)</h5></Row>
          <Row className='bottom_margin'>
            <table className='customize_design_table'>
              <tr>
              <th>Product</th>
              <th>Manufacturer Model</th>
              <th>Description</th>
              <th>Supplier</th>
              <th>SKU</th>
              <th>Unit Cost</th>
              <th>Qty</th>
              <th>Total Cost</th>
              </tr>
              {billOfMaterials.energyStorageSystem.map((material, id) => {
                return (
                  <tr key={id}>
                    <td className='product_name'>{material.product}</td>
                    <td>
                      <select className='customize_design_dropdown'>
                        {material.manufacturerModel.map((model) => {
                          return (
                            <option value={model}>{model}</option>
                          )
                        })}
                      </select>
                    </td>
                    <td className='static_col'>{material.description}</td>
                    <td>
                      <select className='customize_design_dropdown'>
                        {material.supplier.map((supplier) => {
                          return (
                            <option value={supplier}>{supplier}</option>
                          )
                        })}
                      </select>
                    </td>
                    <td className='static_col'>{material.sku}</td>
                    <td className='static_col'>${material.unitCost} CAD</td>
                    <td className='customize_design_qty'>
                      <input type='number' name='energyStorageSystem' defaultValue={material.qty} min='0' 
                      className='customize_design_input' onChange={(event) => updateQuantity(event, id)}>
                      </input>
                    </td>
                    <td className='static_col'>${material.totalCost} CAD</td>
                    <td>
                      <button className='delete_product_btn' id='energyStorageSystem' onClick={(event) => deleteProduct(event, id)}>
                      <ClearIcon />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </table>
          </Row>              
        </Fragment>
      }

      {billOfMaterials.mountingSystem.length > 0 &&
        <Fragment>
          <Row><h5>Mounting System</h5></Row>
          <Row className='bottom_margin'>
            <table className='customize_design_table'>
              <tr>
              <th>Product</th>
              <th>Manufacturer Model</th>
              <th>Description</th>
              <th>Supplier</th>
              <th>SKU</th>
              <th>Unit Cost</th>
              <th>Qty</th>
              <th>Total Cost</th>
              </tr>
              {billOfMaterials.mountingSystem.map((material, id) => {
                return (
                  <tr key={id}>
                    <td className='product_name'>{material.product}</td>
                    <td>
                      <select className='customize_design_dropdown'>
                        {material.manufacturerModel.map((model) => {
                          return (
                            <option value={model}>{model}</option>
                          )
                        })}
                      </select>
                    </td>
                    <td className='static_col'>{material.description}</td>
                    <td>
                      <select className='customize_design_dropdown'>
                        {material.supplier.map((supplier) => {
                          return (
                            <option value={supplier}>{supplier}</option>
                          )
                        })}
                      </select>
                    </td>
                    <td className='static_col'>{material.sku}</td>
                    <td className='static_col'>${material.unitCost} CAD</td>
                    <td className='customize_design_qty'>
                      <input type='number' name='mountingSystem' defaultValue={material.qty} min='0' 
                      className='customize_design_input' onChange={(event) => updateQuantity(event, id)}>
                      </input>
                    </td>
                    <td className='static_col'>${material.totalCost} CAD</td>
                    <td>
                      <button className='delete_product_btn' id='mountingSystem' onClick={(event) => deleteProduct(event, id)}>
                      <ClearIcon />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </table>
          </Row>
        </Fragment>
      }

    </Container>
  )
}