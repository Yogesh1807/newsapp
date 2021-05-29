import React, {useState, useEffect, useContext} from 'react';
import {connect} from 'react-redux';

import {View, FlatList, ActivityIndicator, StyleSheet} from 'react-native';
import {Headline, Title} from 'react-native-paper';
import Config from 'react-native-config';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Carousel from 'react-native-snap-carousel';

import {IApContext} from '../components/IApController';
import {AdmobContext} from '../components/AdmobController';
import ContentPlaceholder from '../components/ContentPlaceholder';
import FlatlistItem from '../components/FlatlistItem';
import {NetworkContext} from '../components/NetworkController';
import {getScreenWidth, getScreenHeight} from '../helpers/DimensionsHelper';

const SCREEN_WIDTH = getScreenWidth();
const SCREEN_HEIGHT = getScreenHeight();

const PostSlider = ({navigation}, props) => {
  const [posts, setPosts] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const [page, setPage] = useState(1);
  const [Allpages, setAllpages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    props.getAllPostList();
  }, []);

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

  return (
    <View style={{flex: 1}}>
      <Carousel
        data={posts}
        renderItem={({item, index}) => (
          <FlatlistItem item={item} navigation={navigation} />
        )}
        sliderWidth={SCREEN_WIDTH}
        sliderHeight={SCREEN_HEIGHT - 150}
        itemWidth={SCREEN_WIDTH}
        itemHeight={SCREEN_HEIGHT - 150}
        inactiveSlideOpacity={1}
        inactiveSlideScale={1}
        vertical={true}
        swipeThreshold={10}
        onEndReached={() => handleLoadMore()}
        onEndReachedThreshold={0.1}
      />
    </View>
  );
};

const mapStateToProps = state => {
  console.log('allpost state', state);
  return {
    page: state.reducer.page,
    allPosts: state.reducer.newsList,
  };
};
const mapDispatchToProps = dispatch => ({
  getAllPostList: page => dispatch(fetchAllNews(page)),
});

export const PostSliderComponent = connect(
  mapStateToProps,
  mapDispatchToProps,
)(PostSlider);
// export default PostSlider;
