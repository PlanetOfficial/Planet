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
  bookmarked: boolean;
  disabled?: boolean;
}

const BookmarkIcon: React.FC<Props> = ({
  place,
  bookmarked,
  disabled = false,
}) => {
  const theme = useColorScheme() || 'light';

  const {bookmarks, setBookmarks} = useBookmarkContext();
  const [loading, withLoading] = useLoadingState();

  return (
    <Icon
      size="m"
      disabled={disabled || loading}
      icon={bookmarked ? icons.bookmarked : icons.bookmark}
      color={bookmarked ? colors[theme].accent : colors[theme].neutral}
      onPress={() =>
        withLoading(() => handleBookmark(place, bookmarks, setBookmarks))
      }
    />
  );
};

export default BookmarkIcon;
