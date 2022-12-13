import React, { useContext } from 'react';
import {Navigation} from 'react-minimal-side-navigation';
import 'react-minimal-side-navigation/lib/ReactMinimalSideNavigation.css';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { ManageContext } from '../index.js';

import upgreen from '../assets/upgreen-symbol.png';
import catalog from '../assets/catalog-icon-18.png';
import rate from '../assets/rate.png';
import cost_icon from '../assets/cost-icon-24.png';

export const SideMenu = () => {
  const { userData } = useContext(ManageContext);
  const { t } = useTranslation();
  const navigate = useNavigate();
    
  return (
    <div>
      {userData.creationRights === 'TRUE' &&
        <Navigation
          // you can use your own router's api to get pathname
          activeItemId="/"
          onSelect={({itemId}) => {
            navigate(itemId);
          }}
          items={[
            {
              title: t('projects'),
              itemId: '/dashboard',
              elemBefore: () => <img src={upgreen} alt='products symbol' className='menu_icons' />,
              subNav: [
                {
                  title: t('in_progress'),
                  itemId: '/dashboard/projects/progress',
                },
                {
                  title: t('completed'),
                  itemId: '/dashboard/projects/completed',
                },
                {
                  title: t('on_hold'),
                  itemId: '/dashboard/projects/hold',
                },
              ]
            },
            {
              title: t('catalogue'),
              itemId: 1,
              elemBefore: () => <img src={catalog} alt='book symbol' className='menu_icons'/>,
              subNav: [
                {
                  title: t('inhouse_products'),
                  itemId: '/dashboard/catalogue/inhouse-products',
                },
                {
                  title: t('external_products'),
                  itemId: '/dashboard/catalogue/external-products',
                },
              ],
            },
            {
              title: t('electricity_rates'),
              itemId: 2,
              elemBefore: () => <img src={rate} alt='rate symbol' className='menu_icons'/>,
              subNav: [
                {
                  title: t('custom_rates'),
                  itemId: '/dashboard/rates/custom',
                },
                {
                  title: t('existing_rates'),
                  itemId: '/dashboard/rates/existing',
                },
              ],
            },
            {
              title: t('load_profiles'),
              itemId: 3,
              elemBefore: () => <img src={rate} alt='rate symbol' className='menu_icons'/>,
              subNav: [
                {
                  title: t('custom_load_profiles'),
                  itemId: '/dashboard/profiles/custom',
                },
                {
                  title: t('existing_load_profiles'),
                  itemId: '/dashboard/profiles/existing',
                },
              ],
            },
            {
              title: t('incentives'),
              itemId: 4, 
              elemBefore: () => <img src={cost_icon} alt='money symbol' className='menu_icons'/>,
            },
          ]}
        />
      }

      {userData.creationRights === 'FALSE' &&
        <Navigation
          // you can use your own router's api to get pathname
          activeItemId="/"
          onSelect={({itemId}) => {
            navigate(itemId);
          }}
          items={[
            {
              title: 'Projects',
              itemId: '/dashboard',
              elemBefore: () => <img src={upgreen} alt='products symbol' className='menu_icons' />,

            },
            {
              title: 'Products',
              itemId: 1,
              elemBefore: () => <img src={rate} alt='rate symbol' className='menu_icons'/>,
              subNav: [
                {
                  title: 'Existing Price List',
                  itemId: '/dashboard/products/existing',
                },
                {
                  title: 'Update Price List',
                  itemId: '/dashboard/products/update',
                }
              ]
            },
            {
              title: 'Reports',
              itemId: 2,
              elemBefore: () => <img src={catalog} alt='book symbol' className='menu_icons'/>,
              subNav: [
                {
                  title: 'In Process',
                  itemId: '/dashboard',
                },
                {
                  title: 'Purchase History',
                  itemId: '/dashboard',
                },
                {
                  title: 'Demand Forecast',
                  itemId: '/dashboard'
                }
              ]
            }
          ]}
        />
      }
    </div>
  )
}
