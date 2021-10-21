const gameboard = (() => {
    let _squareGrid = [["", "", ""], ["", "", ""], ["", "", ""]];

    const getState = () => _squareGrid; 
    const reset = () => {_squareGrid = [["", "", ""], ["", "", ""], ["", "", ""]]};

    const placePiece = (mark, positionX, positionY) => {
        _squareGrid[positionY][positionX] = mark;
    };

    const areAllSpacesTaken = () => {
        for (const row of _squareGrid) {
            for (const space of row) {
                if (space == "") return false;
            }
        }

        return true;
    }

    return {
        reset,
        getState,
        placePiece,
        areAllSpacesTaken,
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
        switch (playerNumber) {
            case 1:
                return _player1;
            case 2:
                return _player2;
            default:
                throw Error("Invalid argument: playerNumber must be either 1 or 2");
        }
    };

    const getPlayerByMark = (playerMark) => { 
        playerMark = playerMark.toLowerCase();
        if (!["x", "o"].includes(playerMark)) {
            return null;
        }

        let player1 = getPlayerByNumber(1);
        if (player1.getMark() === playerMark) {
            return player1;
        }
        
       return getPlayerByNumber(2);
    }

    const setPlayers = (namePlayer1, namePlayer2) => {
        if (!namePlayer1) {
            throw Error("At least one player name should be provided");
        }

        _setPlayer(1, namePlayer1, "x", true)
        namePlayer2 ? _setPlayer(2, namePlayer2, "o", true) :
                      _setPlayer(2, "LBot", "o", false);
    }

    const _setPlayer = (playerNumber, name, mark, isHuman) => {
        switch (playerNumber) {
            case 1:
                _player1 = Player(name, mark, isHuman);
                break;
            case 2:
                _player2 = Player(name, mark, isHuman);
                break;
            default:
                throw Error("Invalid argument: playerNumber must be either 1 or 2");
        }
    };

    const getCurrentTurnPlayer = () => _currentTurnPlayer;
    const setCurrentTurnPlayer = (playerNumber) => {
        _currentTurnPlayer = getPlayerByNumber(playerNumber);
    };

    const getWinnerPlayer = () => _winnerPlayer;
    const setWinnerPlayer = (playerMark) => {
        _winnerPlayer = getPlayerByMark(playerMark);
    };

    const endGame = () => {_isGameOver = true};
    const setTie = () => {_isATie = true};
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
        endGame,
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
            else {
                throw Error("Invalid argument: state must be 'off' or 'on'");
            }
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
            
            while (_content.lastElementChild) {
                _content.removeChild(_content.lastElementChild);
            }
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
            getPlayAgainButton,
        };
    })();

    return {
        gameboard,
        menu,
    };
})();

const Player = (name, mark, isHuman) => {
    const _validMarks = ["x", "o"];
    if (!_validMarks.includes(mark.toLowerCase())) {
        throw Error("Invalid mark: mark must be 'x' or 'y'");
    }

    if (name.length < 2) {
        throw Error("Invalid name: it must be at least 2 characters long");
    }

    if (typeof isHuman !== "boolean") {
        throw Error("Invalid argument: 'isHuman' must be a boolean")
    }

    const _name = name;
    const _mark = mark.toLowerCase()

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

    const getName = () => _name;
    const getMark = () => _mark;

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
        _updateGameState();

        if (gameState.getHumanPlayerNumber() === 1) {
            _playTurn.call(this);
            _updateGameState();
        }
    }

    const _playTurn = function() {
        const player1 = gameState.getPlayerByNumber(1);
        const player2 = gameState.getPlayerByNumber(2);

        if (gameState.getCurrentTurnPlayer() === player1) {
            player1.makeMove(this.dataset.positionx, this.dataset.positiony);
            gameState.setCurrentTurnPlayer(2);
        }
        else {
            player2.makeMove(this.dataset.positionx, this.dataset.positiony);
            gameState.setCurrentTurnPlayer(1);
        }
    };

    /*
    After a turn is played, the game may end, either in a tie or with a player winning.
    This function updates the variables that determine the game outcome.
    It's meant to be called after every turn.
    */
    const _updateGameState = () => {
        const gameboardState = gameboard.getState();
        updateGameStateHelpers.updateWinner(gameboardState);
        updateGameStateHelpers.updateTie();
        if (gameState.getWinnerPlayer() || gameState.isATie()) {
            return gameState.endGame();
        }
    };

    return {
        setGameMode,
        handlePlayerNameFormSubmission,
        handleTurn,
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

        // loook for winning combinations in both diagonals
        if (_isWinnerDiagonals(gameboardState)) {
            winnerMark = gameboardState[1][1];
            return gameState.setWinnerPlayer(winnerMark);
        }
    };

    const _isWinnerRow = (rowIndex, gameboardState) => {
        if (gameboardState[rowIndex][0] === gameboardState[rowIndex][1] &&
            gameboardState[rowIndex][1] === gameboardState[rowIndex][2]) {
            return true;
        }

        return false;
    };

    const _isWinnerColumn = (columnIndex, gameboardState) => {
        if (gameboardState[0][columnIndex] === gameboardState[1][columnIndex] &&
            gameboardState[1][columnIndex] === gameboardState[2][columnIndex]) {
            return true;
        }

        return false;
    }

    const _isWinnerDiagonals = (gameboardState) => {
        // ((main diagonal) OR (secondary diagonal))
        if ((gameboardState[0][0] === gameboardState[1][1] && gameboardState[1][1] === gameboardState[2][2]) ||
            (gameboardState[2][0] === gameboardState[1][1] && gameboardState[1][1] === gameboardState[0][2])) {
            return true;
        }

        return false;
    }

    /* The winner state must be updated before calling this function or else it won't
    work properly, since it needs to check first whether there is already a winner */
    const updateTie = () => {
        if (gameboard.areAllSpacesTaken() && !gameState.getWinnerPlayer()) {
            gameState.setTie();
        }
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
        if (gameState.isGameOver()) {
            return startGameResultAnnouncement()
        }
    };

    return {
        initializeGame,
        startGameModeSelection,
        startPlayerInitialization,
        startRound,
        startGameResultAnnouncement,
    };
})();
