import numbers from './numbers';

const strings = {
  main: {
    appName: 'Planet',
    share: 'Share',
    none: 'None',
    save: 'Save',
    done: 'Done',
    cancel: 'Cancel',
    discard: 'Discard',
    edit: 'Edit',
    remove: 'Remove',
    rename: 'Rename',
    confirm: 'Confirm',
    add: 'Add',
    create: 'Create',
    next: 'Next',
    back: 'Back',
    search: 'Search',
    seeAll: 'See All',
    milesAbbrev: 'mi',
    dash: '-',
    warning: 'Warning',
  },
  login: {
    login: 'Login',
    forgotPassword: 'Forgot Password?',
    noAccount: "Don't have an account?",
    signUp: 'Sign up',
    username: 'Username',
    password: 'Password',
    missingInfo: 'Missing email or password',
  },
  signUp: {
    namePrompt: 'First, please tell us your name:',
    firstName: 'First',
    lastName: 'Last',
    credPrompt: 'Now, choose your username and password:',
    confirmPassword: 'Confirm Password',
    username: 'Username',
    signUpSuccess: 'You have successfully signed up!',
    verifySuccess: 'Phone number has been verified!',
    phonePrompt: 'Next, please enter your phone number:',
    phoneNumber: 'Phone Number',
    verifyPrompt: 'Please enter the 6 digit code we sent you:',
    age: 'Age',
    sendCode: 'Send',
    code: 'Code',
    verifyCode: 'Verify Code',
    codeSendFailed: 'Code failed to send',
    codeVerifyFailed: 'Code invalid.',
    signUp: 'Sign Up',
    inputLong: 'Inputs are too long',
    passwordShort: 'Password is too short',
    termsAgreement:
      "By signing up, you agree to Rivalet's Terms and Conditions and Privacy Policy.",
    passwordsMatch: 'Passwords are not the same',
    missingFields: 'Fields are missing',
    improveExperience:
      'Lastly, help us improve your experience by filling out the following:',
    enjoy: 'Enjoy!',
  },
  poi: {
    reviews: 'Reviews',
    description: 'Description',
    info: 'Info',
    address: 'Address',
    hours: 'Hours',
    phone: 'Phone',
    website: 'Website',
    noPrice: 'No Price',
    noHours: 'No Hours',
    attributes: 'Attributes',
    open: 'Open',
    closed: 'Closed',
    images: 'Images',
  },
  search: {
    search: 'Search',
    noResultsFound: 'No Results Found',
    noResultsFoundDescription: 'Try searching for something else',
    setLocation: 'Set Location',
    tooFar: 'Radius too large',
    tooFarMessage: 'Please select a smaller radius',
  },
  greeting: {
    welcome: 'Welcome',
    morning: 'Good Morning',
    afternoon: 'Good Afternoon',
    evening: 'Good Evening',
  },
  friends: {
    friends: 'Friends',
  },
  profile: {
    yourProfile: 'Your Profile',
    bookmarks: 'Bookmarks',
    yourAlbums: 'Your Albums',
    settings: 'Settings',
    noBookmarksFound: 'No Bookmarks Found',
    noBookmarksFoundDescription: 'Try bookmarking something',
    pfpSelectError: 'Error selecting profile picture',
    pfpSizeError: `Profile picture must be less than ${
      numbers.maxPfpSize / 1000000
    }MB`,
    pfpUploadError: 'Error uploading profile picture',
  },
  event: {
    destinations: 'Destinations',
    yourEvents: 'Your Events',
    untitled: 'Untitled Event',
    backConfirmation:
      'Are you sure you want to go back? Your event will not be saved.',
    addDestination: 'Add a Destination',
    moveUp: 'Move Up',
    moveDown: 'Move Down',
    renameEvent: 'Enter a new name for this event:',
    renamePrompt: 'Enter a new name for this destination:',
    noEventsFound: 'No Events Found',
    noEventsFoundDescription:
      'Try creating an event from the plus button below',
    addSuggestion: 'Add a Suggestion',
    markAsSelected: 'Mark as Selected',
    markAsSelectedInfo:
      'Are you sure you want to mark this suggestion as the primary destination?',
    removeSuggestion: 'Remove Suggestion',
    removeSuggestionInfo: 'Are you sure you want to remove this suggestion?',
    inviteAFriend: 'Invite a Friend',
    leave: 'Leave',
    leaveEvent: 'Leave Event',
    leaveInfo: 'Are you sure you want to leave this event?',
    deleteDestination: 'Remove Destination',
    deleteDestinationInfo: 'Are you sure you want to remove this destination?',
  },
  roulette: {
    total: 'Total',
    spin: 'Spin',
    votes: 'Votes',
    rouletteSpinInfo:
      'Do you want to mark this suggestion as the primary destination?',
    spinHistory: 'Spin History',
    spinHistoryDescription:
      "Records of everyone's spins will be displayed here, whether or not they choose to accept the result.",
    result: 'Result',
    spunBy: 'Spun By',
    time: 'Time',
  },
  notifications: {
    notifications: 'Notifications',
  },
  error: {
    error: 'Error',
    markSuggestionAsSelected:
      'Unable to mark suggestion as selected. Please try again later.',
    removeSuggestion: 'Unable to remove suggestion. Please try again later.',
    loadBookmarks: 'Unable to load bookmarks. Please try again later.',
    updateBookmarks: 'Unable to update bookmarks. Please try again later.',
    saveEvent: 'Unable to save event. Please try again later.',
    fetchEvents: 'Unable to fetch events. Please try again later.',
    fetchEvent: 'Unable to fetch event. Please try again later.',
    addSuggestion: 'Unable to add suggestions. Please try again later.',
    changeVote: 'Unable to change vote. Please try again later.',
    refreshEvent: 'Unable to refresh event. Please try again later.',
    editEventName: 'Unable to edit the event name. Please try again later.',
    editEventDate:
      'Unable to edit the event date/time. Please try again later.',
    renameDestination: 'Unable to rename destination. Please try again later.',
    removeDestination: 'Unable to remove destination. Please try again later.',
    reorderDestination:
      'Unable to reorder destination. Please try again later.',
    leaveEvent: 'Unable to leave the event. Please try again later.',
    recordRouletteSpin:
      'Unable ot record the roulette spin. Please try again later.',
    makeSuggestionPrimary:
      'Unable to make suggestion primary. Please try again later.',
    loadDestinationDetails:
      'Unable to load destination details. Please try again later.',
    logOut: 'Unable to logout. Please try again later.',
    loadGenres: 'Unable to load genres. Please try again later.',
    loadPlaces: 'Unable to load places. Please try again later.',
    locationPermission: 'Location permission denied.',
  },
};

export default strings;
