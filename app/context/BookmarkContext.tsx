import {createContext} from 'react';
import {Poi} from '../utils/types';

type BookmarkContextType = {
  bookmarks: Poi[];
  setBookmarks: React.Dispatch<React.SetStateAction<Poi[]>>;
};

const BookmarkContext = createContext<BookmarkContextType | undefined>(
  undefined,
);

export default BookmarkContext;
