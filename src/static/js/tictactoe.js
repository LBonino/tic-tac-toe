const gameboard = (() => {
    let _squareGrid = [["", "", ""], ["", "", ""], ["", "", ""]];

    const getState = () => _squareGrid; 
    const reset = () => {_squareGrid = [["", "", ""], ["", "", ""], ["", "", ""]]};

    const placePiece = (mark, positionX, positionY) => {
        _squareGrid[positionY][positionX] = mark;
    };

    const removePiece = (positionX, positionY) => {
        _squareGrid[positionY][positionX] = "";
    };

    const getFreeMoves = () => {
        let freeMoves = [];

        for (let i = 0; i < _squareGrid.length; i++) {
            for (let j = 0; j < _squareGrid.length; j++) {
                if (_squareGrid[i][j] == "") freeMoves.push({x: j, y: i});
            }
        }

        return freeMoves;
    };

    const isMark = (value) => {
        const validMarks = ["x", "o"];
        return (validMarks.includes(value));
    };

    return {
        reset,
        getState,
        placePiece,
        removePiece,
        getFreeMoves,
        isMark,
    };
})();

const gameState = (() => {
    // Tells if the user will play against another human or a bot
    let _humanPlayerNumber;
    let _player1;
    let _player2;
    let _currentTurnPlayer;
    let _winnerPlayer;
    let _isGameOver;
    let _isATie;

    /*
    Must be called before using any public method in this module.
    This method will also be used when restarting the game to revert all values
    to their initial state.
    */
    const initialize = () => {
        _humanPlayerNumber = 0;
        _player1 = null;
        _player2 = null;
        _currentTurnPlayer = null;
        _winnerPlayer = null;
        _isGameOver = false;
        _isATie = false;
    }

    const getHumanPlayerNumber = () => _humanPlayerNumber;
    const setHumanPlayerNumber = (humanPlayerNumber) => {
        if (humanPlayerNumber !== 1 && humanPlayerNumber !== 2) {
            throw Error("Invalid argument: number of human players must be either 1 or 2");
        }

        _humanPlayerNumber = humanPlayerNumber;
    };

    const getPlayerByNumber = (playerNumber) => {
        if (playerNumber === 1) return _player1;
        else if (playerNumber === 2) return _player2;
        else throw Error("Invalid argument: playerNumber must be either 1 or 2");
    };

    const getPlayerByMark = (playerMark) => { 
        playerMark = playerMark.toLowerCase();
        if (!gameboard.isMark(playerMark)) return null;

        let player1 = getPlayerByNumber(1); // Refactor this
        if (player1.getMark() === playerMark) return player1;
        else return getPlayerByNumber(2);
    }

    const setPlayers = (namePlayer1, namePlayer2) => {
        if (!namePlayer1) throw Error("At least one player name should be provided");

        _setPlayer(1, namePlayer1, "x", true)
        namePlayer2 ? _setPlayer(2, namePlayer2, "o", true) :
                      _setPlayer(2, "LBot", "o", false);
    }

    const _setPlayer = (playerNumber, name, mark, isHuman) => {
        if (playerNumber === 1) _player1 = Player(name, mark, isHuman);
        else if (playerNumber === 2) _player2 = Player(name, mark, isHuman);
        else throw Error("Invalid argument: playerNumber must be either 1 or 2");
    };

    const getCurrentTurnPlayer = () => _currentTurnPlayer;
    const setCurrentTurnPlayer = (playerNumber) => {
        _currentTurnPlayer = getPlayerByNumber(playerNumber);
    };

    const getWinnerPlayer = () => _winnerPlayer;
    const setWinnerPlayer = (playerMark) => {
        _winnerPlayer = (playerMark) ? getPlayerByMark(playerMark) : null;
    };

    const setGameOver = (gameIsOver) => {_isGameOver = gameIsOver};
    const setTie = (isATie) => {_isATie = isATie};
    const isGameOver = () => _isGameOver;
    const isATie = () => _isATie;

    return {
        initialize,
        getHumanPlayerNumber,
        setHumanPlayerNumber,
        getPlayerByNumber,
        getPlayerByMark,
        setPlayers,
        getCurrentTurnPlayer,
        setCurrentTurnPlayer,
        getWinnerPlayer,
        setWinnerPlayer,
        setGameOver,
        setTie,
        isGameOver,
        isATie,
    }
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

        // Interactive elements 
        let _gameModeButtons = {};
        let _playerNameForm;
        let _playAgainButton;

        const initializeInteractiveElements = () => {
            _gameModeButtons.singlePlayer = document.createElement("button");
            _gameModeButtons.multiPlayer = document.createElement("button");
            _playerNameForm = document.createElement("form");
            _playAgainButton = document.createElement("button");
        };

        const toggle = (state) => {
            if (state === "off") {
                _menu.classList.add("hidden");
                gameboard.getElement().classList.remove("blur");
            }
            else if (state === "on") {
                _menu.classList.remove("hidden");
                gameboard.getElement().classList.add("blur");
            }
            else throw Error("Invalid argument: state must be 'off' or 'on'");
        }

        const showGameModeSelection = () => {
            _clearMenu();
            _title.textContent = "Select game mode";

            const singlePlayerButton = _gameModeButtons.singlePlayer;
            singlePlayerButton.textContent = "1 player";
            singlePlayerButton.dataset.playerNumber = 1;

            const multiPlayerButton = _gameModeButtons.multiPlayer;
            multiPlayerButton.textContent = "2 players";
            multiPlayerButton.dataset.playerNumber = 2;

            _content.className = "gamemode-selection";
            _content.appendChild(singlePlayerButton);
            _content.appendChild(multiPlayerButton);
        }

        const showPlayerNameForm = () => {
            _clearMenu();
            _title.textContent = "Enter player name";

            const itemPlayer1 = _createItemForPlayerName(1);

            const startGame = document.createElement("button");
            startGame.id = "form-submit";
            startGame.classList.add("form-submit");
            startGame.type = "submit";
            startGame.textContent = "START GAME";

            const itemStartGame = document.createElement("li");
            itemStartGame.appendChild(startGame);

            const unorderedList = document.createElement("ul");
            unorderedList.appendChild(itemPlayer1);

            // Add list item for player 2 if the user selects multiplayer mode
            if (gameState.getHumanPlayerNumber() === 2) {
                _title.textContent += "s"; // pluralize the title
                const itemPlayer2 = _createItemForPlayerName(2);
                unorderedList.appendChild(itemPlayer2);
            }

            unorderedList.appendChild(itemStartGame);

            const form = _playerNameForm;
            form.appendChild(unorderedList);

            _content.className = "player-name-form";
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
            input.minLength = 2;

            const item = document.createElement("li");
            item.appendChild(label);
            item.appendChild(input);

            return item;
        }

        const _clearMenu = () => {
            _title.textContent = "";
            
            while (_content.lastElementChild) _content.removeChild(_content.lastElementChild);
        };

        const showGameResult = () => {
            _clearMenu();
            _title.textContent = "Game Over";

            const gameResult = document.createElement("h3");
            gameResult.textContent = (gameState.isATie()) ? "It's a tie!" :
                                     `${gameState.getWinnerPlayer().getName()} wins!`;

            const playAgain = _playAgainButton;
            playAgain.textContent = "Play again";

            _content.className = "game-result";
            _content.appendChild(gameResult);
            _content.appendChild(playAgain);
        }

        const getGameModeButtons = () => _gameModeButtons;
        const getPlayerNameForm = () => _playerNameForm;
        const getPlayAgainButton = () => _playAgainButton;

        return {
            initializeInteractiveElements,
            toggle,
            showGameModeSelection,
            showPlayerNameForm,
            showGameResult,
            getGameModeButtons,
            getPlayerNameForm,
            getPlayAgainButton,        };
    })();

    return {
        gameboard,
        menu,
    };
})();

