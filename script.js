document.addEventListener('DOMContentLoaded', function() {
    fetch('number-of-natural-disaster-events.csv')
        .then(response => response.text())
        .then(csvText => {
            let parsedData = Papa.parse(csvText, {
                header: true,
                dynamicTyping: true,
                worker: false,
            }).data;

            let disasterData = {};

            console.log(parsedData);
            parsedData.forEach(row => {
                if (!disasterData[row.Entity]) {
                    disasterData[row.Entity] = {};
                }
                disasterData[row.Entity][row.Year] = row.Disasters;
            });

            console.log(disasterData);

            let i = 0;
            let disasters = ['All disasters', 'Earthquake', 'Extreme temperature', 'Flood', 'Landslide', 'Mass movement (dry)', 'Volcanic activity', 'Wildfire'];
            let catastrophes = ['Toutes les catastrophes', 'Tremblement de terre', 'Température extrême', 'Inondation', 'Glissement de terrain', 'Mouvement de masse', 'Activité volcanique', 'Feu de forêt'];

            let disaster = disasters[i];

            let labels = Object.keys(disasterData[disaster]);
            let data = Object.values(disasterData[disaster]);

            let ctx = document.getElementById('chart');
            
            let chart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: labels,
                    datasets: [{
                        label: catastrophes[i],
                        data: data
                    }]
                }
            });

            function updateChart(disasterType) {
                let labels = Object.keys(disasterData[disasterType]);
                let data = Object.values(disasterData[disasterType]);

                chart.data.labels = labels;
                chart.data.datasets[0].data = data;
                chart.data.datasets[0].label = disasterType;
                chart.update();
            }

            document.getElementById('btnall').addEventListener('click', function() {
                i 
                updateChart('All disasters');
            });

            document.getElementById('btnino').addEventListener('click', function() {
                updateChart('Flood');
            });

            document.getElementById('btnfeu').addEventListener('click', function() {
                updateChart('Wildfire');
            });

            document.getElementById('btntre').addEventListener('click', function() {
                updateChart('Earthquake');
            });

            document.getElementById('btnsec').addEventListener('click', function() {
                updateChart('Drought');
            });

            updateChart('All disasters');

        });
    
});