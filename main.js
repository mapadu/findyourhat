const prompt = require('prompt-sync')({ sigint: true });

const hat = '^';
const hole = 'O';
const fieldCharacter = '░';
const pathCharacter = '*';

class Field {
  constructor(field) {
    this.field = field; // game grid
    this.playerPosition = [0, 0]; // top-left corner starting point
  }

  print() {
    console.log(this.field.map(row => row.join('')).join('\n'));
  }

  movePlayer(direction) {
    const [currentRow, currentCol] = this.playerPosition;
    let newRow = currentRow;
    let newCol = currentCol;

    // moving directions
    if (direction === 'w') {
      newRow -= 1; // up
    } else if (direction === 's') {
      newRow += 1; // down
    } else if (direction === 'a') {
      newCol -= 1; // left
    } else if (direction === 'd') {
      newCol += 1; // right
    } else {
      console.log('Invalid input! Use WASD!');
      return 'play'; // continue
    }
    
    // checking bounds
    if (newRow < 0 || newRow >= this.field.length || newCol < 0 || newCol >= this.field[0].length) {
      console.log('Out of bounds! You lose!');
      return 'lose'; // bad ending
    }

    // getting the new position tile
    const tile = this.field[newRow][newCol];

    // checking if the tile is hat or hole
    if (tile === hat) {
      console.log('You win! You find your hat!');
      return 'win'; // good ending
    } else if (tile === hole) {
      console.log('Oh no! You fell into a hole!');
      return 'lose'; // bad ending
    }

    // updating field and player position
    this.field[currentRow][currentCol] = fieldCharacter; // reset the old position
    this.field[newRow][newCol] = pathCharacter; // mark new position
    this.playerPosition = [newRow, newCol]; // update player position

    return 'play'; // continue

  }

  static generateField (height, width, holePercentage = 0.2) {

    // empty field
    const field = Array.from({ length: height }, () => Array(width).fill(fieldCharacter));

    // placing the hat randomly
    const hatRow = Math.floor(Math.random() * height);
    const hatCol = Math.floor(Math.random() * width);
    field[hatRow][hatCol] = hat;

    // placing the wholes randomly
    let numHoles = Math.floor(height * width * holePercentage);
    while (numHoles > 0) {
      const holeRow = Math.floor(Math.random() * height);
      const holeCol = Math.floor(Math.random() * width);

    // ensuring that the hole not overwrites the hat
    if (field[holeRow][holeCol] === fieldCharacter && (holeRow !== hatRow || holeCol !== hatCol)) {
      field[holeRow][holeCol] = hole;
      numHoles--;
      }
    }

    // setting the starting position
    field[0][0] = pathCharacter; 

    return field;
  }

  startGame() {
    let gameState = 'play';

    console.log('Welcome! Let\'s start the game!')

    // printing initial field
    this.print();

    while (gameState === 'play') {
      const direction = prompt('Which way? (w/a/s/d): '); // prompt player
      gameState = this.movePlayer(direction); // handle movement
      this.print(); // show updated field
    }

    if (gameState === 'win') {
      console.log('You win! You find your hat!')
    } else if (gameState === 'lose') {
      console.log('Oh no! You fell into a hole!')
    }
  }
}

// initializing the game (you can modify the generateField arguments)
const randomField = Field.generateField(5, 5, 0.2);
const game = new Field(randomField);
game.startGame();