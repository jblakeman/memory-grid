Memory Grid
----

A visual memory game to recall marked tiles on a grid

###Rules/Walk Through###

Cells are filled randomly in the grid, and are hidden after a few seconds.

The player tests their memory by trying to click all the cells that were filled.

Cell clicks that match change the cell's color to green, while non-matched clicks change it to red.

Correct and incorrect clicks are tallied, and the game ends when the user has clicked the number of cells that were randomly filled.

###Objective###

Complete a perfect game by clicking all the originally filled cells with zero misses.

###Notes/Todo###

The game currently does not allow for a new game without refreshing the page.

* Some things to add
    1.  "New Game" button to start new game after completion
    2.  Keep running statistics
        * Total correct/incorrect ratio
        * Number of perfect games / total
    3.  Varying difficulties that adjust the size of the grid and/or the number of filled cells.
    4.  After fininishing without a perfect game, reveal the remaining originally filled cells that the user failed to click.
