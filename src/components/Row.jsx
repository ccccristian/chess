import Square from "./Square";
import './Row.css';
export default function Row({row, pieces, selectedPosition, availableMoves, handleSelectPosition, movePiece, checkPieces}){

    let squares = [];

    for(let square = 0; square < 8; square++)
    {
        let available = false;
        let classState = '';
        
        if(selectedPosition[0] === row && selectedPosition[1] === square) classState += ' selected';
        
        
        const [whiteKingStatus, blackKingStatus] = checkPieces;
        
        if(whiteKingStatus && whiteKingStatus[0] === row && whiteKingStatus[1] === square)
        {
            classState += ' check';
        }
        if(blackKingStatus && blackKingStatus[0] === row && blackKingStatus[1] === square)
        {
            classState += ' check';
        }

        if(availableMoves){
            for(let move of availableMoves){
                if(move[0] === row && move[1] === square){
                    available = true;
                }
            }
        }

        squares.push(
        <Square 
        key={square}
        piece={pieces[square]} 
        classState={classState}
        available={available}
        onClick={()=>{
            if(available){
                movePiece(selectedPosition, [row,square])
            }else{
                handleSelectPosition([row,square])
            }
        }}
        >
        </Square>)
    }

    return(
        <div className="board-row">
            {squares}
        </div>
    );
}

