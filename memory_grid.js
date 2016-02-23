var memory = {
    gridHeight: 6,
    gridWidth: 5,
    numGuesses: 0,
    rCells: {},
    hideAfterMs: 3000,
    grid: document.getElementById("grid"),
    gridRows: document.getElementsByClassName("row"),
    assignNumGuesses: function() {
        this.numGuesses = Math.floor((this.gridHeight*this.gridWidth)/3)+1;
    },
    createNewElement: function(tagName, className) {
        var newElement = document.createElement(tagName);
        if (className) newElement.className = className;
        return newElement;
    },
    changeBackgroundColor: function(event, color, prevent) {
        event.target.style.backgroundColor = color;
        if (prevent) event.prevenDefault();
    },
    createGrid: function() {
        var rowElement, row, cell, i, j;
        this.assignNumGuesses();
        for (i = 0; i < this.gridHeight; i++) {
            rowElement = this.createNewElement("tr", "row");
            for (j = 0; j < this.gridWidth; j++) {
                cell = this.createNewElement("td", "cell");
                rowElement.appendChild(cell);
            }
            this.grid.appendChild(rowElement);
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
                    var cellElem = this.gridRows[r1].childNodes;
                    cellElem[r2].style.backgroundColor = "black";
                    numAssigned++;
                }
            }
        }
    },
    hideFilled: function() {
        self = this;
        setTimeout(function() {
            Object.getOwnPropertyNames(self.gridRows).forEach(function(key1) {
                var cells = self.gridRows[key1].childNodes;
                Object.getOwnPropertyNames(cells).forEach(
                    function(key2) {
                        var prevent = false, color = "red";
                        if (key2 in self.rCells[key1]) {
                            color = "green";
                            prevent = true;
                        }
                        cells[key2].addEventListener("click", function(event) {
                            self.numGuesses++;
                            self.changeBackgroundColor(event, color, prevent);
                        });
                        cells[key2].style.backgroundColor = "white";
                    });

            });
        }, self.hideAfterMs);
    }
};
memory.createGrid();
memory.populateRandomGrid();
memory.hideFilled();
