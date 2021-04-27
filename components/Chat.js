import React from 'react';
// View, Platform to determine the OS currently in use
// KeyboardAvoidingView when keyboard is out of position (covering txt input filed)
import { View, Platform, KeyboardAvoidingView, LogBox } from 'react-native';
// first install Gifted Chat npm install react-native-gifted-chat --save then import
import {
  GiftedChat,
  Bubble,
  InputToolbar,
  Day,
} from 'react-native-gifted-chat';
import AsyncStorage from '@react-native-community/async-storage';
import NetInfo from '@react-native-community/netinfo';
import MapView from 'react-native-maps';
import CustomActions from './CustomActions';

const firebase = require('firebase');
require('firebase/firestore');

LogBox.ignoreAllLogs();

export default class Chat extends React.Component {
  constructor() {
    super(),
      // state initialization
      (this.state = {
        messages: [],
        user: {
          _id: '',
          name: '',
          avatar: '',
        },
        uid: 0,
        isConnected: false,
        image: null,
        location: null,
      });
    //////////////////////////////////////////////////////////////////////
    // 🔶 this will allow us to connect app to Firestore
    if (!firebase.apps.length) {
      firebase.initializeApp({
        apiKey: 'AIzaSyCMqY7WM-hviuO1rNbBWDKgqfxPx_HFAiI',
        authDomain: 'tact-chat-de562.firebaseapp.com',
        projectId: 'tact-chat-de562',
        storageBucket: 'tact-chat-de562.appspot.com',
        messagingSenderId: '650393361745',
        appId: '1:650393361745:web:b6597aef80e257146f4770',
        measurementId: 'G-Z4F856DZN2',
      });
    }
    // 🔶 reference to Firestore collection, we can use a reference to query its documents. This stores and retrieves the chat messages your users send.
    this.referenceChatMessages = firebase.firestore().collection('messages');
  }
  async getMessages() {
    let messages = '';
    try {
      messages = (await AsyncStorage.getItem('messages')) || [];
      this.setState({
        messages: JSON.parse(messages),
      });
    } catch (error) {
      console.log(error.message);
    }
  }

  async saveMessages() {
    try {
      await AsyncStorage.setItem(
        'messages',
        JSON.stringify(this.state.messages)
      );
    } catch (error) {
      console.log(error.message);
    }
  }

  async deleteMessages() {
    try {
      await AsyncStorage.removeItem('messages');
      this.setState({
        messages: [],
      });
    } catch (error) {
      console.log(error.message);
    }
  }

  /////////////////////////////////////////////////////////////////////////

  // this function gets called right after the Chat component mounts
  componentDidMount() {
    this.getMessages();
    // 🔶❗ To avoid "Warning: Cannot update a component from inside the function body of a different component"
    let name = this.props.route.params.name;
    this.props.navigation.setOptions({ title: name });

    NetInfo.fetch().then((connection) => {
      if (connection.isConnected) {
        this.setState({
          isConnected: true,
        });

        this.referenceChatMessages = firebase
          .firestore()
          .collection('messages');
        // 🔶 As soon as the app (and message list component) loads, you’ll want to first check whether the user is signed in. If they’re not, you need to create a new user.
        this.authUnsubscribe = firebase
          .auth()
          .onAuthStateChanged(async (user) => {
            if (!user) {
              await firebase.auth().signInAnonymously();
            }

            //🔶 update user state with currently active(inputed) user data
            this.setState({
              uid: user.uid,
              user: {
                name: this.props.route.params.name,
                avatar: 'https://placeimg.com/140/140/any',
                createdAt: new Date(),
              },
              image: this.state.image,
              location: {
                longitude: 11.5249684,
                latitude: 48.0643933,
              },
              messages: [],
            });
            this.unsubscribe = this.referenceChatMessages
              .orderBy('createdAt', 'desc')
              .onSnapShot(this.onCollectionUpdate);
          });
      } else {
        this.setState({
          isConnected: false,
        });
        this.getMessages();
        window.alert('Hey! Connect to internet to send messages.');
      }
    });
  }

