import requests
import pandas as pd
import numpy as np
import json
from math import sin, cos, sqrt, atan2, radians
import datetime

typeList = ['restaurant', 'cafe', 'shopping_mall', 'movie_theater', 'bank', 'hair_care']
dataset = pd.read_csv('Gowalla_totalCheckins3.txt', delimiter="\t", header=None)
dataset.columns = ["userID", "Date", "latitude", "longitude", "locationID"]
dataset = dataset.drop(["locationID"], axis=1)
date = []
for x in dataset['Date']:
    date.append(x.split("T")[0])
dataset.Date = date
coordinate = zip(dataset["latitude"], dataset["longitude"])


# approximate radius of earth in km
def get_near_by_places(lat, lng, radius):
    """Get near places by latitude and longitude withitn radius.

    Args:
        lat (float): latitude
        lng (float): longtitude
        radius (float): radius

    Returns:
        json: json file contains places within given radius
    """
    r = requests.get(
        f'https://maps.googleapis.com/maps/api/place/nearbysearch/json?location={lat},{lng}&radius={radius}&key=AIzaSyDmbl-UzpILeyTFM5_UbvCRiLHa5-6yhpU')
    return r.json()

def calculate(lat1, lon1, lat2, lon2):
    """compute the distance from [lat1,lon1] to [lat2,lon2]

    Args:
        lat1 (float): latitude of first place
        lon1 (float): longitude of first place
        lat2 (float): latitude of second place
        lon2 (float): longitude of first place

    Returns:
        float: distance from [lat1,lon1] to [lat2,lon2]
    """
    R = 6373.0

    lat1 = radians(lat1)
    lon1 = radians(lon1)
    lat2 = radians(lat2)
    lon2 = radians(lon2)

    dlon = lon2 - lon1
    dlat = lat2 - lat1

    a = sin(dlat / 2)**2 + cos(lat1) * cos(lat2) * sin(dlon / 2)**2
    c = 2 * atan2(sqrt(a), sqrt(1 - a))

    distance = R * c
    return distance

def get_type():
    """Processing the data and export to processData[number].csv."""
    global dataset
    with open('processData2.csv', 'w') as f:
        for index,_ in enumerate(coordinate):
            lat, lng = _
            # row = []
            type = 'undefined'
            radius = 50
            while type == 'undefined':
                data = getNearByPlaces(lat, lng,radius)
                results = data['results']
                min_ = float('+inf')
                for key in results:
                    geometry = key['geometry']
                    location = geometry['location']
                    distance_ = calculate(lat, lng, location['lat'], location['lng'])
                    for typ in key['types']:
                        if distance_ < min_ and typ in typeList:
                            min_ = distance_
                            type = typ
                radius += 50
            row = dataset.iloc[index].values.tolist()
            row.append(type)
            row.remove(row[2])
            row.remove(row[2])
            row[0] = str(row[0])
            f.write(','.join(row))
            f.write('\n')
    f.close()
        # dataset['type'] = type
        # dataset = dataset.drop(["latitude"], axis=1)
        # dataset = dataset.drop(["longitude"], axis=1)
        # dataset.to_csv('processData.csv', index = False, header = False)

get_type()
