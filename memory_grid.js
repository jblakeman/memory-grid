var memory = {
    gridHeight: 6,
    gridWidth: 5,
    numGuesses: 0,
    rCells: {},
    hideAfterMs: 3000,
    grid: [],
    assignNumGuesses: function() {
        this.numGuesses = Math.floor((this.gridHeight*this.gridWidth)/3)+1;
    },
    createNewElement: function(tagName, className) {
        var newElement = document.createElement(tagName);
        if (className) newElement.className = className;
        return newElement;
    },
    changeBackgroundColor: function(event, color) {
        event.target.style.backgroundColor = color;
        event.preventDefault();
    },
    createGrid: function() {
        var row, rowElement, cell, i, j;
        var table = document.getElementById("grid");
        this.assignNumGuesses();
		for (i = 0; i < this.gridHeight; i++) {
            rowElement = this.createNewElement("tr", "row");
            row = [];
            for (j = 0; j < this.gridWidth; j++) {
                cell = this.createNewElement("td", "cell");
                row.push(cell);
                rowElement.appendChild(cell);
            }
            this.grid.push(row);
            table.appendChild(rowElement);
        }
    },
    populateRandomGrid: function() {
        var numAssigned = 0, r1, r2;
        this.rCells = {};
        while(numAssigned < this.numGuesses) {
            r1 = Math.floor(Math.random() * this.gridHeight);
            if (!(r1 in this.rCells)) {
                this.rCells[r1] = {};
            }
            if (Object.keys(this.rCells[r1]).length < this.gridWidth) {
                r2 = Math.floor(Math.random() * this.gridWidth);
                if (!(r2 in this.rCells[r1])) {
                    this.rCells[r1][r2] = true;
                    this.grid[r1][r2].style.backgroundColor = "black";
                    numAssigned++;
                }
            }
        }
        console.log(self.rCells);
    },
    hideFilled: function() {
        self = this;
        setTimeout(function() {
            self.grid.forEach(function(row, i1) {
                row.forEach(function(cell, i2) {
                    var color = "red";
                    if (i1 in self.rCells && i2 in self.rCells[i1]) {
                        color = "green";
                    }
                    cell.addEventListener("click", function(event) {
                        self.numGuesses++;
                        self.changeBackgroundColor(event, color);
                    });
                    cell.style.backgroundColor = "white";
                });
            });
        }, self.hideAfterMs);
    }
};
memory.createGrid();
memory.populateRandomGrid();
memory.hideFilled();
