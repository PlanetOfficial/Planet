import {Filter, Subcategory} from '../../interfaces/types';
import {CustomCallsURL} from '../APIConstants';

export const requestLocationsSingle = async (
  category: number,
  radius: number,
  latitude: number,
  longitude: number,
  count: number,
  filters: Filter[],
  filterValues: (number | number[])[],
  subcategories?: Subcategory[],
  categoryFilter?: number[],
) => {
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

  let _subcategories: number[] = [];
  if (subcategories && categoryFilter) {
    categoryFilter.forEach(item => {
      _subcategories.push(subcategories[item].id);
    });
  }

  const response = await fetch(
    CustomCallsURL +
      `/categoryLocations?category_id=${category}&radius=${radius}&latitude=${latitude}&longitude=${longitude}&count=${count}&filters=${JSON.stringify(
        _filterValues,
      )}&subcategories_ids=${JSON.stringify(_subcategories)}`,
    {
      method: 'GET',
    },
  );

  if (response?.ok) {
    const myJson = await response.json(); //extract JSON from the http response
    return myJson?.places;
  } else {
    return {};
  }
};
