import React, {memo, useState} from 'react';
import {TouchableOpacity} from 'react-native';
import HTMLRender from 'react-native-render-html';
import ImageLoad from 'react-native-image-placeholder';
import moment from 'moment';
import {Card, Title, Paragraph, withTheme} from 'react-native-paper';
import {getScreenWidth, getScreenHeight} from '../helpers/DimensionsHelper';

const SCREEN_WIDTH = getScreenWidth();
const SCREEN_HEIGHT = getScreenHeight();
console.log('SCREEN_HEIGHT', SCREEN_HEIGHT);
let cardHeight = SCREEN_HEIGHT - 185;
const FlatlistItem = ({item, navigation, theme}) => {
  return (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate('News-Detail', {
          post_id: item.id,
          name: item.title.rendered,
        })
      }>
      <Card
        style={{
          // shadowOffset: {width: 5, height: 5},
          // width: SCREEN_WIDTH,
          borderRadius: 0,
          alignSelf: 'center',
          marginBottom: 0,
          paddingHorizontal: 0,
          paddingVertical: 0,
          height: cardHeight,
        }}>
        <Card.Content style={{paddingHorizontal: 10, marginVertical: 0}}>
          {/* <Title>{item.title.rendered}</Title> */}
          <HTMLRender
            key={theme.dark}
            html={`<h3>${item.title.rendered}</h3>`}
            tagsStyles={{
              h3: {color: theme.colors.text},
            }}
          />
          <Paragraph style={{marginVertical: 5}}>
            Published on {moment(item.date).fromNow()}
          </Paragraph>
        </Card.Content>
        {/* <Card.Cover
          style={{height: cardHeight - 330, marginVertical: 10}}
          source={{uri: item.jetpack_featured_media_url}}
        /> */}
        <ImageLoad
          style={{
            width: SCREEN_WIDTH,
            height: cardHeight - 330,
            marginVertical: 10,
          }}
          placeholderStyle={{
            width: SCREEN_WIDTH,
            height: SCREEN_HEIGHT - 600,
          }}
          loadingStyle={{size: 'large', color: 'grey'}}
          source={{uri: item.jetpack_featured_media_url}}
          resizeMode="contain"
        />
        <Card.Content style={{paddingHorizontal: 10}}>
          <HTMLRender
            imagesMaxWidth={SCREEN_WIDTH}
            key={theme.dark}
            html={item.excerpt.rendered}
            tagsStyles={{
              p: {color: theme.colors.text, fontSize: 18},
              // img: {width: SCREEN_WIDTH},
            }}
            // contentWidth={SCREEN_WIDTH}
          />
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );
};

function arePropsEqual(prevProps, nextProps) {
  return prevProps.item === nextProps.item;
}
export default memo(withTheme(FlatlistItem), arePropsEqual);
