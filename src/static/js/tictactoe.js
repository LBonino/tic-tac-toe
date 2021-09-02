const gameboard = (() => {
    let _squareGrid = [["", "", ""], ["", "", ""], ["", "", ""]];
    const _validMarks = ["x", "o"];

    const getState = () => _squareGrid; 
    const reset = () => {_squareGrid = [["", "", ""], ["", "", ""], ["", "", ""]]};
    const getValidMarks = () => _validMarks;

    const placePiece = (mark, positionX, positionY) => {
        _squareGrid[positionY][positionX] = mark;
    };
    
    return {
        reset,
        getState,
        placePiece,
        getValidMarks
    };
})();

const displayController = (() => {
    const _gameboard = document.querySelector("#gameboard");
    const _gameboardCells = Array.from(_gameboard.children);

    const drawMark = (mark, positionX, positionY) => {
        const cell = _gameboardCells.filter((cell) => cell.dataset.positionx == positionX &&
                                                      cell.dataset.positiony == positionY)[0];
        cell.textContent = mark.toUpperCase();
    }

    return {
        drawMark
    };
})();

const Player = (mark) => {
    const _mark = mark.toLowerCase()
    if (!gameboard.getValidMarks().includes(_mark)) {
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
            gameboard.getValidMarks().includes(_mark) &&
            positionX >= 0 && positionX <= 2 &&
            positionY >= 0 && positionY <= 2 &&
            gameboard.getState()[positionY][positionX] === ""
        );
    };

    return {makeMove};
};
