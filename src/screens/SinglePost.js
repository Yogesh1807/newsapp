import React, {useState, useEffect, useContext} from 'react';
import {
  Share,
  ScrollView,
  TouchableOpacity,
  View,
  Dimensions,
  Linking,
} from 'react-native';
import {
  Avatar,
  withTheme,
  Card,
  Title,
  Paragraph,
  List,
  Button,
} from 'react-native-paper';
import {IApContext} from '../components/IApController';
import {AdmobContext} from '../components/AdmobController';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import HTML, {getParentsTagsRecursively} from 'react-native-render-html';
import ImageLoad from 'react-native-image-placeholder';
import AsyncStorage from '@react-native-community/async-storage';
import Config from 'react-native-config';
import ImageView from 'react-native-image-viewing';

import ContentPlaceholder from '../components/ContentPlaceholder';
import moment from 'moment';
import {getScreenWidth, getScreenHeight} from '../helpers/DimensionsHelper';

const SCREEN_WIDTH = getScreenWidth();
const SCREEN_HEIGHT = getScreenHeight();

const SinglePost = ({route, navigation, theme}) => {
  const [isLoading, setisLoading] = useState(true);
  const [post, setpost] = useState([]);
  const [bookmark, setbookmark] = useState(false);
  const [imgVisible, setImgVisible] = useState(false);

  console.log('Siglepost props', navigation);

  const {
    products,
    makePurchase,
    makeSubscription,
    getPurchases,
    showads,
    pointfromiap,
  } = useContext(IApContext);
  let {renderBanner, initRewardAds, point, setPoint} = useContext(AdmobContext);

  useEffect(() => {
    fetchPost();
    fetchPoint();
    console.log(products);
  }, []);
  const fetchPost = async () => {
    let post_id = route.params.post_id;
    const response = await fetch(
      `${Config.API_URL}/wp-json/wp/v2/posts?_embed&include=${post_id}`,
    );
    const post = await response.json();
    console.log('currentPost', post, SCREEN_WIDTH, SCREEN_HEIGHT);
    setpost(post);

    setisLoading(false);
    renderBookMark(post_id);
  };
  async function fetchPoint() {
    await AsyncStorage.getItem('yourcanreadfreepost').then(async res => {
      let remain_point = JSON.parse(res);
      let currpoint = remain_point <= 0 ? 0 : remain_point - 1;
      await AsyncStorage.setItem(
        'yourcanreadfreepost',
        JSON.stringify(currpoint),
      );
      setPoint(currpoint);
    });
  }
  const renderPaymentButton = () => {
    return (
      <View>
        <Title style={{textAlign: 'center'}}>
          Pay {products.products[1].localizedPrice} for read more 10 post
        </Title>
        <Button
          icon="bullhorn"
          color={'#53ccf9'}
          mode="contained"
          onPress={() => makePurchase(products.products[1].productId)}>
          Pay now
        </Button>
      </View>
    );
  };

  const renderContent = () => {
    if (showads && point <= 0) {
      return renderPaymentButton();
    }
    return (
      <Card.Content style={{paddingVertical: 10, paddingHorizontal: 10}}>
        <HTML
          // classesStyles={{
          //   'size-large': {
          //     width: SCREEN_WIDTH,
          //     height: 200,
          //   },
          // }}
          key={theme.dark}
          html={post[0].content.rendered}
          // imagesMaxWidth={SCREEN_WIDTH}
          // contentWidth={SCREEN_WIDTH}
          // computeEmbeddedMaxWidth={computeEmbeddedMaxWidth}
          tagsStyles={{
            p: {color: theme.colors.text, fontSize: 18},
            img: {
              // width: 300,
              // height: 900,
              marginTop: 10,
              objectFit: 'cover',
              // flex: 1,
            },
            pre: {color: theme.colors.accent},
            h1: {color: theme.colors.text},
            h2: {color: theme.colors.text},
            h3: {color: theme.colors.text},
            li: {color: theme.colors.text},
          }}
          onLinkPress={(e, href, htmlAttribs) => {
            console.log('linkPress', e, href, htmlAttribs);
            // Linking.openURL(href);
            navigation.navigate('Web-Screen', {
              url: href,
              name: post[0].title.rendered,
            });
          }}
        />
      </Card.Content>
    );
  };
  // const onShare = async (title, uri) => {
  //   Share.share({
  //     title: title,
  //     url: uri,
  //   });
  // };

  const onShare = async title => {
    let uri = 'https://play.google.com/store/apps/details?id=com.firmnews';
    try {
      const result = await Share.share({
        message: title + ' : ' + uri,
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
          alert(result.activityType);
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
        alert('dismissed');
      }
    } catch (error) {
      alert(error.message);
    }
  };

  const saveBookMark = async post_id => {
    setbookmark(true);
    await AsyncStorage.getItem('bookmark').then(token => {
      const res = JSON.parse(token);
      if (res !== null) {
        let data = res.find(value => value === post_id);
        if (data == null) {
          res.push(post_id);
          AsyncStorage.setItem('bookmark', JSON.stringify(res));
          alert('Your bookmark post');
        }
      } else {
        let bookmark = [];
        bookmark.push(post_id);
        AsyncStorage.setItem('bookmark', JSON.stringify(bookmark));
        alert('Your bookmark post');
      }
    });
  };
  const removeBookMark = async post_id => {
    setbookmark(false);
    const bookmark = await AsyncStorage.getItem('bookmark').then(token => {
      const res = JSON.parse(token);
      return res.filter(e => e !== post_id);
    });
    await AsyncStorage.setItem('bookmark', JSON.stringify(bookmark));
    alert('Your unbookmark post');
  };
  const renderBookMark = async post_id => {
    await AsyncStorage.getItem('bookmark').then(token => {
      const res = JSON.parse(token);
      if (res != null) {
        let data = res.find(value => value === post_id);
        return data == null ? setbookmark(false) : setbookmark(true);
      }
    });
  };
  if (isLoading) {
    return (
      <View style={{paddingLeft: 10, paddingRight: 10, marginTop: 10}}>
        <ContentPlaceholder />
      </View>
    );
  } else {
    return (
      <ScrollView>
        <Card>
          <Card.Content>
            {/* <Title>{post[0].title.rendered}</Title> */}
            <HTML
              key={theme.dark}
              html={`<h3>${post[0].title.rendered}</h3>`}
              tagsStyles={{
                h3: {color: theme.colors.text},
              }}
            />
            <List.Item
              title={`${post[0]._embedded.author[0].name}`}
              description={`${post[0]._embedded.author[0].description}`}
              left={props => {
                return (
                  <Avatar.Image
                    size={55}
                    source={{
                      uri: `${post[0]._embedded.author[0].avatar_urls[96]}`,
                    }}
                  />
                );
              }}
              right={props => {
                if (bookmark == true) {
                  return (
                    <TouchableOpacity
                      onPress={() => removeBookMark(post[0].id)}>
                      <MaterialCommunityIcons
                        name="bookmark"
                        size={30}
                        color={theme.colors.text}
                      />
                    </TouchableOpacity>
                  );
                } else {
                  return (
                    <TouchableOpacity onPress={() => saveBookMark(post[0].id)}>
                      <MaterialCommunityIcons
                        name="bookmark-outline"
                        size={30}
                        color={theme.colors.text}
                      />
                    </TouchableOpacity>
                  );
                }
              }}
            />
            <List.Item
              title={`Published on ${moment(
                post[0].date,
                'YYYYMMDD',
              ).fromNow()}`}
              right={props => {
                return (
                  <TouchableOpacity
                    onPress={() => onShare(post[0].title.rendered)}>
                    <MaterialCommunityIcons
                      name="share"
                      size={30}
                      color={theme.colors.text}
                    />
                  </TouchableOpacity>
                );
              }}
            />
            <Paragraph />
          </Card.Content>
          <TouchableOpacity
            onPress={() => {
              console.log('chamari');
              setImgVisible(true);
            }}>
            <ImageView
              images={[{uri: post[0].jetpack_featured_media_url}]}
              imageIndex={0}
              visible={imgVisible}
              onRequestClose={() => setImgVisible(false)}
            />
            <ImageLoad
              style={{width: '100%', height: 250}}
              loadingStyle={{size: 'large', color: 'grey'}}
              source={{uri: post[0].jetpack_featured_media_url}}
            />
          </TouchableOpacity>
          {showads && renderBanner()}
          {renderContent()}
        </Card>
      </ScrollView>
    );
  }
};
export default withTheme(SinglePost);
