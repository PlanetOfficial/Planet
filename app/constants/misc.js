const misc = {
  imageSize: '480x720',
  libraryFilter: [
    {
      name: 'radius',
      options: ['10mi', '25mi', '100mi'],
      values: [10, 25, 100],
      text: 'Within',
      defaultIdx: 1,
    },
    {
      name: 'sort',
      options: ['Recent', 'Distance', 'Rating'],
      values: [0, 1, 2],
      text: 'Sort By',
      defaultIdx: 0,
    },
  ],
};
export default misc;
