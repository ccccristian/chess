import './Square.css';
import Piece from './Piece';

export default function Square({ piece, onClick, classState, available}){

    if(available) classState += piece === undefined ? ' avaliable' : ' target';
    
    return(
        <div className={'square ' + classState} onClick={onClick}>

            {piece && <Piece piece={piece} key={piece.name+piece.color}/>}
        </div>
    );

}