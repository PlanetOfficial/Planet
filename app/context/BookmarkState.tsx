import React, {useState, useEffect, useMemo} from 'react';
import {Alert} from 'react-native';
import strings from '../constants/strings';
import {getBookmarks} from '../utils/api/bookmarkAPI';
import {Poi} from '../utils/types';
import BookmarkContext from './BookmarkContext';

const BookmarkStateProvider = ({
  children,
  isLoggedIn,
}: {
  children: React.ReactNode;
  isLoggedIn: boolean;
}) => {
  const [bookmarks, setBookmarks] = useState<Poi[]>([]);
  const bookmarkContext = useMemo(
    () => ({bookmarks, setBookmarks}),
    [bookmarks],
  );

  const initializeBookmarks = async () => {
    const result = await getBookmarks();
    if (result) {
      setBookmarks(result);
    } else {
      Alert.alert(strings.error.error, strings.error.loadBookmarks);
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      initializeBookmarks();
    }
  }, [isLoggedIn]);

  return (
    <BookmarkContext.Provider value={bookmarkContext}>
      {children}
    </BookmarkContext.Provider>
  );
};

export default BookmarkStateProvider;
