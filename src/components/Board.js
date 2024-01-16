


const createPiece = (name, color, availableMoves = [], enPassant = false) => ({ name, color, availableMoves});

const generateRow = (color) => {
  const pieceOrder = ['rook', 'knight', 'bishop', 'queen', 'king', 'bishop', 'knight', 'rook'];
  return pieceOrder.map(name => createPiece(name, color));
};

const generatePawnRow = (color) => Array(8).fill().map(() => createPiece('pawn', color, []));

export const initialBoard = [
  generateRow('black'),
  generatePawnRow('black'),
  Array(8).fill(undefined),
  Array(8).fill(undefined),
  Array(8).fill(undefined),
  Array(8).fill(undefined),
  generatePawnRow('white'),
  generateRow('white')
];
