<h1>Installation</h1>

1. Install React Native (ios or android)
2. Clone this repository
3. Create a .env file in the root directory of the project using the .env.example file as a template
4. Ask for the .env file contents from the project owner
5. Install yarn globally if you haven't already (npm install yarn --global)
6. yarn install
7. Run! (see below)
8. (optional) If you run into a @env error, try resetting the react native cache with ```npm start -- --reset-cache```

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

**When adding new libraries, don't forget to '''npx pod-install ios''' if on mac
Upgrade RN library with npx react-native upgrade

**If you add to the .env file, remember to update the '@env' module in declarations.d.ts

Naming Scheme:
-TSX files are PascalCase
-Everything else camelCase

<h1>Deployment</h1>

1. Testing procedure before deployment
- Test release versions on both android and iOS on different screen sizes
- android: npx react-native run-android --mode=release
- iOS: npx react-native run-ios --mode Release

2. Update package.json to have correct version

<h3>Android: </h3>

In android/app/build.gradle, increment versionCode and update versionName if needed.

Make sure you have the keystore file under android/app

```
cd android
./gradlew bundleRelease
```

AAB should be generated under android/app/build/outputs/bundle/release. Upload that file
to the google play store.

<h3>iOS: </h3>

[WRITE IOS CHECKLIST HERE]