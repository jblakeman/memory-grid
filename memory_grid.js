var memory = {
    grid: {
        height: 6,
        width: 5,
        filled: {},
        elements: [],
    },
    numGuesses: 0,
    hideAfterMs: 3350,
    assignNumGuesses: function() {
        this.numGuesses = Math.floor((this.grid.height*this.grid.width)/3)+1;
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
        while(numAssigned < this.numGuesses) {
            r1 = Math.floor(Math.random() * this.grid.height);
            if (!(r1 in this.grid.filled)) {
                this.grid.filled[r1] = {};
            }
            if (Object.keys(this.grid.filled[r1]).length < this.grid.width) {
                r2 = Math.floor(Math.random() * this.grid.width);
                if (!(r2 in this.grid.filled[r1])) {
                    this.grid.filled[r1][r2] = true;
                    this.grid.elements[r1][r2].style.backgroundColor = "#CEE7FF";
                    numAssigned++;
                }
            }
        }
        console.log(self.grid.filled);
    },
    hideFilled: function() {
        self = this;
        setTimeout(function() {
            self.grid.elements.forEach(function(row, i1) {
                row.forEach(function(cell, i2) {
                    var color = "#FF353F";
                    if (i1 in self.grid.filled && i2 in self.grid.filled[i1]) {
                        color = "#84FF77";
                    }
                    cell.addEventListener("click", function(event) {
                        self.numGuesses++;
                        self.changeBackgroundColor(event, color);
                    });
                    cell.style.backgroundColor = "#8B93C0";
                });
            });
        }, self.hideAfterMs);
    }
};
memory.createGrid();
memory.populateRandomGrid();
memory.hideFilled();
