const grid = document.getElementsByClassName('sudoku-grid');
var inputs = [];

// Creates a 9x9  sudoku grid in the first element with class sudoku-grid
for (let i = 1; i <= 9; i++) {
  const rowId = i;
  const majorRowId = Math.ceil(rowId / 3);
  const row = document.createElement('div');
  row.classList = 'row';

  for (let j = 1; j <= 9; j++) {
    const colId = j;
    const majorColId = Math.ceil(colId / 3);
    const cell = document.createElement('div');
    cell.classList = 'cell';

    const cellInput = document.createElement('input');
    cellInput.setAttribute('type', 'number');
    cellInput.dataset.row = rowId;
    cellInput.dataset.column = colId;
    cellInput.dataset.grid = (majorRowId * majorColId) + ((majorRowId - 1) * (3 - majorColId));

    cellInput.addEventListener('input', e => {
      validate(e.target);
    });

    inputs.push(cellInput);
    
    cell.appendChild(cellInput);
    row.appendChild(cell);
  }

  grid[0].appendChild(row);
}

const sanitizeInput = activeCell => {
  var value = parseInt(activeCell.value);
  if (value !== '') value %= 10;
  
  if (value >= 1 && value <= 9) {
    activeCell.value = value;
  } else {
    activeCell.value = '';
  }
}

const validate = activeCell => {
  sanitizeInput(activeCell);
  const value = parseInt(activeCell.value);

  const fullSet  = inputs.filter(i => {
    if (i.dataset.row === activeCell.dataset.row) return true;
    if (i.dataset.column === activeCell.dataset.column) return true;
    if (i.dataset.grid === activeCell.dataset.grid) return true;
    return false;
  });

  // Using set to remove duplicates of row and column in grid
  const errors = new Set(fullSet.filter(i => { return parseInt(i.value) === value }));

  // These checks will always match the original input, so only care if it matches 2 or more, indicating an error
  if (errors.size > 1) {
    errors.forEach(e => {
      e.classList.add('error');
    });
  } else if (activeCell.classList.contains('error')) {
    activeCell.classList.remove('error');
    fullSet.forEach(input => {
      if (input.classList.contains('error')) {
        validate(input);
      }
    })
  }
}