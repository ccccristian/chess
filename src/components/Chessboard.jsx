import Row from "./Row";
import './Chessboard.css'
import { useState } from "react";
import { initialBoard } from "./Board";
import { Promotion, GameOver } from "./Display";
import { sounds } from './sounds'

let resetIcon = <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" style={{fill: 'rgba(255, 255, 255, 1)', transform: '', msfilter: ''}}><path d="M10 11H7.101l.001-.009a4.956 4.956 0 0 1 .752-1.787 5.054 5.054 0 0 1 2.2-1.811c.302-.128.617-.226.938-.291a5.078 5.078 0 0 1 2.018 0 4.978 4.978 0 0 1 2.525 1.361l1.416-1.412a7.036 7.036 0 0 0-2.224-1.501 6.921 6.921 0 0 0-1.315-.408 7.079 7.079 0 0 0-2.819 0 6.94 6.94 0 0 0-1.316.409 7.04 7.04 0 0 0-3.08 2.534 6.978 6.978 0 0 0-1.054 2.505c-.028.135-.043.273-.063.41H2l4 4 4-4zm4 2h2.899l-.001.008a4.976 4.976 0 0 1-2.103 3.138 4.943 4.943 0 0 1-1.787.752 5.073 5.073 0 0 1-2.017 0 4.956 4.956 0 0 1-1.787-.752 5.072 5.072 0 0 1-.74-.61L7.05 16.95a7.032 7.032 0 0 0 2.225 1.5c.424.18.867.317 1.315.408a7.07 7.07 0 0 0 2.818 0 7.031 7.031 0 0 0 4.395-2.945 6.974 6.974 0 0 0 1.053-2.503c.027-.135.043-.273.063-.41H22l-4-4-4 4z" /></svg>
let backIcon = <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" style={{fill: 'rgba(255, 255, 255, 1)', transform: '', msfilter: ''}}><path d="M9 10h6c1.654 0 3 1.346 3 3s-1.346 3-3 3h-3v2h3c2.757 0 5-2.243 5-5s-2.243-5-5-5H9V5L4 9l5 4v-3z" /></svg>


let initialized = false;

