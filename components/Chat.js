import React, { Component } from 'react';
// View, Platform to determine the OS currently in use
// KeyboardAvoidingView when keyboard is out of position (covering txt input filed)
import { View, Platform, KeyboardAvoidingView } from 'react-native';
// first install Gifted Chat npm install react-native-gifted-chat --save then import
import { GiftedChat, Bubble } from 'react-native-gifted-chat';

const firebase = require('firebase');
require('firebase/firestore');

export default class Chat extends React.Component {
  constructor() {
    super();
    // state initialization
    this.state = {
      messages: [],
      user: {
        _id: '',
        name: '',
        avatar: '',
      },
      uid: 0,
    };
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

  /////////////////////////////////////////////////////////////////////////

  // this function gets called right after the Chat component mounts
  componentDidMount() {
    // 🔶❗ To avoid "Warning: Cannot update a component from inside the function body of a different component"
    let name = this.props.route.params.name;
    this.props.navigation.setOptions({ title: name });
    // 🔶 As soon as the app (and message list component) loads, you’ll want to first check whether the user is signed in. If they’re not, you need to create a new user.
    this.authUnsubscribe = firebase.auth().onAuthStateChanged(async (user) => {
      if (!user) {
        await firebase.auth().signInAnonymously();
      }

      //🔶 update user state with currently active(inputed) user data
      this.setState({
        user: {
          _id: user.uid,
          name: this.props.route.params.name,
          avatar: 'https://placeimg.com/140/140/any',
        },
        messages: [],
      });
      this.referenceChatMessages = firebase.firestore().collection('messages');
      this.unsubscribe = this.referenceChatMessages
        .orderBy('createdAt', 'desc')
        .onSnapShot(this.onCollectionUpdate);
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
      text: message.text,
      createdAt: message.createdAt,
      user: message.user,
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

  /////////////////////////////////////////////////////////////////////
  render() {
    let color = this.props.route.params.color;

    return (
      // code for rendering chat interface
      <View style={{ flex: 1, backgroundColor: color }}>
        <GiftedChat
          renderBubble={this.renderBubble.bind(this)}
          messages={this.state.messages}
          onSend={(messages) => this.onSend(messages)}
          user={this.state.user}
        />
        {Platform.OS === 'android' ? <KeyboardAvoidingView /> : null}
      </View>
    );
  }
}
