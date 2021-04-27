import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ImageBackground,
  StyleSheet,
} from 'react-native';

const backgroundImage = require('../assets/Background-Image.png');

export default class Start extends React.Component {
  constructor(props) {
    super(props);
    this.state = { text: '', color: '' };
  }

  render() {
    return (
      <ImageBackground source={backgroundImage} style={styles.img}>
        <Text style={styles.heading}>Tact Chat</Text>

        <View style={styles.container}>
          <TextInput
            style={styles.textInput}
            onChangeText={(text) => this.setState({ text })}
            placeholder="Your Name"
            placeholderTextColor={'#757083'}
            value={this.state.text}
          />
          <Text style={styles.chooseBckCol}>Choose Background Color:</Text>
          <View
            style={{ flexDirection: 'row', justifyContent: 'space-around' }}
          >
            <TouchableOpacity
              accessible={true}
              accessibilityLabel="Green color"
              accessibilityHint="Choose background color"
              accessibilityRole="button"
              style={styles.circle1}
              onPress={() => {
                this.setState({ color: '#B9C6AE' });
              }}
            ></TouchableOpacity>
            <TouchableOpacity
              accessible={true}
              accessibilityLabel="Blue color"
              accessibilityHint="Choose background color"
              accessibilityRole="button"
              style={styles.circle2}
              onPress={() => {
                this.setState({ color: '#AEB9C6' });
              }}
            ></TouchableOpacity>
            <TouchableOpacity
              accessible={true}
              accessibilityLabel="Rose color"
              accessibilityHint="Choose background color"
              accessibilityRole="button"
              style={styles.circle3}
              onPress={() => {
                this.setState({ color: '#C6AEB9' });
              }}
            ></TouchableOpacity>
            <TouchableOpacity
              accessible={true}
              accessibilityLabel="Grey color"
              accessibilityHint="Choose background color"
              accessibilityRole="button"
              style={styles.circle4}
              onPress={() => {
                this.setState({ color: '#AEAEAE' });
              }}
            ></TouchableOpacity>
          </View>

          <TouchableOpacity
            accessible={true}
            accessibilityLabel="Start Chatting Button"
            accessibilityHint="Go to chat screen"
            accessibilityRole="button"
            style={styles.btn}
            title="Start Chatting"
            onPress={() =>
              this.props.navigation.navigate('Chat', {
                name: this.state.text,
                color: this.state.color,
              })
            }
          >
            <Text style={styles.text}>Start Chatting</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    height: '44%',
    width: '88%',
    alignSelf: 'center',
    backgroundColor: 'white',
    paddingTop: '5%',
    marginTop: '45%',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 10,
  },
  textInput: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    width: '88%',
    fontSize: 16,
    fontWeight: '300',
    opacity: 0.5,
    paddingLeft: '5%',
    alignContent: 'center',
  },
  img: {
    width: '100%',
    height: '100%',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  heading: {
    fontSize: 45,
    alignSelf: 'center',
    paddingTop: 100,
    color: 'white',
  },
  chooseBckCol: {
    alignSelf: 'flex-start',
    fontWeight: '300',
    color: '#757083',
    paddingLeft: '5%',
  },
  circle1: {
    backgroundColor: '#B9C6AE',
    width: 40,
    height: 40,
    borderRadius: 25,
    margin: '5%',
  },
  circle2: {
    backgroundColor: '#AEB9C6',
    width: 40,
    height: 40,
    borderRadius: 25,
    margin: '5%',
  },
  circle3: {
    backgroundColor: '#C6AEB9',
    width: 40,
    height: 40,
    borderRadius: 25,
    margin: '5%',
  },
  circle4: {
    backgroundColor: '#AEAEAE',
    width: 40,
    height: 40,
    borderRadius: 25,
    margin: '5%',
  },
  btn: {
    marginBottom: '5%',
    alignItems: 'center',
    backgroundColor: '#757083',
    padding: 10,
    width: '88%',
    height: '20%',
    justifyContent: 'center',
  },
});
