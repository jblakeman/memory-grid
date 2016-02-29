// JGZ - Would love to see some in line commenting! there are some fairly complicated functions here
// So it would be super useful for people who wanted to check out you code to see some comments explaining what you are doing

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
    // JGZ - I love this function here! Would this be to eventually allow the user to select the size of the board?
    setNumFilled: function() {
        this.grid.fillNum = Math.floor((this.grid.height*this.grid.width)/3)+1;
    },
    createNewElement: function(tagName, className, idName) {
        var newElement = document.createElement(tagName);
    // JGZ - I totally get that this is a stylistic choice, so feel free to disagree, but I'd recommend using "{ }"'s even for one line conditionals
    // The reason being that it can be tough for others to read your code and understand exactly where the conditional ends.
    // More importantly, moving forward it could lead to some confusion if you eve need to expand such conditionals. I'd just think about it as best practice!
        if (className) newElement.className = className;
        if (idName) newElement.id = idName;
        return newElement;
    },
    createGrid: function() {
      // JGZ - interesting approach to creating variables here.
      // I'm curious as to why, instead of simply declaring them when they arise? there don't seem to be any scoping issues..
        var row, rowElement, cell, i, j;
        var table = document.getElementById("grid");
        this.setNumFilled();
        // JGZ - watch indentation here!
		for (i = 0; i < this.grid.height; i++) {
      // JGZ - COOL! i had no idea you could add classes like this when creating an element!
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
      console.log(self);
      // JGZ - I consider more semantic naming than r1,and r2?
        var numAssigned = 0, r1, r2;
        self.grid.filled = {};
        while(numAssigned < self.grid.fillNum) {
            r1 = Math.floor(Math.random() * self.grid.height);
            if (!(r1 in self.grid.filled)) self.grid.filled[r1] = {};
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
            // JGZ - I'd consider passing in the below numbers as arguments to a function and pulling this statement out!
            // I personally like to avoid nested if's if at all possible, just for clarity.
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
                    if (correct) color = self.grid.colors.hit;
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
                    // JGZ - could you not just pass in self here instead of the event?
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
