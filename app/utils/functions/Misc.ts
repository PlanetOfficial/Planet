export const getRegionForCoordinates = (points: Array<any>) => {
    // find the minimum and maximum latitude and longitude coordinates
    const latitudes = points.map((point) => point.latitude);
    const longitudes = points.map((point) => point.longitude);
    const minLat = Math.min(...latitudes);
    const maxLat = Math.max(...latitudes);
    const minLng = Math.min(...longitudes);
    const maxLng = Math.max(...longitudes);

    // calculate the center and delta values for the region
    const centerLat = (maxLat + minLat) / 2;
    const centerLng = (maxLng + minLng) / 2;
    const latDelta = (maxLat - minLat) * 1.2; // add a bit of padding
    const lngDelta = (maxLng - minLng) * 1.2;

    return {
      latitude: centerLat,
      longitude: centerLng,
      latitudeDelta: latDelta,
      longitudeDelta: lngDelta,
    };
};