export default function Chessboard({isWhiteNext, setIsWhiteNext}){

    const [pieces,setPieces] = useState(initialBoard)
    const [selectedPosition, setSelectedPosition] = useState([null, null])
    const [passantPieces, setPassantPieces] = useState([])


    let availableMoves = selectedPosition[0] === null ? null
    : pieces[selectedPosition[0]][selectedPosition[1]].availableMoves;

    const [checkPieces, setCheckPieces] = useState([null,null])

    const [promote, setPromote] = useState({position: null, promoting: false,color: 'white'})
    const [winner, setWinner] = useState(null);

    const [history, setHistory] = useState([initialBoard]);

    let currPlayer = isWhiteNext ? 'white' : 'black';

    let rows = [];

    if(!initialized){
        calculateBoardStatus(pieces)
        initialized = true;
    }


    for(let i = 0; i < 8; i++)
    {
        rows.push(
        <Row 
        key={i}

        row={i} 
        pieces={pieces[i]} 
        selectedPosition={selectedPosition} 
        setSelectedPosition={setSelectedPosition}
        handleSelectPosition={handleSelectPosition}
        availableMoves={availableMoves}
        movePiece={movePiece}
        checkPieces={checkPieces}
        ></Row>)
    }


    function handleSelectPosition(position){
        let selection = pieces[position[0]][position[1]];
         if(selection && selection.color === currPlayer && !promote.promoting){
            setSelectedPosition(position)

        }else{
            setSelectedPosition([null,null])
        }



    }

    function movePiece(position, nextPosition){
        sounds.move.play()
        let currentPiece = pieces[position[0]][position[1]]

        let newPieces = pieces.map(row=>[...row]);
        newPieces[nextPosition[0]][nextPosition[1]] = currentPiece;


        if(passantPieces.length > 0)
        {
            passantPieces[0].enPassant = false;
            setPassantPieces([])
        }
        
        if(currentPiece.name === 'pawn')
        {
            let enPassantPos = isWhiteNext ? 4: 3;
            let pawnStartPos = isWhiteNext ? 6 : 1;
            let pawnEndPos = isWhiteNext ? 0 : 7;

            if(nextPosition[0] === enPassantPos && position[0] === pawnStartPos){

                setPassantPieces([...passantPieces, currentPiece])
                currentPiece.enPassant = true;
            }


            if(nextPosition[0] === pawnEndPos){
                setPromote({
                    promoting: true,
                    color: isWhiteNext ? 'white' : 'black',
                    position: nextPosition
                })
            }
        }


        
        
        newPieces[position[0]][position[1]] = undefined;
        
        setPieces(newPieces)
        setSelectedPosition([null,null])
        setIsWhiteNext(!isWhiteNext)
        calculateBoardStatus(newPieces)


        setHistory([...history, newPieces])
    }
    function undoBoard()
    {
        if(history.length >1)
        {
            let newPieces = history[history.length -2];
            setPieces(newPieces)
            
            const newHistory = [...history]
            newHistory.pop()
            setHistory(newHistory)
            calculateBoardStatus(newPieces)
            setIsWhiteNext(!isWhiteNext)
            setSelectedPosition([null,null])

            sounds.undo.play()

        }
    }

    function resetPieces(){
        setPieces(initialBoard.map(row=>[...row]))
        calculateBoardStatus(initialBoard)
        setSelectedPosition([null,null])
        setIsWhiteNext(true)
        setCheckPieces([null,null])
        setWinner(null)
        setHistory([initialBoard])
        sounds.boardStart.play();
    }


    // simula un determinado movimiento, y retorna true o false segun si el movimiento es válido o no
    function simulate(board, position, nextPosition)
    {
        let virtualBoard = [...board.map(row=>[...row.map(square=>{

            if(square) return{...square}
            return undefined;
        }
        
        )])]
        let currentPiece = virtualBoard[position[0]][position[1]]
        let color = currentPiece.color;


        virtualBoard[nextPosition[0]][nextPosition[1]] = currentPiece;
        virtualBoard[position[0]][position[1]] = undefined;

        const [whiteKingStatus, blackKingStatus] = calculateKingStatus(virtualBoard)

        if(whiteKingStatus && virtualBoard[whiteKingStatus[0]][whiteKingStatus[1]].color === color)
        {
            return false;
        }
        if(blackKingStatus && virtualBoard[blackKingStatus[0]][blackKingStatus[1]].color === color)
        {
            return false;
        }
        return true;
    }



    function calculateKingStatus(board) {
        const moves = [];
        
        //Calcula todos los movimientos posibles
        for (let r = 0; r < board.length; r++) {
          for (let c = 0; c < board[r].length; c++) {
            const piece = board[r][c];
            if (piece && piece.color) {
              const availableMoves = calculateAvailableMoves(board, piece, [r, c]);
              moves.push(...availableMoves);
            }
          }
        }

        let checkPos = [null,null];

        for (const move of moves) {
          const [r, c] = move;
          const piece = board[r][c];
          if (piece && piece.name === 'king') {
            if(piece.color === 'white')
            {

                checkPos[0] =  move;
            }else
            {
                checkPos[1] = move;
            }
          }
        }
      
        return checkPos;
      } 

    function calculateBoardStatus(board){

        let whiteAvalMoves = 0;
        let blackAvalMoves = 0;

        for(let row in board){
            for(let square in board[row]){
                if(typeof board[row][square] === 'object'){
                    let piece = board[row][square];
                    let moves = calculateAvailableMoves(board, piece, [Number(row),Number(square)])

                    moves = moves.filter(move=>{
                        return simulate(board, [row,square], move)
                    })

                    piece.availableMoves = moves;

                    if(piece.color === 'white')
                    {
                        whiteAvalMoves+= moves.length;
                    }else
                    {
                        blackAvalMoves += moves.length;
                    }
                }
            }

        }

        let kingStatus = calculateKingStatus(board)
        if(kingStatus[0] || kingStatus[1])sounds.check.play();
        
        setCheckPieces(kingStatus)


        if(whiteAvalMoves === 0 && kingStatus && !promote.promoting)
        {

            displayWinner('Black')
        }
        if(blackAvalMoves === 0 && kingStatus && !promote.promoting)
        {
            displayWinner('White')
        }

        if(!kingStatus && ((blackAvalMoves === 0 && isWhiteNext) || (whiteAvalMoves === 0 && !isWhiteNext)) && !promote.promoting)
        {
            displayWinner('Draw')
        }


    }

    function displayWinner(winner)
    {
        setWinner(winner);
        if(winner !== 'Draw')
        {
            sounds.winner.play();

        }else{
            sounds.draw.play();
    }
    }

    function calculateAvailableMoves(board, piece, position){

        let avaliableMoves = []
        let targetColor = piece.color;
        let yPos = position[0]
        let xPos = position[1]
    
        function addMove(y, x)
        {
            
            if(typeof board[y] === 'object' && y < 8 && x < 8 && y >= 0 && x >= 0)
            {
                if(typeof board[y][x] === 'object' && board[y][x].color === targetColor )
                {
                    
                    return;
                }
                avaliableMoves.push([y, x]);
            }
        }
    
    
        function diagonalOrStraight(diagonal) {
            const diagonalDirections = [
              [1, 1],  // Diagonal derecha abajo
              [1, -1], // Diagonal izquierda abajo
              [-1, 1], // Diagonal derecha arriba
              [-1, -1] // Diagonal izquierda arriba
            ];
            const straightDirections = [
                [0, 1],  // derecha 
                [0, -1], // izquierda
                [1, 0], // abajo
                [-1, 0] // arribla
              ];
            let directions = diagonal ? diagonalDirections : straightDirections;
    
            for (const [yDir, xDir] of directions) {
              let y = yPos + yDir;
              let x = xPos + xDir;
              let canContinue = true;
    
              while (typeof board[y] === 'object' && canContinue && y < 8 && x < 8 && x >-1) {
                if(board[y][x] !== undefined)
                {
                    canContinue = false
                }
                  addMove(y, x);
                  y += yDir;
                  x += xDir;
                
              }
    
    
            }
          }
          function pawn(isBlack)
          {
            let direction = isBlack ? +1 : -1;
            let nextRow = yPos + direction;
            let startPos = isBlack ? 1 : 6;
            if(board[nextRow])
            {
                if(board[nextRow][xPos] === undefined){
                    addMove(nextRow, xPos)
        
                    // Si está en la posición inicial, el peón puede avanzar 2 casillas.
                    if(yPos === startPos && board[yPos + direction *2][xPos] === undefined){
                        addMove(yPos + direction *2, xPos) 
                    }
                }
        
                if(board[nextRow][xPos +1] !== undefined)
                {
                    addMove(nextRow, xPos +1) 
                }
                if(board[nextRow][xPos -1] !== undefined)
                {
                    addMove(nextRow, xPos -1) 
                }

            }

    
    
          }
          function king()
          {
            addMove(yPos +1, xPos +1)
            addMove(yPos -1, xPos -1)
            addMove(yPos +1, xPos -1)
            addMove(yPos -1, xPos +1)
            addMove(yPos, xPos +1)
            addMove(yPos, xPos -1)
            addMove(yPos +1, xPos)
            addMove(yPos -1, xPos)

          }
          function knight()
          {
            addMove(yPos +2, xPos +1)
            addMove(yPos +2, xPos -1)
    
            addMove(yPos -2, xPos +1)
            addMove(yPos -2, xPos -1)
    
            addMove(yPos +1, xPos +2)
            addMove(yPos +1, xPos -2)
    
            addMove(yPos -1, xPos +2)
            addMove(yPos -1, xPos -2)

            
          }
        switch(piece.name){
    
            case 'pawn':
                pawn(targetColor === 'black')
                break;
    
            case 'knight':
                knight();
                break;
    
            case 'queen':
                //Movimiento diagonal y recto
                diagonalOrStraight(true)
                diagonalOrStraight(false)
                break;
            case 'rook':
                //Movimiento recto
                diagonalOrStraight(false)
                break;
    
            case 'bishop':
                //Movimiento diagonal
                diagonalOrStraight(true)
                break;
            case 'king':
                king();
                break;
    
            default:
                break;
        }
        return avaliableMoves;
    }
    
    function Promote(position,color, piece){

        let newRow = [...pieces[position[0]]]
        newRow[position[1]] = {name:piece, color: color}
        let newBoard = [...pieces];
        newBoard[position[0]] = newRow;

        sounds.coronation.play()
        setPieces(newBoard);
        setPromote({...promote, promoting: false})
        calculateBoardStatus(newBoard)
    }


    return(
        <div className="container">
        <div className="chessboard">
            {rows}

        </div>
        <div className="inputs">
            <button type="button" className="mr" disabled={winner || promote.promoting} onClick={resetPieces}>
                {resetIcon}
            </button>
            <button type="button" disabled={winner || promote.promoting} onClick={undoBoard}>
                {backIcon}
            </button>
        </div>
        {
            promote.promoting && 
            <Promotion color={promote.color[0]}
            onClick={(piece)=>{
                Promote(promote.position, promote.color, piece)
            }}
            />
            
        }
        {
            winner && 
            (
            <GameOver>
            {
                winner !== 'Draw'?
                <>
                    <h3>CHECKMATE</h3>
                    <p>WINNER: {winner}</p>
                    <br/>
                    <img src="./sources/winner.png" alt="Winner"/>
                    <br/>
                </>
                    :
                <>
                    <h2>DRAW</h2>
                    <p>The king is not in check and the player has no legal moves.</p>
                    <br/>
                    
                    <img src="./sources/draw.png" alt="Draw"/>
                    <br/>
                </>
            }
                <button type="button" className="mr" onClick={resetPieces}>
                    {resetIcon}
                </button>
                <button type="button" onClick={()=>{
                    undoBoard();
                    setWinner(null)
                }}>
                    {backIcon}
                </button>


            </GameOver>
            )

        }
        </div>
    );


}
