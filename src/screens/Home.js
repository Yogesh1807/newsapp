import React, {useState, useEffect, useContext} from 'react';
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

const Home = ({navigation}) => {
  const [posts, setPosts] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const [page, setPage] = useState(1);
  const [Allpages, setAllpages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const {isConnected} = useContext(NetworkContext);
  let {renderBanner} = useContext(AdmobContext);
  let {showads} = useContext(IApContext);
  console.log('isLoading', isLoading);

  useEffect(() => {
    if (isFetching) {
      fetchLastestPost();
    }
  }, [isFetching]);

  useEffect(() => {
    console.log('useeffectPage', page);
    if (page > 1) {
      fetchLastestPost();
    }
  }, [page]);

  useEffect(() => {
    if (isConnected) {
      fetchLastestPost();
    } else {
      setIsLoading(false);
    }
  }, [isConnected]);

  function onRefresh() {
    setIsFetching(true);
  }
  const handleLoadMore = () => {
    if (page < Allpages) {
      setPage(page + 1);
    } else {
      setIsFetching(false);
      setIsLoading(false);
      alert('No more posts are available');
    }
  };

  const fetchLastestPost = async () => {
    console.log('page>>>', page);
    if (page <= Allpages) {
      const response = await fetch(
        `${Config.API_URL}/wp-json/wp/v2/posts?per_page=10&page=${page}`,
      ).then(res => {
        // console.log('resHeaders', res);
        if (res !== null) {
          setAllpages(Number(res.headers.map['x-wp-totalpages']));
        }
        return res;
      });
      console.log(Config.API_URL);
      const post = await response.json();
      console.log('postdata', post);
      if (page == 1) {
        setPosts(post);
        setIsFetching(false);
        setIsLoading(false);
      } else {
        setPosts([...posts, ...post]);
        setIsFetching(false);
        setIsLoading(false);
      }
    } else {
      setIsFetching(false);
      setIsLoading(false);
      alert('No more posts are available');
    }
  };

  useEffect(() => {
    setIsLoading(true);
    fetchLastestPost();
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
  if (isLoading) {
    return (
      <View style={{paddingLeft: 10, paddingRight: 10}}>
        {/* <Headline style={{marginLeft: 23}}>Lastest Post</Headline> */}
        <ContentPlaceholder />
      </View>
    );
  } else if (!isConnected) {
    return (
      <View style={{alignSelf: 'center', alignItems: 'center'}}>
        <MaterialCommunityIcons name={'wifi-off'} size={150} color={'black'} />
        <Title style={{textAlign: 'center'}}>
          Your are offline App will automatically reload when your back to
          online
        </Title>
      </View>
    );
  } else {
    return (
      <View style={{flex: 1, backgroundColor: 'white'}}>
        <Carousel
          data={posts}
          renderItem={({item, index}) => (
            <FlatlistItem item={item} navigation={navigation} />
          )}
          sliderWidth={SCREEN_WIDTH}
          sliderHeight={SCREEN_HEIGHT - 150}
          itemWidth={SCREEN_WIDTH}
          itemHeight={SCREEN_HEIGHT - 150}
          // inactiveSlideOpacity={1}
          // inactiveSlideScale={1}
          style={{backgroundColor: 'red'}}
          vertical={true}
          swipeThreshold={10}
          onRefresh={() => onRefresh()}
          refreshing={isFetching}
          onEndReached={() => handleLoadMore()}
          onEndReachedThreshold={0.1}
          keyExtractor={(item, index) => index.toString()}
          ListFooterComponent={() => renderFooter()}
          // nestedScrollEnabled
          // windowSize={10}
          // onSnapToItem={this.onSlideChange}
          ListEmptyComponent={
            <View style={{paddingLeft: 10, paddingRight: 10}}>
              <ContentPlaceholder />
            </View>
          }
        />
      </View>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  item: {
    width: SCREEN_WIDTH - 60,
    height: SCREEN_WIDTH - 60,
  },
  imageContainer: {
    flex: 1,
    marginBottom: Platform.select({ios: 0, android: 1}), // Prevent a random Android rendering issue
    backgroundColor: 'white',
    borderRadius: 8,
  },
  image: {
    ...StyleSheet.absoluteFillObject,
    resizeMode: 'cover',
  },
});

export default Home;
