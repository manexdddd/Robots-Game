document.addEventListener('DOMContentLoaded', () => {
    const cientificosYRobots = [
        document.getElementById('cientifico1'),
        document.getElementById('cientifico2'),
        document.getElementById('cientifico3'),
        document.getElementById('robot1'),
        document.getElementById('robot2'),
        document.getElementById('robot3')
    ];

    // Añadimos la clase 'cientifico' a los elementos correspondientes
    document.getElementById('cientifico1').classList.add('cientifico');
    document.getElementById('cientifico2').classList.add('cientifico');
    document.getElementById('cientifico3').classList.add('cientifico');

    // Añadimos la clase 'robot' a los elementos correspondientes
    document.getElementById('robot1').classList.add('robot');
    document.getElementById('robot2').classList.add('robot');
    document.getElementById('robot3').classList.add('robot');

    const laboratorio1 = document.getElementById('laboratorio1');
    const laboratorio2 = document.getElementById('laboratorio2');
    const elevator = document.getElementById('elevadorInterior');
    const moveCounter = document.getElementById('textoo');
    moveCounter.id = 'moveCounter';
    moveCounter.textContent = 'Movimientos: 0';
   

    let selectedElements = [];
    let currentLab = laboratorio1;
    let moves = 0;

    const resultModal = document.getElementById('resultModal');
    const resultText = document.getElementById('resultText');
    const closeModalBtn = document.getElementById('closeModalBtn');
    const checkResultBtn = document.getElementById('checkResultBtn');

    function selectElement(element) {
        if (selectedElements.includes(element)) {
            element.classList.remove('selected');
            selectedElements = selectedElements.filter(el => el !== element);
        } else if (selectedElements.length < 2) {
            element.classList.add('selected');
            selectedElements.push(element);
        }
    }

    cientificosYRobots.forEach(element => {
        element.addEventListener('click', () => {
            if (currentLab.contains(element) || elevator.contains(element)) {
                selectElement(element);
            }
        });
    });
    function checkRules(lab) {
        const cientificos = lab.querySelectorAll('.cientifico').length;
        const robots = lab.querySelectorAll('.robot').length;
    
        // Solo perderá si hay más robots que científicos y al menos un científico
        return cientificos === 0 || robots <= cientificos;
    }
    

    function loadUnloadElevator() {
        if (elevator.children.length > 1) {
            alert("El elevador ya tiene personajes y no se pueden cargar más.");
            return;
        }
        
    
        selectedElements.forEach(element => {
            if (elevator.contains(element)) {
                currentLab.appendChild(element);
            } else {
                elevator.appendChild(element);
            }
            element.classList.remove('selected');
        });
        selectedElements = [];
    }

    function moveElevator(targetLab) {
        if (Array.from(elevator.children).length === 0) {
            alert("El elevador no puede trasladarse vacío.");
            return;
        }
    
      
        if (targetLab === laboratorio2) {
            elevator.style.transform = 'translateY(340px)';
        } else {
            elevator.style.transform = 'translateY(0)';
        }
    
        currentLab = targetLab;

        if (!checkRules(currentLab)) {
            alert("No puedes dejar más robots que científicos en el laboratorio.");
            return;
        }
    
    }

    function sendToTargetLab(targetLab) {
        const allSelectedInElevator = selectedElements.every(element => elevator.contains(element));

        if (elevator.children.length === 0) {
            alert("No hay personajes en el elevador para enviar.");
            return;
        }

        if (selectedElements.length === 2 && allSelectedInElevator) {
            alert("Selecciona solo uno");
            return;
        }

        moveElevator(targetLab);

        setTimeout(() => {
            Array.from(elevator.children).forEach(element => {
                targetLab.appendChild(element);
                element.classList.remove('selected');
            });

            moves++;
            moveCounter.textContent = 'Movimientos: ' + moves;
            selectedElements = [];

            if (checkGameStatus()) {
                return;
            }
        }, 2000);
    }

    function checkGameStatus() {
        if (laboratorio2.querySelectorAll('.cientifico').length === 3 && laboratorio2.querySelectorAll('.robot').length === 3) {
            alert("¡Felicidades! Has ganado el juego en " + moves + " movimientos.");
            audio.pause();
            audio.currentTime = 0; // Volver al inicio de la canción
        
            // Cambiar la canción y reproducirla
            audio.src = 'firework.mp3'; // Aquí pones la ruta de tu nueva canción
            audio.play(); // Reproducir la nueva canción
            showWinModal();
            return true;
        }

        if (!checkRules(laboratorio1)) {
            alert("¡Derrota! Hay más robots que científicos en laboratorio 1.");
            audio.pause();
            audio.currentTime = 0; // Volver al inicio de la canción
        
            // Cambiar la canción y reproducirla
            audio.src = 'boda.mp3'; // Aquí pones la ruta de tu nueva canción
            audio.play(); // Reproducir la nueva canción
            showLoseModal();
            return true;
        }

        if (!checkRules(laboratorio2)) {
            alert("¡Derrota! Hay más robots que científicos en laboratorio 2.");

            audio.pause();
            audio.currentTime = 0; // Volver al inicio de la canción
        
            // Cambiar la canción y reproducirla
            audio.src = 'boda.mp3'; // Aquí pones la ruta de tu nueva canción
            audio.play(); // Reproducir la nueva canción
            showLoseModal();
            return true;
        }

        return false;
    }

    function showLoseModal() {
        document.getElementById('modal-btn').checked = true;
    }

    function showWinModal() {
        document.getElementById('modal-btn2').checked = true;
    }

    function refreshPage() {
        window.location.reload();
    }

    document.getElementById('loseButton2').addEventListener('click', refreshPage);
    document.getElementById('loseButton').addEventListener('click', refreshPage);
    document.getElementById('moveButton').addEventListener('click', loadUnloadElevator);
    document.getElementById('moveButton2').addEventListener('click', () => {
        sendToTargetLab(laboratorio2);
    });
    document.getElementById('moveButton3').addEventListener('click', () => {
        sendToTargetLab(laboratorio1);
    });
});
