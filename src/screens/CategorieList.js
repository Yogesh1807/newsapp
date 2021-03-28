import React, {useEffect, useState, useContext} from 'react';
import {FlatList, View, ActivityIndicator} from 'react-native';
import Carousel from 'react-native-snap-carousel';
import Config from 'react-native-config';

import {getScreenWidth, getScreenHeight} from '../helpers/DimensionsHelper';
import ContentPlaceholder from '../components/ContentPlaceholder';
import FlatlistItem from '../components/FlatlistItem';

const SCREEN_WIDTH = getScreenWidth();
const SCREEN_HEIGHT = getScreenHeight();

const CategorieList = ({navigation, route}) => {
  const [posts, setPosts] = useState([]);
  const [isloading, setIsLoading] = useState(true);
  const [isFetching, setIsFetching] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);

  useEffect(() => {
    if (page <= totalPage) {
      fetchLastestPost();
    } else {
      setIsFetching(false);
      alert('No data');
    }
  }, []);

  useEffect(() => {
    if (isFetching) {
      if (page <= totalPage) {
        fetchLastestPost();
      } else {
        setIsFetching(false);
        alert('No data');
      }
    }
  }, [isFetching]);

  useEffect(() => {
    console.log('pageNu', page, totalPage);
    if (page <= totalPage) {
      fetchLastestPost();
    } else {
      setIsFetching(false);
      alert('No data');
    }
  }, [page]);

  const fetchLastestPost = async () => {
    let categorie_id = route.params.categorie_id;
    console.log('categorie_id', categorie_id);
    const response = await fetch(
      `${
        Config.API_URL
      }/wp-json/wp/v2/posts?categories=${categorie_id}&per_page=10&page=${page}`,
    ).then(function(responseHea) {
      console.log('responseHea', responseHea);
      setTotalPage(Number(responseHea.headers.map['x-wp-totalpages']));
      return responseHea;
    });
    const post = await response.json();
    console.log('category post', post);
    if (page == 1) {
      setPosts(post);
    } else {
      setPosts([...posts, ...post]);
    }
    setIsLoading(false);
    setIsFetching(false);
  };

  function onRefresh() {
    setIsFetching(true);
  }
  function handleLoadMore() {
    setPage(page => page + 1);
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
  } else {
    return (
      <View>
        {/* <FlatList
          data={posts}
          onRefresh={() => onRefresh()}
          refreshing={isFetching}
          onEndReached={() => handleLoadMore()}
          onEndReachedThreshold={0.1}
          ListFooterComponent={() => renderFooter()}
          renderItem={({index, item}) => (
            <FlatlistItem item={item} navigation={navigation} />
          )}
          keyExtractor={(item, index) => index.toString()}
        /> */}
        <Carousel
          data={posts}
          renderItem={({item, index}) => (
            <React.Fragment>
              <FlatlistItem item={item} navigation={navigation} />
            </React.Fragment>
          )}
          sliderWidth={SCREEN_WIDTH}
          sliderHeight={SCREEN_HEIGHT - 190}
          itemWidth={SCREEN_WIDTH}
          itemHeight={SCREEN_HEIGHT - 190}
          // inactiveSlideOpacity={1}
          // inactiveSlideScale={1}
          style={{borderRadius: 12}}
          vertical={true}
          swipeThreshold={10}
          onRefresh={() => onRefresh()}
          refreshing={isFetching}
          onEndReached={() => handleLoadMore()}
          onEndReachedThreshold={0.1}
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

export default CategorieList;
