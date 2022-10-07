import React from 'react';
import {Navigation} from 'react-minimal-side-navigation';
import 'react-minimal-side-navigation/lib/ReactMinimalSideNavigation.css';
import { useTranslation } from 'react-i18next';

import upgreen from '../assets/upgreen-symbol.png';
import catalog from '../assets/catalog-icon-18.png';
import rate from '../assets/rate.png';
import cost_icon from '../assets/cost-icon-24.png';

export const SideMenu = () => {
  const { t } = useTranslation();

    return (
      <div>
          <Navigation
              // you can use your own router's api to get pathname
              activeItemId="/"
              onSelect={({itemId}) => {
                // maybe push to the route
              }}
              items={[
                {
                  title: t('projects'),
                  itemId: '/projects',
                  elemBefore: () => <img src={upgreen} alt='products symbol' className='menu_icons' />,
                  subNav: [
                    {
                      title: t('in_progress'),
                      itemId: '/projects/progress',
                    },
                    {
                      title: t('completed'),
                      itemId: '/projects/completed',
                    },
                    {
                      title: t('on_hold'),
                      itemId: '/projects/hold',
                    },
                  ]
                },
                {
                  title: t('catalogue'),
                  itemId: '/catalogue',
                  elemBefore: () => <img src={catalog} alt='book symbol' className='menu_icons'/>,
                  subNav: [
                    {
                      title: t('inhouse_products'),
                      itemId: '/catalogue/inhouseproducts',
                    },
                    {
                      title: t('external_products'),
                      itemId: '/catalogue/externalproducts',
                    },
                  ],
                },
                {
                  title: t('electricity_rates'),
                  itemId: '/rates',
                  elemBefore: () => <img src={rate} alt='rate symbol' className='menu_icons'/>,
                  subNav: [
                    {
                      title: t('custom_rates'),
                      itemId: '/rates/custom',
                    },
                    {
                      title: t('existing_rates'),
                      itemId: '/rates/existing',
                    },
                  ],
                },
                {
                  title: t('load_profiles'),
                  itemId: '/profiles',
                  elemBefore: () => <img src={rate} alt='rate symbol' className='menu_icons'/>,
                  subNav: [
                    {
                      title: t('custom_load_profiles'),
                      itemId: '/profiles/custom',
                    },
                    {
                      title: t('existing_load_profiles'),
                      itemId: '/profiles/existing',
                    },
                  ],
                },
                {
                  title: t('incentives'),
                  itemId: '/incentives', 
                  elemBefore: () => <img src={cost_icon} alt='money symbol' className='menu_icons'/>,
                },
              ]}
            />
      </div>
    )
}
