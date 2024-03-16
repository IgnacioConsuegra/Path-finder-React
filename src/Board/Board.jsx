import { useEffect, useReducer, useRef, useState } from 'react';
import Cell from '../components/Cell';
import Peon from '../assets/peon.png';
import './index.css'
import { Node } from './Classes/node';
import { Table } from './Classes/table';
export const ACTIONS = { 
  CREATE_TABLE: 'create-table',
  MODIFY_CELL : 'modify-cell',
  MODIFY_ALL : 'modify-all',
  UPDATE_SINGLE: 'update-single',
  TEST: 'test',
}
function reducer(table, action) {
  switch(action.type)
  {
    case ACTIONS.CREATE_TABLE : 
      return action.payload.arr;

    case ACTIONS.MODIFY_CELL:
      // eslint-disable-next-line no-case-declarations
      const { row, column, value } = action.payload;
        // eslint-disable-next-line no-case-declarations
      
      // if(value !== (1 || 2))
      // {
        const updatedTable = table["table"].map((rowArray, rowIndex) => {
          if (rowIndex === row) {
            return rowArray.map((node, columnIndex) => {
              if (columnIndex === column) {
                  const updatedNode = new Node(
                    node.id,
                    value,
                    node.row,
                    node.column,
                    node.g,
                    node.f,
                    node.h,
                    node.neighbors,
                    node.previous,
                    node.left,
                    node.right,
                    node.top,
                    node.bottom,
                    node.topLeft,
                    node.topRight,
                    node.bottomLeft,
                    node.bottomRight,
                    node.minDistance
                  );
                  return updatedNode;
              }
              return node;
            });
          }
          return rowArray;
        });
      // } 
        
        const newTable = new Table(updatedTable, [], [],
          table["startNode"],
          table["endNode"],
          table["dispatch"]
        );
        console.log(newTable)

        return newTable;
    case ACTIONS.TEST:

      return table;
      
    case ACTIONS.MODIFY_ALL : 
      return action.payload.arr;
  }
}


function changeCellReducer(changingCellsOnOver, action) {
  switch(action.type)
  {
    case ACTIONS.UPDATE_SINGLE : 
      return action.payload.value;
  }
}



export function Board()
{
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [table, dispatch] = useReducer(reducer, {});
  const [changingCellsOnOver, setChangingCellsOnOver] = useReducer(changeCellReducer, 0);
  const [updateTable, setUpdateTable] = useState(false);
  const [isMouseDown, setIsMouseDown] = useState(false);

  const [start, setStart] = useState(false);

  const classes = ["empty", "init", "end", "wall", "searching", "searched", "path"];
  useEffect(() => {
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

    const myTable = new Table(myArrNodes, [], [], null, null, dispatch);
    myTable.bindNodes();
    myTable.createInit(5, 5);
    myTable.createEnd(7, 1);

    myTable.createWall(7, 4);
    myTable.createWall(6, 1);
    myTable.createWall(6, 2);
    myTable.createWall(6, 3);
    myTable.createWall(6, 4);
    myTable.createWall(6, 5);
    myTable.createWall(5, 4);

    dispatch({type: ACTIONS.CREATE_TABLE, payload: {arr: myTable}});
  }, [])
  useEffect(() => {
    if(start)
    {
      if(table["endNode"])
      {
        table.bindNodes();
        table.myOwn();
      }
    }
  }, [start]);

  useEffect(() => {
    console.log(isMouseDown, changingCellsOnOver);

  }, [isMouseDown, changingCellsOnOver])

  useEffect(() => {
    console.log(changingCellsOnOver);
  }, [changingCellsOnOver])
  useEffect(() => 
  {
    console.log(table)
  }, [table])
  function handleStart()
  {
    setStart((prev) => !prev);
  }
  function handleMouseDown() 
  {
    setIsMouseDown(true);
  }
  function handleMouseUp() 
  {
    setIsMouseDown(false);
  }
  return (
    <section id='main'>
      <div id='table' className='table' >
      {
          table["table"] && 
          (
              table["table"].map((arr) => {
            
              return arr.map((element) => 
              {
                
                return(<Cell 
                  key={element.id} 
                  myClass={classes[element["value"]]} 
                  info={element} 
                  dispatch={dispatch}
                  handleMouseDown={handleMouseDown}
                  mouseUp={handleMouseUp}
                  changingCellsOnOver={changingCellsOnOver}
                  isMouseDown={isMouseDown}
                  setChangingCellsOnOver={setChangingCellsOnOver}
                  />)
              })
              })
          )
      }
      </div>
      <div onClick={handleStart}>Start</div>
    </section>
  )
}

export default Board;