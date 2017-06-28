import React from 'react';
import { StyleSheet, Text, View, Image,TouchableHighlight } from 'react-native';
import { Components, ImagePicker } from 'expo'
import Lightbox from 'react-native-lightbox';



const Photo = (props) => {
  let url;
  if(!props.image){
  }else {
    url = props.image;
  }
  return (
    <Lightbox navigator={props.navigator}>
      <Image
        style={{width: 300, height: 300 }}
        source={{ uri: url}}
      />
    </Lightbox>
  )
};




export default class App extends React.Component {

  constructor(){
    super();

    this.state = {
      latitude: 0,
      longitude: 0,

      marker: {
        lat: 0,
        long: 0,

      },

      image: '',
      showFullImage: false
    }
  }


  componentDidMount = () => {
    navigator.geolocation.getCurrentPosition((position) => {

      this.setState({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      })

    }, (error) => console.log('[App.js] error', error));
  };

  onLongPress =  (event) => {
    let location = event.nativeEvent.coordinate;
   // alert('Latitude : ' + location.latitude + ' \n Longitude : ' + location.longitude);
    let marker= {
      lat: location.latitude,
      long: location.longitude,
    };
    this.setState({
      marker,
    })
  };

  onMakerPress = () => {
   // this.marker.showCallout();
  };

  onCalloutPress = () => {
    this._pickImage();
  };

  _pickImage = () => {

    ImagePicker.launchImageLibraryAsync({
      allowsEditing: false,
      aspect: [4, 3],
    })
      .then((data) => {
        console.log('[App.js] ', data);
        this.setState({image: data.uri});
      })
      .catch((error) => console.log('[App.js] ', error))

  };

  clickImage = () => {
    this.setState({showFullImage : true})
  };

  render() {
    return (
      <View style={styles.container}>

        {
          this.state.showFullImage ? (<Photo image={this.state.image} />) : null
        }
        <Components.MapView
          style={{flex: 1}}
          onLongPress={this.onLongPress}
          region={{
            latitude: this.state.latitude,
            longitude: this.state.longitude,
            latitudeDelta: 0.09,
            longitudeDelta: 0.04,
          }}
        >
          <Components.MapView.Marker
            onPress={this.onMakerPress}
            ref={(m) => {
              this.marker = m;
            }}
            coordinate={{
              latitude: this.state.marker.lat,
              longitude: this.state.marker.long,
            }}
          >
            <Components.MapView.Callout
              onPress={this.onCalloutPress}
              style={{width: 200, backgroundColor: '#FFFF00',}}>

              <View>
                <Text>Hello world</Text>
                {/*<Photo image={this.state.image} />*/}

                {
                  this.state.image !== '' ?
                    (<TouchableHighlight
                      onPress={this.clickImage}
                    >
                      <Image source={{uri : this.state.image}} style={{width: 300, height: 300}}/>
                    </TouchableHighlight>) : null
                }

              </View>
            </Components.MapView.Callout>

          </Components.MapView.Marker>



        </Components.MapView>

      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
