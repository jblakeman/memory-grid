var memory = {
    grid: {
        height: 6,
        width: 5,
        fillNum: 0,
        filled: {},
        elements: [],
        colors: {
            miss: "#FF4A48",
            hit: "#84FF77",
            filled: "#CEE7FF",
            hidden: "#8B93C0",
        }
    },
    startButton: document.getElementById("start-new"),
    statusBar: document.getElementById("remaining"),
    guesses: {
        used: 0,
        correct: 0
    },
    hideAfterMs: 3350,
    setNumFilled: function() {
        this.grid.fillNum = Math.floor((this.grid.height*this.grid.width)/3)+1;
    },
    createNewElement: function(tagName, className) {
        var newElement = document.createElement(tagName);
        if (className) newElement.className = className;
        return newElement;
    },
    createGrid: function() {
        var row, rowElement, cell, i, j;
        var table = document.getElementById("grid");
        this.setNumFilled();
		for (i = 0; i < this.grid.height; i++) {
            rowElement = this.createNewElement("tr", "row");
            row = [];
            for (j = 0; j < this.grid.width; j++) {
                cell = this.createNewElement("td", "cell");
                row.push(cell);
                rowElement.appendChild(cell);
            }
            this.grid.elements.push(row);
            table.appendChild(rowElement);
        }
    },
    populateRandomGrid: function() {
        var numAssigned = 0, r1, r2;
        this.grid.filled = {};
        while(numAssigned < this.grid.fillNum) {
            r1 = Math.floor(Math.random() * this.grid.height);
            if (!(r1 in this.grid.filled)) {
                this.grid.filled[r1] = {};
            }
            if (Object.keys(this.grid.filled[r1]).length < this.grid.width) {
                r2 = Math.floor(Math.random() * this.grid.width);
                if (!(r2 in this.grid.filled[r1])) {
                    this.grid.filled[r1][r2] = true;
                    this.grid.elements[r1][r2].style.backgroundColor = this.grid.colors.filled;
                    numAssigned++;
                }
            }
        }
    },
    checkForWinner: function(self) {
        if (self.grid.fillNum === self.guesses.used) {
            if (self.guesses.correct === self.grid.fillNum) {
                self.statusBar.innerText = "Perfect Game!  " +
                                           self.guesses.correct + "/" +
                                           self.guesses.max;
            } else {
                self.statusBar.innerText = "Game Over.  " +
                                           self.guesses.correct + "/" +
                                           self.guesses.used + " correct";
            }
            self.endGame();
        }
    },
    changeBackgroundColor: function(event, color) {
        event.target.style.backgroundColor = color;
        event.preventDefault();
    },
    setHiddenBoard: function() {
        self = this;
        setTimeout(function() {
            self.grid.elements.forEach(function(row, i1) {
                row.forEach(function(cell, i2) {
                    var correct = false, color = self.grid.colors.miss;
                    if (i1 in self.grid.filled && i2 in self.grid.filled[i1]) {
                        color = self.grid.colors.hit;
                        correct = true;
                    }
                    cell.addEventListener("click", function(event) {
                        if (correct) {
                            self.guesses.correct++;
                        }
                        self.guesses.used++;
                        self.statusBar.innerText = (self.grid.fillNum -
                                                    self.guesses.used) +
                                                   " Guesses left";
                        self.changeBackgroundColor(event, color);
                        self.checkForWinner(self);
                    });
                    cell.style.backgroundColor = self.grid.colors.hidden;
                });
            });
            self.statusBar.innerText = self.grid.fillNum + " Guesses left";
        }, self.hideAfterMs);
    },
    newGame: function() {
    },
    endGame: function() {
        // Cloning and replacing removes all grid event listeners
        // User can no longer interact with board after game is finished
        var oldGrid = document.getElementById("grid");
        var newGrid = oldGrid.cloneNode(true);
        oldGrid.parentNode.replaceChild(newGrid, oldGrid);
    },
    playGame: function() {
        this.createGrid();
        this.populateRandomGrid();
        this.setHiddenBoard();
    }
};
memory.playGame();
