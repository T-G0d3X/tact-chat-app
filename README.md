


# tact-chat-app
  https://user-images.githubusercontent.com/69514083/116515822-150f0500-a8cd-11eb-946d-390d95ab7729.mp4


## *Description*

A chat app for mobile devices using React Native. This app provides users with a chat interface and options to share images and their location.

The app is written with React Native and developed with Expo. Chat conversation are stored locally and in the Google Firebase Database. For authentication the app use also Google Firebase to authenticate users anonymously. The Gifted Chat library is used to create the chat interface and its functionality.

The app allows users to pick and send images from their phone's image library. When the user grants permission to access their media library and camera. Users can share their location only when permission is granted.

## *Key Features*

-   A page where users can enter their name and choose a background color for the chat screen before joining the chat.
-   A page displaying the conversation, as well as an input field and submit button.
-   The chat must provide users with two additional communication features: sending images and location data.
-   Data gets stored online and offline.

## *Get Started*

### Technical Requirements

-   Node.js
-   Expo Command Line Interface

```
npm install expo-cli --global
```

 1.   **To run the app on your mobile device**, install the Expo app through your app store.
    
    
 2. You also need and Expo account which can be created via 
    [Expo.io](https://expo.io/)
    
    -   You need to login into Expo in order to access the App

    
 -  **If you like to run the app on your machine through a simulator/emulator,** you need:
    
    -   [iOS Simulator](https://docs.expo.io/workflow/ios-simulator/)
    -   [Android Studio](https://docs.expo.io/workflow/android-studio-emulator/)

### *Installing Dependencies*

In the project directory install the application's dependencies.

```
npm install
```

### *Running the App*

```
expo start
```

#### Running the App on your mobile device

After using "expo start" command to run the app,  scan the QR code displayed in the command line interface via your mobile device.

#### Running the App through a simulator/emulator

With the command line interface open after using the "expo start" command, press:

-   'a' to open the app with an Android emulator
-   'i' to open the app with the iOS simulator

## Technologies used

-   [React Native](https://reactnative.dev/)
-   [Expo](https://expo.io/)
-   [Google Firestore](https://firebase.google.com/)
-   [Gifted Chat](https://github.com/FaridSafi/react-native-gifted-chat)
-   [Android Studio](https://developer.android.com/studio)
