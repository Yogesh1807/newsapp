import React from 'react';

import SplashScreen from 'react-native-splash-screen';
import AsyncStorage from '@react-native-community/async-storage';
import OneSignal from 'react-native-onesignal';

import Navigators from './src/components/Navigator';
import {ThemeController} from './src/components/ThemeController';
import {NetworkController} from './src/components/NetworkController';
import {AdmobController} from './src/components/AdmobController';
import {IApController} from './src/components/IApController';

export default function App() {
  React.useEffect(() => {
    SplashScreen.hide();
    initPoint();
    OneSignal.init('23f8ed57-39e6-4375-a33e-d9b94e13e19c');
    OneSignal.addEventListener('ids', res => {
      console.log(res);
    });
  }, []);

  async function initPoint() {
    let initPoint = await AsyncStorage.getItem('yourcanreadfreepost');
    console.log('initPoint', initPoint);
    if (initPoint == null) {
      await AsyncStorage.setItem('yourcanreadfreepost', '1');
    }
  }
  return (
    <IApController>
      <AdmobController>
        <NetworkController>
          <ThemeController>
            <Navigators />
          </ThemeController>
        </NetworkController>
      </AdmobController>
    </IApController>
  );
}
