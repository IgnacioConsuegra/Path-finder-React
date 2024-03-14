import { useEffect, useReducer, useRef, useState } from 'react';
import Cell from '../components/Cell';
import Peon from '../assets/peon.png';
import './index.css'
import { Node } from './Classes/node';
import { Table } from './Classes/table';
export const ACTIONS = { 
  CREATE_CELLS: 'create-cells',
  MODIFY_CELL : 'modify-cell',
  MODIFY_ALL : 'modify-all'
}
function reducer(cells, action) {
  switch(action.type)
  {
    case ACTIONS.CREATE_CELLS : 
      return action.payload.arr;

    case ACTIONS.MODIFY_CELL:
      const { row, column, value } = action.payload;
      const updatedTable = cells.table.map((rowArray, rowIndex) => {
        if (rowIndex === row) {
          return rowArray.map((node, columnIndex) => {
            if (columnIndex === column) {
              return { ...node, value: value };
            }
            return node;
          });
        }
        return rowArray;
      });
      return { ...cells, table: updatedTable };
      
    case ACTIONS.MODIFY_ALL : 
      return action.payload.arr;
  }
}



export function Board()
{
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [cells, dispatch] = useReducer(reducer, [[], []]);
  const [reRender, setReRender] = useState(1);
  const breathJustOnce = useRef();

  const classes = ["empty", "init", "end", "wall", "searching", "searched", "path"];
  useEffect(() => {
    breathJustOnce.current = true;
    const table = [];
    for(let i = 0; i < 8; i++){
      const row = [];
      for(let j = 0; j < 8; j++){
        row.push({row: i, column: j});
      }
      table.push(row);
    }

    const myArrNodes = []
    table.map((e) => 
    {
      myArrNodes.push(
        e.map((element) => 
        {
          return new Node(`${element.row}${element.column}`, 0, element.row, element.column);
        })
      )
    })

    const myTable = new Table(myArrNodes, dispatch);
    myTable.bindNodes();
    myTable.createInit(5, 5);
    myTable.createEnd(1, 2);
    myTable.createWall(4, 4);
    myTable.createWall(6, 4);
    myTable.createWall(7, 4);
    myTable.createWall(5, 4);
    myTable.createWall(3, 4);
    myTable.createWall(2, 4);
    myTable.createWall(1, 4);
    dispatch({type: ACTIONS.CREATE_CELLS, payload: {arr: myTable}})
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  useEffect(() => {
    if(cells["endNode"])
    {
      if(breathJustOnce.current)
      {
        setTimeout(() => {
          cells.bfs();
          setReRender((prev) => setReRender(prev + 1));
        }, 1 * 1000)
      }
      breathJustOnce.current = false;
    }
  }, [cells])

  return (
    <div className='table'>
      {
        reRender && (
          cells["table"] && (
            cells["table"].map((arr) => {
            
              return arr.map((element) => 
              {
                
                return(<Cell key={element.id} myClass={classes[element["value"]]} info={element}/>)
              })
            })
          )
        )
      }
    </div>
  )
}

export default Board;