const Player = (name, mark, isHuman) => {
    mark = mark.toLowerCase();

    if (!gameboard.isMark(mark.toLowerCase())) throw Error("Invalid mark: mark must be 'x' or 'y'");
    if (name.length < 2) throw Error("Invalid name: it must be at least 2 characters long");
    if (typeof isHuman !== "boolean") throw Error("Invalid argument: 'isHuman' must be a boolean");

    const makeMove = (positionX, positionY) => {
        if (!_isValidMove(positionX, positionY)) throw Error("Invalid move");
        gameboard.placePiece(mark, positionX, positionY);
    }

    const _isValidMove = (positionX, positionY) => {
        return (
            positionX >= 0 && positionX <= 2 &&
            positionY >= 0 && positionY <= 2 &&
            gameboard.getState()[positionY][positionX] === ""
        );
    };

    const getName = () => name;
    const getMark = () => mark;

    return {
        makeMove,
        getName,
        getMark,
    };
};

/* Methods for performing different actions related to the game state like:
    - Setting the game mode
    - Playing a turn
    - Updating variables that tell if there is a winner, tie and game over accordingly
*/
const gameActions = (() => {
    const setGameMode = (e) => {
        gameState.setHumanPlayerNumber(Number(e.target.dataset.playerNumber));
    }

    const switchTurns = () => {
        const currentTurnPlayer = gameState.getCurrentTurnPlayer();
        if (currentTurnPlayer.getMark() === 'x') gameState.setCurrentTurnPlayer(2);
        else gameState.setCurrentTurnPlayer(1);
    };

    const handlePlayerNameFormSubmission = (e) => {
        // prevent standard form behavior like making a new request, creating a query string, etc.
        e.preventDefault();

        const form = e.target;
        const namePlayer1 = form.elements["player1-name-input"].value;
        const namePlayer2 = (form.elements["player2-name-input"]) ? form.elements["player2-name-input"].value :
                                                                    undefined;
        gameState.setPlayers(namePlayer1, namePlayer2);
    };

    /* 
    To be called when a square in the gameboard is clicked.
    Since the bot can't click a square, the methods inside get called twice if needed:
    First to play the human's turn, then the bot's turn.
    */
    const handleTurn = function() {
        _playTurn.call(this);
        updateGameState();

        if (gameState.getHumanPlayerNumber() === 1 && !gameState.isGameOver()) { 
            _playTurn.call(this);
            updateGameState();
        }
    }

    const _playTurn = function() {
        const player1 = gameState.getPlayerByNumber(1);
        const player2 = gameState.getPlayerByNumber(2);
        const currentTurnPlayer = gameState.getCurrentTurnPlayer();
        const moveXCoord = this.dataset.positionx;
        const moveYCoord = this.dataset.positiony;

        if (currentTurnPlayer === player1) {
            player1.makeMove(moveXCoord, moveYCoord);
            displayController.gameboard.drawMark(player1.getMark(), moveXCoord, moveYCoord);
        }
        else {
            const moveCoords = (gameState.getHumanPlayerNumber() === 1) ? 
            bot.generateMoveCoords(currentTurnPlayer) :
            {x: moveXCoord, y: moveYCoord};

            player2.makeMove(moveCoords.x, moveCoords.y);
            displayController.gameboard.drawMark(player2.getMark(), moveCoords.x, moveCoords.y);
        }

        switchTurns();
    };

    /*
    Updates the gameState variables that determine the game outcome according
    to the gameboard state at the moment.
    It's meant to be called every time a piece is either placed or removed.
    */
    const updateGameState = () => {
        const gameboardState = gameboard.getState();
        updateGameStateHelpers.updateWinner(gameboardState);
        updateGameStateHelpers.updateTie();

        if (gameState.getWinnerPlayer() || gameState.isATie()) return gameState.setGameOver(true);
        else gameState.setGameOver(false);
    };

    return {
        setGameMode,
        switchTurns,
        handlePlayerNameFormSubmission,
        handleTurn,
        updateGameState,
    }
})();

