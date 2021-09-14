const gameboard = (() => {
    let _squareGrid = [["", "", ""], ["", "", ""], ["", "", ""]];

    const getState = () => _squareGrid; 
    const reset = () => {_squareGrid = [["", "", ""], ["", "", ""], ["", "", ""]]};

    const placePiece = (mark, positionX, positionY) => {
        _squareGrid[positionY][positionX] = mark;
    };
    
    return {
        reset,
        getState,
        placePiece
    };
})();

const displayController = (() => {
    const gameboard = (() => {
        const _gameboard = document.querySelector("#gameboard");
        const _gameboardCells = Array.from(_gameboard.children);

        const drawMark = (mark, positionX, positionY) => {
            const cell = _gameboardCells.filter((cell) => cell.dataset.positionx == positionX &&
                                                          cell.dataset.positiony == positionY)[0];
            cell.textContent = mark.toUpperCase();
        }

        const clear = () => {_gameboardCells.forEach((cell) => cell.textContent = "")};
        const getElement = () => _gameboard;

        return {
            drawMark,
            clear,
            getElement,
        };
    })();

    const menu = (() => {
        const _menu = document.querySelector(".menu");

        const toggle = (state) => {
            if (state === "off") {
                _menu.classList.add("hidden");
                gameboard.getElement().classList.remove("blur");
            }
            else if (state === "on") {
                _menu.classList.remove("hidden");
                gameboard.getElement().classList.add("blur");
            }
            else {
                throw Error("Invalid argument: state must be 'off' or 'on'");
            }
        }

        const showGameModeSelection = () => {
            const title = _menu.firstElementChild;
            title.textContent = "Select game mode";

            const singlePlayerButton = document.createElement("button");
            singlePlayerButton.textContent = "1 player";
            singlePlayerButton.dataset.playerNumber = 1;

            const multiPlayerButton = document.createElement("button");
            multiPlayerButton.textContent = "2 players";
            multiPlayerButton.dataset.playerNumber = 2;

            const content = _menu.lastElementChild;
            content.classList.add("gamemode-selection")
            content.appendChild(singlePlayerButton);
            content.appendChild(multiPlayerButton);
        }

        const showPlayerNameForm = () => {
            const title = _menu.firstElementChild;
            title.textContent = "Enter player names";

            const labelPlayer1 = document.createElement("label");
            labelPlayer1.htmlFor = "player1-name-input";
            labelPlayer1.textContent = "Player 1";

            const inputPlayer1 = document.createElement("input");
            inputPlayer1.id = "player1-name-input";
            inputPlayer1.classList.add("player-name-input");
            inputPlayer1.name = "player1-name";
            inputPlayer1.type = "text";
            inputPlayer1.required = true;

            const itemPlayer1 = document.createElement("li");
            itemPlayer1.appendChild(labelPlayer1);
            itemPlayer1.appendChild(inputPlayer1);

            const labelPlayer2 = document.createElement("label");
            labelPlayer2.htmlFor = "player2-name-input";
            labelPlayer2.textContent = "Player 2";

            const inputPlayer2 = document.createElement("input");
            inputPlayer2.id = "player2-name-input";
            inputPlayer2.classList.add("player-name-input");
            inputPlayer2.name = "player2-name";
            inputPlayer2.type = "text";
            inputPlayer2.required = true;

            const itemPlayer2 = document.createElement("li");
            itemPlayer2.appendChild(labelPlayer2);
            itemPlayer2.appendChild(inputPlayer2);

            const startGame = document.createElement("button");
            startGame.id = "form-submit";
            startGame.classList.add("form-submit");
            startGame.type = "submit";
            startGame.textContent = "START GAME";

            const itemStartGame = document.createElement("li");
            itemStartGame.appendChild(startGame);

            const unorderedList = document.createElement("ul");
            unorderedList.appendChild(itemPlayer1);
            unorderedList.appendChild(itemPlayer2);
            unorderedList.appendChild(itemStartGame);
            
            const form = document.createElement("form");
            form.appendChild(unorderedList);

            const content = _menu.lastElementChild;
            content.classList.add("player-name-form");
            content.appendChild(form);
        }

        return {
            toggle,
            showGameModeSelection,
            showPlayerNameForm
        };
    })();

    return {
        gameboard,
        menu,
    };
})();

const Player = (mark) => {
    const _mark = mark.toLowerCase()
    const _validMarks = ["x", "o"];

    if (!_validMarks.includes(_mark)) {
        return console.error("Invalid mark: mark must be 'x' or 'y'");
    }

    const makeMove = (positionX, positionY) => {
        if (!_isValidMove(positionX, positionY)) {
            throw Error("Invalid move");
        }

        gameboard.placePiece(_mark, positionX, positionY);
        displayController.gameboard.drawMark(_mark, positionX, positionY);
    }

    const _isValidMove = (positionX, positionY) => {
        return (
            positionX >= 0 && positionX <= 2 &&
            positionY >= 0 && positionY <= 2 &&
            gameboard.getState()[positionY][positionX] === ""
        );
    };

    return {makeMove};
};
