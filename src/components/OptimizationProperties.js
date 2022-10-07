import React, { useContext, useState, useEffect, useRef } from 'react';
import { unstable_batchedUpdates } from 'react-dom';
import { Container, Row, Col } from 'react-bootstrap';
import { LayersControl, MapContainer, Marker, TileLayer, FeatureGroup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { EditControl } from 'react-leaflet-draw';
import GeoUtil from 'leaflet-geometryutil';
import { ManageContext } from '../index.js';
import { booleanPointInPolygon, booleanWithin, point, polygon } from '@turf/turf';

import './optimizationproperties.css';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw-rotate';
import 'leaflet-draw-rotate/dist/Edit.Rectangle.Rotate.js';

import 'leaflet-draw/dist/leaflet.draw.css';
import markerIconPng from 'leaflet/dist/images/marker-icon.png';
import {Icon} from 'leaflet';

export const OptimizationProperties = () => {
  const { latitude, longitude, projectType, projectLocation } = useContext(ManageContext);
  const [layers, setLayers] = useState({ 0: { } });
  const [layerId, setLayerId] = useState(0);
  const [areaType, setAreaType] = useState('roof');
  const [mountingType, setMountingType] = useState('');
  const [roofType, setRoofType] = useState('');
  const [azimuth, setAzimuth] = useState(0);
  const [slope, setSlope] = useState(0);
  const [height, setHeight] = useState(0);
  const [setback, setSetback] = useState(0);
  const [cubeHeight, setCubeHeight] = useState(0);
  const [cylinderHeight, setCylinderHeight] = useState(0);
  const [disableRoof, setDisableRoof] = useState(false);
  const [areaPopupOpen, setAreaPopupOpen] = useState(false);
  const [cubeConstraintPopupOpen, setCubeConstraintPopupOpen] = useState(false);
  const [cylinderConstraintPopupOpen, setCylinderConstraintPopupOpen] = useState(false);
  const [availableArea, setAvailableArea] = useState({});
  const [prevLayerClicked, setPrevLayerClicked] = useState({});
  const [currentShapeSelected, setCurrentShapeSelected] = useState('');

  let newArea = availableArea;
  let shapeAreas = {};
  const polygonsDrawn = useRef([]);

  const _onCreate = (event) => {
    const { layerType, layer } = event;
    let layersDrawn = layers;
    let shapeId = layer._leaflet_id;
    let polygonArray = polygonsDrawn.current;

    if (layerType === 'polygon') {
      // Add new polygon and its properties to layers object  
      layersDrawn[shapeId] = {
        areaType: 'roof',
        mountingType: 'Sloped roof',
        roofType: 'Composite shingles',
        azimuth: 0,
        slope: 0,
        height: 0,
        setback: 0,
        constraintType: '',
        constraintLength: 0,
        constraintWidth: 0,
        cubeHeight: 0,
        constraintDiameter: 0,
        cylinderHeight: 0
      }
      setLayers(layersDrawn); 

      // Calculate area of new polygon
      let polygonCoordinates = layer._latlngs[0];
      let layerCoordinates = [];
      layerCoordinates[0] = shapeId;
      for (let index = 0; index < polygonCoordinates.length; index++) {
        layerCoordinates[index + 1] = [polygonCoordinates[index].lat, polygonCoordinates[index].lng];
      }

      layerCoordinates[polygonCoordinates.length + 1] = layerCoordinates[1];
      polygonArray.push(layerCoordinates);
      polygonsDrawn.current = polygonArray;
      
      let polygonArea = window.google.maps.geometry.spherical.computeArea(polygonCoordinates);
      shapeAreas[shapeId] = [layerType, polygonArea];

      // Update available area with addition of polygon
      newArea[shapeId] = polygonArea;
      setAvailableArea({...newArea});
    }

    if (layerType === 'circle') {
      // Calculate area of new circle constraint
      let radius = layer._mRadius;
      let diameter = radius * 2;
      let circleArea = radius * radius * Math.PI;
      let circleCoordinate = point([layer._latlng.lat, layer._latlng.lng]);

      // Assign area of zero if no polygons exist
      if (polygonsDrawn.current.length === 0) {
        shapeAreas[shapeId] = [layerType, 0, 0];
      }

      // Update available area with addition of circle
      for (let index = 0; index < polygonsDrawn.current.length; index++) {
        let coordinates = polygonsDrawn.current[index].slice(1);
        let polygonId = polygonsDrawn.current[index][0];

        if (booleanPointInPolygon(circleCoordinate, polygon([coordinates]))) {
          if (typeof(polygonId) === 'number') {
            shapeAreas[shapeId] = [layerType, circleArea, polygonId, circleCoordinate];
            newArea[polygonId] = newArea[polygonId] - circleArea;
            setAvailableArea({...newArea});
          }
        }
        else {
          // Set area of circle to zero if constraint does not overlap polygon
          shapeAreas[shapeId] = [layerType, 0, 0];
        }
      }

      // Add new constraint and its properties to layers object
      layersDrawn[shapeId] = {
        areaType: '',
        mountingType: '',
        roofType: '',
        azimuth: 0,
        slope: 0,
        height: 0,
        setback: 0,
        constraintType: 'cylinder',
        constraintLength: 0,
        constraintWidth: 0,
        cubeHeight: 0,
        constraintDiameter: diameter.toFixed(2),
        cylinderHeight: 0,
      }
      setLayers(layersDrawn);
    }
    if (layerType === 'rectangle') {
      // Calculate area of new rectangle constraint
      let length = window.google.maps.geometry.spherical.computeDistanceBetween(
        new window.google.maps.LatLng(layer._latlngs[0][1].lat, layer._latlngs[0][1].lng),
        new window.google.maps.LatLng(layer._latlngs[0][2].lat, layer._latlngs[0][2].lng)
      );

      let width = window.google.maps.geometry.spherical.computeDistanceBetween(
        new window.google.maps.LatLng(layer._latlngs[0][0].lat, layer._latlngs[0][0].lng),
        new window.google.maps.LatLng(layer._latlngs[0][1].lat, layer._latlngs[0][1].lng)
      );

      let rectangleArea = length * width;
      let rectangleCoordinates = layer._latlngs[0];

      let layerCoordinates = [];
      for (let index = 0; index < rectangleCoordinates.length; index++) {
          layerCoordinates[index] = [rectangleCoordinates[index].lat, rectangleCoordinates[index].lng];
      }
      layerCoordinates[rectangleCoordinates.length] = layerCoordinates[0];
      
      // Assign area of zero if no polygons exist
      if (polygonsDrawn.current.length === 0) {
        shapeAreas[shapeId] = [layerType, 0, 0];
      }

      // Update available area with addition of rectangle constraint
      for (let index = 0; index < polygonsDrawn.current.length; index++) {
        let coordinates = polygonsDrawn.current[index].slice(1);
        let polygonId = polygonsDrawn.current[index][0];

        if (booleanWithin(polygon([layerCoordinates]), polygon([coordinates]))) {
          if (typeof(polygonId) === 'number') {
            shapeAreas[shapeId] = [layerType, rectangleArea, polygonId, layerCoordinates];
            newArea[polygonId] = newArea[polygonId] - rectangleArea;
            setAvailableArea({...newArea});
          }
        }
        else {
          // Set area of rectangle to zero if constraint does not overlap polygon
          shapeAreas[shapeId] = [layerType, 0, 0];
        }
      }

      // Add new constraint and its properties to layers object
      layersDrawn[shapeId] = {
        areaType: '',
        mountingType: '',
        roofType: '',
        azimuth: 0,
        slope: 0,
        height: 0,
        setback: 0,
        constraintType: 'cube',
        constraintLength: length.toFixed(2),
        constraintWidth: width.toFixed(2),
        cubeHeight: 0,
        constraintDiameter: 0,
        cylinderHeight: 0
      }
      setLayers(layersDrawn);
    }
  }

  const _onEdit = (event) => {
    let layersDrawn = layers;
    let layerId = Number(Object.keys(event.layers._layers)[0]);
    let layerType = shapeAreas[layerId][0];
    let prevRectangleArea = shapeAreas[layerId][1];
    let updatedPolygonArray = polygonsDrawn.current;

    if (layerType === 'polygon') {
      // On editing a polygon
      // Delete previous version of polygon coordinates on edit
      for (let index = 0; index < updatedPolygonArray.length; index++) {
        if (updatedPolygonArray[index][0] === layerId) {
          updatedPolygonArray.splice(index, 1);
          break;
        }
      }
      polygonsDrawn.current = updatedPolygonArray;

      // Calculate area of updated polygon
      let polygonCoordinates = event.layers._layers[layerId]._latlngs[0];
      let layerCoordinates = [];
      layerCoordinates[0] = layerId;
      for (let index = 0; index < polygonCoordinates.length; index++) {
        layerCoordinates[index + 1] = [polygonCoordinates[index].lat, polygonCoordinates[index].lng];
      }

      layerCoordinates[polygonCoordinates.length + 1] = layerCoordinates[1];
      updatedPolygonArray.push(layerCoordinates);
      polygonsDrawn.current = updatedPolygonArray;
      
      let polygonArea = window.google.maps.geometry.spherical.computeArea(polygonCoordinates);
      shapeAreas[layerId] = [layerType, polygonArea];

      // Set constraint area to zero if updated polygon coordinates do not overlap with constraint
      for (let [key, value] of Object.entries(shapeAreas)) {
        if (value[0] === 'circle') {
          let coordinates = layerCoordinates.slice(1);
          let circleCoordinate = value[3];

          if (value[2] === layerId && (!booleanPointInPolygon(circleCoordinate, polygon([coordinates])))) {    
            shapeAreas[key] = [layerType, 0, 0, circleCoordinate];
          }
        }
        if (value[0] === 'rectangle') {
          let coordinates = layerCoordinates.slice(1);
          let rectangleCoordinates = value[3];

          if (value[2] === layerId && (!booleanWithin(polygon([rectangleCoordinates]), polygon([coordinates])))) {    
            shapeAreas[key] = [layerType, 0, 0, rectangleCoordinates];
          }          
        }
      }

      // Update available area with update of polygon
      newArea[layerId] = polygonArea;
      setAvailableArea({...newArea});
    }
    else if (layerType === 'circle') {
      // On editing a circle
      let radius = event.layers._layers[layerId]._mRadius;
      let diameter = radius * 2;
      let circleArea = radius * radius * Math.PI;
      let circleCoordinate = point([event.layers._layers[layerId]._latlng.lat, event.layers._layers[layerId]._latlng.lng]);

      // Update available area with update of circle
      for (let index = 0; index < polygonsDrawn.current.length; index++) {
        let coordinates = polygonsDrawn.current[index].slice(1);
        let polygonId = polygonsDrawn.current[index][0];

        if (booleanPointInPolygon(circleCoordinate, polygon([coordinates]))) {
          if (typeof(polygonId) === 'number') {
            shapeAreas[layerId] = [layerType, circleArea, polygonId];
            newArea[polygonId] = newArea[polygonId] - circleArea;
            setAvailableArea({...newArea});
          }
          else {
            // Set area of circle to zero if constraint does not overlap polygon
            shapeAreas[layerId] = [layerType, 0, 0];
          }
        }
      }

      // Change diameter of circle based on edit
      Object.assign(layersDrawn[layerId], {
        constraintDiameter: diameter.toFixed(2),
      });
      setLayers({...layersDrawn});
    }
    else if (layerType === 'rectangle') {
      // On editing a rectangle
      // Calculate area of updated rectangle constraint
      let length = window.google.maps.geometry.spherical.computeDistanceBetween(
        new window.google.maps.LatLng(event.layers._layers[layerId]._latlngs[0][1].lat, event.layers._layers[layerId]._latlngs[0][1].lng),
        new window.google.maps.LatLng(event.layers._layers[layerId]._latlngs[0][2].lat, event.layers._layers[layerId]._latlngs[0][2].lng)
      );
      let width = window.google.maps.geometry.spherical.computeDistanceBetween(
        new window.google.maps.LatLng(event.layers._layers[layerId]._latlngs[0][0].lat, event.layers._layers[layerId]._latlngs[0][0].lng),
        new window.google.maps.LatLng(event.layers._layers[layerId]._latlngs[0][1].lat, event.layers._layers[layerId]._latlngs[0][1].lng)
      );
      let rectangleArea = length * width;
      let rectangleCoordinates = event.layers._layers[layerId]._latlngs[0];

      let layerCoordinates = [];
      for (let index = 0; index < rectangleCoordinates.length; index++) {
          layerCoordinates[index] = [rectangleCoordinates[index].lat, rectangleCoordinates[index].lng];
      }
      layerCoordinates[rectangleCoordinates.length] = layerCoordinates[0];

      // Update available area with update of rectangle constraint
      for (let index = 0; index < polygonsDrawn.current.length; index++) {
        let coordinates = polygonsDrawn.current[index].slice(1);
        let polygonId = polygonsDrawn.current[index][0];

        if (booleanWithin(polygon([layerCoordinates]), polygon([coordinates]))) {
          if (typeof(polygonId) === 'number') {
            newArea[polygonId] = newArea[polygonId] + prevRectangleArea - rectangleArea;
            shapeAreas[layerId] = [layerType, rectangleArea, polygonId];
            setAvailableArea({...newArea});
          }
          else {
            // Set area of rectangle to zero if constraint does not overlap polygon
            shapeAreas[layerId] = [layerType, 0, 0];
          }
        }
      }

      // Change length/width of rectangle based on edit
      Object.assign(layersDrawn[layerId], {
        constraintLength: length.toFixed(2),
        constraintWidth: width.toFixed(2)
      });
      setLayers({...layersDrawn});
    }
  }

  const _onDelete = (event) => {
    const { layers } = event;
    let shapeId = Object.keys(layers._layers)[0];

    let deletedShapes = Object.keys(layers._layers);
    let updatedPolygonArray = polygonsDrawn.current;
    let shapeColour = layers._layers[shapeId].options.color;
    let layerType = shapeAreas[shapeId][0];

    if (shapeColour === 'yellow') {
      if (layerType === 'polygon') {
        setAreaPopupOpen(false);
      }
      else if (layerType === 'circle') {
        setCylinderConstraintPopupOpen(false);
      }
      else if (layerType === 'rectangle') {
        setCubeConstraintPopupOpen(false);
      }
    }

    if (updatedPolygonArray.length > 0) {
      // Update area when multiple shapes are deleted at once
      if (deletedShapes.length > 1) {
        for (let index = 0; index < deletedShapes.length; index++) {
          let id = deletedShapes[index];
          let area = shapeAreas[id][1];
          let polygonId = shapeAreas[id][2];
  
          if (shapeAreas[id][0] === 'polygon') {
            delete newArea[id];
            setAvailableArea({...availableArea, newArea});
          }
          else {
            if (typeof(polygonId) === 'number') {
              newArea[polygonId] = newArea[polygonId] + area;
              setAvailableArea({...availableArea, newArea});
            }
          }
        }
      }
      else {
        // Update area when a single shape is deleted
        let polygonId = shapeAreas[shapeId][2];
  
        if (shapeAreas[shapeId][0] === 'polygon') {
          delete newArea[shapeId];
          setAvailableArea({...availableArea, newArea});
        }
        else {
          if (typeof(polygonId) === 'number') {
            newArea[polygonId] = newArea[polygonId] + shapeAreas[shapeId][1];
            setAvailableArea({...availableArea, newArea});
          }
        }
      }
    }

    // Delete polygon based on id
    for (let index = 0; index < updatedPolygonArray.length; index++) {

      for (let shape = 0; shape < deletedShapes.length; shape++) {
        let deletedId = parseInt(deletedShapes[shape]);
        if (updatedPolygonArray[index][0] === deletedId) {
          updatedPolygonArray.splice(index, 1);
          break;
        }
      }
    }
    polygonsDrawn.current = updatedPolygonArray;

    if (currentShapeSelected === 'polygon') {
      setAreaPopupOpen(false);
    }
    if (currentShapeSelected === 'circle') {
      setCylinderConstraintPopupOpen(false);
    }
    if (currentShapeSelected === 'rectangle') {
      setCubeConstraintPopupOpen(false);
    }
  }

  // Get vertex location on draw vertex
  const currentVertex = useRef({lat: 0, lng: 0});

  const _onDrawVertex = (event) => {
    let obj = event.target._layers;
    let vertexArray = [];

    // Get layer of map that has latitude and longitude of vertex
    for (let layer in obj) {
      if (obj[layer]._latlng !== undefined) {
        vertexArray.push(obj[layer]._latlng);
      }
    }
    currentVertex.current = vertexArray[1];
  }
  
  // Update layers object when user changes polygon parameters
  useEffect(() => {
    let layersDrawn = layers;

    // Reset unnecessary inputs if ground areaType is selected
    if (areaType === 'ground') {
      Object.assign(layersDrawn[layerId], {
        areaType: areaType,
        mountingType: mountingType,
        roofType: '',
        azimuth: azimuth,
        slope: 0,
        height: height,
        setback: setback
      });
    } else {
      Object.assign(layersDrawn[layerId], {
        areaType: areaType,
        mountingType: mountingType,
        roofType: roofType,
        azimuth: azimuth,
        slope: slope,
        height: height,
        setback: setback
      });
    }
    setLayers(layersDrawn);

  }, [areaType, mountingType, roofType, azimuth, slope, height, setback]);

  // Update layers object when user changes rectangle parameters
  useEffect(() => {
    let layersDrawn = layers;

    Object.assign(layersDrawn[layerId], {
      cubeHeight: cubeHeight,
    });
    setLayers(layersDrawn);

  }, [cubeHeight]);

  // Update layers object when user changes circle parameters
  useEffect(() => {
    let layersDrawn = layers;

    Object.assign(layersDrawn[layerId], {
      cylinderHeight: cylinderHeight
    });
    setLayers(layersDrawn);

  }, [cylinderHeight]);

  // Update racking type of shape to default when switching between roof and ground
  useEffect(() => {
    let layersDrawn = layers;

    if (areaType === 'roof') {
      Object.assign(layersDrawn[layerId], {
        mountingType: 'Sloped Roof',
      });
      setLayers(layersDrawn);
      setMountingType('Sloped Roof');
    }

    if (areaType === 'ground') {
      Object.assign(layersDrawn[layerId], {
        mountingType: 'Fix Tilted'
      });
      setLayers(layersDrawn);
      setMountingType('Fix Tilted');
    }
  }, [areaType]);
  
  const Map = () => {
    const [sideLength, setSideLength] = useState(0);
    const [sideBearing, setSideBearing] = useState(0);

    L.drawLocal = {
      draw: {
        toolbar: {
          // #TODO: this should be reorganized where actions are nested in actions
          // ex: actions.undo  or actions.cancel
          actions: {
            title: 'Cancel',
            text: 'Cancel'
          },
          finish: {
            title: 'Finish',
            text: 'Finish'
          },
          undo: {
            title: 'Undo',
            text: 'Delete last point'
          },
          buttons: {
            polyline: '- your text-',
            polygon: 'Draw polygon to outline available area',
            rectangle: 'Draw rectangle to outline obstructions',
            circle: 'Draw circle to outline obstructions',
            marker: '- your text-',
            circlemarker: '- your text-'
          }
        },
        handlers: {
          circle: {
            tooltip: {
              start: 'Click and drag to draw circle'
            },
            radius: 'radius'
          },
          circlemarker: {
            tooltip: {
              start: '- your text-.'
            }
          },
          marker: {
            tooltip: {
              start: '- your text-.'
            }
          },
          polygon: {
            allowIntersection: false,
            tooltip: {
              start: 'Click to start drawing shape',
              cont: sideBearing + '° ' + sideLength + ' m',
              end: sideBearing + '° ' + sideLength + ' m'
            }
          },
          polyline: {
            error: '<strong>Error:</strong> shape edges cannot cross!',
            tooltip: {
              start: 'Click to start drawing line.',
              cont: 'Click to continue drawing line.',
              end: 'Click last point to finish line.'
            }
          },
          rectangle: {
            tooltip: {
              start: 'Click and drag to draw rectangle'
            }
          },
          simpleshape: {
            tooltip: {
              end: 'Release mouse to finish drawing.'
            }
          }
        }
      },
      edit: {
        toolbar: {
          actions: {
            save: {
              title: 'Save changes',
              text: 'Save'
            },
            cancel: {
              title: 'Cancel editing, discards all changes',
              text: 'Cancel'
            },
            clearAll: {
              title: 'Clear all layers',
              text: 'Clear All'
            }
          },
          buttons: {
            edit: 'Edit layers',
            editDisabled: 'No layers to edit',
            remove: 'Delete layers',
            removeDisabled: 'No layers to delete'
          }
        },
        handlers: {
          edit: {
            tooltip: {
              text: 'Drag handles or markers to edit features.',
              subtext: 'Click cancel to undo changes.'
            }
          },
          remove: {
            tooltip: {
              text: 'Click on a feature to remove.'
            }
          }
        }
      }
    };
    
    // Calculate segment length from vertex to user mouse location on map
    let vertexCoordinates = currentVertex.current;

    const map = useMapEvents({
      mousemove(event) {
        if (Object.keys(currentVertex).length > 0) {
          let mouseCoordinates = {lat: event.latlng.lat, lng: event.latlng.lng };
          let vertexLatitude = vertexCoordinates.lat;
          let vertexLongitude = vertexCoordinates.lng;
          let segmentLength = window.google.maps.geometry.spherical.computeDistanceBetween(
            new window.google.maps.LatLng(vertexLatitude, vertexLongitude),
            new window.google.maps.LatLng(mouseCoordinates.lat, mouseCoordinates.lng));
          let bearing = GeoUtil.angle(map, vertexCoordinates, mouseCoordinates);
          // Round segment length and angle
          segmentLength = Math.round(segmentLength * 100) / 100;
          bearing = Math.round(bearing);
          
          setSideLength(segmentLength);
          setSideBearing(bearing);
        }
      }
    })
    return null 
  }
  // Disable slope input field if 'ground' is selected as area type
  useEffect(() => {
    if (areaType === 'ground') {
      setDisableRoof(true);
    }
    else {
      setDisableRoof(false);
    }
  }, [areaType]);

  return (
    <Container fluid>
      <Row id='optimization_header'>
        <Col lg={2}>
          <h4>Properties</h4>
        </Col>
        <Col lg={8}>
          <h4 id='property_desc'>{projectLocation} - {projectType}</h4>
        </Col>
        <Col className='right_col_header' lg={2}>
          <button id='save_btn_optimization'>SAVE</button>
        </Col>
      </Row>
      <Row>
        <Col lg={3} className='optimization_column'>
          {areaPopupOpen && <div><Row className='optimization_subheader' id='available_areas_header'>
            <h5>Available Areas</h5>
          </Row>
          <Row>
            <div className='popup_table'>
              <div className='popup_cells'>
                <input type='radio' id='roof' className='inline_block' name='area' checked={areaType === 'roof'} onClick={() => setAreaType('roof')}></input>
                <p className='inline_block'>Roof</p>
              </div>
              <div className='popup_cells'>
                <input type='radio' id='ground' className='inline_block' name='area' checked={areaType === 'ground'} onClick={() => setAreaType('ground')}></input>
                <p className='inline_block'>Ground</p>
              </div>
            </div>
          </Row>
          <Row>
            <Col>
              <label htmlFor='mounting_type' className='available_areas_label'>Mounting Type</label>
              <select type='text' className='available_areas_dropdown' name='mounting_type' selected={layers[layerId].mountingType} value={mountingType} onChange={(event) => setMountingType(event.target.value)}>
                <option value='Sloped Roof' selected={!disableRoof} disabled={disableRoof}>Sloped Roof</option>
                <option value='Flat Roof' disabled={disableRoof}>Flat Roof</option>
                <option value='Awning' disabled={disableRoof}>Awning</option>
                <option value='Pole' disabled={disableRoof}>Pole</option>
                <option value='Carport' disabled={disableRoof}>Carport</option>
                <option value='Fixed Tilt Racking' selected={disableRoof} disabled={!disableRoof}>Fix Titled</option>
                <option value='Single Axis Tracker' disabled={!disableRoof}>Single Axis Tracker</option>
                <option value='Dual Axis Tracker' disabled={!disableRoof}>Dual Axis Tracker</option> 
              </select>            
            </Col>
          </Row>
          <Row className='bottom_margin'>
            <Col>
              <label htmlFor='roof_material' className='available_areas_label'>Roof Type</label>
              <select type='text' className='available_areas_dropdown' name='roof_material' selected={layers[layerId].roofType} value={roofType} disabled={disableRoof} onChange={(event) => setRoofType(event.target.value)}>
                <option value='Composite Shingles'>Composite shingles</option>
                <option value='Trapezoidal Sheet Metal'>Trapezoidal Sheet Metal</option>
                <option value='Standing Seam Metal'>Standing Seam Metal</option>
                <option value='Corrugated Metal'>Corrugated Metal</option>
                <option value='Concrete Decking'>Concrete Decking</option>
                <option value='Spanish Tiles'>Spanish Tiles</option>
                <option value='Flat Tiles'>Flat Tiles</option>
                <option value='EPDM membrane'>EPDM membrane</option>
                <option value='TPO membrane'>TPO membrane</option>
                <option value='PVC membrane'>PVC membrane</option>
                <option value='Modified Bitumen'>Modified Bitumen</option>
                <option value='Built-up'>Built-Up (BUR)</option>
                <option value='Other'>Other</option>
              </select>                
            </Col>
          </Row>
          <Row>
            <Col lg={3}>
              <p>Azimuth</p>
            </Col>
            <Col lg={9}>
              <input type='number' className='property_input' min='0' max='360' defaultValue={layers[layerId].azimuth} value={azimuth} onChange={(event) => setAzimuth(event.target.value)}></input>deg 
            </Col>
          </Row>
          <Row>
            <Col lg={3}>
              <p>Slope</p>
            </Col>
            <Col lg={9}>
              <input type='number' className='property_input' min='0' max='90' defaultValue={layers[layerId].slope} value={slope} disabled={disableRoof} onChange={(event) => setSlope(event.target.value)}></input>deg           
            </Col>
          </Row>
          <Row>
            <Col lg={3}>
              <p>Height</p>
            </Col>
            <Col lg={9}>
              <input type='number' className='property_input' min='0' defaultValue={layers[layerId].height} value={height} onChange={(event) => setHeight(event.target.value)}></input>m        
            </Col>
          </Row>
          <Row>
            <Col lg={3}>
              <p>Setback</p>
            </Col>
            <Col lg={9}>
              <input type='number' className='property_input' min='0' defaultValue={layers[layerId].setback} value={setback} onChange={(event) => setSetback(event.target.value)}></input>m  
            </Col>
          </Row>
          <Row>
            <h5>Area: {Math.round(availableArea[layerId] * 100) / 100} m<sup>2</sup></h5>
          </Row></div> }

          {cubeConstraintPopupOpen && <div><Row className='optimization_subheader'>
            <h5>Cube Constraint</h5>
          </Row>
          <Row>
            <Col lg={3}>
              <p>Length</p>
            </Col>
            <Col lg={9}>
              <input type='number' className='property_input read_only' min='0' defaultValue={layers[layerId].constraintLength} value={layers[layerId].constraintLength} readOnly></input>m         
            </Col>
          </Row>
          <Row>
            <Col lg={3}>
              <p>Width</p>
            </Col>
            <Col lg={9}>
              <input type='number' className='property_input read_only' min='0' defaultValue={layers[layerId].constraintWidth} value={layers[layerId].constraintWidth} readOnly></input>m
            </Col>
          </Row>
          <Row>
            <Col lg={3}>
              <p>Height</p>
            </Col>
            <Col lg={9}>
              <input type='number' className='property_input' min='0' defaultValue={layers[layerId].cubeHeight} value={cubeHeight} onChange={(event) => setCubeHeight(event.target.value)}></input>m     
            </Col>
          </Row></div>}

          {cylinderConstraintPopupOpen && <div><Row className='optimization_subheader'>
            <h5>Cylinder Constraint</h5>
          </Row>
          <Row>
            <Col lg={3}>
              <p>Diameter</p>
            </Col>
            <Col lg={9}>
              <input type='number' className='property_input read_only' min='0' defaultValue={layers[layerId].constraintDiameter} value={layers[layerId].constraintDiameter} readOnly></input>m 
            </Col>
          </Row>
          <Row>
            <Col lg={3}>
              <p>Height</p>
            </Col>
            <Col lg={9}>
              <input type='number' className='property_input' min='0' defaultValue={layers[layerId].cylinderHeight} value={cylinderHeight} onChange={(event) => setCylinderHeight(event.target.value)}></input>m         
            </Col>
          </Row></div>}
        </Col>
        <Col lg={9} className='optimization_column'>
          <MapContainer center={[latitude, longitude]} zoom={17} scrollWheelZoom={true} attributionControl={false}>
            <TileLayer 
                url='https://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}'
                maxZoom= {20}
                subdomains={['mt1','mt2','mt3']}
                pasteControl={true}
            />
            <Map />
            <LayersControl>
              <Marker position={[latitude, longitude]} icon={new Icon({iconUrl: markerIconPng, iconSize: [25, 41], iconAnchor: [12, 41]})}>
              </Marker>
            </LayersControl>
            <FeatureGroup   
              eventHandlers={{
                click: (event) => {    
                  let selectedShapeId = event.propagatedFrom._leaflet_id;
                  setLayerId(selectedShapeId);

                  // Open parameters section based on shape selected
                  if (isNaN(event.propagatedFrom._radius) && event.propagatedFrom.options.fillColor === 'blue') {
                    setAreaPopupOpen(false);
                    setCubeConstraintPopupOpen(true);
                    setCylinderConstraintPopupOpen(false);
                    setCurrentShapeSelected('rectangle');

                    // Set input value to saved value in layers object
                    setCubeHeight(layers[selectedShapeId].cubeHeight);
                  }
                  else if (typeof(event.propagatedFrom._radius) === 'number') {
                    setAreaPopupOpen(false);
                    setCubeConstraintPopupOpen(false);
                    setCylinderConstraintPopupOpen(true);
                    setCurrentShapeSelected('circle');

                    // Set input value to saved value in layers object
                    setCylinderHeight(layers[selectedShapeId].cylinderHeight);
                  }
                  else {
                    setAreaPopupOpen(true);
                    setCubeConstraintPopupOpen(false);
                    setCylinderConstraintPopupOpen(false);
                    setCurrentShapeSelected('polygon');

                    // Set input value to saved value in layers object
                    unstable_batchedUpdates(() => {
                      setAreaType(layers[selectedShapeId].areaType);
                      setMountingType(layers[selectedShapeId].mountingType);
                      setRoofType(layers[selectedShapeId].roofType);
                      setAzimuth(layers[selectedShapeId].azimuth);
                      setSlope(layers[selectedShapeId].slope);
                      setHeight(layers[selectedShapeId].height);
                      setSetback(layers[selectedShapeId].setback);
                    });
                  }

                  // Reset style of previously clicked shape to default style
                  let lastClicked = prevLayerClicked;
                  
                  if (prevLayerClicked !== null && Object.keys(prevLayerClicked).length > 0) {
                    if (prevLayerClicked.options.fillColor === 'blue') {
                      lastClicked.setStyle({
                        color: 'blue',
                        weight: 4,
                        fillOpacity: 0.2
                      });
                    }
                    if (prevLayerClicked.options.fillColor === '#FF4500') {
                      lastClicked.setStyle({
                        color: '#FF4500',
                        weight: 4,
                        fillOpacity: 0.2
                      });
                    }
                  }
                  setPrevLayerClicked(event.propagatedFrom);

                  // Highlight shape on click 
                  event.propagatedFrom.setStyle({
                    color: 'yellow',
                    weight: 5,
                    fillOpacity: 0.4
                  });

                  // Enable/disable roof 
                  if (areaType === 'roof') {
                    setDisableRoof(false);
                  }
                  else {
                    setDisableRoof(true);
                  }

                },
              }}
            >
              <EditControl
                position='topright'
                onEdited={_onEdit}
                onCreated={_onCreate}
                onDeleted={_onDelete}
                onDrawVertex={_onDrawVertex}
                            
                draw={{
                  polyline: false,
                  marker: false,
                  circlemarker: false,
                  polygon: {
                    shapeOptions: { color: '#FF4500', fillColor: '#FF4500' },
                    metric: true,
                  },
                  rectangle: {
                    shapeOptions: { color: 'blue', fillColor: 'blue' },
                    metric: true,
                    showArea: true
                  },
                  circle: {
                    shapeOptions: { color: 'blue', fillColor: 'blue' },
                    metric: true,
                    showRadius: true
                  },
                }}
              />
            </FeatureGroup>
          </MapContainer>
        </Col>
      </Row>
    </Container>
  )
}