const updateGameStateHelpers = (() => {
    const updateWinner = (gameboardState) => {
        let winnerMark;

        // look for winning combinations in all rows and columns
        for (let i = 0; i < 3; i++) {
            if (_isWinnerRow(i, gameboardState)) {
                winnerMark = gameboardState[i][0];
                return gameState.setWinnerPlayer(winnerMark);
            }

            if (_isWinnerColumn(i, gameboardState)) {
                winnerMark = gameboardState[0][i];
                return gameState.setWinnerPlayer(winnerMark);
            }
        }

        // look for winning combinations in both diagonals
        if (_isWinnerDiagonal(gameboardState)) {
            winnerMark = gameboardState[1][1];
            return gameState.setWinnerPlayer(winnerMark);
        }

        gameState.setWinnerPlayer(null);
    };

    const _isWinnerRow = (rowIndex, gameboardState) => {
        const firstRowValueIsMark = gameboard.isMark(gameboardState[rowIndex][0]);
        const rowValuesAreEqual = gameboardState[rowIndex][0] === gameboardState[rowIndex][1] &&
                                    gameboardState[rowIndex][1] === gameboardState[rowIndex][2];

        return (firstRowValueIsMark && rowValuesAreEqual);
    };

    const _isWinnerColumn = (columnIndex, gameboardState) => {
        const firstColumnValueIsMark = gameboard.isMark(gameboardState[0][columnIndex]);
        const columnValuesAreEqual = gameboardState[0][columnIndex] === gameboardState[1][columnIndex] &&
                                     gameboardState[1][columnIndex] === gameboardState[2][columnIndex];

        return (firstColumnValueIsMark && columnValuesAreEqual);
    };

    const _isWinnerDiagonal = (gameboardState) => {
        const firstMainDiagonalValue = gameboardState[0][0];
        const mainDiagonalValuesAreEqual = gameboardState[0][0] === gameboardState[1][1] &&
                                           gameboardState[1][1] === gameboardState[2][2];

        const firstSecondaryDiagonalValue = gameboardState[2][0];
        const SecondaryDiagonalValuesAreEqual = gameboardState[2][0] === gameboardState[1][1] &&
                                                gameboardState[1][1] === gameboardState[0][2];

        return (gameboard.isMark(firstMainDiagonalValue) && mainDiagonalValuesAreEqual ||
                gameboard.isMark(firstSecondaryDiagonalValue) && SecondaryDiagonalValuesAreEqual);
    };

    /* The winner state must be updated before calling this function or else it won't
    work properly, since it needs to check first whether there is already a winner */
    const updateTie = () => {
        const allSpacesTaken = (gameboard.getFreeMoves().length === 0) ? true : false; 
        if (allSpacesTaken && !gameState.getWinnerPlayer()) return gameState.setTie(true);
        else gameState.setTie(false);
    }

    return {
        updateWinner,
        updateTie
    }
})();

