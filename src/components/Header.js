import React, { useState, useEffect } from 'react';
import Input from '@material-ui/core/Input';
import SearchIcon from '@mui/icons-material/Search';
import InputAdornment from '@material-ui/core/InputAdornment';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import NotificationsIcon from '@mui/icons-material/Notifications';
import PersonIcon from '@mui/icons-material/Person';
import Logo from '../assets/logo.png';
import { Container, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import './header.css';
import './dashboard.css';
import '../i18n';

export const Header = (props) => {
  const { t, i18n } = useTranslation();
  const [selectedLanguage, setSelectedLanguage] = useState();

  const navigate = useNavigate();

  const onLoginHeader = () => {
    navigate("/login");
  }

  const goToHomepage = () => {
    navigate("/");
  }

  const goToDashboard = () => {
    navigate("/dashboard");
  }

  const onLogout = () => {
    props.onUserLogout();
    navigate("/login");
  }
  
  // Get saved language preference from local storage
  let key = localStorage.getItem('i18nextLng');

  const onLanguageChange = (event) => {
    setSelectedLanguage(event.target.value);
  }
  
  useEffect(() => {
    i18n.changeLanguage(selectedLanguage);
  }, [i18n, selectedLanguage]);

  // Redirect to create project page
  const createProject = () => {
    if (props.userData.creationRights === 'TRUE') {
      navigate("/dashboard/create-project");
    }
    else {
      alert('Access Denied: This feature requires creation rights');
    }
  }

  if (props.isLoggedIn) {
    return (
      <Container fluid id='page_header'>
        <header>
          <Row>
            <Col id='left_col_header'>
              <img src={Logo} alt='Upgreen logo' id='logo' onClick={goToDashboard}/>
              <Input
                id='search_input'
                placeholder={t('search_products_header')}
                startAdornment={
                  <InputAdornment position="start">
                    <SearchIcon id='search_icon'/>
                  </InputAdornment>
                }
              />
            </Col>
            <Col id='right_col_header'>
              <div className='header_dropdown'>
                <button id='add_btn_header'><AddCircleOutlineIcon id='header_add_icon'/>{t('create')}</button>
                <div className='dropdown_content'>
                  <button onClick={createProject}>New Project</button>
                  <button onClick={createProject}>New Rate</button>
                  <button onClick={createProject}>New Load Profile</button>
                  <button onClick={createProject}>New Product</button>
                </div>
              </div>
              <NotificationsIcon id='notification_icon' />
              <PersonIcon id='user_icon'/>
              <p id='user_name'>{props.firstName} {props.lastName}</p>
              <select name='languages' id='languages' onChange={onLanguageChange} defaultValue={key}>
                <option value='en'>EN</option>
                <option value='es'>ES</option>
              </select>
              <button id='login_btn_header' onClick={onLogout}>Log out</button>
            </Col>
          </Row>
        </header>
      </Container>
    )
  }
  else {
    return (
      <Container fluid id='page_header'>
        <header>
          <Row>
            <Col id='left_col_header'>
              <img src={Logo} alt='Upgreen logo' id='logo' onClick={goToHomepage}/>
              <Input
              id='search_input'
              placeholder={t('search_products_header')}
              startAdornment={
                <InputAdornment position="start">
                  <SearchIcon id='search_icon'/>
                </InputAdornment>
              }
              />  
            </Col>
            <Col id='right_col_header'>
              <button id='login_btn_header' onClick={onLoginHeader}>{t('login')}</button>
              <NotificationsIcon id='notification_icon' />
              <PersonIcon id='user_icon'/>
              <select name='languages' id='languages' onChange={onLanguageChange} defaultValue={key}>
              <option value='en'>EN</option>
              <option value='es'>ES</option>
              </select>   
            </Col>
          </Row>
        </header>
      </Container>
    );
  }

}
