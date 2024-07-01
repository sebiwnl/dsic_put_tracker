const putts_thrown = 21;
const current_c1x = 0;




document.getElementById('add-stats').addEventListener('click', function() {
    postPuttData();


    // reload window
    window.location.reload();
});

// Allow pressing Enter key to submit the form
document.addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        document.getElementById('add-stats').click();
    }
});

function postPuttData() {
    const putt6m = document.getElementById('putt-6m').value;
    const putt75m = document.getElementById('putt-7.5m').value;
    const putt95m = document.getElementById('putt-9.5m').value;

    const data = {
        date: getDate(),
        attempts: putts_thrown,
        six: +putt6m,
        sevenfive: +putt75m,
        ninefive: +putt95m
    };

    fetch('/add_putt', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(result => {
        // Handle the response from the server
        console.log('1',result);
    })
    .catch(error => {
        // Handle any errors
        console.error('2',error);
    });
}


function getDate() {
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();

    return `${year}-${month}-${day}`;
}

function renderPuttingStats(payload) {

    // table
    dataList = JSON.parse(payload)["putts"]
    
    for(let i = 0; i < dataList.length; i++) {
        create_div(dataList[i]);
    }

    // chart
    let dates = [];
    let c1xStats = [];

    dataList.forEach(function(data) {
        dates.push(data['date']);
        let c1x = ((data['six'] + data['sevenfive'] + data['ninefive']) / (putts_thrown * 3))*100;
        c1xStats.push(c1x);
    });

    renderChart(dates, c1xStats);
    
}

function renderChart(dates, c1xStats) {
    const ctx = document.getElementById('c1xChart').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: dates,
            datasets: [{
                label: 'C1X %',
                data: c1xStats,
                borderColor: 'rgba(0, 0, 0, 0.6)',
                backgroundColor: 'rgba(0,0,0, 0.2)',
                fill: true
            }]
        },
        options: {
            responsive: true,
            scales: {
                x: {
                    display: true,
                    title: {
                        display: true,
                        text: 'Date'
                    }
                },
                y: {
                    display: true,
                    title: {
                        display: true,
                        text: 'C1X %'
                    }
                }
            }
        }
    });
}

function create_div(dataList) {
    // Retrieve values from input fields
    const putt6m = dataList['six'];
    const putt75m = dataList['sevenfive'];
    const putt95m = dataList['ninefive'];
    const attempts = dataList['attempts'];

    

    const totalPutts = parseInt(putt6m) + parseInt(putt75m) + parseInt(putt95m);

    const sixMeterPercentage = Math.round((parseInt(putt6m) / putts_thrown) * 100);
    const sevenFiveMeterPercentage = Math.round((parseInt(putt75m) / putts_thrown) * 100);
    const nineFiveMeterPercentage = Math.round((parseInt(putt95m) / putts_thrown) * 100);
    const totalPuttPercentage = Math.round((totalPutts / (putts_thrown*3)) * 100);
    current_c1x

    // Create a new td
    const newTableRow = document.createElement('tr');

    // Create columns for each stat
    newTableRow.innerHTML = `
        <th class="">${dataList['date']}</th>
        <th class="text-secondary">${attempts}</th>
        <th class="${getColor(sixMeterPercentage,1)}">${putt6m} (${sixMeterPercentage}%)</th>
        <th class="${getColor(sevenFiveMeterPercentage,2)}">${putt75m} (${sevenFiveMeterPercentage}%)</th>
        <th class="${getColor(nineFiveMeterPercentage,3)}">${putt95m} (${nineFiveMeterPercentage}%)</th>
        <th class="${getColor(totalPuttPercentage,4)}">${totalPuttPercentage} %</th>    
    `;

     // Append the new row to the stats display container
     document.getElementById('stats-table').appendChild(newTableRow);
}

function getColor(percentage, dist) {

    if (dist == 1) {
        if (percentage < 75) {
            return 'text-danger';
        } else if (percentage < 92.5) {
            return 'text-warning';
        } else {
            return 'text-success';
        }
    }
    if (dist == 2) {
        if (percentage < 65) {
            return 'text-danger';
        } else if (percentage < 82.5) {
            return 'text-warning';
        } else {
            return 'text-success';
        }
    }
    if (dist == 3) {
        if (percentage < 35) {
            return 'text-danger';
        } else if (percentage < 70) {
            return 'text-warning';
        } else {
            return 'text-success';
        }
    }
    if (dist == 4) {
        if (percentage < 57.5) {
            return 'text-danger';
        } else if (percentage < 80) {
            return 'text-warning';
        } else {
            return 'text-success';
        }
    }
}