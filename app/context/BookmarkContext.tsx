import React, {
  useState,
  useEffect,
  useMemo,
  useContext,
  createContext,
} from 'react';
import {Alert} from 'react-native';

import strings from '../constants/strings';

import {getBookmarks} from '../utils/api/bookmarkAPI';
import {Poi} from '../utils/types';

import {BookmarkContextType} from './ContextTypes';

const BookmarkContext = createContext<BookmarkContextType | undefined>(
  undefined,
);

const BookmarkStateProvider = ({
  children,
  isLoggedInStack,
}: {
  children: React.ReactNode;
  isLoggedInStack: boolean;
}) => {
  const [bookmarks, setBookmarks] = useState<Poi[]>([]);

  const initializeBookmarks = async () => {
    const result = await getBookmarks();
    if (result) {
      setBookmarks(result);
    } else {
      Alert.alert(strings.error.error, strings.error.loadBookmarks);
    }
  };

  const bookmarkContext = useMemo(
    () => ({bookmarks, setBookmarks, initializeBookmarks}),
    [bookmarks],
  );

  useEffect(() => {
    if (isLoggedInStack) {
      initializeBookmarks();
    }
  }, [isLoggedInStack]);

  return (
    <BookmarkContext.Provider value={bookmarkContext}>
      {children}
    </BookmarkContext.Provider>
  );
};

const useBookmarkContext = () => {
  const context = useContext(BookmarkContext);
  if (!context) {
    throw new Error('BookmarkContext is not set!');
  }
  return context;
};

export {useBookmarkContext, BookmarkStateProvider};
