var memory = {
    gridHeight: 6,
    gridLength: 4,
    gridArray: [],
    numGuesses: 0,
    grid: document.getElementById("grid"),
    gridRows: document.getElementsByClassName("grid-row"),
    assignNumGuesses: function() {
        this.numGuesses = Math.floor((this.gridHeight*this.gridLength)/3)+1;
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
            rowElement = this.createNewElement("tr", "grid-row");
            for (j = 0; j < this.gridLength; j++) {
                rowElement.appendChild(
                    this.createNewElement("td", "grid-cell")
                );
                row.push(false);
            }
            this.grid.appendChild(rowElement);
            this.gridArray.push(row);
        }
    },
    assignDefaults: function(obj, key, value) {
        if (!(key in obj)) {
            obj[key] = value;
        }
        return obj;
    },
    populateRandomGrid: function() {
        var numAssigned = 0, randomCells = {}, r1, r2;
        while(numAssigned < this.numGuesses) {
            r1 = Math.floor(Math.random() * this.gridHeight);
            if (!(r1 in randomCells)) {
                randomCells[r1] = {};
            }
            if (Object.keys(randomCells[r1]).length < this.gridLength) {
                r2 = Math.floor(Math.random() * this.gridLength);
                if (!(r2 in randomCells[r1])) {
                    randomCells[r1][r2] = true;
                    numAssigned++;
                }
            }
        }
        var key, index;
        for (key in randomCells) {
            for (index in randomCells[key]) {
                this.gridArray[key][index] = randomCells[key][index];
            }
        }
    },
};
memory.createGrid();
memory.populateRandomGrid();
