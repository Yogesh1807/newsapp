import React, {useState, useEffect, useContext} from 'react';
import {
  FlatList,
  ScrollView,
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import ContentPlaceholder from '../components/ContentPlaceholder';
import {Card, Title} from 'react-native-paper';
import Config from 'react-native-config';
const Categories = ({navigation}) => {
  const [isloading, setisloading] = useState(true);
  const [categories, setCategories] = useState([]);
  const fetchCategorie = async () => {
    setisloading(true);
    const response = await fetch(`${Config.API_URL}/wp-json/wp/v2/categories`);
    const categories = await response.json();
    setCategories(categories);
    setisloading(false);
  };
  useEffect(() => {
    fetchCategorie();
  }, []);

  function Item({item}) {
    return (
      <TouchableOpacity
        onPress={() =>
          navigation.navigate('Categorie-News', {
            categorie_id: item.id,
            categorie_name: item.name,
          })
        }>
        <View style={styles.listItem}>
          <Image
            source={require('../assets/image/cat_icon.png')}
            style={{width: 50, height: 50, borderRadius: 30}}
          />
          <View
            style={{alignItems: 'center', justifyContent: 'center', flex: 1}}>
            <Text
              style={{
                fontWeight: 'bold',
                fontSize: 20,
              }}>
              {item.name}
            </Text>
            {/* <Text>Samsung mobiles details{item.description}</Text> */}
          </View>
          <View
            style={{
              height: 50,
              width: 50,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text style={{color: 'green'}}>{item.count}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  function RenderCat({item}) {
    return (
      <TouchableOpacity
        onPress={() =>
          navigation.navigate('Categorie-News', {
            categorie_id: item.id,
            categorie_name: item.name,
          })
        }>
        <Card>
          <Card.Content>
            <Title>{item.name}</Title>
            <Title>{item.count}</Title>
          </Card.Content>
        </Card>
      </TouchableOpacity>
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
      <View style={styles.container}>
        <FlatList
          style={{flex: 1}}
          data={categories}
          renderItem={({item}) => <Item item={item} />}
          keyExtractor={(item, index) => index.toString()}
        />
      </View>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F7F7',
    marginTop: 10,
  },
  listItem: {
    margin: 5,
    padding: 5,
    backgroundColor: '#FFF',
    width: '95%',
    flex: 1,
    alignSelf: 'center',
    flexDirection: 'row',
    borderRadius: 5,
  },
});
export default Categories;
