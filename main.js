(function () {
	// Generate gameboard HTML elements
	const gameboard_el = document.getElementById("gameboard");
	const generateBoard = (() => {
		for (let i = 0; i < 3; i++) {
			let row = document.createElement("tr");

			for (let j = 0; j < 3; j++) {
				let data_cell = document.createElement("td");
				data_cell.id = `cell-${i * 3 + j}`;
				// data_cell.textContent = Gameboard.board[i][j]; // Assign value from board array
				row.appendChild(data_cell);
			}

			gameboard_el.appendChild(row);
		}
	})();

	// Player Object
	const Player = (nameArg, symbolArg) => {
		let name = nameArg;
		let symbol = symbolArg;

		return {
			name,
			symbol,
		};
	};

	// Gameboard Object
	const Gameboard = (() => {
		let isBoardEmpty = true;
		let board = [
			["", "", ""],
			["", "", ""],
			["", "", ""],
		];

		const resetGameboard = () => {
			// Reset board array
			board.forEach((row, rowIndex) => {
				row.forEach((_, colIndex) => {
					board[rowIndex][colIndex] = "";
				});
			});
			// Reset board table cells
			table_cells.forEach((cell) => (cell.textContent = ""));
			console.log("Gameboard Reset");
		};

		const setGameboard = (i, j, value) => {
			board[i][j] = value;
		};

		return {
			isBoardEmpty,
			board,
			resetGameboard,
			setGameboard,
		};
	})();

	// Elements
	const table_cells = document.querySelectorAll("[id^=cell-]");
	const turnIndicator = document.getElementById("turn-indicator");
	const player1Input = document.getElementById("player1");
	const player2Input = document.getElementById("player2");
	const enterButton = document.getElementById("enter");
	const resetButton = document.getElementById("reset");

	let player1 = Player("", "X");
	let player2 = Player("", "O");
	let turns;
	let current_player;
	let next_player;
	let gameOver = false;

	console.log(player1);

	const handlePlayerNameInput = (event, player) => {
		const playerName = event.target.value;
		player.name = playerName;
		if (!playerName) player.name = player.symbol;
		if (playerName) enterButton.disabled = false;
	};

	player1Input.addEventListener("input", (event) => {
		handlePlayerNameInput(event, player1);
	});
	player2Input.addEventListener("input", (event) => {
		handlePlayerNameInput(event, player2);
	});

	enterButton.addEventListener("click", () => {
		if (player1.name === "") {
			player1.name = player1.symbol;
		}
		if (player2.name === "") {
			player2.name = player2.symbol;
		}
		turnIndicator.textContent = `${current_player.name}'s turn`;
		enterButton.disabled = true;
		player1Input.disabled = true;
		player2Input.disabled = true;
	});

	const init = () => {
		turns = 0;
		current_player = player1;
		next_player = player2;
		gameOver = false;
		Gameboard.isBoardEmpty = true;
		enterButton.disabled = true;
		player1Input.disabled = false;
		player2Input.disabled = false;
		turnIndicator.textContent = `${current_player.symbol}'s turn`;
		console.log("lets go");
	};
	init();

	const displayController = (() => {
		const resetNames = () => {
			player1Input.value = "";
			player2Input.value = "";
			player1.name = "";
			player2.name = "";
		};

		const disableNamesInput = () => {
			player1Input.disabled = true;
			player2Input.disabled = true;
		};

		const displayWinner = (winner) => {
			if (winner === "tie") {
				turnIndicator.textContent = "It's a tie!";
			} else {
				turnIndicator.textContent = `${winner} wins!`;
			}
		};

		const checkWin = (board) => {
			// Check rows
			for (let i = 0; i < board.length; i++) {
				if (
					board[i][0] === board[i][1] &&
					board[i][1] === board[i][2] &&
					board[i][0] !== ""
				) {
					console.log(`${next_player.name} wins!`);
					gameOver = true;
					return next_player.name;
				}
			}

			// Check columns
			for (let i = 0; i < board.length; i++) {
				if (
					board[0][i] === board[1][i] &&
					board[1][i] === board[2][i] &&
					board[0][i] !== ""
				) {
					console.log(`${next_player.name} wins!`);
					gameOver = true;
					return next_player.name;
				}
			}

			// Check diagonals
			if (
				board[0][0] === board[1][1] &&
				board[1][1] === board[2][2] &&
				board[0][0] !== ""
			) {
				console.log(`${next_player.name} wins!`);
				gameOver = true;
				return next_player.name;
			}
			if (
				board[0][2] === board[1][1] &&
				board[1][1] === board[2][0] &&
				board[0][2] !== ""
			) {
				console.log(`${next_player.name} wins!`);
				gameOver = true;
				return next_player.name;
			}

			// Check for tie
			if (turns === 9) {
				console.log("It's a tie!");
				gameOver = true;
				return "tie";
			}

			return null;
		};

		const switchPlayer = () => {
			if (current_player === player1) {
				current_player = player2;
				next_player = player1;
			} else {
				current_player = player1;
				next_player = player2;
			}
			turnIndicator.textContent = `${
				current_player.name === "" ? current_player.symbol : current_player.name
			}'s turn`;
		};

		const updateGameboard = () => {
			for (let i = 0; i < Gameboard.board.length; i++) {
				for (let j = 0; j < Gameboard.board[i].length; j++) {
					let index = i * Gameboard.board.length + j;

					Gameboard.board[i][j] = table_cells[index].textContent;
				}
			}
		};

		const checkCell = (event) => {
			if (event.target.textContent) {
				console.log("Can't play there.");
				return false;
			}
			return true;
		};

		const markCell = (event, player) => {
			event.target.textContent = player.symbol;
			Gameboard.isBoardEmpty = false;
		};

		// Add event listeners to each cell
		const addEventListenersToCells = (() => {
			table_cells.forEach((cell) => {
				cell.addEventListener("click", (event) => {
					if (gameOver) {
						return;
					}
					disableNamesInput();
					player1.name = player1.name === "" ? player1.symbol : player1.name;
					player2.name = player2.name === "" ? player2.symbol : player2.name;
					if (checkCell(event)) {
						markCell(event, current_player);
						updateGameboard();
						switchPlayer();
						turns++;
						const result = checkWin(Gameboard.board);
						if (gameOver) displayWinner(result);
					} else {
						return;
					}
				});
			});
		})();

		// Reset button
		resetButton.addEventListener("click", () => {
			if (Gameboard.isBoardEmpty) return;
			Gameboard.resetGameboard();
			resetNames();
			init();
			console.log("Game reset");
		});
	})();
})();
