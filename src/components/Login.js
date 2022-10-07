import React from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import bcrypt from 'bcryptjs';

import './login.css'
import Cookies from 'js-cookie';

export const Login = (props) => {

  const navigate = useNavigate();
  const { t } = useTranslation();

  // Check if password inputted by user and stored password match
  const validatePassword = () => {
    let doesPasswordMatch = bcrypt.compareSync(props.password, props.userData.password);
    return doesPasswordMatch;
  }

  const onLogin = (event) => {
    event.preventDefault();
    // Check if user email exists
    if (typeof props.userData.email === 'undefined' && !props.userData.email) {
      toast.error('The email address provided is not registered', {
        id: 'user_not_registered'
      });
    }

    let passwordMatches = validatePassword();
    let hashedPassword = bcrypt.hashSync(props.password);
    // if (props.userData.role === 'designer' && passwordMatches)
    if (passwordMatches) {

      const requestOptions = {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ 
          email: props.userData.email,
          password: hashedPassword
        })
      };
      fetch('/api/v1/users/login', requestOptions)
        .then(response => {
          Cookies.set('token', response.headers.get('set-cookie'));
        })
        
      props.onUserLogin();
      navigate("/dashboard");
      toast.success("Login successful!", {
        id: 'login_success'
      });

    }
    // else if (props.userData.role !== 'designer') {
    //   toast.error('Access Denied: This feature requires a designer account', {
    //     id: 'access_denied'
    //   });
    // }
    else {
      toast.error('Incorrect password', {
        id: 'incorrect_password'
      });
    }

  };
  return (
    <div id='login_page' className='container_fluid'>
      <form id='login_section' onSubmit={onLogin} method='post'>
        <table>
          <tbody>
            <tr>
              <td><label htmlFor='email'>{t('username')}</label></td>
              <td><input type='email' placeholder={t('corporate_email')} id='email' name='email' onChange={props.getEmail} value={props.email}></input></td>
            </tr>
            <tr>
              <td className='spacer'></td>
            </tr>
            <tr>
              <td><label htmlFor='password'>{t('password')}</label></td>
              <td><input type='password' placeholder={t('enter_password')} id='password' name='password'  onChange={props.getPassword} value={props.password} minLength='8' required></input></td>
            </tr>
            <tr>
              <td></td>
              <td><p id='password_note'>{t('password_min')}</p></td>
            </tr>
          </tbody>
        </table>
        <input type='submit' id='login_btn' value={t('login')}></input>
      </form>
      <a href='/login' className='login_page_links'>{t('forgot_password')}</a>
      <a href='/login' className='login_page_links'>{t('login_google')}</a>
      <br></br>
      <a href='/register-designer' className='login_page_links'>{t('create_designer')}</a>
      <a href='/register-supplier' className='login_page_links'>{t('create_supplier')}</a>
    </div> 
  )
}