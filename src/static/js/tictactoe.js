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

        return {
            toggle,
            showGameModeSelection,
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
