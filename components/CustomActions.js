import React, { Component } from 'react';
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';
import PropTypes from 'prop-types';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';
import * as Location from 'expo-location';

const firebase = require('firebase');
require('firebase/firestore');

export default class CustomActions extends React.Component {
  onActionPress = () => {
    // array of strings to be displayed in the ActionSheet
    const options = [
      'Choose From Library',
      'Take Picture',
      'Send Location',
      'Cancel',
    ];
    // cancel button, need to determine its position in the ActionSheet. This is because ActionSheet will automatically close the view if the user presses “Cancel.”
    const cancelButtonIndex = options.length - 1;

    // React’s Context class, provides a way to pass data through the component tree without having to pass props down manually at every level.
    // this.context.actionSheet().showActionSheetWithOptions is used to hand down data (the options you want to display) to the ActionSheet component.
    this.context.actionSheet().showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
      },
      async (buttonIndex) => {
        switch (buttonIndex) {
          case 0:
            return this.pickImage();
          case 1:
            return this.takePhoto();
          case 2:
            return this.getLocation();
          default:
        }
      }
    );
  };

  /////////////////////////////////////////////////////////////
  pickImage = async () => {
    const { status } = await Permissions.askAsync(Permissions.MEDIA_LIBRARY);

    if (status === 'granted') {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
      }).catch((error) => console.error(error));

      if (!result.cancelled) {
        const imageUrl = await this.uploadImageFetch(result.uri);
        this.props.onSend({ image: imageUrl });
      }
    }
  };

  ///////////////////////////////////////////////////////////////
  takePhoto = async () => {
    const { status } = await Permissions.askAsync(
      Permissions.CAMERA,
      Permissions.MEDIA_LIBRARY
    );

    if (status === 'granted') {
      let result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
      }).catch((error) => console.error(error));

      if (!result.cancelled) {
        const imageUrl = await this.uploadImageFetch(result.uri);
        this.props.onSend({ image: imageUrl, text: '' });
      }
    }
  };

  /////////////////////////////////////////////////////////////
  getLocation = async () => {
    const { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status === 'granted') {
      const result = await Location.getCurrentPositionAsync({}).catch((error) =>
        console.log(error)
      );

      const longitude = JSON.stringify(result.coords.longitude);
      const latitude = JSON.stringify(result.coords.latitude);
      if (result) {
        this.props.onSend({
          location: {
            longitude: result.coords.longitude,
            latitude: result.coords.latitude,
          },
        });
      }
    }
  };

  ////////////////////////////////////////////////////////////////
  uploadImageFetch = async (uri) => {
    const blob = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function () {
        resolve(xhr.response);
      };
      xhr.onerror = function (e) {
        reject(new TypeError('Network request failed', e));
      };
      xhr.responseType = 'blob';
      xhr.open('GET', uri, true);
      xhr.send(null);
    });

    try {
      const imageNameBefore = uri.split('/');
      const imageName = imageNameBefore[imageNameBefore.length - 1];

      const ref = firebase.storage().ref().child(`images/${imageName}`);

      const snapshot = await ref.put(blob);
      blob.close();

      const imageDownload = await snapshot.ref.getDownloadURL();
      return imageDownload;
    } catch (e) {
      console.log(e);
    }
  };

  render() {
    return (
      <TouchableOpacity
        accessible={true}
        accessibilityLabel="More options"
        accessibilityHint="You can choose between image from your gallery, take a new photo, or send your location"
        accessibilityRole="button"
        style={[styles.container]}
        // When the user presses the button in the input field, onActionPress is called, which creates an ActionSheet that displays a set of defined actions. As soon as the user selects one of these actions, a method for performing that action (e.g., picking an image from the gallery) is called.
        onPress={this.onActionPress}
      >
        <View style={[styles.wrapper, this.props.wrapperStyle]}>
          <Text style={[styles.iconText, this.props.iconTextStyle]}>+</Text>
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: 26,
    height: 26,
    marginLeft: 10,
    marginBottom: 10,
  },
  wrapper: {
    borderRadius: 13,
    borderColor: '#b2b2b2',
    borderWidth: 2,
    flex: 1,
  },
  iconText: {
    color: '#b2b2b2',
    fontWeight: 'bold',
    fontSize: 13.5,
    textAlign: 'center',
  },
});

// Gifted Chat expects actionSheet to be a function—that’s why PropTypes was imported above
CustomActions.contextTypes = {
  actionSheet: PropTypes.func,
};
