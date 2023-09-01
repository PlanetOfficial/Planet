import numbers from './numbers';

const websiteUrl = 'https://planetapp.us';

const strings = {
  login: {
    login: 'Log In',
    welcome: 'Welcome',
    greeting: 'Welcome Back!',
    description: 'Log in to your account',
    username: 'Username',
    password: 'Password',
    missingInfo: 'Missing username or password',
    newPassword: 'New Password',
    resetPassword: 'Reset Password',
    passwordResetSuccess: 'Password was successfully reset!',
    noAccount: "Don't have an account?",
    forgotPassword: 'Forgot Password',
    forgotPasswordQuestion: 'Forgot your password?',
    forgotPasswordDescription: 'Enter your username:',
  },
  main: {
    appName: 'Planet',
    tagLine: 'Plan it, Together!',
    description: 'Make & decide your plans with anyone you choose.',
    shareMessage:
      'Download Planet, my go-to app for finding places and planning events effortlessly!',
    url: websiteUrl,
    downloadUrl: websiteUrl + '/download',
    save: 'Save',
    cancel: 'Cancel',
    discard: 'Discard',
    remove: 'Remove',
    rename: 'Rename',
    confirm: 'Confirm',
    add: 'Add',
    warning: 'Warning',
    milesAbbrev: 'mi',
    edit: 'Edit',
    success: 'Success',
    continue: 'Continue',
  },
  title: {
    home: 'Home',
    search: 'Explore',
    library: 'Events',
    profile: 'Profile',
  },
  signUp: {
    confirmPassword: 'Confirm Password',
    username: 'Username',
    sendCode: 'Send',
    verifyCode: 'Verify Code',
    codeSendFailed: 'Code failed to send',
    codeVerifyFailed: 'Code invalid.',
    signUp: 'Sign Up',
    inputLong: 'Inputs are too long',
    passwordShort: 'Password is too short',
    passwordsMatch: 'Passwords are not the same',
    missingFields: 'Fields are missing',
    iAgreeTo: 'I Agree to the',
    letsGetStarted: "Let's Get Started!",
    promptName: "What's your name?",
    displayName: 'Display Name',
    hi: 'Hi',
    promptBirthday:
      'When is your birthday? This help us\n recommend just the right places for you.',
    setUpPrompt: "Great, let's set up your account!",
    setUpDescription: 'Enter a unique username\n and a secure password.',
    accountHasBeenCreated: 'Your account has been created!',
    promptPhoneNumber:
      "Enter your phone number so we\n know that you're a real human.",
    verifyPrompt: 'Enter the 6 digit code we sent you.',
    oneLastStep: 'One last step!',
    invitePrompt:
      'Planet is designed to be used with others!\nInvite at least one person you know.',
    skip: 'Skip',
    sendAnInviteLink: 'Send an Invite Link',
    changeNumber: 'Change Phone Number',
  },
  home: {
    upcomingEvent: 'Upcoming Event',
    noUpcomingEvent: 'No Upcoming Event',
    viewAllEvents: 'View All Events',
    viewAllFriends: 'View All Friends',
    noUpcomingEvents: 'Create an event',
    recommendations: 'Recommended Events for You',
    suggestedFriends: 'Suggested Friends',
    customize: 'Customize this event',
    noRecommendations: 'No Recommendations Found',
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
  explore: {
    categories: 'Categories',
    allCategories: 'All Categories',
    search: 'Search',
    searchHere: 'Search Here',
    setLocation: 'Set Location',
    searchLocation: 'Search Location',
    yourLocation: 'Your Location',
  },
  greeting: {
    morning: 'Good Morning',
    afternoon: 'Good Afternoon',
    evening: 'Good Evening',
  },
  friends: {
    friends: 'Friends',
    requests: 'Requests',
    searchFriends: 'Search Friends',
    newFriendGroup: 'Create',
    suggestions: 'Suggestions',
    addFriends: 'Add Friends',
    inviteFriends: 'Invite Friends',
    inviteFriendsOnPlanet: 'Invite Friends on Planet',
    pending: 'Pending',
    added: 'Added',
    users: 'Users',
    accept: 'Accept',
    ignore: 'Ignore',
    blocked: 'Blocked',
    noFriendsFound: 'No Friends Found',
    noRequestsFound: 'No Requests Found',
    pendingRequest: 'Pending Request',
    mutualEvents: 'Shared Events',
    addFriend: 'Add Friend',
    unfriend: 'Unfriend',
    unfriendInfo: 'Are you sure you want to unfriend this user?',
    cancelRequest: 'Cancel Request',
    noMutualEventsFound: 'No Mutual Events Found',
    createFriendGroup: 'Create a Friend Group',
    fgCreateBackConfirmation: 'Are you sure you want to go back?',
    friendGroup: 'Friend Group',
    friendGroups: 'Friend Groups',
    renameFriendGroup: 'Enter a new name for this friend group:',
    deleteFriendGroup: 'Delete Friend Group',
    deleteFriendGroupInfo: 'Are you sure you want to delete this friend group?',
    friendGroupName: 'Friend Group Name',
    friendGroupNameInfo: 'Enter a name for this friend group:',
    invite: 'Invite',
    block: 'Block',
    unblock: 'Unblock',
    report: 'Report',
    reportInfo: 'Are you sure you want to report this user?',
    reportUser: 'Report User',
    reportSuccess: 'Thank you, your report has been submitted.',
  },
  profile: {
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
    removePfp: 'Remove Profile Picture',
    removePfpPrompt: 'Are you sure you want to remove your profile picture?',
  },
  event: {
    destinations: 'Destinations',
    yourEvents: 'Your Events',
    untitled: 'Untitled Event',
    destinationDefaultName: 'Untitled Destination',
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
    eventName: 'Event Name',
    noDate: 'No Date Set',
    create: 'Create',
    suggest: 'Suggest',
    upcomingEvents: 'Upcoming Events',
    nonDatedEvents: 'Unscheduled Events',
    pastEvents: 'Completed Events',
    completed: 'Completed',
    incomplete: 'Incomplete',
    markAsCompleted: 'Mark as Completed',
    markAsIncomplete: 'Mark as Incomplete',
    changeCompletionStatusInfo:
      'This will only affect the status of your event.',
    report: 'Report',
    reportEventInfo: 'Thank you, your report has been submitted.',
    removeMember: 'Remove Member',
    removeMemberInfo: 'Are you sure you want to remove this member?',
    duplicate: 'Clone',
  },
  roulette: {
    total: 'Total',
    spin: 'Spin',
    votes: 'Votes',
    rouletteSpinInfo:
      'Do you want to mark this suggestion as the primary destination?',
    alreadyPrimary: 'This suggestion is already the primary destination.',
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
    logoutInfo: 'Are you sure you want to logout?',
    removeAccount: 'Remove Account',
    removeAccountInfo: 'Are you sure you want to remove your account?',
    privacyPolicy: 'Privacy Policy',
    termsAndConditions: 'Terms and Conditions',
    version: 'Version:',
    blockedUsers: 'Blocked Users',
    blockedUsersInfo:
      'Users you have blocked cannot search your profile or invite you to events.',
    noBlockedUsersFound: 'No Blocked Users Found',
    displayName: 'Display Name',
    username: 'Username',
    birthday: 'Birthday',
    phoneNumber: 'Phone Number',
    notSet: 'Not Set',
    editDisplayName: 'Edit Display Name',
    editDisplayNamePrompt: 'Enter a new display name:',
    editUsername: 'Edit Username',
    editUsernamePrompt: 'Enter a new username:',
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
    locationPermissionInfo:
      'Please enable location services in the settings app to continue.',
    loadFriendsList: 'Unable to load friends info. Please try again later.',
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
    searchError: 'Unable to search for users. Please try again later.',
    loadUserData: 'Unable to load user data. Please try again later.',
    friendRequest: 'Unable to send friend request. Please try again later.',
    unfriend: 'Unable to unfriend. Please try again later.',
    createFG: 'Unable to create friend group. Please try again later.',
    fgNameEmpty: 'Friend group name cannot be empty.',
    editFGName: 'Unable to edit friend group name. Please try again later.',
    deleteFG: 'Unable to delete friend group. Please try again later.',
    inviteUsers: 'Unable to invite users. Please try again later.',
    block: 'Unable to block user. Please try again later.',
    unblock: 'Unable to unblock user. Please try again later.',
    changeCompletionStatus:
      'Unable to change completion status. Please try again later.',
    loadRecommendations:
      'Unable to load recommendations. Please try again later.',
    loadSuggestedPoiSections: 'Unable to load places. Please try again later.',
    removePfp: 'Unable to remove profile picture. Please try again later.',
    reportEvent: 'Unable to report event. Please try again later.',
    reportUser: 'Unable to report user. Please try again later.',
    kickMember: 'Unable to kick member. Please try again later.',
    logout: 'Unable to logout. Please try again later.',
    removeAccount: 'Unable to remove account. Please try again later.',
    displayNameLength: 'Display name must be between 3 and 15 characters.',
    editDisplayName: 'Unable to edit display name. Please try again later.',
    editUsername: 'Unable to edit username. Please try again later.',
    editBirthday: 'Unable to edit birthday. Please try again later.',
    searchLocality: 'Unable to search for cities. Please try again later.',
    searchPlace: 'Unable to search for places. Please try again later.',
    noResultsFound: 'No Results Found',
    noResultsFoundDescription: 'Try searching for something else',
  },
};

export default strings;
