const putts_thrown = 21;
const current_c1x = 0;
lets = c1xChart = null;




document.getElementById('add-stats').addEventListener('click', function() {
    postPuttData();
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

    document.getElementById('putt-6m').value = '';
    document.getElementById('putt-7.5m').value = '';
    document.getElementById('putt-9.5m').value = '';

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
        removePuttingStats();
        removeChart();
        renderPuttingStats(result);
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

function removePuttingStats() {
    const stats = document.getElementById('stats-table');
    while (stats.firstChild) {
        stats.removeChild(stats.firstChild);
    }
}

function removeChart() {
    const chart = document.getElementById('c1xChart');
    while (chart.firstChild) {
        chart.removeChild(chart.firstChild);
    }
}

function renderPuttingStats(payload) {
    console.log('payload', payload)
    // table
    const dataList = typeof payload === 'string' ? JSON.parse(payload).putts : payload.putts;
    
    for(let i = 0; i < dataList.length; i++) {
        create_div(dataList[i]);
    }

    // chart
    let dates = [];
    let c1xStats = [];

    // revers datalist

    dataList.forEach(function(data) {
        dates.push(data['date']);
        let c1x = ((data['six'] + data['sevenfive'] + data['ninefive']) / (putts_thrown * 3))*100;
        c1xStats.push(c1x);
    });

    renderChart(dates, c1xStats);
    
}

function renderChart(dates, c1xStats) {
    const ctx = document.getElementById('c1xChart').getContext('2d');

    if (c1xChart) {
        c1xChart.destroy();
    }
    c1xChart = new Chart(ctx, {
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
    const id = dataList['id'];

    

    const totalPutts = parseInt(putt6m) + parseInt(putt75m) + parseInt(putt95m);

    const sixMeterPercentage = Math.round((parseInt(putt6m) / putts_thrown) * 100);
    const sevenFiveMeterPercentage = Math.round((parseInt(putt75m) / putts_thrown) * 100);
    const nineFiveMeterPercentage = Math.round((parseInt(putt95m) / putts_thrown) * 100);
    const totalPuttPercentage = Math.round((totalPutts / (putts_thrown*3)) * 100);
    current_c1x

    // Create a new td
    const newTableRow = document.createElement('tr');
    newTableRow.setAttribute('data-id', id);  // Add data-id attribute

    // Create columns for each stat
    newTableRow.innerHTML = `
        <th class="">${dataList['date']}</th>
        <th class="text-secondary">${attempts}</th>
        <th class="${getColor(sixMeterPercentage,1)}">${putt6m} (${sixMeterPercentage}%)</th>
        <th class="${getColor(sevenFiveMeterPercentage,2)}">${putt75m} (${sevenFiveMeterPercentage}%)</th>
        <th class="${getColor(nineFiveMeterPercentage,3)}">${putt95m} (${nineFiveMeterPercentage}%)</th>
        <th class="${getColor(totalPuttPercentage,4)}">${totalPuttPercentage} %</th>
        <th class="text-right" ><button class="btn btn-danger btn-sm delete-btn ">Del</button></th>    
    `;

     // Append the new row to the stats display container
     document.getElementById('stats-table').appendChild(newTableRow);

     // Add event listener to the delete button
     newTableRow.querySelector('.delete-btn').addEventListener('click', function() {
        const row = this.parentElement.parentElement;
        const id = row.getAttribute('data-id');
        deleteData(id);
        row.remove();
     });
}

function deleteData(id) {
    fetch('/delete_putt', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({id: id})
    })
    .then(response => response.json())
    .then(result => {
        // Handle the response from the server
        removePuttingStats();
        removeChart();
        renderPuttingStats(result);
    })
    .catch(error => {
        // Handle any errors
        console.error(error);
    });
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




// get text area notes
document.getElementById('update_notes').addEventListener('click', function() {
    postNotesData();
});

function postNotesData() {
    const notes = document.getElementById('noteTextArea').value;

    const data = {
        notes: notes
    };

    let jsonString = JSON.stringify(data, (key, value) => {
        if (typeof value === 'string') {
            return value.replace(/\n/g, '\\n'); // Replace newline with escaped newline
        }
        return value;
    });

    fetch('/update_notes', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: jsonString
    })
    .then(response => response.json())
    .then(result => {
        // Handle the response from the server
        //document.getElementById('notes').value = result.notes;
    })
    .catch(error => {
        // Handle any errors
        console.error(error);
    });
}


function renderNotes(notes) {
    
    document.getElementById('noteTextArea').value = JSON.parse(notes).notes;
}

function uploadFile() {

    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];
    const formData = new FormData();
    formData.append('file', file);

    // set input text to file name 
    document.getElementById('inputText').innerHTML = file.name;

    fetch('/upload', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(result => {
        // Handle the response from the server
        console.log(result);
    })
    .catch(error => {
        // Handle any errors
        console.error(error);
    });
}
