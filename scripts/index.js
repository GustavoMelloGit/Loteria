(function () {
    "use strict";
    function app() {
        const ajax = new XMLHttpRequest();
        let gamesOptions;
        let games;
        let response;
        const gameDescription = document.querySelector(
            '[data-js="gameDescription"]'
        );
        const gamesOptionsWrapper = document.querySelector('[data-js="gamesOptionsWrapper"]');
        const gameName = document.querySelector('[data-js="betGameName"]');
        const betTable = document.querySelector("#betNumbers");
        const addToCart = document.querySelector('[data-js="addToCart"]');
        const gamesInCart = document.querySelector('[data-js="gamesInCart"]');
        const totalPrice = document.querySelector('[data-js="totalPrice"]');
        const completeGame = document.querySelector('[data-js="completeGame"]');
        const clearGame = document.querySelector('[data-js="clearGame"]');

        let gameSelected;
        let numbersSelected = [];
        let totalPriceCount = 0;

        function verifyStateAjax() {
            if (ajax.readyState === 4 && ajax.status === 200) {
                response = JSON.parse(ajax.responseText);
                gamesOptions = response.types;
                addGamesOptions();
                return true;
            }
        }
        async function getDataFromJSON() {
            try {
                ajax.open("GET", "./games.json");
                ajax.send();
                ajax.addEventListener("readystatechange", verifyStateAjax);
            } catch (e) {
                alert(e);
            }
        }

        function addGameInfo() {
            gameDescription.textContent = response.types[gameSelected].description;
            gameName.textContent = `for ${response.types[gameSelected].type}`
        }

        function addGamesOptions() {
            for (let i = 0; i < gamesOptions.length; i++) {
                const gameButton = document.createElement("button");
                gameButton.setAttribute('class', 'buttonGame');
                gameButton.setAttribute('data-js', 'buttonGame');
                gameButton.textContent = gamesOptions[i].type;
                gameButton.style.border = `2px solid ${gamesOptions[i].color}`;
                gameButton.style.color = gamesOptions[i].color;
                gameButton.addEventListener('click', () => eventListeners(i))
                gamesOptionsWrapper.appendChild(gameButton);
            }
            games = document.querySelectorAll('[data-js="buttonGame"]');
            games[0].click();
        }


        function resetButtonsSelected(games) {
            for (let i in gamesOptions) {
                games[i].style.backgroundColor = "white";
                games[i].style.color = gamesOptions[i].color;
            }
        }

        function buttonSelected() {
            resetButtonsSelected(games);
            games[gameSelected].style.backgroundColor = games[gameSelected].style.color;
            games[gameSelected].style.color = "white";
            handleClearGame();
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
                number.style.backgroundColor = gamesOptions[gameSelected].color;
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
            return gamesOptions[gameSelected].type;
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
            return gamesOptions[gameSelected].price;
        }

        function calculateTotalPrice() {
            totalPriceCount += response.types[gameSelected].price;
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

        function selectRandomNumbers() {
            const numbers = document.querySelectorAll('.betNumber');
            if (numbersSelected.length < getSelectedGameMax()) {
                const random = randomNumber(1, getSelectedGameRange());
                numbers[random - 1].click();
                console.log(numbersSelected);
                selectRandomNumbers();
            }
            else return;
        }

        function handleCompleteGame() {
            handleClearGame();
            selectRandomNumbers();
        }

        function handleClearGame() {
            numbersSelected = [];
            const numbers = document.querySelectorAll('.betNumber');
            for (let i = 0; i < numbers.length; i++) {
                numbers[i].style.backgroundColor = "#adc0c4";
            }
        }

        function handleDeleteGame(deletedGame, price) {
            deletedGame.remove();
            totalPriceCount -= price;
            totalPrice.textContent = `Total: ${formatPrice(totalPriceCount)}`;
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
            handleClearGame();
        }

        function eventListeners(index) {
            gameSelected = index;
            buttonSelected(index);
            addGameInfo();
            createBetButtons(response.types[index].range);
        }

        addToCart.addEventListener("click", () => {
            handleAddToCart();
        });
        completeGame.addEventListener('click', () => {
            handleCompleteGame();
        })
        clearGame.addEventListener('click', () => {
            handleClearGame();
        })
        document.addEventListener('DOMContentLoaded', () => {
            getDataFromJSON();
        })
    }
    app();
})();
