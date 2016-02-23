var memory = {
    gridHeight: 6,
    gridWidth: 5,
    gridArray: [],
    numGuesses: 0,
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
    createGrid: function() {
        var rowElement, row, i, j;
        this.assignNumGuesses();
        for (i = 0; i < this.gridHeight; i++) {
            row = [];
            rowElement = this.createNewElement("tr", "row");
            for (j = 0; j < this.gridWidth; j++) {
                rowElement.appendChild(this.createNewElement("td", "cell"));
                row.push(false);
            }
            this.grid.appendChild(rowElement);
            this.gridArray.push(row);
        }
    },
    populateRandomGrid: function() {
        var numAssigned = 0, randomCells = {}, r1, r2;
        while(numAssigned < this.numGuesses) {
            r1 = Math.floor(Math.random() * this.gridHeight);
            if (!(r1 in randomCells)) {
                randomCells[r1] = {};
            }
            if (Object.keys(randomCells[r1]).length < this.gridWidth) {
                r2 = Math.floor(Math.random() * this.gridWidth);
                if (!(r2 in randomCells[r1])) {
                    randomCells[r1][r2] = true;
                    this.gridArray[r1][r2] = randomCells[r1][r2];
                    numAssigned++;
                }
            }
        }
    }
};
memory.createGrid();
memory.populateRandomGrid();
