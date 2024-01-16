export default function Piece({piece}){
    let pieceName = piece.name + (piece.color === 'white' ? '-w' : '-b');
    let color = piece.color;

    return(
        <img src={`./sources/pieces/${pieceName}.png`} className={'piece ' + color} alt={pieceName}/>
    );
}

