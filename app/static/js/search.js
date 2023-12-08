// js of search page

function handleChange() {
    const input = document.querySelector("#prices");
    const selectedOption = input.options[input.selectedIndex];
    const value = selectedOption ? selectedOption.value : input.value;
    return value;
}

function handleChange() {
    const input = document.querySelector("#square_meters");
    const selectedOption = input.options[input.selectedIndex];
    const value = selectedOption ? selectedOption.value : input.value;
    return value;
  }
  
const button = document.querySelector("button");
button.addEventListener("click", () => {
    const price = handleChange();
    // Виконати пошук з ціною price
});

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

$("#prop-graph-button").on('click', function () {
    // price-range-between-dates - endpoint
    console.log('prop-graph-button clicked');
    const city = $('#prop-graph-city').val();
    

    $.ajax({
        url: '/api/v1/search-by-property',
        type: 'GET',
        data: { country: cities[city] },
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        success: function (data) {
            console.log(data);

            if (document.getElementById('tmp-prop-graph-img')) {
                document.getElementById('tmp-prop-graph-img').remove();
            }

            // make pie chart with data [{"property_type": "Apartment", "count": 1}, ...]
            const propertyTypes = data.map(function (item) {
                return item.property_type;
            });

            const counts = data.map(function (item) {
                return item.count;
            });

            var ctx = document.getElementById('prop-graph').getContext('2d');

            if (window.myChart)
                window.myChart.destroy();

            window.myChart = new Chart(ctx, {
                type: 'pie',
                data: {
                    labels: propertyTypes,
                    datasets: [{
                        label: '# of Votes',
                        data: counts,
                        backgroundColor: [
                            'rgba(255, 99, 132, 0.2)',
                            'rgba(54, 162, 235, 0.2)',
                            'rgba(255, 206, 86, 0.2)',
                            'rgba(75, 192, 192, 0.2)',
                            'rgba(153, 102, 255, 0.2)',
                            'rgba(255, 159, 64, 0.2)',
                            // Add more colors here
                        ],
                        borderColor: [
                            'rgba(255, 99, 132, 1)',
                            'rgba(54, 162, 235, 1)',
                            'rgba(255, 206, 86, 1)',
                            'rgba(75, 192, 192, 1)',
                            'rgba(153, 102, 255, 1)',
                            'rgba(255, 159, 64, 1)',
                            // Add more colors here
                        ],
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: false,
                    maintainAspectRatio: false,
                    scales: {
                        yAxes: [{
                            ticks: {
                                beginAtZero: true,
                                display: false
                            }
                        }]
                    }
                }
            });
        },
                
        error: function (data) {
            console.log(data);
        }
    })
})


$.ajax({
    url: '/api/v1/get-top-cities',
    type: 'GET',
    contentType: 'application/json; charset=utf-8',
    dataType: 'json',
    success: function (data) {
        console.log(data);

        const cities = data.map(function (item) {
            return item.city;
        });

        const counts = data.map(function (item) {
            return item.count;
        });

        // make bar chart with data [{"city": "Paris", "count": 1}, ...]

        var ctx = document.getElementById('top-graph').getContext('2d');

        if (window.myChart2)
            window.myChart.destroy();

        window.myChart2 = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: cities,
                datasets: [{
                    label: '# of Votes',
                    data: counts,
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        // Add more colors here
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        // Add more colors here
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: false,
                maintainAspectRatio: false,
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true,
                            display: false
                        }
                    }]
                }
            }
        });
    },
    error: function (data) {
        console.log(data);
    }
})