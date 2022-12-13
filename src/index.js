import React, { Suspense, useState, useEffect, createContext, useReducer } from 'react';
import ReactDOM from 'react-dom';
import { Content } from './components/Content';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { Login } from './components/Login';
import { CreateDesignerAccount } from './components/CreateDesignerAccount';
import { CreateSupplierAccount } from './components/CreateSupplierAccount';
import { Dashboard } from './components/Dashboard';
import { CreateProject } from './components/CreateProject';
import { SuccessMessage } from './components/SuccessMessage';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import duplicate_icon from './assets/duplicate-icon.png';
import design_icon from './assets/design-icon.png';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';

import './index.css';
import './i18n';
import { RegistrationMessage } from './components/RegistrationMessage';
import { SupplierDashboard } from './components/SupplierDashboard';
import { SupplierProducts } from './components/SupplierProducts';
import { UpdateSupplierProducts } from './components/UpdateSupplierProducts';
import { UploadProductSuccess } from './components/UploadProductSuccess';

export const ManageContext = createContext();

const App = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userData, setUserData] = useState([]);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [businessNumber, setBusinessNumber] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [projectData,setProjectData] = useState([]);
  const [productData, setProductData] = useState([]);
  const [latitude, setLatitude] = useState(35.396120);
  const [longitude, setLongitude] = useState(-118.973590);

  const [projectLocation, setProjectLocation] = useState('');
  const [gridType, setGridType] = useState('low');
  const [optimizationType, setOptimizationType] = useState('roi');
  const [accountType, setAccountType] = useState('');
  const [registrationCompanyName, setRegistrationCompanyName] = useState('');
  const [tags, setTags] = useState([]);

  // Set user account type
  const setUserType = (user) => {
    setAccountType(user);
  }

  // Set company name on registration
  const handleRegistrationCompanyName = (event) => {
    setRegistrationCompanyName(event.target.value);
  }

  // Fetch product data of supplier
  const getProducts = async () => {
    const response = await fetch(`/api/v1/products/${businessNumber}`);
    const data = await response.json();

    const warehouseResponse = await fetch(`/api/v1/warehouses/${businessNumber}`);
    const warehouseData = await warehouseResponse.json();
  
    // Store warehouse id/name pair
    let warehouseObj = {};
    for (let i = 0; i < warehouseData.length; i++) {
      warehouseObj[warehouseData[i].warehouseId] = warehouseData[i].warehouseName;
    }

    for (let i = 0; i < data.length; i++) {
      const moduleResponse = await fetch(`/api/v1/modules/${data[i].mpn}`);
      const moduleData = await moduleResponse.json();
      let mpn = moduleData.mpn;

      // Replace warehouse id in products data with warehouse name
      data[i].warehouseId = warehouseObj[data[i].warehouseId];

      data[i].price = '$' + (data[i].price).toFixed(2);

      // Replace module id with product mpn
      data[i].mpn = mpn;

      data[i].actions = <button className='more_info_btn'>More info</button>;
    }

    setProductData(data);
  }

  // Handle basic project information
  const [basicProjectInfo, setBasicProjectInfo] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    {
      projectType: 'Net Metering',
      projectName: '',
      projectContact: 'James Stewart',
      projectStage: 'New',
      inverterType: 'centralized',
      mediumVoltage: '1',
      transformerOwned: 'no',
      connectionVoltage: '1 x 110V',
      maxDemandFromGrid: '1',
      exportLimit: '50'      
    }
  );

  const handleBasicProjectInfo = (event) => {
    const { name, value } = event.target;
    setBasicProjectInfo( { [name]: value });
  }

  // Handle advanced project information
  const [advancedProjectInfo, setAdvancedProjectInfo] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    {
      projectLife: '25',
      financingType: 'Loan',
      debtRatio: '80',
      escalationRate: '3',
      inflationRate: '3',
      incomeTaxRate: '15',
      depreciationRate: '20'
    }
  );

  const handleAdvancedProjectInfo = (event) => {
    const { name, value } = event.target;
    setAdvancedProjectInfo( { [name]: value });
  }

  // Handle electrical load information
  const [electricalLoadInfo, setElectricalLoadInfo] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    {
      meterId: '',
      loadProfileName: '',
      facilityType: 'House',
      weatherType: 'Hot-Humid'
    }
  );

  const handleElectricalLoadInfo = (event) => {
    const { name, value } = event.target;
    setElectricalLoadInfo( { [name]: value });
  }

  // Handle energy rates information
  const [energyRatesInfo, setEnergyRatesInfo] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    {
      compensationMechanism: 'Net Energy Metering',
      compensationRate: '0'
    }
  );

  const handleEnergyRatesInfo = (event) => {
    const { name, value } = event.target;
    setEnergyRatesInfo( { [name]: value });
  }  

  // Handle optimization parameters
  const [optimizationParameters, setOptimizationParameters] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    {
      loadGenerationType: 'Net Metering',
      maximumETA: 'Within one week',
      inverterTechnology: 'Microinverter'
    }
  );

  const handleOptimizationParameters = (event) => {
    const { name, value } = event.target;
    setOptimizationParameters( { [name]: value });
  }

  let projectInformation = {
    projectType: basicProjectInfo.projectType,
    projectName: basicProjectInfo.projectName,
    address: projectLocation,
    contactName: basicProjectInfo.projectContact,
    stage: basicProjectInfo.projectStage,
    companyName: companyName,
    facilityType: electricalLoadInfo.facilityType
  }

  // Set grid type to no grid, low voltage or medium voltage
  const handleNoGrid = () => {
    setGridType('none');
  }
  const handleLowVoltage = () => {
    setGridType('low');
  }
  const handleMediumVoltage = () => {
    setGridType('medium');
  }

  // Set optimization type to ROI, LCOE, Investment or Offset %
  const handleROI = () => {
    setOptimizationType('roi');
  }
  const handleLCOE = () => {
    setOptimizationType('lcoe');
  }
  const handleInvestment = () => {
    setOptimizationType('investment');
  }
  const handleOffset = () => {
    setOptimizationType('offset');
  }
  
  // Get latitude and longitude based on address
  const onSearchLocation = (location) => {
    try {
      fetch(`https://api.opencagedata.com/geocode/v1/json?q=${location}&key=9e71eaa7b6e745609d665a2284c23762`)
      .then(response => response.json())
      .then(data => {
        setLatitude(data.results[0].geometry.lat);
        setLongitude(data.results[0].geometry.lng);
      });
    } catch(err) {
      console.log(err);
    }

    setProjectLocation(location);
  }
  
  const getEmail = (event) => {
    setEmail(event.target.value);
  }

  const getPassword = (event) => {
    setPassword(event.target.value);
  }

  // Get user data from the backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/v1/users/${email}`);
        const data = await response.json();
        setUserData(data);
      } catch(err) {
        console.log(err);
      }
    }
    fetchData();
    setFirstName(userData.firstName);
    setLastName(userData.lastName);
    setBusinessNumber(userData.businessNumber);
  }, [email, userData.firstName, userData.lastName, userData.businessNumber]);

  // Get company name of user
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/v1/companies/${businessNumber}`);
        const data = await response.json();
        setCompanyName(data.companyName);
      } catch(err) {
        console.log(err);
      }
    }
    fetchData();
  }, [businessNumber]);

  // Get project data from database
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/v1/projects/${companyName}`);
        const data = await response.json();
        setProjectData(data);
      } catch(err) {
        console.log(err);
      }
    }
    fetchData();
  }, [companyName]);

  // Update project data to include icons and buttons
  const updateTable = () => {
    let listOfProjects = projectData;

    for (let i = 0; i < listOfProjects.length; i++) {
      listOfProjects[i].contactName = <div className='contact_section'><p className='contact_name'>{listOfProjects[i].contactName}</p><PhoneIcon className='phone_icon'/><EmailIcon className='email_icon'/></div>
      
      if (userData.creationRights === 'TRUE') {
        listOfProjects[i].actions = <div><img src={duplicate_icon} className='action_icons' alt='copy icon' /><img src={design_icon} className='action_icons' alt='drawing icon' /><button className='delete_btn'>Delete</button></div>
      }
      if (userData.creationRights === 'FALSE') {
        listOfProjects[i].actions = <div><button className='more_info_btn'>More info</button></div>       
      }

    }
    setProjectData(listOfProjects);
  }
  
  const onUserLogin = () => {
    setIsLoggedIn(true);
    updateTable();
  }

  const addNewProject = async () => {
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(projectInformation)
    };
    await fetch('/api/v1/projects', requestOptions);

    projectInformation.contactName = <div className='contact_section'><p className='contact_name'>{basicProjectInfo.projectContact}</p><PhoneIcon className='phone_icon'/><EmailIcon className='email_icon'/></div>
    
    setProjectData([...projectData, projectInformation]);
  }
  
  // Add icons and buttons to newly added project in table
  const updateLastTableElement = () => {
    let listOfProjects = projectData;
    let latestProject = projectData.length - 1;
      
    listOfProjects[latestProject].actions = <div><img src={duplicate_icon} className='action_icons' alt='copy icon' /><img src={design_icon} className='action_icons' alt='drawing icon' /><button className='delete_btn'>Delete</button></div>

    setProjectData(listOfProjects);
  }

  // Get company product information from database

  const onUserLogout = () => {
    setIsLoggedIn(false);
    setEmail("");
    setPassword("");
  }

  // Handle changes in tag input component
  const handleDelete = (i) => {
    setTags(tags.filter((tag, index) => index !== i));
  };

  const handleAddition = (tag) => {
    setTags([...tags, tag]);
  };

  const handleDrag = (tag, currPos, newPos) => {
    const newTags = tags.slice();

    newTags.splice(currPos, 1);
    newTags.splice(newPos, 0, tag);

    // re-render
    setTags(newTags);
  };

  const [billOfMaterials, setBillOfMaterials] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    {
      pvArray: [
        {product: 'Solar PV Module', manufacturerModel: ['JKM455M-7RL3-TV'], 
        description: '455W 156 split cell Bifacial Jinko Eagle 78TR G4B JK03 Silver Clear 40mm, 1400mm cables',
        supplier: ['BayWa Canada'], sku: 'JKO-1003', unitCost: 226, qty: 40, totalCost: 9040},
        {product: 'Junction Box', manufacturerModel: ['0799-5B'], description: 'SolaDeck-0799-5B',
        supplier: ['BayWa Canada'], sku: 'SOL-1004', unitCost: 82, qty: 2, totalCost: 164.00},
        {product: 'PV Wire', manufacturerModel: ['RPVU90 PV Wire - 10AWG/6mm - Black'],
        description: '10AWG 1000VDC XLPE Copper - Black', supplier: ['Guillevin International'],
        sku: '5400000', unitCost: 2, qty: 40, totalCost: 80.00},
        {product: 'PV Wire', manufacturerModel: ['RPVU90 PV Wire - 10AWG/6mm - Red'],
        description: '10AWG 1000VDC XLPE Copper - Red', supplier: ['Guillevin International'], sku: '5400002',
        unitCost: 2, qty: 40, totalCost: 80.00}
      ],
      hybridInverter: [
        {product: 'PV Inverter', manufacturerModel: ['Enphase IQ8+'], 
        description: 'Enphase IQ8A-72-2-US Micro Inverter',
        supplier: ['BayWa Canada'], sku: 'JKO-1003', unitCost: 202, qty: 40, totalCost: 8080.00},
        {product: 'Trunk Cable', manufacturerModel: ['Q'], 
        description: 'Q Cable Portrait (60/72 cell modules) Portrait module pitch 1.0M. Connector Pitch 1.3M',
        supplier: ['BayWa Canada'], sku: 'SOL-1004', unitCost: 17.34, qty: 40, totalCost: 693.60},
        {product: 'Disconnect Tool', manufacturerModel: ['RPVU90 PV Wire - 10AWG/6mm - Black'],
        description: 'IQ Disconnect Tool Disconnect Tool for Q Cable connectors', 
        supplier: ['Guillevin International'], sku: '5400000', unitCost: 5.59, qty: 1, totalCost: 5.59},
        {product: 'Connectors ', manufacturerModel: ['RPVU90 PV Wire - 10AWG/6mm - Red'],
        description: 'Female Field-wireable connector for Q Cable Pack of 10 connector bodies with 25 MC4 pins',
        supplier: ['Guillevin International'], sku: '5400002', unitCost: 13.81, qty: 1, totalCost: 13.81}    
      ],
      pvInverter: [],
      energyStorageSystem: [
        {product: 'Battery', manufacturerModel: ['Enphase Encharge-10'], 
        description: 'Enphase Encharge-10T Full kit w/3 x 3.36kWh bat. c/w cover, mounting bracket, screws, joiners, and wires',
        supplier: ['BayWa Canada'], sku: 'JKO-1003', unitCost: 10200, qty: 1, totalCost: 10200.00},
        {product: 'Controller', manufacturerModel: ['IQ System Controller 2'], 
        description: 'Enphase Enpower Smart Switch with 200A include Intelligent load control Generator Interconnection 240V',
        supplier: ['BayWa Canada'], sku: 'SOL-1004', unitCost: 1950, qty: 1, totalCost: 1950.00}       
      ],
      mountingSystem: [
        {product: 'PV Inverter', manufacturerModel: ['Enphase IQ8+'], 
        description: 'Enphase IQ8A-72-2-US Micro Inverter',
        supplier: ['BayWa Canada'], sku: 'JKO-1003', unitCost: 202, qty: 40, totalCost: 8080.00},
        {product: 'Trunk Cable', manufacturerModel: ['Q'], 
        description: 'Q Cable Portrait (60/72 cell modules) Portrait module pitch 1.0M. Connector Pitch 1.3M',
        supplier: ['BayWa Canada'], sku: 'SOL-1004', unitCost: 17.34, qty: 40, totalCost: 693.60},
        {product: 'Disconnect Tool', manufacturerModel: ['RPVU90 PV Wire - 10AWG/6mm - Black'],
        description: 'IQ Disconnect Tool Disconnect Tool for Q Cable connectors', 
        supplier: ['Guillevin International'], sku: '5400000', unitCost: 5.59, qty: 1, totalCost: 5.59},
        {product: 'Connectors ', manufacturerModel: ['RPVU90 PV Wire - 10AWG/6mm - Red'],
        description: 'Female Field-wireable connector for Q Cable Pack of 10 connector bodies with 25 MC4 pins',
        supplier: ['Guillevin International'], sku: '5400002', unitCost: 13.81, qty: 1, totalCost: 13.81}
      ]
    }
  );

  // Update quantity of product to customize purchase order
  const updateQuantity = (event, id) => {
    const { name, value } = event.target;
    let tableData = billOfMaterials[name];
    let quantity = parseInt(value);
    
    // Update product quanity and total cost
    tableData[id].qty = quantity;
    tableData[id].totalCost = (Math.round((tableData[id].qty * tableData[id].unitCost) * 100) / 100).toFixed(2);

    setBillOfMaterials({ [name]: tableData });
  }

  // Delete product from selected design to customize purchase order
  const deleteProduct = (event, id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      let name = event.currentTarget.id;
      let tableData = billOfMaterials[name];

      // Delete product row from table of products
      tableData.splice(id, 1);

      setBillOfMaterials({ [name]: tableData });
    }
  }
  
  return (
    <Suspense fallback="loading">
      <Toaster
        containerClassName='toaster_alert'
        toastOptions={{
          // Options on error
          duration: 4000,

          // Options on success
          success: {
            duration: 2000
          },
        }}
      />
      <Router>
        <ManageContext.Provider value={{ userData, companyName, latitude, longitude, onSearchLocation, projectLocation, addNewProject, gridType, handleNoGrid, handleLowVoltage, handleMediumVoltage, updateLastTableElement, optimizationType, handleROI, handleLCOE, handleInvestment, handleOffset, handleBasicProjectInfo, basicProjectInfo, handleAdvancedProjectInfo, advancedProjectInfo, handleOptimizationParameters, optimizationParameters, handleElectricalLoadInfo, electricalLoadInfo, handleEnergyRatesInfo, energyRatesInfo, accountType, setUserType, registrationCompanyName, handleRegistrationCompanyName, tags, handleAddition, handleDelete, handleDrag, billOfMaterials, updateQuantity, deleteProduct }}>
          <div className='App'>
            <Header isLoggedIn={isLoggedIn} onUserLogout={onUserLogout} firstName={firstName} lastName={lastName} userData={userData}/>
            
            <Routes>
              <Route path="/" element={<Content />} />
              <Route path="/login" element={<Login onUserLogin={onUserLogin} userData={userData} email={email} password={password} getEmail={getEmail} getPassword={getPassword} />} />
              <Route path="/register-designer" element={<CreateDesignerAccount />} />
              <Route path="/register-supplier" element={<CreateSupplierAccount />} />
              <Route path="/register/success" element={<RegistrationMessage />} />
              {userData.creationRights === 'TRUE' &&
                <Route path="/dashboard" element={<Dashboard projectData={projectData} userData={userData}/>} />
              }
              {userData.creationRights === 'FALSE' &&
                <Route path="/dashboard" element={<SupplierDashboard projectData={projectData} getProducts={getProducts}/>} />
              }
              <Route path="/dashboard/create-project" element={<CreateProject />} />
              <Route path="/dashboard/create-project/success" element={<SuccessMessage />}></Route>
              <Route path="/dashboard/products/existing" element={<SupplierProducts productData={productData} />}></Route>
              <Route path="/dashboard/products/update" element={<UpdateSupplierProducts />}></Route>
              <Route path="/dashboard/products/update/success" element={<UploadProductSuccess />}></Route>
            </Routes>
            
            <Footer />
          </div>
        </ManageContext.Provider>
      </Router>
    </Suspense>
  );
}

ReactDOM.render(<App />, document.getElementById('root'));




