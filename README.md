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

<h1>Testing/Cleaning (**required before merging pull requests**)</h1>

```
npm run test (this command is a optional, sometimes node modules can give issues)

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

<h1>Deployment</h1>
Android:
```yarn android-release
```

Test on android and iOS constantly!!

**See React Native guide on deploying to app stores

**When adding new libraries, don't forget to '''npx pod-install ios''' if on mac
Upgrade RN library with npx react-native upgrade

------------

When merging pull requests, go through the following checklist:
-Run Testing/Cleaning code procedure
-Test on android and iOS
