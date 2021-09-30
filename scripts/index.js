(function () {
    "use strict";
    function app() {
        const ajax = new XMLHttpRequest();
        let response;
        const lotofacil = document.querySelector('[data-js="button-lotofacil"]');
        const megaSena = document.querySelector('[data-js="button-mega-sena"]');
        const lotomania = document.querySelector('[data-js="button-lotomania"]');
        const gameDescription = document.querySelector(
            '[data-js="gameDescription"]'
        );
        const gameName = document.querySelector('[data-js="betGameName"]');
        const betTable = document.querySelector("#betNumbers");
        const addToCart = document.querySelector('[data-js="addToCart"]');
        const gamesInCart = document.querySelector('[data-js="gamesInCart"]');
        const totalPrice = document.querySelector('[data-js="totalPrice"]');
        const completeGame = document.querySelector('[data-js="completeGame"]');
        let gameSelected;
        let numbersSelected = [];
        let totalPriceCount = 0;

        function verifyStateAjax() {
            if (ajax.readyState === 4 && ajax.status === 200) {
                response = JSON.parse(ajax.responseText);
                return true;
            } else return false;
        }
        function getDataFromJSON(index) {
            try {
                ajax.open("GET", "./games.json");
                ajax.send();
                ajax.addEventListener("readystatechange", () => {
                    if (verifyStateAjax()) {
                        gameDescription.textContent = response.types[index].description;
                    }
                });
            } catch (e) {
                alert(e);
            }
        }

        function resetButtonsSelected() {
            if (response) {
                lotofacil.style.backgroundColor = "white";
                lotofacil.style.color = response.types[0].color;
                megaSena.style.backgroundColor = "white";
                megaSena.style.color = response.types[1].color;
                lotomania.style.backgroundColor = "white";
                lotomania.style.color = response.types[2].color;
            }
        }

        function buttonSelected(index) {
            switch (index) {
                case 0:
                    resetButtonsSelected();
                    lotofacil.style.backgroundColor = "#7f3992";
                    lotofacil.style.color = "white";
                    gameName.textContent = "for lotofácil";
                    break;
                case 1:
                    resetButtonsSelected();
                    megaSena.style.backgroundColor = "#01ac66";
                    megaSena.style.color = "white";
                    gameName.textContent = "for Mega-sena";
                    break;
                case 2:
                    resetButtonsSelected();
                    lotomania.style.backgroundColor = "#f79c31";
                    lotomania.style.color = "white";
                    gameName.textContent = "for lotomania";
                    break;
            }
            numbersSelected = [];
        }

        function numberFormat(index) {
            if (index < 10) return `0${index}`;
            else return index;
        }

        function cleanBetTable() {
            betTable.innerHTML = "";
        }

        function handleNumberClicked(number) {
            if (numbersSelected.includes(number.value)) {
                const index = numbersSelected.indexOf(number.value);

                number.style.backgroundColor = "#adc0c4";
                numbersSelected.splice(index, 1);
            } else {
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
                const numbers = document.createElement("button");
                numbers.classList.add("betNumber");
                numbers.style.transition = ".2s";
                numbers.textContent = numberFormat(i);
                numbers.value = i;

                numbers.addEventListener("click", () => handleNumberClicked(numbers));

                betTable.appendChild(numbers);
            }
        }

        function verifyNumberOfSelected() {
            if (response.types[gameSelected].max_number < numbersSelected.length || numbersSelected.length === 0) return false;
            else return true;
        }

        function returnGameName() {
            switch (gameSelected) {
                case 0:
                    return response.types[0].type;
                case 1:
                    return response.types[1].type;
                case 2:
                    return response.types[2].type;
            }
        }

        function formatPrice(number) {
            const formated = new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL'
            })
            number = formated.format(number);
            return ` ${number}`;
        }
        function calculateGamePrice() {
            let gamePrice = response.types[gameSelected].price * numbersSelected.length;
            totalPriceCount += response.types[gameSelected].price * numbersSelected.length;
            return gamePrice;
        }

        function calculateTotalPrice() {
            return `Total: ${formatPrice(totalPriceCount)}`;
        }

        function randomNumber(min, max) {
            return Math.floor(Math.random() * (max - min) + min);
        }

        function getSelectedGameRange() {
            return response.types[gameSelected].range;
        }
        function getSelectedGameMax() {
            return response.types[gameSelected].max_number;
        }
        function getSelectedGameColor() {
            return response.types[gameSelected].color;
        }

        function handleCompleteGame() {
            for (let i = 0; i < getSelectedGameMax(); i++) {
                if (gameSelected !== getSelectedGameMax) {
                    const random = randomNumber(1, getSelectedGameRange())
                    if (!numbersSelected.includes(random)) {
                        numbersSelected.push(random);
                    }
                    else i--;
                }
            }
            handleAddToCart();
        }

        function handleDeleteGame(deletedGame, price) {
            deletedGame.remove();
            totalPriceCount -= price;
            totalPrice.textContent = calculateTotalPrice();
        }
        function handleAddToCart() {
            const trashCan = document.createElement('img');
            trashCan.src = '../assets/trash.svg';

            if (verifyNumberOfSelected()) {
                const game = document.createElement('div');
                game.classList.add('game');
                game.appendChild(trashCan);

                const gameInnerContent = document.createElement('div');
                gameInnerContent.classList.add('gameInnerContent');
                gameInnerContent.style.borderLeft = `3px solid ${getSelectedGameColor()}`;

                const gameNumbers = document.createElement('span');
                const wrapper = document.createElement('div');

                const gameName = document.createElement('span');
                gameName.classList.add('gameName');
                gameName.style.color = getSelectedGameColor();

                const price = document.createElement('span');
                const priceNumber = calculateGamePrice();

                price.textContent = formatPrice(priceNumber);
                gameName.textContent = returnGameName();
                totalPrice.textContent = calculateTotalPrice();

                wrapper.appendChild(gameName);
                wrapper.appendChild(price);

                gameNumbers.textContent = numbersSelected;
                gameInnerContent.appendChild(gameNumbers);
                gameInnerContent.appendChild(wrapper);

                game.appendChild(gameInnerContent);

                gamesInCart.appendChild(game);

                trashCan.addEventListener('click', () => handleDeleteGame(game, priceNumber));
            } else {
                alert(
                    `Preencha corretamente os campos`
                );
            }
            numbersSelected = [];
        }

        function eventListeners(index) {
            gameSelected = index;
            getDataFromJSON(index);
            buttonSelected(index);
            if (response) {
                createBetButtons(response.types[index].range);
            }
        }

        lotofacil.addEventListener("click", () => {
            eventListeners(0);
        });

        megaSena.addEventListener("click", () => {
            eventListeners(1);
        });

        lotomania.addEventListener("click", () => {
            eventListeners(2);
        });

        addToCart.addEventListener("click", () => {
            handleAddToCart();
        });
        completeGame.addEventListener('click', () => {
            handleCompleteGame();
        })

        lotofacil.click();
    }
    app();
})();
