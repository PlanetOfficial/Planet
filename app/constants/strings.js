import numbers from './numbers';

const strings = {
  main: {
    appName: 'Planet',
    none: 'None',
    save: 'Save',
    done: 'Done',
    cancel: 'Cancel',
    discard: 'Discard',
    remove: 'Remove',
    rename: 'Rename',
    confirm: 'Confirm',
    add: 'Add',
    next: 'Next',
    search: 'Search',
    seeAll: 'See All',
    warning: 'Warning',
    milesAbbrev: 'mi',
    edit: 'Edit',
  },
  title: {
    home: 'Home',
    search: 'Explore',
    library: 'Events',
    profile: 'Profile',
    suggestions: 'Suggestions',
    friends: 'Friends',
    requests: 'Requests',
  },
  login: {
    login: 'Login',
    forgotPassword: 'Forgot Password?',
    signUp: 'Sign up',
    username: 'Username',
    password: 'Password',
    missingInfo: 'Missing username or password',
    newPassword: 'New Password',
    resetPassword: 'Reset Password',
    passwordResetSuccess: 'Password was successfully reset!',
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
    gender: 'Gender',
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
    info: 'Info',
    address: 'Address',
    hours: 'Hours',
    phone: 'Phone',
    website: 'Website',
    noPrice: 'No Price',
    noHours: 'No Hours',
    noRating: 'No Rating',
    attributes: 'Attributes',
    open: 'Open',
    closed: 'Closed',
    images: 'Images',
  },
  search: {
    search: 'Search',
    searchFriends: 'Search Friends',
    noResultsFound: 'No Results Found',
    noResultsFoundDescription: 'Try searching for something else',
    setLocation: 'Set Location',
    tooFar: 'Radius too large',
    tooFarMessage: 'Please select a smaller radius',
  },
  greeting: {
    morning: 'Good Morning',
    afternoon: 'Good Afternoon',
    evening: 'Good Evening',
  },
  friends: {
    friends: 'Friends',
    noFriendsFound: 'No Friends Found',
    friendRequest: 'Friend Request',
    friendRequests: 'Friend Requests',
    pendingRequest: 'Pending Request',
    pendingRequests: 'Pending Requests',
    mutualEvents: 'Shared Events',
    addFriend: 'Add Friend',
    unfriend: 'Unfriend',
    cancelRequest: 'Cancel Request',
    accept: 'Accept',
    reject: 'Reject',
    noMutualEventsFound: 'No Mutual Events Found',
    friendsWith: 'Friends with',
    and: 'and',
    other: 'other',
    others: 'others',
    mutualFriend: 'Mutual Friend',
    mutualFriends: 'Mutual Friends',
    mutualFriendsDescriptions: 'You have these friends in common',
    noSuggestionsFound: 'No Suggestions Found',
    noRequestsFound: 'No Requests Found',
    createFriendGroup: 'Create a Friend Group',
    fgCreateBackConfirmation: 'Are you sure you want to go back?',
    friendGroup: 'Friend Group',
    friendGroups: 'Friend Groups',
    customize: 'Customize',
    members: 'Members',
    renameFriendGroup: 'Enter a new name for this friend group:',
    deleteFriendGroup: 'Delete Friend Group',
    deleteFriendGroupInfo: 'Are you sure you want to delete this friend group?',
    friendGroupName: 'Friend Group Name',
    friendGroupNameInfo:
      'Enter a name for this friend group:\nNote: friend groups are for your own and will not be shared with others.',
  },
  profile: {
    yourProfile: 'Your Profile',
    bookmarks: 'Bookmarks',
    yourAlbums: 'Your Albums',
    albums: 'Albums',
    noBookmarksFound: 'No Bookmarks Found',
    noBookmarksFoundDescription: 'Try bookmarking something',
    pfpSelectError: 'Error selecting profile picture',
    pfpSizeError: `Profile picture must be less than ${
      numbers.maxPfpSize / 1000000
    }MB`,
    pfpUploadError: 'Error uploading profile picture',
    editProfile: 'Edit Profile',
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
    create: 'Create',
    suggest: 'Suggest',
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
  settings: {
    settings: 'Settings',
    account: 'Account',
    contactUs: 'Contact Us',
    locations: 'Locations',
    notifications: 'Push Notifications',
    privacy: 'Privacy',
    profile: 'Profile',
    openLocationSettings: 'Open Location Settings',
    resetPassword: 'Reset Password',
    logout: 'Logout',
    removeAccount: 'Remove Account',
  },
  error: {
    error: 'Error',
    ambiguousError: 'Something went wrong. Please try again later.',
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

    loadGenres: 'Unable to load genres. Please try again later.',
    loadPlaces: 'Unable to load places. Please try again later.',
    locationPermission: 'Location permission denied.',
    loadFriendsList: 'Unable to load friends info. Please try again later.',
    loadFriendRequests:
      'Unable to load friend requests. Please try again later.',
    acceptFriendRequest:
      'Unable to accept friend request. Please try again later.',
    declineFriendRequest:
      'Unable to decline friend request. Please try again later.',
    cancelFriendRequest:
      'Unable to cancel friend request. Please try again later.',
    loadNotifications:
      'Unable to load notification settings. Please try again later.',
    toggleNotifications:
      'Unable to toggle notification settings. Please try again later.',
    editInfo: 'Unable to edit user info. Please try again later.',
    resetPassword: 'Unable to reset password. Please try again later.',
    searchError: 'Unable to search for users. Please try again later.',
    loadUserData: 'Unable to load user data. Please try again later.',
    friendRequest: 'Unable to send friend request. Please try again later.',
    unfriend: 'Unable to unfriend. Please try again later.',
    addFriend: 'Unable to invite friend. Please try again later.',
    createFG: 'Unable to create friend group. Please try again later.',
    fgNameEmpty: 'Friend group name cannot be empty.',
    reorderFG: 'Unable to reorder friend groups. Please try again later.',
    editFGName: 'Unable to edit friend group name. Please try again later.',
    deleteFG: 'Unable to delete friend group. Please try again later.',
  },
  ageEnum: [
    {label: '-17', value: '-17'},
    {label: '18-21', value: '18-21'},
    {label: '22-24', value: '22-24'},
    {label: '25-30', value: '25-30'},
    {label: '30-40', value: '30-40'},
    {label: '41+', value: '41%2B'},
  ],
  genderEnum: [
    {label: 'Male', value: 'Male'},
    {label: 'Female', value: 'Female'},
    {label: 'Other', value: 'Other'},
    {label: 'Rather not say', value: 'Rather not say'},
  ],
};

export default strings;
