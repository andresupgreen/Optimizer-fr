import React from 'react';
import { useLocation } from 'react-router-dom';
import InstagramIcon from '@mui/icons-material/Instagram';
import CopyrightIcon from '@mui/icons-material/Copyright';
import './footer.css'

export const Footer = () => {
  let location = useLocation();

  // Remove footer on login page
  if (location.pathname === '/login' || location.pathname === '/register/success') {
    return null;
  }
  else {
    return (
      <div id='page_footer'>
        <footer>
            <InstagramIcon id='instagram_icon'/>
            <div id='copyright_section'>
              <CopyrightIcon id='copyright_icon'/>
              <p id='copyright'>Copyright 2022 Upgreen Inc.</p>
            </div>
        </footer>
      </div>
    )
  }

}