const gameController = (() => {
    // Make sure everything is in its default state before starting
    // This method is also used to restart the game
    const initializeGame = () => {
        gameState.initialize();
        gameboard.reset();
        displayController.gameboard.clear();
        displayController.menu.initializeInteractiveElements();
        startGameModeSelection();
    }

    // Each of these methods correspond to a different phase of the game
    const startGameModeSelection = () => {
        displayController.menu.showGameModeSelection();

        const gameModebuttons = Object.values(displayController.menu.getGameModeButtons());
        gameModebuttons.forEach(button => {
            button.addEventListener("click", gameActions.setGameMode);
            button.addEventListener("click", startPlayerInitialization);
        });
    }

    const startPlayerInitialization = () => {
        displayController.menu.showPlayerNameForm();

        const playerNameForm = displayController.menu.getPlayerNameForm();
        playerNameForm.addEventListener("submit", gameActions.handlePlayerNameFormSubmission);
        playerNameForm.addEventListener("submit", startRound);
    };

    const startRound = () => {
        displayController.menu.toggle("off");

        const gameboardCells = Array.from(displayController.gameboard.getElement().children);
        gameboardCells.forEach(cell => {
            cell.addEventListener("click", gameActions.handleTurn);
            cell.addEventListener("click", _announceResultOnGameOver)
        });

        gameState.setCurrentTurnPlayer(1);
    };

    const startGameResultAnnouncement = () => {
        displayController.menu.toggle("on");
        displayController.menu.showGameResult();

        const playAgainButton = displayController.menu.getPlayAgainButton();
        playAgainButton.addEventListener("click", initializeGame);
    };

    const _announceResultOnGameOver = () => {
        if (gameState.isGameOver()) return startGameResultAnnouncement();
    };

    return {
        initializeGame,
        startGameModeSelection,
        startPlayerInitialization,
        startRound,
        startGameResultAnnouncement,
    };
})();

gameController.initializeGame();

const bot = (() => {
    // Use the minimax algorithm to assign a score for each possible move
    const generateMoveCoords = (maximizingPlayer) => {
        const freeMoves = gameboard.getFreeMoves();
        for (const move of freeMoves) move.score = _evaluateMove(move, maximizingPlayer, 0);
        const highestScoreMove = _getMoveByScore(freeMoves);
        
        return {
            x: highestScoreMove.x,
            y: highestScoreMove.y
        };
    };
    
    // Determine how 'smart' a movement is giving it a score based on the minimax algorithm
    const _evaluateMove = (move, maximizingPlayer, depth) => {
        _simulateMove(move);
        let moveScore = 0;
    
        // Base case: the simulated game is over, return score based on game result
        if (gameState.isGameOver()) {
            if (gameState.isATie()) moveScore = 0;
            else if (gameState.getWinnerPlayer() === maximizingPlayer) moveScore = 10 - depth;
            else moveScore = depth - 10;
    
            _undoSimulatedMove(move);
            return moveScore;
        }
    
        // Recursive case: game is not over yet, evaluate every possible next move
        const freeMoves = gameboard.getFreeMoves();
        for (const nextMove of freeMoves) nextMove.score = _evaluateMove(nextMove, maximizingPlayer, depth + 1);
        
        const currentTurnPlayer = gameState.getCurrentTurnPlayer();
        if (currentTurnPlayer === maximizingPlayer) moveScore = _getMoveByScore(freeMoves).score;
        else moveScore = _getMoveByScore(freeMoves, true).score;
    
        _undoSimulatedMove(move);
        return moveScore;
    };

    const _simulateMove = (move) => {
        const currentTurnPlayer = gameState.getCurrentTurnPlayer();
        currentTurnPlayer.makeMove(move.x, move.y);
        gameActions.updateGameState();
        gameActions.switchTurns();
    };

    const _undoSimulatedMove = (move) => {
        const currentTurnPlayer = gameState.getCurrentTurnPlayer();
        gameboard.removePiece(move.x, move.y);
        gameActions.updateGameState();
        gameActions.switchTurns();
    }
    
    const _getMoveByScore = (moves, getLowestScoreMove) => {
        return moves.reduce((move1, move2) => {
            if (getLowestScoreMove) return (move1.score < move2.score) ? move1 : move2;
            else return (move1.score > move2.score) ? move1 : move2;
        });
    };

    return {
        generateMoveCoords,
    };

})();
