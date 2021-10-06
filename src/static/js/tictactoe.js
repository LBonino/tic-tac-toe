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

const gameState = (() => {
    // Tells if the user will play against another human or a bot
    let _humanPlayerNumber = 0;
    let _player1 = null;
    let _player2 = null;
    let _currentTurnPlayer = null;
    let _winnerPlayer = null;
    let _isGameOver = false;
    let _isATie = false;

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
        const _gameModeButtons = {
            singlePlayer: document.createElement("button"),
            multiPlayer: document.createElement("button")
        };
        const _playerNameForm = document.createElement("form");

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

            _content.classList.add("gamemode-selection")
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

        const getGameModeButtons = () => _gameModeButtons;
        const getPlayerNameForm = () => _playerNameForm;

        return {
            toggle,
            showGameModeSelection,
            showPlayerNameForm,
            getGameModeButtons,
            getPlayerNameForm,
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

const gameEvents = (() => {
    const gameModeSelection = (() => {
        const addListeners = () => {
            const gameModebuttons = Object.values(displayController.menu.getGameModeButtons());
            gameModebuttons.forEach(button => {
                button.addEventListener("click", _setGameMode);
                button.addEventListener("click", gameController.startPlayerInitialization);
            });
        }

        const _setGameMode = (e) => {
            gameState.setHumanPlayerNumber(Number(e.target.dataset.playerNumber));
        }

        return {addListeners};
    })();

    const playerInitialization = (() => {
        const addListeners = () => {
            const playerNameForm = displayController.menu.getPlayerNameForm();
            playerNameForm.addEventListener("submit", _handleSubmission);
            playerNameForm.addEventListener("submit", gameController.startGame);
        };

        const _handleSubmission = (e) => {
            // prevent standard form behavior like making a new request, creating a query string, etc. 
            e.preventDefault(); 
 
            const form = e.target;
            const namePlayer1 = form.elements["player1-name-input"].value; 
            const namePlayer2 = (form.elements["player2-name-input"]) ? form.elements["player2-name-input"].value : 
                                                                        undefined; 
            gameState.setPlayers(namePlayer1, namePlayer2);
        };

        return {addListeners};
    })();

    const gameStart = (() => {
        const addListeners = () => {
            const gameboardCells = Array.from(displayController.gameboard.getElement().children);
            gameboardCells.forEach(cell => {
                cell.addEventListener("click", _playTurn);
            });
        };

        const _playTurn = function(e) {
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

        return {addListeners};
    })();

    return {
        gameModeSelection,
        playerInitialization,
        gameStart
    };
})();

const gameController = (() => {
    // Each of these methods correspond to a different phase of the game
    const startGameModeSelection = () => {
        displayController.menu.showGameModeSelection();
        gameEvents.gameModeSelection.addListeners();
    }

    const startPlayerInitialization = () => {
        displayController.menu.showPlayerNameForm();
        gameEvents.playerInitialization.addListeners();
    };

    const startGame = () => {
        displayController.menu.toggle("off");
        gameEvents.gameStart.addListeners();
        gameState.setCurrentTurnPlayer(1);
    };

    return {
        startGameModeSelection,
        startPlayerInitialization,
        startGame
    };
})();
