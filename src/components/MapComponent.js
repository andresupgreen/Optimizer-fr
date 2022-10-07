import React, { useContext, useState } from 'react';
import { GoogleMap, Marker } from '@react-google-maps/api';
import GooglePlacesAutocomplete from 'react-google-places-autocomplete';
import { ManageContext } from '../index.js';

export const MapComponent = () => {
  const { latitude, longitude, onSearchLocation } = useContext(ManageContext);
  const [value, setValue] = useState('');

  if (value !== '') {
    onSearchLocation(value.value.description);
  }

  const containerStyle = {
    width: '100%',
    height: '75vh'
  };

  const center = {
    lat: latitude,
    lng: longitude
  };

  return (
    <div>
      <div className='bottom_margin'>
        <GooglePlacesAutocomplete
          selectProps={{
            value,
            onChange: setValue,
            placeholder: 'Search location...',
            styles: {
              input: (provided) => ({
                ...provided,
                color: 'black',
                padding: '1% 0%'
              }),
              option: (provided) => ({
                ...provided,
                color: 'black',
              }),
              singleValue: (provided) => ({
                ...provided,
                color: 'black',
              }),
            },
          }}
        />        
      </div>

      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={17}
        tilt={0}
        mapTypeId={"satellite"}>
        <Marker position={{ lat: latitude, lng: longitude }} />
        <></>
      </GoogleMap>
    </div>

  )
}



