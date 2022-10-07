import React, { useState, useReducer, useEffect, useRef, useContext } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import GooglePlacesAutocomplete, { geocodeByPlaceId } from 'react-google-places-autocomplete';
import countries from 'i18n-iso-countries';
import enLocale from 'i18n-iso-countries/langs/en.json';
import GreenIcon from '../assets/green_icon.png';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { TagInputComponent } from './TagInputComponent';
import { Trans, useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { ManageContext } from '../index';

import './createdesigneraccount.css';

export const CreateDesignerAccount = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { setUserType, tags } = useContext(ManageContext);

  const [disableInputPlaceholder, setDisableInputPlaceholder] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [address, setAddress] = useState('');
  const [companyAddress, setCompanyAddress] = useState('');
  const countryCode = useRef('');
  const [listOfStates, setListOfStates] = useState([{ code: '', name: '' }]);
  const mainActivities = useRef([]);
  const companyCountryCode = useRef('');
  const [listOfStatesCompany, setListOfStatesCompany] = useState([]);
  const mainMarkets = useRef([]);
  const mainSolutions = useRef([]);
  const [personalInfo, setPersonalInfo] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      role: '',
      country: '',
      city: '',
      zipCode: '',
      province: '',
    }
  );
  const [companyInfo, setCompanyInfo] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    {
      mainActivity: mainActivities.current,
      businessNumber: '',
      companyName: '',
      branchOfficeEmail: '',
      companyWebsite: '',
      branchOfficeCountry: '',
      branchOfficeProvince: '',
      branchOfficeCity: '',
      branchOfficeZipCode: '',
      mainSolutions: mainSolutions.current,
      mainMarkets: mainMarkets.current,
    }
  );

  let personalInformation = {
    firstName: personalInfo.firstName,
    lastName: personalInfo.lastName,
    email: personalInfo.email,
    role: personalInfo.role,
    address: address.label,
    city: personalInfo.city,
    province: personalInfo.province,
    zipCode: personalInfo.zipCode,
    country: personalInfo.country,
    password: personalInfo.password,
    creationRights: 'TRUE',
    businessNumber: companyInfo.businessNumber
  }

  let companyInformation = {
    mainActivity: JSON.stringify(companyInfo.mainActivity),
    businessNumber: companyInfo.businessNumber,
    companyName: companyInfo.companyName,
    branchOfficeEmail: companyInfo.branchOfficeEmail,
    companyWebsite: companyInfo.companyWebsite,
    branchOfficeCountry: companyInfo.branchOfficeCountry,
    branchOfficeAddress: companyAddress.label,
    branchOfficeProvince: companyInfo.branchOfficeProvince,
    branchOfficeCity: companyInfo.branchOfficeCity,
    branchOfficeZipCode: companyInfo.branchOfficeZipCode,
    mainSolutions: JSON.stringify(companyInfo.mainSolutions),
    mainMarkets: JSON.stringify(companyInfo.mainMarkets),
    branchOfficeRegions: JSON.stringify(tags)
  }

  // Disable default placeholder of dropdown inputs when selecting a value
  const disablePlaceholder = () => {
    if (disableInputPlaceholder === false) {
      setDisableInputPlaceholder(true);
    }
  }

  const handleCheckboxes = (event, groupName) => {
    let values = groupName.current;
    let index = values.indexOf(event.target.name);

    // Add checkbox values to array if checked
    if (event.target.checked === true) {
      values.push(event.target.name);
    }

    // Remove checkbox values from array if unchecked
    if (event.target.checked === false) {
      if (index !== -1) {
        values.splice(index, 1);
      }
    }

    groupName.current = values;
  };

  // Store user information in database 
  const addNewUser = async (informationType, pathVariable) => {
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(informationType)
    };
    const response = await fetch(`/api/v1/${pathVariable}`, requestOptions);
    console.log(response);
  }

  const termsAndConditions = `1. LIABILITY\n2. FEES AND COMMISSIONS\n3. CONFLICT OF INTEREST\n4. PAYMENT METHOD`;

  // Set user as designer on register
  useEffect(() => {
    setUserType('Designer');
  }, [])

  const handlePersonalInput = (event) => {
    const { name, value } = event.target;
    setPersonalInfo({ [name]: value });
  }

  const handleCompanyInput = (event) => {
    const { name, value } = event.target;
    setCompanyInfo({ [name]: value });
  }

  const togglePassword = () => {
    setShowPassword(!showPassword);
  }
  
  // Get list of countries
  countries.registerLocale(enLocale);
  let countriesObj = countries.getNames('en', { select: 'official' });
  let countriesArray = [];

  Object.entries(countriesObj).map(([key, value]) => {
    countriesArray.push({ code: key, name: value });
  });

  // Get ISO2 country code and fetch states/provinces of selected country
  useEffect(() => {
    for (const [key, value] of Object.entries(countriesObj)) {
      if (value === personalInfo.country) {
        countryCode.current = key;
        break;
      }
    }

    let headers = new Headers();
    headers.append("X-CSCAPI-KEY", "MVFJeHpBb3FRMmNHVHBXY3BPME9IOU95eXFaY25DODR3b083cjU0Tw==");
    
    let requestOptions = {
     method: 'GET',
     headers: headers,
     redirect: 'follow'
    };

    // Store states of selected country into array
    let statesArray = [];
    if (countryCode.current !== '') {
      fetch(`https://api.countrystatecity.in/v1/countries/${countryCode.current}/states`, requestOptions)
      .then(response => response.json())
      .then(data => {
        for (let index = 0; index < data.length; index++) {
          statesArray[index] = { code: data[index].iso2, name: data[index].name };
        }

        setListOfStates(statesArray);
      })
    }

  }, [personalInfo.country]);

  useEffect(() => {
    for (const [key, value] of Object.entries(countriesObj)) {
      if (value === companyInfo.branchOfficeCountry) {
        companyCountryCode.current = key;
        break;
      }
    }

    let headers = new Headers();
    headers.append("X-CSCAPI-KEY", "MVFJeHpBb3FRMmNHVHBXY3BPME9IOU95eXFaY25DODR3b083cjU0Tw==");
    
    let requestOptions = {
     method: 'GET',
     headers: headers,
     redirect: 'follow'
    };

    // Store states of selected country into array
    let statesArray = [];
    if (companyCountryCode.current !== '') {
      fetch(`https://api.countrystatecity.in/v1/countries/${companyCountryCode.current}/states`, requestOptions)
      .then(response => response.json())
      .then(data => {
        for (let index = 0; index < data.length; index++) {
          statesArray[index] = { code: data[index].iso2, name: data[index].name };
        }

        setListOfStatesCompany(statesArray);
      })
    }

  }, [companyInfo.branchOfficeCountry]);
  
  // Set city, zip/postal code based on address input
  useEffect(() => {
    let userInformation = personalInfo;
    
    if (address !== '' && address.value.terms.length === 5) {
      let cityName = address.value.terms[2].value;
      Object.assign(userInformation, {
        city: cityName
      });
    }

    if (address !== '') {
      geocodeByPlaceId(address.value.place_id)
        .then(results => {
          let addressLength = results[0].address_components.length;
          let zipCodeValue = results[0].address_components[addressLength - 1].long_name;
          Object.assign(userInformation, {
            zipCode: zipCodeValue
          })
          setPersonalInfo(userInformation);
        })
        .catch(error => console.error(error));
    }
  }, [address]);

  useEffect(() => {
    let userInformation = companyInfo;
    
    if (companyAddress !== '' && companyAddress.value.terms.length === 5) {
      let cityName = companyAddress.value.terms[2].value;
      Object.assign(userInformation, {
        branchOfficeCity: cityName
      });
    }

    if (companyAddress !== '') {
      geocodeByPlaceId(companyAddress.value.place_id)
        .then(results => {
          let addressLength = results[0].address_components.length;
          let zipCodeValue = results[0].address_components[addressLength - 1].long_name;
          Object.assign(userInformation, {
            branchOfficeZipCode: zipCodeValue
          })
          setCompanyInfo(userInformation);
        })
        .catch(error => console.error(error));
    }
  }, [companyAddress]);

  const onRegistrationSubmit = async (event) => {
    event.preventDefault();

    if (companyAddress === '') {
      alert('Please fill in the corporate headquarters address');
    }
    else if (mainActivities.current.length === 0) {
      alert('Please confirm main activity of the company');
    }
    else if (tags.length === 0) {
      alert('Please fill in the areas/regions relevant to the company');
    }
    else {
      try {
        const responsePersonalInfo = addNewUser(personalInformation, 'users');
        const responseCompanyInfo = addNewUser(companyInformation, 'companies');

        // Redirect to success page on successful registration
        navigate('/register/success');
          
      } catch (err) {
        console.log(err);
      }

    }
  }

  return (
    <Container fluid id='register_page' className='left_padding'>
      <form onSubmit={onRegistrationSubmit} method='post'>
        <Row className='bottom_margin'>
          <h3 className='registration_subheading'>PERSONAL INFORMATION</h3>
          <p>Please fill out the following information below.<br></br>All fields with (*) are mandatory</p>
        </Row>
        <Row>
          <Col lg={5}>
            <div>
              <label className='inline_block personal_info_label' htmlFor='firstName'>FIRST NAME (*)</label>
              <input type='text' className='basic_info personal_info_input' name='firstName' placeholder='First Name' onChange={handlePersonalInput} required></input>
            </div>
            <div>
              <label className='inline_block personal_info_label' htmlFor='lastName'>LAST NAME (*)</label>
              <input type='text' className='basic_info personal_info_input' name='lastName' placeholder='Last Name' onChange={handlePersonalInput} required></input>
            </div>
            <div>
              <label className='inline_block personal_info_label' htmlFor='email'>CORPORATE EMAIL (*)</label>
              <input type='email' className='basic_info personal_info_input' name='email' placeholder='Corporate Email' onChange={handlePersonalInput} required></input>
            </div>
            <div id='password_section'>
              <label className='inline_block personal_info_label' htmlFor='password'>PASSWORD (*)</label>
              <input type={showPassword ? "text" : "password"} className='basic_info personal_info_input inline_block' name='password' placeholder='Password' min='8' onChange={handlePersonalInput} required></input>
              {!showPassword && <VisibilityOffIcon className='visible_icon' onClick={togglePassword}/> }
              {showPassword && <VisibilityIcon className='visible_icon' onClick={togglePassword}/> }
            </div>
            <div>
              <label className='inline_block personal_info_label' htmlFor='companyName'>COMPANY (*)</label>
              <input type='text' className='basic_info personal_info_input' name='companyName' placeholder='Company Name' onChange={handleCompanyInput} required></input>
            </div>
            <div>
              <label className='inline_block personal_info_label' htmlFor='role'>ROLE</label>
              <select className='basic_info personal_info_input' name='role' onClick={disablePlaceholder} onChange={handlePersonalInput}>
                <option default value='' disabled={disableInputPlaceholder}>Select role</option>
                <option value='admin'>Admin</option>
                <option value='business_developer'>Business Developer</option>
                <option value='purchaser'>Purchaser</option>
                <option value='designer'>Designer</option>
                <option value='general manager'>General Manager</option>
                <option value='regional manager'>Regional Manager</option>
                <option value='sales representative'>Sales Representative</option>
                <option value='project manager'>Project Manager</option>
                <option value='other'>Other</option>
              </select>
            </div>
          </Col>
          <Col lg={4} className='left_padding'>
            <Row>
              <div>
                <label htmlFor='country'>Country</label>
                <select id='personal_country' className='basic_info' onChange={handlePersonalInput} name='country' onClick={disablePlaceholder}>
                  <option default value='' disabled={disableInputPlaceholder}>Select country</option>
                  {countriesArray.map((country) => {
                    return (
                      <option key={country.code} value={country.name}>{country.name}</option>
                    )
                  })}
                </select>
              </div>

            </Row>
            <Row className='bottom_margin'>
              <label htmlFor='address'>Address</label>
              <GooglePlacesAutocomplete 
                selectProps={{
                  address,
                  onChange: setAddress,
                  placeholder: 'Number, Street Address',
                  styles: {
                    input: (provided) => ({
                      ...provided,
                      color: 'black',
                      padding: '8px 0px',
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
            </Row>
            <Row>
              <Col>
                <label htmlFor='city'>City</label>
                <input type='text' id='personal_city' className='basic_info' name='city' placeholder='City' value={personalInfo.city} onChange={handlePersonalInput}></input>
              </Col>
              <Col>
                <label htmlFor='zipCode'>Zip Code</label>
                <input type='text' id='personal_zipcode' className='basic_info' name='zipCode' placeholder='ZIP/Postal Code' value={personalInfo.zipCode} onChange={handlePersonalInput}></input>
              </Col>
            </Row>
            <Row>
              <div>
                <label htmlFor='province'>State/Province</label>
                <select id='personal_state' className='basic_info' name='province' onClick={disablePlaceholder} onChange={handlePersonalInput}>
                  <option default value='' disabled={disableInputPlaceholder}>Select state/province</option>
                  {listOfStates.map((state) => {
                    return (
                      <option key={state.code} value={state.name}>{state.name}</option>
                    )
                  })}
                </select>
              </div>

            </Row>
          </Col>
          <Col lg={3} className='left_padding bottom_margin'>
            <div className='summary_description'>
              <img src={GreenIcon} alt='summary_point' className='green_icon'/>
              <h5 className='summary_points'>
                <Trans components={{ br: <br />}}>
                  summary_point1
                </Trans>
              </h5>
            </div><br></br>
            <div className='summary_description'>
              <img src={GreenIcon} alt='summary_point' className='green_icon'/>
              <h5 className='summary_points'>
                <Trans components={{ br: <br />}}>
                  summary_point2
                </Trans>
              </h5>
            </div><br></br>
            <div className='summary_description'>
              <img src={GreenIcon} alt='summary_point' className='green_icon'/>
              <h5 className='summary_points'>
                <Trans components={{ br: <br />}}>
                  summary_point3
                </Trans>
              </h5>
            </div><br></br>
            <div className='summary_description'>
              <img src={GreenIcon} alt='summary_point' className='green_icon'/>
              <h5 className='summary_points'>
                Avoid delays in shipping, and design your system with equipment that is available locally
              </h5>
            </div><br></br>
            <div className='summary_description'>
              <img src={GreenIcon} alt='summary_point' className='green_icon'/>
              <h5 className='summary_points'>
                <Trans components={{ br: <br />}}>
                  summary_point5
                </Trans>
              </h5>
            </div>
          </Col>
        </Row>

        <Row className='bottom_margin'>
          <h3 className='registration_subheading'>COMPANY INFORMATION</h3>
          <p>Please fill out the following information below. You may want to get in touch with the admin team of your company.<br></br>All fields with (*) are mandatory</p>
        </Row>
        <Row className='bottom_margin'>
          <Col lg={6}>
            <Row className='bottom_margin'>
              <h5>What is the main activity of the company? (*)</h5>
              <div>
                <input type='checkbox' className='inline_block registration_checkbox' name='developer' onClick={(event) => handleCheckboxes(event, mainActivities)}></input>
                <label htmlFor='developer' className='inline_block company_activity_label'>Developer</label>
                <input type='checkbox' className='inline_block registration_checkbox' name='installer' onClick={(event) => handleCheckboxes(event, mainActivities)}></input>
                <label htmlFor='installer' className='inline_block company_activity_label'>Installer</label>
                <input type='checkbox' className='inline_block registration_checkbox' name='consultant' onClick={(event) => handleCheckboxes(event, mainActivities)}></input>
                <label htmlFor='consultant' className='inline_block company_activity_label'>Consultant</label>
              </div>
            </Row>
            <Row>
              <div>
                <label htmlFor='businessNumber'>Business Number (*)</label>
                <input type='text' id='company_business_number' className='basic_info' name='businessNumber' placeholder='Business/Corporation Number' onChange={handleCompanyInput} required></input>
              </div>
            </Row>
            <Row>
              <Col>
                <label htmlFor='branchOfficeEmail'>Corporate Email (*)</label>
                <input type='text' id='company_email' className='basic_info' name='branchOfficeEmail' placeholder="Primary contact's email" onChange={handleCompanyInput} required></input>
              </Col>
              <Col>
                <label htmlFor='companyWebsite'>Corporate Website (*)</label>
                <input type='url' id='company_website' className='basic_info' name='companyWebsite' placeholder='Website URL' onChange={handleCompanyInput} required></input>              
              </Col>
            </Row>
            <Row>
              <Col>
                <label htmlFor='branchOfficeCountry'>Country (*)</label>
                <select id='company_country' className='basic_info' onChange={handleCompanyInput} name='branchOfficeCountry' onClick={disablePlaceholder} required>
                  <option default value='' disabled={disableInputPlaceholder}>Select country</option>
                  {countriesArray.map((country) => {
                    return (
                      <option key={country.code} value={country.name}>{country.name}</option>
                    )
                  })}
                </select>                 
              </Col>
              <Col>
                <label htmlFor='branchOfficeProvince'>State/Province (*)</label>
                <select id='company_state' className='basic_info' name='branchOfficeProvince' onClick={disablePlaceholder} onChange={handleCompanyInput} required>
                  <option default value='' disabled={disableInputPlaceholder}>Select state/province</option>
                  {listOfStatesCompany.map((state) => {
                    return (
                      <option key={state.code} value={state.name}>{state.name}</option>
                    )
                  })}
                </select>              
              </Col>
            </Row>
            <Row className='bottom_margin'>
              <Col lg={8}>
                <label htmlFor='branchOfficeAddress'>Corporate Headquarters Address (*)</label>
                <GooglePlacesAutocomplete 
                  selectProps={{
                    companyAddress,
                    onChange: setCompanyAddress,
                    placeholder: 'Number, Street Address',
                    styles: {
                      input: (provided) => ({
                        ...provided,
                        color: 'black',
                        padding: '8px 0px',
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
            </Row>
            <Row>
              <Col>
                <label htmlFor='branchOfficeCity'>City (*)</label>
                <input type='text' className='basic_info' name='branchOfficeCity' placeholder='City' value={companyInfo.branchOfficeCity} onChange={handleCompanyInput} required></input>
              </Col>
              <Col>
                <label htmlFor='branchOfficeZipCode'>Zip Code (*)</label>
                <input type='text' className='basic_info' name='branchOfficeZipCode' placeholder='ZIP/Postal Code' value={companyInfo.branchOfficeZipCode} onChange={handleCompanyInput} required></input>
              </Col>
            </Row>

          </Col>
          <Col lg={6} className='left_padding'>
            <h5>What are the main solutions you offer?</h5>
            <Row className='bottom_margin'>
              <Col>
                <div className='bottom_margin'>
                  <input type='checkbox' id='grid_tie' className='inline_block registration_checkbox' name='grid-tie solar PV systems' onClick={(event) => handleCheckboxes(event, mainSolutions)}></input>
                  <label htmlFor='grid_tie' className='inline_block'>Grid-tie solar PV systems</label>
                </div>
                <div className='bottom_margin'>
                  <input type='checkbox' id='hybrid_systems' className='inline_block registration_checkbox' name='hybrid systems' onClick={(event) => handleCheckboxes(event, mainSolutions)}></input>
                  <label htmlFor='hybrid_systems' className='inline_block'>Hybrid Systems (Grid-tie with ESS)</label>
                </div>
                <div className='bottom_margin'>
                  <input type='checkbox' id='microgrids' className='inline_block registration_checkbox' name='microgrids' onClick={(event) => handleCheckboxes(event, mainSolutions)}></input>
                  <label htmlFor='microgrids' className='inline_block'>Microgrids</label>      
                </div>
              </Col>
              <Col>
                <div className='bottom_margin'>
                  <input type='checkbox' id='energy_storage' className='inline_block registration_checkbox' name='energy storage' onClick={(event) => handleCheckboxes(event, mainSolutions)}></input>
                  <label htmlFor='energy_storage' className='inline_block'>Energy Storage (ESS)</label>
                </div>
                <div className='bottom_margin'>
                  <input type='checkbox' id='offgrid_systems' className='inline_block registration_checkbox' name='off-grid systems' onClick={(event) => handleCheckboxes(event, mainSolutions)}></input>
                  <label htmlFor='offgrid_systems' className='inline_block'>Off-grid Systems</label>
                </div>
                <div className='bottom_margin'>
                  <input type='checkbox' id='power_plants' className='inline_block registration_checkbox' name='PV power plants' onClick={(event) => handleCheckboxes(event, mainSolutions)}></input>
                  <label htmlFor='power_plants' className='inline_block'>PV Power Plants</label>      
                </div>            
              </Col>
            </Row>

            <h5>What are the main markets you serve?</h5>
            <Row className='bottom_margin'>
              <Col>
                <div className='bottom_margin'>
                  <input type='checkbox' id='commercial_institutional' className='inline_block registration_checkbox' name='commercial & institutional' onClick={(event) => handleCheckboxes(event, mainMarkets)}></input>
                  <label htmlFor='commercial_institutional' className='inline_block'>Commercial & Institutional</label>
                </div>
                <div className='bottom_margin'>
                  <input type='checkbox' id='municipalities' className='inline_block registration_checkbox' name='municipalities' onClick={(event) => handleCheckboxes(event, mainMarkets)}></input>
                  <label htmlFor='municipalities' className='inline_block'>Municipalities</label>
                </div>
                <div className='bottom_margin'>
                  <input type='checkbox' id='agricultural' className='inline_block registration_checkbox' name='agricultural' onClick={(event) => handleCheckboxes(event, mainMarkets)}></input>
                  <label htmlFor='agricultural' className='inline_block'>Agricultural</label>      
                </div>
              </Col>
              <Col>
                <div className='bottom_margin'>
                  <input type='checkbox' id='residential' className='inline_block registration_checkbox' name='residential' onClick={(event) => handleCheckboxes(event, mainMarkets)}></input>
                  <label htmlFor='residential' className='inline_block'>Residential</label>
                </div>
                <div className='bottom_margin'>
                  <input type='checkbox' id='utility_scale' className='inline_block registration_checkbox' name='utility scale' onClick={(event) => handleCheckboxes(event, mainMarkets)}></input>
                  <label htmlFor='utility_scale' className='inline_block'>Utility Scale</label>
                </div>          
              </Col>
            </Row>
            <h5>What areas/regions are you covering? (*)</h5>
            <TagInputComponent/>
          </Col>
        </Row>

        <Row className='bottom_margin terms_conditions_section' id='terms_conditions_checkbox'>
          <div>
            <input type='checkbox' id='terms_conditions' className='registration_checkbox' name='terms_conditions' required></input>
            <label htmlFor='terms_conditions' className='inline_block'>By registering, I declare that I accept the privacy policies, terms and conditions of this platform</label>
          </div>
        </Row>
        <Row className='bottom_margin terms_conditions_section'>
          <div>
            <label id='terms_conditions_label'>TERMS AND CONDITIONS</label>
            <textarea type='text' id='terms_conditions_textbox' value={termsAndConditions} rows='5' cols='100' readOnly></textarea>
          </div>
        </Row>
        <Row>
          <div>
            <input type='submit' id='create_designer_btn' className='terms_conditions_section' value='Create Account'></input>
          </div>
        </Row>
      </form>
    </Container>
  )
}