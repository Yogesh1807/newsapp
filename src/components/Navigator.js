import React, {useContext, useEffect} from 'react';
import {ThemeContext} from './ThemeController';
import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
} from '@react-navigation/native';
import {
  Provider as PaperProvider,
  DefaultTheme as PaperDefaultTheme,
  DarkTheme as PaperDarkTheme,
} from 'react-native-paper';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

// import {trackEvent} from '../utils/analytics.utils';

import HomeScreen from '../screens/Home';
import PostSliderComponent from '../screens/PostSlider';

import CategorieScreen from '../screens/Categories';
import SettingScreen from '../screens/Setting';
import BookMarkScreen from '../screens/Bookmark';
import SinglePost from '../screens/SinglePost';
import WebScreen from '../screens/WebScreen';

import CategorieList from '../screens/CategorieList';
import Feedback from '../screens/Feedback';
import RemoveAds from '../screens/RemoveAds';
import {IApContext} from './IApController';
import {Provider} from 'react-redux';
import {applyMiddleware, createStore} from 'redux';
import thunk from 'redux-thunk';
import rootReducer from '../reducers';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {YNEWS_BRAND, WHITE} from '../constants/Colors';

const Stack = createStackNavigator();
const stactOptions = {
  headerStyle: {
    backgroundColor: YNEWS_BRAND,
    elevation: null,
    shadowOpacity: 0.9,
  },
  headerTitleStyle: {
    color: WHITE,
    fontFamily: 'Roboto-Bold',
    fontWeight: '500',
    fontSize: 22,
    textAlign: 'center',
    flexGrow: 0.75,
  },
  headerTintColor: WHITE,
};

const newsDeatilStactOptions = {
  headerStyle: {
    backgroundColor: YNEWS_BRAND,
    elevation: null,
    shadowOpacity: 0.9,
  },
  headerTitleStyle: {
    color: WHITE,
    fontFamily: 'Roboto-Bold',
    fontWeight: '500',
    fontSize: 22,
    textAlign: 'center',
    flexGrow: 0.75,
  },
  headerTintColor: WHITE,
};

function HomeStack() {
  // navigation.setOptions({tabBarVisible: false});
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="FirmNews"
        options={stactOptions}
        component={PostSliderComponent}
      />
      <Stack.Screen
        name="News-Detail"
        component={SinglePost}
        options={newsDeatilStactOptions}
      />
      <Stack.Screen
        options={{headerShown: false}}
        name="Web-Screen"
        component={WebScreen}
      />
    </Stack.Navigator>
  );
}
function BookMarkStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Bookmark"
        component={BookMarkScreen}
        options={stactOptions}
      />
      <Stack.Screen
        name="News-Detail"
        component={SinglePost}
        options={newsDeatilStactOptions}
      />
      <Stack.Screen name="Web-Screen" component={WebScreen} />
    </Stack.Navigator>
  );
}
function SettingStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Setting"
        component={SettingScreen}
        options={stactOptions}
      />
      <Stack.Screen
        name="Feedback"
        component={Feedback}
        options={stactOptions}
      />
      <Stack.Screen
        name="Remove-Ads"
        component={RemoveAds}
        options={stactOptions}
      />
    </Stack.Navigator>
  );
}
function CategorieStack({navigation}) {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Categories"
        component={CategorieScreen}
        options={stactOptions}
      />
      <Stack.Screen
        name="Categorie-News"
        component={CategorieList}
        options={stactOptions}
      />
      <Stack.Screen
        name="News-Detail"
        component={SinglePost}
        options={newsDeatilStactOptions}
      />
      <Stack.Screen name="Web-Screen" component={WebScreen} />
    </Stack.Navigator>
  );
}

// console.disableYellowBox = true;
const store = createStore(rootReducer, applyMiddleware(thunk));
const tabBarOnPress = (nav, value) => {
  console.log('tabpress 137=>', nav, value);
};
export default (Navigator = () => {
  const {theme} = useContext(ThemeContext);

  const CustomPaperDefaultTheme = {
    ...PaperDefaultTheme,
    roundness: 2,
    backgroundColor: 'white',
    // colors: {
    //   ...PaperDefaultTheme.colors,
    //   primary: '#3498db',
    //   accent: '#f1c40f',
    // },
  };

  const CustomNavTheme = {
    ...PaperDefaultTheme,
    tabBarOptions: {
      activeTintColor: 'white',
      inactiveTintColor: '#ededed',
      // backgroundColor: YNEWS_BRAND,
      style: {
        backgroundColor: YNEWS_BRAND,
        // opacity: 0.6,
        // position: 'absolute',
        // left: 10,
        // right: 10,
        // bottom: 0,
        // elevation: 0,
        // borderRadius: 8,
        // height: 55,
        // fontSize: 14,
      },
    },
    // colors: {
    //   ...PaperDefaultTheme.colors,
    //   primary: '#3498db',
    //   accent: '#f1c40f',
    // },
  };

  let paper_theme = theme ? PaperDarkTheme : CustomPaperDefaultTheme;
  let nav_theme = theme ? DarkTheme : CustomNavTheme;
  const {initIAp, checkValidPurchase, products} = useContext(IApContext);
  useEffect(() => {
    initIAp();
    checkValidPurchase();
  }, []);
  const Tab = createBottomTabNavigator();
  return (
    <Provider store={store}>
      <PaperProvider theme={paper_theme}>
        <NavigationContainer theme={nav_theme}>
          <Tab.Navigator
            screenOptions={({route, navigation}) => ({
              tabBarIcon: ({focused, color, size}) => {
                let iconName;
                if (route.name === 'Home') {
                  iconName = focused ? 'home' : 'home-outline';
                } else if (route.name === 'Bookmark') {
                  iconName = focused ? 'bookmark' : 'bookmark-outline';
                } else if (route.name === 'Categories') {
                  iconName = focused ? 'apps' : 'apps-box';
                } else if (route.name === 'Settings') {
                  iconName = focused ? 'settings' : 'settings-box';
                }
                return (
                  <MaterialCommunityIcons
                    name={iconName}
                    size={30}
                    color={color}
                  />
                );
              },
            })}
            tabBarOptions={nav_theme.tabBarOptions}>
            <Tab.Screen name="Home" {...props} component={HomeStack} />
            <Tab.Screen name="Categories" component={CategorieStack} />
            <Tab.Screen name="Bookmark" component={BookMarkStack} />
            <Tab.Screen name="Settings" component={SettingStack} />
          </Tab.Navigator>
        </NavigationContainer>
      </PaperProvider>
    </Provider>
  );
});
