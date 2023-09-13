import React from 'react';
import {useColorScheme} from 'react-native';

import colors from '../../constants/colors';
import icons from '../../constants/icons';

import Icon from './Icon';

import {Poi} from '../../utils/types';
import {handleBookmark, useLoadingState} from '../../utils/Misc';

import {useBookmarkContext} from '../../context/BookmarkContext';

interface Props {
  place: Poi;
  disabled?: boolean;
  color?: string;
}

const BookmarkIcon: React.FC<Props> = ({place, disabled = false, color}) => {
  const theme = useColorScheme() || 'light';

  const {bookmarks, setBookmarks} = useBookmarkContext();
  const [loading, withLoading] = useLoadingState();

  const bookmarked = bookmarks.some(
    (bookmark: Poi) => bookmark.id === place.id,
  );

  return (
    <Icon
      size="m"
      disabled={disabled || loading}
      icon={bookmarked ? icons.bookmarked : icons.bookmark}
      color={
        bookmarked
          ? colors[theme].accent
          : color
          ? color
          : colors[theme].neutral
      }
      onPress={() =>
        withLoading(() => handleBookmark(place, bookmarks, setBookmarks))
      }
    />
  );
};

export default BookmarkIcon;
