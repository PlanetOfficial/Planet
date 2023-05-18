import {Filter} from '../../interfaces/types';
import {CustomCallsURL} from '../APIConstants';

export const getCatFiltered = async (
  subcategories: number[],
  count: number,
  latitude: number,
  longitude: number,
  category_id: number,
  filters: Filter[],
  filterValues: (number | number[])[],
) => {
  
  let subcategoryString = '';

  subcategories.forEach(item => {
    subcategoryString += `subcategories_ids[]=${item}&`;
  });

  let _filterValues: {
    [key: string]: string | number | (string | number)[];
  } = {};
  filters.forEach((item, index) => {
    const filterValue: number | number[] = filterValues[index];
    if (Array.isArray(filterValue)) {
      _filterValues[item.name] = filterValue.map(value => item.values[value]);
    } else {
      _filterValues[item.name] = item.values[filterValue];
    }
  });

  const response = await fetch(
    CustomCallsURL +
      `/category_filter_v2?${subcategoryString}count=${count}&latitude=${latitude}&longitude=${longitude}&category_id=${category_id}&filters=${JSON.stringify(
        _filterValues,
      )}`,
    {
      method: 'GET',
    },
  );

  if (response?.ok) {
    const myJson = await response.json(); //extract JSON from the http response
    return myJson;
  } else {
    return [];
  }
};
