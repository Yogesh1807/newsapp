import React from 'react';
import {TouchableOpacity} from 'react-native';
import HTMLRender from 'react-native-render-html';
import ImageLoad from 'react-native-image-placeholder';
import moment from 'moment';
import {Card, Title, Paragraph, withTheme} from 'react-native-paper';

const FlatlistItem = ({item, navigation, theme}) => {
  return (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate('SinglePost', {
          post_id: item.id,
          name: item.title.rendered,
        })
      }>
      <Card
        style={{
          shadowOffset: {width: 5, height: 5},
          width: '100%',
          borderRadius: 12,
          alignSelf: 'center',
          marginBottom: 10,
        }}>
        <Card.Content>
          {/* <Title>{item.title.rendered}</Title> */}
          <HTMLRender
            key={theme.dark}
            html={`<h3>${item.title.rendered}</h3>`}
            tagsStyles={{
              h3: {color: theme.colors.text},
            }}
          />
          <Paragraph>Published on {moment(item.date).fromNow()}</Paragraph>
        </Card.Content>
        <ImageLoad
          style={{height: 390}}
          loadingStyle={{size: 'large', color: 'grey'}}
          source={{uri: item.jetpack_featured_media_url}}
          resizeMode="cover"
        />
        <Card.Content>
          <Card.Content>
            <HTMLRender
              key={theme.dark}
              html={item.excerpt.rendered}
              tagsStyles={{
                p: {color: theme.colors.text},
              }}
            />
          </Card.Content>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );
};
export default withTheme(FlatlistItem);
