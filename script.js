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
                console.log(slider.value);
                let annee = slider.value;
                let data = disasterData[disaster][annee];
                display.textContent = catastrophes[i] + " : " + data + " en " + annee;
                console.log(data);
                
                firstValue = Number(firstValue);
                lastValue = Number(lastValue);
                let range = lastValue - firstValue;
                
                let quarter = Math.floor((annee - firstValue) / (range / 4));

                switch (quarter) {
                    case 0:
                        console.log("First quarter");
                        image.src = "LEGO/"+disasters[i]+"/1.png";
                        break;
                    case 1:
                        console.log("Second quarter");
                        image.src = "LEGO/"+disasters[i]+"/2.png";
                        break;
                    case 2:
                        console.log("Third quarter");
                        image.src = "LEGO/"+disasters[i]+"/3.png";
                        break;
                    case 3:
                        console.log("Fourth quarter");
                        image.src = "LEGO/"+disasters[i]+"/4.png";
                        break;
                    default:
                        console.log("Out of range");
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
                console.log(labels);
                firstValue = labels[0];
                lastValue = labels[labels.length - 1];
                console.log(slider)
                slider.min = firstValue;
                slider.max = lastValue;

                // Met à jour la couleur du slider et du curseur pour qu'elles correspondent à la couleur du graphique
                updateSliderColor(borderColor);
            }

            // Boutons de sélection de catastrophes
            document.getElementById('btnall').addEventListener('click', function() {
                i = 0;
                updateChart('All disasters', catastrophes[i], disasterColors[i]);
                slider.value = slider.min;  // Réinitialiser la valeur du slider
                image.src = "LEGO/"+disasters[i]+"/1.png";  // Afficher la première image
            });

            document.getElementById('btnino').addEventListener('click', function() {
                i = 3;
                updateChart('Flood', catastrophes[i], disasterColors[i]);
                slider.value = slider.min;  // Réinitialiser la valeur du slider
                image.src = "LEGO/"+disasters[i]+"/1.png";  // Afficher la première image
            });

            document.getElementById('btnfeu').addEventListener('click', function() {
                i = 7;
                updateChart('Wildfire', catastrophes[i], disasterColors[i]);
                slider.value = slider.min;  // Réinitialiser la valeur du slider
                image.src = "LEGO/"+disasters[i]+"/1.png";  // Afficher la première image
            });

            document.getElementById('btntre').addEventListener('click', function() {
                i = 1;
                updateChart('Earthquake', catastrophes[i], disasterColors[i]);
                slider.value = slider.min;  // Réinitialiser la valeur du slider
                image.src = "LEGO/"+disasters[i]+"/1.png";  // Afficher la première image
            });

            document.getElementById('btnsec').addEventListener('click', function() {
                i = 2;
                updateChart('Drought', catastrophes[i], disasterColors[i]);
                slider.value = slider.min;  // Réinitialiser la valeur du slider
                image.src = "LEGO/"+disasters[i]+"/1.png";  // Afficher la première image
            });

            // Initialisation du graphique avec la première catastrophe et mise à jour de la couleur du slider et du curseur
            updateChart('All disasters', catastrophes[i], disasterColors[i]);
            slider.value = slider.min;  // Réinitialiser la valeur du slider
            image.src = "LEGO/"+disasters[i]+"/1.png";  // Afficher la première image
        });
});
