import React, {useEffect, useState, useContext} from 'react';
import {FlatList, View, Image, ActivityIndicator} from 'react-native';
import {Headline, Text} from 'react-native-paper';
import {useIsFocused} from '@react-navigation/native';
import Config from 'react-native-config';
import AsyncStorage from '@react-native-community/async-storage';
import Carousel from 'react-native-snap-carousel';

import FlatlistItem from '../components/FlatlistItem';
import ContentPlaceholder from '../components/ContentPlaceholder';
import {getScreenWidth, getScreenHeight} from '../helpers/DimensionsHelper';

const SCREEN_WIDTH = getScreenWidth();
const SCREEN_HEIGHT = getScreenHeight();

const Bookmark = ({navigation}) => {
  const [bookmarkpost, setbookmarkpost] = useState([]);
  const [isloading, setisloading] = useState(true);
  const [isFetching, setIsFetching] = useState(false);
  const isFocused = useIsFocused();

  useEffect(() => {
    fetchBookMark();
  }, [isFocused]);

  useEffect(() => {
    if (isFetching) {
      fetchBookMark();
    }
  }, [isFetching]);

  const fetchBookMark = async () => {
    await AsyncStorage.getItem('bookmark').then(async token => {
      res = JSON.parse(token);
      setisloading(true);
      if (res) {
        console.log('arr', res);
        const result = res.map(post_id => {
          return 'include[]=' + post_id;
        });
        let query_string = result.join('&');
        const response = await fetch(
          `${Config.API_URL}/wp-json/wp/v2/posts?${query_string}`,
        );
        const post = await response.json();
        setbookmarkpost(post);
        console.log(post);
        setisloading(false);
      } else {
        setbookmarkpost([]);
        setisloading(false);
      }
    });
  };

  function onRefresh() {
    setIsFetching(true);
  }

  function renderFooter() {
    if (isFetching) return null;
    return (
      <View
        style={{
          paddingVertical: 20,
          borderTopWidth: 1,
          borderColor: '#CED0CE',
        }}>
        <ActivityIndicator animating size="large" />
      </View>
    );
  }

  if (isloading) {
    return (
      <View style={{marginTop: 30, padding: 12}}>
        <ContentPlaceholder />
      </View>
    );
  } else if (bookmarkpost.length == 0) {
    return (
      <View
        style={{
          textAlign: 'center',
          alignItems: 'center',
          alignSelf: 'center',
        }}>
        <Image source={require('../assets/image/nobookmark.png')} />
      </View>
    );
  } else {
    return (
      <View>
        {/* <Headline style={{marginLeft: 30}}>Bookmark Post</Headline> */}

        {/* <FlatList
          data={bookmarkpost}
          renderItem={({index, item}) => (
            <React.Fragment>
              <FlatlistItem item={item} navigation={navigation} />
            </React.Fragment>
          )}
          keyExtractor={(item, index) => index.toString()}
        /> */}
        <Carousel
          data={bookmarkpost}
          renderItem={({item, index}) => (
            <React.Fragment>
              <FlatlistItem item={item} navigation={navigation} />
            </React.Fragment>
          )}
          sliderWidth={SCREEN_WIDTH}
          sliderHeight={SCREEN_HEIGHT - 190}
          itemWidth={SCREEN_WIDTH}
          itemHeight={SCREEN_HEIGHT - 190}
          style={{borderRadius: 12}}
          vertical={true}
          swipeThreshold={10}
          onRefresh={() => onRefresh()}
          refreshing={isFetching}
          // onEndReached={() => handleLoadMore()}
          // onEndReachedThreshold={0.1}
          keyExtractor={(item, index) => index.toString()}
          ListFooterComponent={() => renderFooter()}
          // nestedScrollEnabled
          // windowSize={5}
          // onSnapToItem={this.onSlideChange}
          // ListEmptyComponent={<ShortsLoader />}
        />
      </View>
    );
  }
};
export default Bookmark;