  /////////////////////////////////////////////////////////////////////
  componentWillUnmount() {
    // 🔶 stop listening for authentication and collection changes
    this.authUnsubscribe();
  }

  /////////////////////////////////////////////////////////////////////////
  //  🔶 whenever onSnapShot() is fired we need to call a function, it retrieves the current data in messages collection and store it in state lists, alowing that data to be rendered in view
  onCollectionUpdate = (querySnapshot) => {
    const messages = [];
    // go through each document
    querySnapshot.forEach((doc) => {
      // get QueryDocumentSnapshot's data
      let data = doc.data();
      messages.push({
        _id: data._id,
        text: data.text,
        createdAt: data.createdAt.toDate(),
        user: data.user,
        image: data.image || null,
        location: data.location || null,
      });
    });
    this.setState({
      messages,
    });
  };

  ///////////////////////////////////////////////////////////////////////
  // 🔶
  addMessage() {
    const message = this.state.messages[0];
    this.referenceChatMessages.add({
      _id: message._id,
      // uid: this.state.uid,
      text: message.text || '',
      createdAt: message.createdAt,
      user: message.user,
      image: message.image || null,
      location: message.location || null,
    });
  }

  ///////////////////////////////////////////////////////////////////////
  // 🔶 custom function- called when a user sends a message
  //❗ setState() is called with the parameter previousState, which is a reference to the component’s state at the time the change is applied. Then comes the append() function provided by GiftedChat, which appends the new message to the messages object. The message a user has just sent gets appended to the state messages so that it can be displayed in the chat
  onSend(messages = []) {
    this.setState(
      (previousState) => ({
        messages: GiftedChat.append(previousState.messages, messages),
      }),
      () => {
        this.saveMessages();
        this.addMessage();
      }
    );
  }

  ////////////////////////////////////////////////////////////////////////
  // 🔶 added prop renderBubble to Gifted Chat Component, then altered Bubble component is returned from Gifted Chat. First we inherit props with the       ...props keyword. Then we give new wrapperStyle. We target right speech bubble(one from sender) and give it color black.
  renderBubble(props) {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: '#000',
          },
        }}
      />
    );
  }

  renderInputToolbar(props) {
    if (this.state.isConnected === false) {
    } else {
      return <InputToolbar {...props} />;
    }
  }

  // is responsible for creating the circle button
  renderCustomActions = (props) => {
    return <CustomActions {...props} />;
  };

  renderCustomView(props) {
    const { currentMessage } = props;
    if (currentMessage.location) {
      return (
        <MapView
          style={{ width: 150, height: 100, borderRadius: 13, margin: 3 }}
          region={{
            latitude: currentMessage.location.latitude,
            longitude: currentMessage.location.longitude,
            latitudeDelta: 0.922,
            longitudeDelta: 0.0421,
          }}
        />
      );
    }
    return null;
  }

  renderDay(props) {
    return <Day {...props} textStyle={{ color: '#7a49a5' }} />;
  }

  /////////////////////////////////////////////////////////////////////
  render() {
    let color = this.props.route.params.color;

    return (
      // code for rendering chat interface
      <View style={{ flex: 1, backgroundColor: color }}>
        <GiftedChat
          renderBubble={this.renderBubble.bind(this)}
          renderInputToolbar={this.renderInputToolbar.bind(this)}
          renderActions={this.renderCustomActions}
          renderCustomView={this.renderCustomView}
          messages={this.state.messages}
          isConnected={this.state.isConnected}
          showUserAvatar
          onSend={(messages) => this.onSend(messages)}
          user={this.state.user}
          renderDay={this.renderDay}
        />
        {Platform.OS === 'android' ? <KeyboardAvoidingView /> : null}
      </View>
    );
  }
}
