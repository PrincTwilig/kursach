# processing tools will be here
from app.models import SpiderOutputHistory, SpiderOutput
from peewee import fn
import json


def generate_heetmap_by_date(date):
    """
    Generate heatmap for given date
    """
    query = SpiderOutputHistory.select(SpiderOutputHistory.city, fn.COUNT(SpiderOutputHistory.city).alias(
        'count')).where(fn.date_trunc('day', SpiderOutputHistory.created_at) == date).group_by(SpiderOutputHistory.city)

    all_data = [{'city': x.city, 'count': x.count} for x in query if x.city]

    # in static/cities.json is a list of cities with their coordinates, make [lat, lng, count] list
    cities = json.load(open('app/static/cities.json', 'r', encoding='utf-8'))
    cities_dict = {x['name'].lower(): x for x in cities}
    data = []

    # make count from 0 to 1 for better visualization
    max_count = max([x['count'] for x in all_data])
    for x in all_data:
        x['count'] = x['count'] / max_count

    for x in all_data:
        city = x['city'].lower()
        if city in cities_dict:
            data.append({
                'lat': cities_dict[city]['lat'],
                'lng': cities_dict[city]['lng'],
                'count': x['count'],
                'name': x['city']
            })

    return data


def generate_price_range_between_dates(start, end, country, property_type='apartment'):

    query = SpiderOutputHistory.select(SpiderOutputHistory.rent, SpiderOutputHistory.created_at).where(
        SpiderOutputHistory.country == country,
        SpiderOutputHistory.property_type == property_type,
        SpiderOutputHistory.rent.is_null(False),
        SpiderOutputHistory.created_at.between(start, end)
    ).distinct(SpiderOutputHistory.external_link)

    all_data = [{'rent': x.rent, 'created_at': x.created_at}
                for x in query if x.rent]

    # make avg rent for each day
    avg_rent = {}
    for x in all_data:
        date = x['created_at'].strftime('%Y-%m-%d')
        if date not in avg_rent:
            avg_rent[date] = []
        avg_rent[date].append(x['rent'])

    avg_rent = [{'date': x, 'avg_rent': sum(
        avg_rent[x]) / len(avg_rent[x])} for x in avg_rent]

    # clear avg_rent from outliers (rents that are 2 times higher or lower than average) just make them equal to average
    for i in range(len(avg_rent)):
        if i == 0 or i == len(avg_rent) - 1:
            continue

        if avg_rent[i]['avg_rent'] > avg_rent[i - 1]['avg_rent'] * 2 or avg_rent[i]['avg_rent'] < avg_rent[i - 1]['avg_rent'] / 2:
            avg_rent[i]['avg_rent'] = avg_rent[i - 1]['avg_rent']
        

    return avg_rent

def generate_pie_for_property(country):

    # make data for pie chart, [property_type, count]
    data = SpiderOutput.select(SpiderOutput.property_type, fn.COUNT(SpiderOutput.property_type).alias(
        'count')).where(SpiderOutput.country == country).group_by(SpiderOutput.property_type)
    
    data = [{'property_type': x.property_type, 'count': x.count} for x in data if x.property_type]

    return data

def generate_top_cities():

    # make data for bar chart, [city, count]
    # make top 10 cities by count
    data = SpiderOutput.select(SpiderOutput.city, fn.COUNT(SpiderOutput.city).alias(
        'count')).group_by(SpiderOutput.city).order_by(fn.COUNT(SpiderOutput.city).desc()).limit(10)
    
    data = [{'city': x.city, 'count': x.count} for x in data if x.city]

    return data