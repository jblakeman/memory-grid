var gridHeight = 6, gridLength = 4;
var gridArray = [];
var grid = document.getElementById("grid");

function createNewElement(tagName, className) {
    var newElement = document.createElement(tagName);
    if (className) newElement.className = className;
    return newElement;
}

function populateGrid() {
    var row, rowElement, i, j;
    for (i = 0; i < gridHeight; i++) {
        row = [];
        rowElement = createNewElement("tr");
        for (j = 0; j < gridLength; j++) {
            rowElement.appendChild(createNewElement("td", "cell"));
            row.push(false);
        }
        grid.appendChild(rowElement);
        gridArray.push(row);
    }
}

populateGrid();

