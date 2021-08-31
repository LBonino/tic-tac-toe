const gameboard = (function () {
    let _squareGrid = [["", "", ""], ["", "", ""], ["", "", ""]];

    const getState = () => _squareGrid; 
    const reset = () => {_squareGrid = [["", "", ""], ["", "", ""], ["", "", ""]]};

    const placePiece = (mark, positionX, positionY) => {
        if (!_isValidMove(mark, positionX, positionY)) {
            return console.error("Invalid move");
        }

        _squareGrid[positionY][positionX] = mark;
    };

    const _isValidMove = (mark, positionX, positionY) => {
        const validMarks = ["x", "o"];

        return (
            validMarks.includes(mark.toLowerCase()) &&
            positionX >= 0 && positionX <= 2 &&
            positionY >= 0 && positionY <= 2 &&
            _squareGrid[positionY][positionX] === ""
        );
    };
    
    return {
        reset,
        getState,
        placePiece
    };
})();
