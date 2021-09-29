(function () {
    "use strict";
    function app() {
        const ajax = new XMLHttpRequest();
        let response;
        const lotofacil = document.querySelector('[data-js="button-lotofacil"]');
        const megaSena = document.querySelector('[data-js="button-mega-sena"]');
        const lotomania = document.querySelector('[data-js="button-lotomania"]');
        const gameDescription = document.querySelector('[data-js="gameDescription"]');
        const gameName = document.querySelector('[data-js="betGameName"]');
        const betTable = document.querySelector('#betNumbers');
        const addToCart = document.querySelector('[data-js="addToCart"]');
        let gameSelected;
        let numbersSelected = [];
        let countNumberSelected;

        function verifyStateAjax() {
            if (ajax.readyState === 4 && ajax.status === 200) {
                response = JSON.parse(ajax.responseText);
                return true;
            }
            else return false;
        }
        async function getDataFromJSON(index) {
            try {
                ajax.open('GET', './games.json');
                ajax.send();
                ajax.addEventListener('readystatechange', () => {
                    if (verifyStateAjax()) {
                        gameDescription.textContent = response.types[index].description;
                    }
                });
            } catch (e) {
                alert(e);
            }
        }

        function resetButtonsSelected() {
            lotofacil.style.backgroundColor = 'white';
            lotofacil.style.color = response.types[0].color;
            megaSena.style.backgroundColor = "white";
            megaSena.style.color = response.types[1].color;
            lotomania.style.backgroundColor = "white";
            lotomania.style.color = response.types[2].color;
        }

        function buttonSelected(index) {
            switch (index) {
                case 0:
                    resetButtonsSelected();
                    lotofacil.style.backgroundColor = '#7f3992';
                    lotofacil.style.color = "white";
                    gameName.textContent = 'for lotofácil';
                    break;
                case 1:
                    resetButtonsSelected();
                    megaSena.style.backgroundColor = "#01ac66";
                    megaSena.style.color = "white";
                    gameName.textContent = 'for Mega-sena';
                    break;
                case 2:
                    resetButtonsSelected();
                    lotomania.style.backgroundColor = "#f79c31";
                    lotomania.style.color = "white";
                    gameName.textContent = 'for lotomania';
                    break;
            }
            numbersSelected = [];
        }

        function numberFormat(index) {
            if (index < 10) return `0${index}`;
            else return index;
        }

        function cleanBetTable() {
            betTable.innerHTML = '';
        }
        function numberClicked(number) {
            if (numbersSelected.includes(number.value)) {
                const index = numbersSelected.indexOf(number.value);

                number.style.backgroundColor = '#adc0c4';
                numbersSelected.splice(index, 1);
            }
            else {
                switch (gameSelected) {
                    case 0:
                        number.style.backgroundColor = response.types[0].color;
                        break;
                    case 1:
                        number.style.backgroundColor = response.types[1].color;
                        break;
                    case 2:
                        number.style.backgroundColor = response.types[2].color;
                        break;
                }
                numbersSelected.push(number.value);
            }
        }

        function createBetButtons(index) {
            cleanBetTable();
            for (let i = 1; i <= index; i++) {
                const numbers = document.createElement('button');
                numbers.classList.add('betNumber');
                numbers.style.transition = ".2s";
                numbers.textContent = numberFormat(i);
                numbers.value = i;

                numbers.addEventListener('click', () => numberClicked(numbers));

                betTable.appendChild(numbers);
            }
        }

        function eventListeners(index) {
            countNumberSelected++;
            gameSelected = index;
            getDataFromJSON(index);
            buttonSelected(index);
            createBetButtons(response.types[index].range);
        }

        lotofacil.addEventListener('click', () => {
            eventListeners(0);
        });

        megaSena.addEventListener('click', () => {
            eventListeners(1);
        });

        lotomania.addEventListener('click', () => {
            eventListeners(2);
        });
        addToCart.addEventListener('click', () => console.log(numbersSelected))

        document.addEventListener("DOMContentLoaded", () => {
            lotofacil.click();
        });
    }
    app();
})();