import React, {Component} from 'react';
import {
  Text,
  StyleSheet,
  View,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import {WebView} from 'react-native-webview';
import HTML, {getParentsTagsRecursively} from 'react-native-render-html';

import Icon from 'react-native-vector-icons/MaterialIcons';
// import {connect} from 'react-redux';
// import {bindActionCreators} from 'redux';
// import Spinner from 'react-native-loading-spinner-overlay';

import {BLACK, WHITE, YNEWS_BRAND} from '../constants/Colors';
import {FONT_SIZE_SMALL} from '../constants/Dimens';
// import {getStatusBarHeight} from 'react-native-status-bar-height';
import {getScreenHeight} from '../helpers/DimensionsHelper';

// import {
//   setCurrentNewsSlideIndex,
//   fetchCategoryNews,
//   fetchTopicNews,
//   fetchAllYnews,
// } from '../reducers/news';

const SCREEN_HEIGHT = getScreenHeight();
const STATUS_BAR_HEIGHT = 35; //getStatusBarHeight();
const WebScreen = ({route, navigation, theme}) => {
  let url = route.params.url;
  let name = route.params.name;

  return (
    <>
      <View style={styles.container}>
        {/* <Spinner
          visible={false}
          textContent={'Data is Loading...'}
          textStyle={SpinnerStyles.SpinnerText}
        /> */}
        <View style={styles.top}>
          <Icon
            name="chevron-left"
            color={WHITE}
            size={STATUS_BAR_HEIGHT * 0.8}
            onPress={() => navigation.goBack()}
          />
          <HTML
            // key={theme.dark}
            html={`<h3>${name}</h3>`}
            tagsStyles={{
              h3: {color: WHITE},
            }}
          />
          {/* <Icon name="more-vert" color={WHITE} size={STATUS_BAR_HEIGHT * 0.7} /> */}
        </View>
        <View>
          {/* <Text>{JSON.stringify(this.props.currentSlideData)}</Text> */}
        </View>
        <View style={styles.webViewContainer}>
          <WebView
            source={{
              uri: url,
            }}
            style={styles.webViewContainer}
            startInLoadingState
            scrollEnabled
            scalesPageToFit
            javaScriptEnabled={true}
            zoomable={false}
          />
        </View>
      </View>
    </>
  );

  const SpinnerStyles = StyleSheet.create({
    MainContainer: {
      flex: 1,
      backgroundColor: '#FAFAFA',
      padding: 8,
      justifyContent: 'center',
      alignItems: 'center',
    },

    text: {
      textAlign: 'center',
      fontSize: 22,
    },

    SpinnerText: {
      color: '#ffff',
    },
  });
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'hidden',
  },
  top: {
    height: STATUS_BAR_HEIGHT * 1.75,
    backgroundColor: YNEWS_BRAND,
    color: WHITE,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 10,
  },
  title: {
    color: WHITE,
    fontSize: FONT_SIZE_SMALL,
  },
  webViewContainer: {
    minHeight: SCREEN_HEIGHT + 30,
  },
});

export default WebScreen;
// export default connect(
//   state =>
//     // console.log('state', state),
//     ({
//       currentNewsSlideIndex: state.news.currentNewsSlideIndex,
//       isWebViewVisible: state.news.isWebViewVisible,
//       allYnews: state.news.allYnews,
//       isLoading: state.news.isLoading,
//       currentSlideData: state.news.allYnews[state.news.currentNewsSlideIndex]
//         ? state.news.allYnews[state.news.currentNewsSlideIndex]
//         : null,
//     }),
//   dispatch => ({
//     // actions: bindActionCreators({fetchAllYnews}, dispatch),
//   }),
// )(WebScreen);
