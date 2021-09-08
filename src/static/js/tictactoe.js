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
    const _gameboard = document.querySelector("#gameboard");
    const _gameboardCells = Array.from(_gameboard.children);
    const _menu = document.querySelector(".menu");

    const drawMark = (mark, positionX, positionY) => {
        const cell = _gameboardCells.filter((cell) => cell.dataset.positionx == positionX &&
                                                      cell.dataset.positiony == positionY)[0];
        cell.textContent = mark.toUpperCase();
    }

    const clearGameboard = () => {_gameboardCells.forEach((cell) => cell.textContent = "")};

    const toggleMenu = (state) => {
        if (state === "off") {
            _menu.classList.add("hidden");
            _gameboard.classList.remove("blur");
        }
        else if (state === "on") {
            _menu.classList.remove("hidden");
            _gameboard.classList.add("blur");
        }
        else {
            throw Error("Invalid argument: state must be 'off' or 'on'");
        }
    }

    return {
        drawMark,
        clearGameboard,
        toggleMenu,
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
        displayController.drawMark(_mark, positionX, positionY)
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
