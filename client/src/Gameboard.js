import React, { useEffect, useState } from "react";
import Square from "./components/Square";

function Gameboard({socket,code})
{
    const [board,setboard]=useState(["","","","","","","","","",]);
    const [player,setPlayer]=useState("X");
    const [turn,setTurn]=useState("X");
    const [result,setResult]=useState({winner:"none",state:"none"});
    let resultShow=document.getElementById("resultShow");
    const Patterns=[
        [0,1,2],
        [3,4,5],
        [6,7,8],
        [0,3,6],
        [1,4,7],
        [2,5,8],
        [0,4,8],
        [2,4,6],];

    const chooseSquare=(square)=>{
        if(turn===player && board[square]==="" && result.winner==="none")
        {
            setTurn(player==="X"?"O":"X");
            socket.emit("send_move",{square,player,code});
            setboard(board.map((val,idx)=>{
                if(idx===square && val==="")
                {
                    return player;
                }
                return val;
            }));
        }
    };

    const checkWin=()=>{
        Patterns.forEach((currentPattern)=>{
            const firstPlayer=board[currentPattern[0]];
            if(firstPlayer==="") return;
            let foundwinningPattern=true;
            currentPattern.forEach((idx)=>{
                if (board[idx]!==firstPlayer){
                    foundwinningPattern=false;
                }
            });
            if(foundwinningPattern){
                resultShow.textContent=`winner is ${board[currentPattern[0]]}`;
                setResult({winner:board[currentPattern[0]],state:"Won"});
            }
        });
    };
    useEffect(()=>{
        checkWin();
        checkTie();
    },[board]);

    const checkTie=()=>{
        let filled=true;
        board.forEach((square)=>{
            if(square===""){
                filled=false;
            }
        });
        if(filled){
            resultShow.textContent="Game is TIE";
            setResult({winner:"none",state:"Tie"});
        }
    };

    
    socket.on("receive_move",(data)=>{
        if(board[data.square]==="")
        {
            const currentPlayer=data.player==="X"?"O":"X";
            setPlayer(currentPlayer);
            setTurn(currentPlayer);
            setboard(board.map((val,idx)=>{
                if(idx===data.square && val==="")
                {
                    return data.player;
                }
                return val;
            }));
        }
    });

    return(
        <div className="App">
            <h2>{`your game code is ${code}`}</h2>
            <div className="App">
                <div className="game-board">
                    <div className="row">
                        <Square val={board[0]} chooseSquare={()=>{chooseSquare(0)}}/>
                        <Square val={board[1]} chooseSquare={()=>{chooseSquare(1)}}/>
                        <Square val={board[2]} chooseSquare={()=>{chooseSquare(2)}}/>
                    </div>
                    <div className="row">
                        <Square val={board[3]} chooseSquare={()=>{chooseSquare(3)}}/>
                        <Square val={board[4]} chooseSquare={()=>{chooseSquare(4)}}/>
                        <Square val={board[5]} chooseSquare={()=>{chooseSquare(5)}}/>
                    </div>
                    <div className="row">
                        <Square val={board[6]} chooseSquare={()=>{chooseSquare(6)}}/>
                        <Square val={board[7]} chooseSquare={()=>{chooseSquare(7)}}/>
                        <Square val={board[8]} chooseSquare={()=>{chooseSquare(8)}}/>
                    </div>
                </div>
            </div>
            <h1 id="resultShow"></h1>
        </div>
    )
}

export default Gameboard;