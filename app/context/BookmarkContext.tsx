import {createContext, useContext} from 'react';
import {Poi} from '../utils/types';

type BookmarkContextType = {
  bookmarks: Poi[];
  setBookmarks: React.Dispatch<React.SetStateAction<Poi[]>>;
};

const BookmarkContext = createContext<BookmarkContextType | undefined>(
  undefined,
);

const useBookmarkContext = () => {
  const context = useContext(BookmarkContext);
  if (!context) {
    throw new Error('BookmarkContext is not set!');
  }
  return context;
};

export {useBookmarkContext, BookmarkContext};
