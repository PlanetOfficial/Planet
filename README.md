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

<h1>Commits</h1>

Before making a commit, go to the version control tab of git and double check changed files.

<h1>Testing/Cleaning (**required before merging pull requests to main**)</h1>

Make E2E tests for new features and run them
(see below for Detox instructions)

```
npm run lint
npm run lint -- --fix
```

Test on android and iOS for functionality.

Check for hard coded constants, try to put them in a separate file.
do ?. instead of . when appropriate

Naming Scheme:
-TSX files are PascalCase
-Everything else camelCase

UPDATE LIBRARIES OFTEN!!

<h1>Deployment (checklist is incomplete, see official RN guide)</h1>
Android: 

```
yarn android-release
```

Test on android and iOS constantly!!

**See React Native guide on deploying to app stores

**When adding new libraries, don't forget to '''npx pod-install ios''' if on mac
Upgrade RN library with npx react-native upgrade

------------

<h1>Detox setup:</h1>
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

how to test individual files:
```
npx detox test /e2e/*.test.js --configuration ios.sim.debug
```

replace * with the prefix it's been named