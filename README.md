<h1>Installation</h1>

1. Install React Native (ios or android)
2. Clone this repository
3. Install yarn globally if you haven't already (npm install yarn --global)
4. yarn install
5. Run!

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

**When adding new libraries, don't forget to '''npx pod-install ios''' if on mac
Upgrade RN library with npx react-native upgrade

<h1>Commits</h1>

Before making a commit, go to the version control tab of git in vscode and double check changed files.

<h1>Testing/Cleaning (**required before merging pull requests to main**)</h1>

```
npm run lint
npm run lint -- --fix
```

Test on android and iOS for functionality.

Test release build on android (optional):

```
npx react-native run-android --mode=release
```

Naming Scheme:
-TSX files are PascalCase
-Everything else camelCase

<h1>Deployment</h1>

1. Update package.json to have correct version

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

------------

<h1>Detox setup (INACTIVE CURRENTLY):</h1>
https://wix.github.io/Detox/docs/introduction/getting-started/

Run this in your terminal (for macs)
```
brew tap wix/brew
brew install applesimutils
```
--> make sure to run the commands above every so often to update to latest version
--> you might have to restart your computer

Run necessary build commands:

For ios debug mode, run:

```
npx detox build --configuration ios.sim.debug
```

For other OS and releases, see link for build commands to test .detocrc.js file (step 5 in Project Setup tab)

```
npm start
npx detox test --configuration ios.sim.debug
```
*see link for other OS and release versions
