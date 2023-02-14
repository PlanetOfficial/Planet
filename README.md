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

5. Copy environment variables (if there are any)

<h1>Testing/Cleaning (**required before merging pull requests**)</h1>

```
npm run test

npm run lint
npm run lint -- --fix
```

<h1>Deployment</h1>
Android:
```yarn android-release
```

Test on android and iOS constantly!!

**See React Native guide on deploying to app stores

**When adding new libraries, don't forget to '''npx pod-install ios''' if on mac