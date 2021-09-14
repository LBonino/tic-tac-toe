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
        const _title = _menu.firstElementChild;
        const _content = _menu.lastElementChild;

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
            _title.textContent = "Select game mode";

            const singlePlayerButton = document.createElement("button");
            singlePlayerButton.textContent = "1 player";
            singlePlayerButton.dataset.playerNumber = 1;

            const multiPlayerButton = document.createElement("button");
            multiPlayerButton.textContent = "2 players";
            multiPlayerButton.dataset.playerNumber = 2;

            _content.classList.add("gamemode-selection")
            _content.appendChild(singlePlayerButton);
            _content.appendChild(multiPlayerButton);
        }

        const showPlayerNameForm = () => {
            _title.textContent = "Enter player names";

            const itemPlayer1 = _createItemForPlayerName(1);
            const itemPlayer2 = _createItemForPlayerName(2);

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

            _content.classList.add("player-name-form");
            _content.appendChild(form);
        }

        const _createItemForPlayerName = (playerNumber) => {
            const label = document.createElement("label");
            label.htmlFor = `player${playerNumber}-name-input`;
            label.textContent = `Player ${playerNumber}`;

            const input = document.createElement("input");
            input.id = `player${playerNumber}-name-input`;
            input.classList.add("player-name-input");
            input.name = `player${playerNumber}-name`;
            input.type = `text`;
            input.required = true;

            const item = document.createElement("li");
            item.appendChild(label);
            item.appendChild(input);

            return item;
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
