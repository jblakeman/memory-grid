(function() {
    function createNewElement(tagName, className, idName) {
        var newElement = document.createElement(tagName);
        if (className) { newElement.className = className; }
        if (idName) { newElement.id = idName; }
        return newElement;
    }
    function changeBackgroundColor(event, color) {
        event.preventDefault();
        event.target.style.backgroundColor = color;
    }
    function Grid() {
        this.height = 6;
        this.width = 5;
        this.fillNum = 0;
        this.filled = {};
        this.empty = {};
        this.elements = [];
        this.colors = {
            miss: "#FF4A48",
            hit: "#84FF77",
            filled: "#CEE7FF",
            hidden: "#8B93C0"
        };
        this.guesses = {
            used: 0,
            correct: 0
        };
        this.finished = false;
        this.gridBox = document.getElementById("grid-box");
        this.table = null;
        this.startButton = null;
        this.statusBar = null;
        this.finishBar = null;
        this.started = false;
    }
    Grid.prototype.setFillNum = function() {
        this.fillNum = Math.floor((this.height*this.width)/3)+1;
    };
    Grid.prototype.createElements = function() {
        this.startButton = this.gridBox.appendChild(
            createNewElement("button", "status", "start-new")
        );
        this.startButton.innerText = "Start";
        this.table = this.gridBox.appendChild(
            createNewElement("table", false, "grid")
        );
    };
    Grid.prototype.createGrid = function() {
        this.createElements();
        this.setFillNum();
        var row, rowElement, cell, i, j;
        for (i = 0; i < this.height; i++) {
            rowElement = createNewElement("tr", "row");
            row = [];
            this.empty[i] = {};
            for (j = 0; j < this.width; j++) {
                cell = createNewElement("td", "cell");
                row.push(cell);
                rowElement.appendChild(cell);
                this.empty[i][j] = false;
            }
            this.elements.push(row);
            this.table.appendChild(rowElement);
        }
    };
    Grid.prototype.populateRandom = function() {
        var numAssigned = 0, random1, random2;
        this.filled = {};
        while(numAssigned < this.fillNum) {
            // Add random row number as key with its own object of random cell keys
            random1 = Math.floor(Math.random() * this.height);
            if (!(random1 in this.filled)) {
                this.filled[random1] = {};
            }
            // Populate random cell keys for each random row
            if (Object.keys(this.filled[random1]).length < this.width) {
                random2 = Math.floor(Math.random() * this.width);
                if (!(random2 in this.filled[random1])) {
                    // Initialize filled cell to false so later in listener
                    // we can ignore cells that have already been clicked
                    this.filled[random1][random2] = false;
                    // Change background color as we populate
                    this.elements[random1][random2].style.backgroundColor =
                        this.colors.filled;
                    numAssigned++;
                }
            }
        }
        this.statusBar = this.gridBox.appendChild(
            createNewElement("div", "status", "remaining")
        );
        this.statusBar.innerText = "Memorize";
    };
    Grid.prototype.clearBoard = function() {
        while (this.gridBox.firstChild) {
            this.gridBox.removeChild(this.gridBox.firstChild);
        }
    };

    Grid.prototype.checkForWinner = function() {
        var doneMsg, rateCorrect;
        if (this.fillNum === this.guesses.used) {
            rateCorrect = this.guesses.correct + "/" + this.guesses.used;
            this.statusBar.innerText = rateCorrect + " correct";
            if (this.guesses.correct === this.fillNum) {
                doneMsg = "Perfect Game!";
            } else {
                doneMsg = "Game Over";
            }
            // Add game completion status element when finished
            this.finishBar = createNewElement("div", "status", "completion");
            this.finishBar.innerText = doneMsg;
            this.gridBox.insertBefore(this.finishBar, this.statusBar);
            this.finished = true;
            this.startButton.innerText = "New Game";
            this.startButton.addEventListener("click", function() {
                this.clearBoard();
                var newGrid = new Grid();
                playGame(newGrid);
            }.bind(this));
            // Cloning the node removes the event listener - this is a hack that
            // needs to be replaced with a cleaner solution when the reset game
            // button functionality is added
            //var newStart = self.startButton.cloneNode(true);
            //self.startButton.parentNode.replaceChild(newStart, self.startButton);
        }
    };
    Grid.prototype.cellClickHandler = function(event, correct, color, i1, i2) {
        if (!this.finished) {
            if (correct && !(this.filled[i1][i2])) {
                this.guesses.correct++;
                this.filled[i1][i2] = true;
            }
            if (!this.empty[i1][i2]) {
                this.guesses.used++;
                this.empty[i1][i2] = true;
            }
            this.statusBar.innerText = (this.fillNum -
                                        this.guesses.used) +
                                        " Guesses left";
            changeBackgroundColor(event, color);
            this.checkForWinner();
        }
    };
    Grid.prototype.setHiddenBoard = function() {
        var hideAfterMs = 3350;
        setTimeout(function() {
            this.elements.forEach(function(row, i1) {
                row.forEach(function(cell, i2) {
                    // Check correctness of each cell to tally accordingly
                    // to determine when game ends and prevent duplicate
                    // click tallies
                    var color = this.colors.miss;
                    var correct = ((i1 in this.filled) && 
                                   (i2 in this.filled[i1]));
                    if (correct) { color = this.colors.hit; }
                    cell.addEventListener("click", function(event) {
                        this.cellClickHandler(event, correct, color, i1, i2);
                    }.bind(this));
                    cell.style.backgroundColor = this.colors.hidden;
                }.bind(this));
            }.bind(this));
            this.statusBar.innerText = this.fillNum + " Guesses left";
        }.bind(this), hideAfterMs);
    };
    function playGame(grid) {
        grid.createGrid();
        grid.startButton.addEventListener("click", function() {
            if (!grid.started) {
                grid.started = true;
                grid.populateRandom();
                grid.setHiddenBoard();
            }
        });
    }
    var g = new Grid();
    playGame(g);
})();
