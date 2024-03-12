import { useEffect, useReducer } from 'react';
import Cell from '../components/Cell';
import Peon from '../assets/peon.png';
import './index.css'

export const ACTIONS = { 
  CREATE_CELLS: 'create-cells',
}
function reducer(cells, action) {
  switch(action.type){
    case ACTIONS.CREATE_CELLS : 
    return action.payload.arr;
  }
}



const Table = () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [cells, dispatch] = useReducer(reducer, [[], []])

  // eslint-disable-next-line react-hooks/r~ules-of-hooks
  useEffect(() => {
    const table = [];
    for(let i = 0; i < 8; i++){
      const row = [];
      for(let j = 0; j < 8; j++){
        row.push({row: i, column: j, piece: null});
      }
      table.push(row);
    }
    dispatch({type: ACTIONS.CREATE_CELLS, payload: {arr: table}})
    
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  useEffect(() => {
    class Node
    {
      constructor(id = 0, row = null, column = null, left = null, right = null, top = null, bottom = null, topLeft = null, topRight = null, bottomLeft = null, bottomRight = null)
      {
        this.id = id;
        this.row = row;
        this.column = column;
        this.right = right;
        this.left = left; 
        this.top  = top;
        this.bottom = bottom;
        this.topLeft = topLeft;
        this.topRight = topRight;
        this.bottomLeft = bottomLeft;
        this.bottomRight = bottomRight;
      }
    }

    const myArrNodes = []
    cells.map((e) => 
    {
      myArrNodes.push(
        e.map((element, index) => 
        {
          return new Node(`${element.row}${element.column}`, element.row, element.column);
        })
      )
    })

    class Table
    {
      constructor(table)
      {
        this.table = table;
      }
      bindNodes() 
      {
        for(let i = 0; i < this.table.length; i++){
          for(let j = 0; j < this.table[i].length; j++)
          { 
            this.table[i][j]["left"] = (j > 0) ? this.table[i][j - 1] : null;
            this.table[i][j]["right"] = (j < this.table[i].length - 1) ? this.table[i][j + 1] : null;
            this.table[i][j]["top"] = (i > 0) ? this.table[i - 1][j] : null;
            this.table[i][j]["bottom"] = (i < this.table.length - 1) ? this.table[i + 1][j] : null;
            this.table[i][j]["topLeft"] = (i > 0 && j > 0) ? this.table[i - 1][j - 1] : null;
            this.table[i][j]["topRight"] = (i > 0 && j < this.table[i].length - 1) ? this.table[i - 1][j + 1] : null;
            this.table[i][j]["bottomLeft"] = (i < this.table.length - 1 && j > 0) ? this.table[i + 1][j - 1] : null;
            this.table[i][j]["bottomRight"] = (i < this.table.length - 1 && j < this.table[i].length - 1) ? this.table[i + 1][j + 1] : null;
          }
        }
      }
      printAll()
      {
        console.log(this.table)
      }
    }
    const myTable = new Table(myArrNodes);
    myTable.bindNodes();
    myTable.printAll();

    
  }, [cells])

  return (
    <div className='table'>
      {
        cells.map((arr, index1) => {
          
          return arr.map((element, index2) => {
            if(element.piece){
              return(<Cell key={index1 + index2} info={element} url={Peon}/>)
            }
            return(<Cell key={index1 + index2} info={element}/>)
          })
        })
      }
    </div>
  )
}

export default Table;