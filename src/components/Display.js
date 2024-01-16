

export function Promotion({color, onClick}){
    return(
        <div className="display winner">
            <h3>PROMOTE PAWN TO:</h3>
            <div className="buttons">

            <button type="button" className="mr">
                <img src={"./sources/pieces/queen-"+color + '.png'} onClick={()=>onClick('queen')} width={70} alt="queen"/>
            </button>
            <button type="button" className="mr">
                <img src={"./sources/pieces/rook-"+color + '.png'} onClick={()=>onClick('rook')} width={70} alt="rook"/>
            </button>
            <button type="button" className="mr">
                <img src={"./sources/pieces/bishop-"+color + '.png'} onClick={()=>onClick('bishop')} width={70} alt="bishop"/>
            </button>
            <button type="button">
                <img src={"./sources/pieces/knight-"+color + '.png'} onClick={()=>onClick('knight')} width={70} alt="knight"/>
            </button>
            </div>

        </div>
    );
}

export function GameOver({children})
{
    return(
        <div className="display">
            {children}
        </div>
        );
}