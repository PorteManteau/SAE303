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
                        data: data,
                        pointRadius : 0,
                        backgroundColor: 'rgba(0, 0, 0, 0)',
                    }]
                }
            });

            function updateChart(disasterType, label, borderColor) {
                let labels = Object.keys(disasterData[disasterType]);
                let data = Object.values(disasterData[disasterType]);

                chart.data.labels = labels;
                chart.data.datasets[0].data = data;
                chart.data.datasets[0].label = label;
                chart.data.datasets[0].borderColor = borderColor;
                chart.update();
            }

            
            document.getElementById('btnall').addEventListener('click', function() {
                i = 0;
                updateChart('All disasters', catastrophes[i], '#FF0000');
            });

            document.getElementById('btnino').addEventListener('click', function() {
                i = 3
                updateChart('Flood', catastrophes[i], '#0000FF');
            });

            document.getElementById('btnfeu').addEventListener('click', function() {
                i = 7;
                updateChart('Wildfire', catastrophes[i], '#ff5100');
                
            });

            document.getElementById('btntre').addEventListener('click', function() {
                i = 1;
                updateChart('Earthquake', catastrophes[i], '#402402');
            });

            document.getElementById('btnsec').addEventListener('click', function() {
                i = 2;
                updateChart('Drought', catastrophes[i], '#d98723');
            });

            updateChart('All disasters', catastrophes[i], '#FF0000');


        });
    
});