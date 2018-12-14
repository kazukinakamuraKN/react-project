import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) { 
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
renderSquare(i) {
    return (
      <Square 
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  render() {
    return (
      <div>

        {Array(9).fill(null).map((value, num) =>
          <div>{this.renderSquare({num})}</div>
        )}
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
      }],
      stepNumber: 0,
      xIsNext: true,
      colrow:  Array(null,2,3,4,5,6,7,8,9),
      hover: false,
    };
  }

  hoverOn() {
    this.setState({
      hover: true,
    })
  }

  hoverOff() { 
    this.setState({
      hover: false,
    })    
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    const colrow = this.state.colrow;
    const sliceColrow = colrow.slice();

    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    sliceColrow[this.state.stepNumber + 1] = `[${ Math.floor(i % 3) + 1 },${ Math.floor(i / 3) + 1 }]`;
    this.setState({
      history: history.concat([{
        squares: squares,
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
      colrow: sliceColrow,
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    })
  }

  render() {
    console.log(this.state);
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);
    const moves = history.map((step, move) => {
      // 参考演算子のif 式 ? trueなら実行 : falseなら実行
      const colrow = this.state.colrow[move];
      const desc = move ?
        'Go to move #' + move :
        'Go to game start';
      const nowstyle = () => ({
        fontWeight: (this.state.stepNumber === move) ? "bold" : "normal",
        // step === current　も　可能 stepもcurrentもhistoryの中身、squaresの配列を持ってる
        // color: step === current ? this.state.hover ? "red" : "black" : "black"
        // CSSだったーーー
      })
      return (
        // style = キャメルケース & {{}}
        <li key={move} className="target" onMouseEnter={() => this.hoverOn()} onMouseLeave={() => this.hoverOff()}>
          <button
            style={nowstyle()}
            onClick={() => this.jumpTo(move)}>{desc}{colrow}
          </button>
        </li>
        );
    });

    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next Player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />

        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
