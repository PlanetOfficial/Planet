<h1>Installation</h1>

1. Install React Native (ios or android)
2. Clone this repository
3. npm install or yarn install
4. Run!

To run on android, run
```
npx react-native run-android
```

To run on ios,
```
cd ios && pod install
npx react-native start
npx react-native run-ios
```

5. Copy environment variables

<h1>Testing/Cleaning</h1>
```
yarn eslint-check
yarn lint
```

<h1>Deployment</h1>
Android:
```
yarn android-release
```

**See React Native guide on deploying to app stores