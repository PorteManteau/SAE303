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

            parsedData.forEach(row => {
                if (!disasterData[row.Entity]) {
                    disasterData[row.Entity] = {};
                }
                disasterData[row.Entity][row.Year] = row.Disasters;
            });

            let i = 0;
            let disasters = ['All disasters', 'Earthquake', 'Extreme temperature', 'Flood', 'Landslide', 'Mass movement (dry)', 'Volcanic activity', 'Wildfire'];
            let catastrophes = ['Toutes les catastrophes', 'Tremblement de terre', 'Température extrême', 'Inondation', 'Glissement de terrain', 'Mouvement de masse', 'Activité volcanique', 'Feu de forêt'];
            let disasterColors = ['#FF0000', '#402402', '#d98723', '#0000FF', '#ff5100', '#4caf50', '#9c27b0', '#ff9800']; // Couleurs des catastrophes

            let disaster = disasters[i];

            let labels = Object.keys(disasterData[disaster]);
            let data = Object.values(disasterData[disaster]);
            let firstValue = labels[0];
            let lastValue = labels[labels.length - 1];

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
                        borderColor: disasterColors[i], // Couleur du graphique
                        borderWidth: 2
                    }]
                }
            });

            let image = document.getElementById('image');
            let slider = document.getElementById('slider');
            let display = document.getElementById('display');

            // Fonction pour changer la couleur de la partie avant du slider et du curseur
            function updateSliderColor(color) {
                const value = slider.value;
                const min = slider.min;
                const max = slider.max;
                const percentage = (value - min) / (max - min) * 100;

                // Mise à jour de la couleur de la partie avant du slider
                slider.style.background = `linear-gradient(to right, ${color} ${percentage}%, #ddd ${percentage}%)`;

                // Mise à jour de la couleur du curseur
                slider.style.setProperty('--thumb-color', color); // Changer la couleur du curseur
            }

            // Initialisation de la couleur du slider et du curseur
            updateSliderColor(disasterColors[i]);

            // Initialisation du slider avec la valeur minimale
            slider.value = slider.min;  // Réinitialiser la valeur du slider
            slider.addEventListener('input', function() {

                let annee = slider.value;
                let data = disasterData[disaster][annee];

                if (data === undefined) {
                    data = 0; // Vous pouvez remplacer `0` par "Aucune donnée" ou ce que vous préférez.
                }

                display.textContent = catastrophes[i] + " : " + data + " en " + annee;
                
                
                let maxData = Math.max(...Object.values(disasterData[disaster]));
                let minData = Math.min(...Object.values(disasterData[disaster]));
                console.log(`Highest: ${maxData}, Lowest: ${minData}`);
                
                let range = maxData - minData;
                let quarter = Math.floor((data - minData) / (range / 4));
                console.log("Data: "+data);
                console.log(`Quarter: ${quarter}`);
                
                if(i==0){
                    document.getElementById('big-display').innerText = data;
                }

                else{
                    switch (quarter) {
                        case 0:
                            image.src = "LEGO/"+disasters[i]+"/1.png";
                            break;
                        case 1:
                            image.src = "LEGO/"+disasters[i]+"/2.png";
                            break;
                        case 2:
                            image.src = "LEGO/"+disasters[i]+"/3.png";
                            break;
                        case 3:
                            image.src = "LEGO/"+disasters[i]+"/4.png";
                            break;
                        default:
                    }
                }
            
                // Met à jour la couleur du slider et du curseur chaque fois que la valeur change
                updateSliderColor(disasterColors[i]);
            });

            function updateChart(disasterType, label, borderColor) {
                let labels = Object.keys(disasterData[disasterType]);
                let data = Object.values(disasterData[disasterType]);

                chart.data.labels = labels;
                chart.data.datasets[0].data = data;
                chart.data.datasets[0].label = label;
                chart.data.datasets[0].borderColor = borderColor; // Mise à jour de la couleur du graphique
                chart.update();
                firstValue = labels[0];
                lastValue = labels[labels.length - 1];
                slider.min = firstValue;
                slider.max = lastValue;

                // Met à jour la couleur du slider et du curseur pour qu'elles correspondent à la couleur du graphique
                updateSliderColor(borderColor);
            }

            // Boutons de sélection de catastrophes
            document.getElementById('btnall').addEventListener('click', function() {
                i = 0;
                disaster = disasters[i];
                updateChart('All disasters', catastrophes[i], disasterColors[i]);
                slider.value = slider.min;  // Réinitialiser la valeur du slider
                image.style.display = "none";
                document.getElementById('big-display').innerText = disasterData[disaster][slider.value];
                
            });

            document.getElementById('btnino').addEventListener('click', function() {
                i = 3;
                disaster = disasters[i];
                updateChart('Flood', catastrophes[i], disasterColors[i]);
                slider.value = slider.min;  // Réinitialiser la valeur du slider
                image.src = "LEGO/"+disasters[i]+"/1.png";  // Afficher la première image
                image.style.display = "block";
                document.getElementById('big-display').innerText = "";
                display.textContent = catastrophes[i] + " : " + disasterData[disaster][slider.value] + " en " + slider.value;
                
            });

            document.getElementById('btnfeu').addEventListener('click', function() {
                i = 7;
                disaster = disasters[i];
                updateChart('Wildfire', catastrophes[i], disasterColors[i]);
                slider.value = slider.min;  // Réinitialiser la valeur du slider
                image.src = "LEGO/"+disasters[i]+"/1.png";  // Afficher la première image
                image.style.display = "block";
                document.getElementById('big-display').innerText = "";
                display.textContent = catastrophes[i] + " : " + disasterData[disaster][slider.value] + " en " + slider.value;

            });

            document.getElementById('btntre').addEventListener('click', function() {
                i = 1;
                disaster = disasters[i];
                updateChart('Earthquake', catastrophes[i], disasterColors[i]);
                slider.value = slider.min;  // Réinitialiser la valeur du slider
                image.src = "LEGO/"+disasters[i]+"/1.png";  // Afficher la première image
                image.style.display = "block";
                document.getElementById('big-display').innerText = "";
                display.textContent = catastrophes[i] + " : " + disasterData[disaster][slider.value] + " en " + slider.value;

            });

            document.getElementById('btnsec').addEventListener('click', function() {
                i = 2;
                disaster = disasters[i];
                console.log(disaster);
                updateChart('Extreme temperature', catastrophes[i], disasterColors[i]);
                slider.value = slider.min;  // Réinitialiser la valeur du slider
                image.src = "LEGO/"+disasters[i]+"/1.png";  // Afficher la première image
                image.style.display = "block";
                document.getElementById('big-display').innerText = "";
                display.textContent = catastrophes[i] + " : " + disasterData[disaster][slider.value] + " en " + slider.value;

            });

            // Initialisation du graphique avec la première catastrophe et mise à jour de la couleur du slider et du curseur
            updateChart('All disasters', catastrophes[i], disasterColors[i]);
            slider.value = slider.min;  // Réinitialiser la valeur du slider
            document.getElementById('big-display').innerText = disasterData[disaster][slider.value];
            display.textContent = catastrophes[i] + " : " + disasterData[disaster][slider.value] + " en " + slider.value;
        });
});
