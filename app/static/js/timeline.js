
var map;


$('#heat-map-button').on('click', function () {
    // /api/v1/heat-map-by-date - endpoint
    // payload = {datetime: %Y-%m-%d}

    const date = $('#heat-map-date').val();
    
    $.ajax({
        url: '/api/v1/heat-map-by-date',
        type: 'GET',
        data: {datetime: date},
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        success: function (data) {
            if (map) {
                map.remove();
            }

            map = L.map('heat-map').setView([51.505, -0.09], 6);

            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(map);

            L.heatLayer(data, { minOpacity: 0.2, radius: 5, blur: 1, gradient: { 0.1: 'blue', 0.45: 'lime', 0.75: 'red' } }).addTo(map);

        },
        error: function (data) {
            console.log(data);
        }
    })
})


$('#comparison-button').on('click', function () {
    // price-range-between-dates - endpoint
    console.log('comparison button clicked');
    const date_start = $('#comparison-date-start').val();
    const date_end = $('#comparison-date-end').val();
    const city = $('#comparison-city').val();
    const propertyType = $('#comparison-property-type').val();

    // city from lang to eng
    const cities = {
        "Данія": "denmark",
        "Ірландія": "ireland",
        "Німеччина": "germany",
        "Португалія": "portugal",
        "Італія": "italy",
        "Іспанія": "spain",
        "Нідерланди": "netherlands",
        "Франція": "france",
        "Швеція": "sweden"
    }

    const propertyTypes = {
        "Квартира": "Apartment",
        "Будинок": "House",
        "Кімната": "Room"
    }

    $.ajax({
        url: '/api/v1/price-range-between-dates',
        type: 'GET',
        data: { start: date_start, end: date_end, country: cities[city], property_type: propertyTypes[propertyType] },
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        success: function (data) {
            console.log(data);

            if (document.getElementById('tmp-comp-img')) {
                document.getElementById('tmp-comp-img').remove();
            }

            // sort data by date
            data.sort(function (a, b) {
                return new Date(a.date) - new Date(b.date);
            });


            const dates = data.map(function (item) {
                return item.date;
            });

            const prices = data.map(function (item) {
                return item.avg_rent;
            });

            const ctx = document.getElementById('comparison-chart').getContext('2d');

            if (window.chart) {
                // If chart already exists, update the data
                window.chart.data.labels = dates;
                window.chart.data.datasets[0].data = prices;
                window.chart.update();
            } else {
                // If chart doesn't exist, create a new chart
                window.chart = new Chart(ctx, {
                    type: 'line',
                    data: {
                        labels: dates,
                        datasets: [{
                            label: 'Average rent',
                            backgroundColor: 'rgb(255, 99, 132)',
                            borderColor: 'rgb(255, 99, 132)',
                            data: prices
                        }]
                    },
                    options: {}
                });
            }
        },
        error: function (data) {
            console.log(data);
        }
    })
})