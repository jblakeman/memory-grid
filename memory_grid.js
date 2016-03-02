var memory = {
    grid: {
        height: 6,
        width: 5,
        fillNum: 0,
        filled: {},
        empty: {},
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
    createNewElement: function(tagName, className, idName) {
        var newElement = document.createElement(tagName);
        if (className) { newElement.className = className; }
        if (idName) { newElement.id = idName; }
        return newElement;
    },
    createGrid: function() {
        var row, rowElement, cell, i, j;
        var table = document.getElementById("grid");
        this.setNumFilled();
        for (i = 0; i < this.grid.height; i++) {
            rowElement = this.createNewElement("tr", "row");
            row = [];
            this.grid.empty[i] = {};
            for (j = 0; j < this.grid.width; j++) {
                cell = this.createNewElement("td", "cell");
                row.push(cell);
                rowElement.appendChild(cell);
                this.grid.empty[i][j] = false;
            }
            this.grid.elements.push(row);
            table.appendChild(rowElement);
        }
    },
    populateRandomGrid: function(self) {
        var numAssigned = 0, r1, r2;
        self.grid.filled = {};
        while(numAssigned < self.grid.fillNum) {
            r1 = Math.floor(Math.random() * self.grid.height);
            if (!(r1 in self.grid.filled)) { self.grid.filled[r1] = {}; }
            // 
            if (Object.keys(self.grid.filled[r1]).length < self.grid.width) {
                r2 = Math.floor(Math.random() * self.grid.width);
                if (!(r2 in self.grid.filled[r1])) {
                    self.grid.filled[r1][r2] = false;
                    self.grid.elements[r1][r2].style.backgroundColor = 
                        self.grid.colors.filled;
                    numAssigned++;
                }
            }
        }
        self.statusBar.innerText = "Memorize";
    },
    checkForWinner: function(self) {
        var doneMsg, rateCorrect;
        if (self.grid.fillNum === self.guesses.used) {
            rateCorrect = self.guesses.correct + "/" + self.guesses.used;
            self.statusBar.innerText = rateCorrect + " correct";
            if (self.guesses.correct === self.grid.fillNum) {
                doneMsg = "Perfect Game!";
            } else {
                doneMsg = "Game Over";
            }
            var finishBar = self.createNewElement("div", "status", "completion");
            finishBar.innerText = doneMsg;
            gridBox = document.getElementById("grid-box");
            gridBox.insertBefore(finishBar, self.statusBar);
            self.finished = true;
            var newStart = self.startButton.cloneNode(true);
            self.startButton.parentNode.replaceChild(newStart, self.startButton);
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
                    var color = self.grid.colors.miss;
                    var correct = ((i1 in self.grid.filled) && 
                                   (i2 in self.grid.filled[i1]));
                    if (correct) { color = self.grid.colors.hit; }
                    cell.addEventListener("click", function(event) {
                        if (!self.finished) {
                            if (correct && !(self.grid.filled[i1][i2])) {
                                self.guesses.correct++;
                                self.grid.filled[i1][i2] = true;
                            }
                            if (!self.grid.empty[i1][i2]) {
                                self.guesses.used++;
                                self.grid.empty[i1][i2] = true;
                            }
                            self.statusBar.innerText = (self.grid.fillNum -
                                                        self.guesses.used) +
                                                       " Guesses left";
                            self.changeBackgroundColor(event, color);
                            self.checkForWinner(self);
                        }
                    });
                    cell.style.backgroundColor = self.grid.colors.hidden;
                });
            });
            self.statusBar.innerText = self.grid.fillNum + " Guesses left";
        }, self.hideAfterMs);
    },
    playGame: function() {
        this.createGrid();
        this.statusBar.innerText = "Press start to begin";
        self = this;
        self.startButton.addEventListener("click", function() {
            self.populateRandomGrid(self);
            self.setHiddenBoard(self);
        });
    }
};
memory.playGame();
