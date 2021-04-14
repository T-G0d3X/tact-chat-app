import React from 'react';
// View, Platform to determine the OS currently in use
// KeyboardAvoidingView when keyboard is out of position (covering txt input filed)
import { View, Platform, KeyboardAvoidingView } from 'react-native';
// first install Gifted Chat npm install react-native-gifted-chat --save then import
import { GiftedChat, Bubble } from 'react-native-gifted-chat';

export default class Chat extends React.Component {
  constructor() {
    super();
    // state initialization
    this.state = {
      messages: [],
    };
  }

  // this function gets called right after the Chat component mounts
  //❗ set the state with a static message so that we are be able to see each element of the UI displayed on screen right away
  componentDidMount() {
    this.setState({
      // messages need to follow this format in Gifted Chat libary
      messages: [
        {
          _id: 1,
          text: 'Hello Tihomir, how are you?',
          createdAt: new Date(),
          user: {
            _id: 2,
            name: 'React Native',
            avatar: 'https://placeimg.com/140/140/any',
          },
        },
        {
          _id: 2,
          text: `User ${this.props.route.params.name} entered the chat`,
          createdAt: new Date(),
          system: true,
        },
      ],
    });
  }

  // custom function- called when a user sends a message
  //❗ setState() is called with the parameter previousState, which is a reference to the component’s state at the time the change is applied. Then comes the append() function provided by GiftedChat, which appends the new message to the messages object. The message a user has just sent gets appended to the state messages so that it can be displayed in the chat
  onSend(messages = []) {
    this.setState((previousState) => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }));
  }

  // added prop renderBubble to Gifted Chat Component, then altered Bubble component is returned from Gifted Chat. First we inherit props with the       ...props keyword. Then we give new wrapperStyle. We target right speech bubble(one from sender) and give it color black.
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

  render() {
    let name = this.props.route.params.name;
    let color = this.props.route.params.color;

    this.props.navigation.setOptions({ title: name });

    return (
      // code for rendering chat interface
      <View style={{ flex: 1, backgroundColor: color }}>
        <GiftedChat
          renderBubble={this.renderBubble.bind(this)}
          messages={this.state.messages}
          onSend={(messages) => this.onSend(messages)}
          user={{ _id: 1 }}
        />
        {Platform.OS === 'android' ? <KeyboardAvoidingView /> : null}
      </View>
    );
  }
}
