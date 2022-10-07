import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import GreenIcon from '../assets/green_icon.png';
import { Trans, useTranslation } from 'react-i18next';

import './content.css';

export const Content = () => {
  const { t } = useTranslation();

  return (
    <Container fluid>
      <Row id='content_summary'>
          <Col md={8}>
            <h1 id='content_summary_title'>
              <Trans components={{ br: <br />}}>
                content_summary_title
              </Trans>
            </h1>
            <button className='open_account_btn'>{t('open_design')}</button><br></br>
            <button className='open_account_btn'>{t('open_sell')}</button><br></br>
            <button className='open_account_btn'>{t('open_buy')}</button>
          </Col>
          <Col>
            <br></br>
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
                <Trans components={{ br: <br />}}>
                  summary_point4
                </Trans>
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

      <Row id='content_details'>
          <h1 id='content_details_title'>
            <Trans components={{ br: <br />}}>
              content_details_title
            </Trans>
          </h1>
          <Col md={4}>
            <div className='description'>
              <h5 className='content_details_subtitle'>{t('content_subtitle1')}</h5>
              <p>{t('detail_point1')}</p>
            </div>
            <div className='description'>
              <h5 className='content_details_subtitle'>{t('content_subtitle2')}</h5>
              <p>{t('detail_point2')}</p>
            </div>
            <div className='description'>
              <h5 className='content_details_subtitle'>{t('content_subtitle3')}</h5>
              <p>{t('detail_point3')}</p>
            </div>
          </Col>
          <Col md={{ span: 4, offset: 2}}>
            <div className='description'>
              <h5 className='content_details_subtitle'>{t('content_subtitle4')}</h5>
              <p>{t('detail_point4')}</p>
            </div>
            <div className='description'>
              <h5 className='content_details_subtitle'>{t('content_subtitle5')}</h5>
              <p>{t('detail_point5')}</p>
            </div>
            <div className='description'>
              <h5 className='content_details_subtitle'>{t('content_subtitle6')}</h5>
              <p>{t('detail_point6')}</p>
            </div>
          </Col>
      </Row>
    </Container>
  )
}