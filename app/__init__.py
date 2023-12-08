from flask import Flask, render_template, request
from app.tools import generate_heetmap_by_date, generate_price_range_between_dates, generate_pie_for_property, generate_top_cities

import datetime

app = Flask(__name__)

# pages
@app.route('/')
def index():
    return render_template('index.html')

@app.route('/search')
def search():
    return render_template('search.html')

@app.route('/timeline')
def timeline():
    return render_template('timeline.html')

# api
@app.route('/api/v1/heat-map-by-date', methods=['GET'])
def hello_world_1():
    # url example: /api/v1/heat-map-by-date?datetime=2020-01-01

    payload = request.args.to_dict()
    
    if payload is None or payload.get('datetime') is None:
        return 'Please provide a datetime', 400

    date = datetime.datetime.strptime(payload['datetime'], '%Y-%m-%d')
    return generate_heetmap_by_date(date)


@app.route('/api/v1/price-range-between-dates', methods=['GET'])
def hello_world_2():
    # url example: /api/v1/price-range-between-dates?start=2020-01-01&end=2020-01-02&country=germany

    payload = request.args.to_dict()
    
    if payload is None or payload.get('start') is None or payload.get('end') is None:
        return 'Please provide a start, end and country', 400

    start = datetime.datetime.strptime(payload['start'], '%Y-%m-%d')
    end = datetime.datetime.strptime(payload['end'], '%Y-%m-%d')
    country = payload.get('country', 'germany')
    property_type = payload.get('property_type', 'apartment')

    return generate_price_range_between_dates(start, end, country, property_type)

@app.route('/api/v1/search-by-property', methods=['GET'])
def hello_world_3():
    # url example: /api/v1/search-by-property?country=germany

    payload = request.args.to_dict()

    if payload is None or payload.get('country') is None:
        return 'Please provide a country', 400
    
    country = payload.get('country', 'germany')

    return generate_pie_for_property(country)

@app.route('/api/v1/get-top-cities', methods=['GET'])
def hello_world_4():
    # url example: /api/v1/get-top-cities

    return generate_top_cities()