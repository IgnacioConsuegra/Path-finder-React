/* eslint-disable no-case-declarations */
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
let initOverEnd = false;
let initOrEndPositions = {};
let changeEndPoints= false;
let changeEndPointsPositions = {};
function reducer(table, action) {
  switch(action.type)
  {
    case ACTIONS.CREATE_TABLE : 
      return action.payload.arr;

    case ACTIONS.MODIFY_CELL:
      // eslint-disable-next-line no-case-declarations
      const { row, column, value } = action.payload;
        // eslint-disable-next-line no-case-declarations

      const updatedTable = table["table"].map((rowArray, rowIndex) => {
          if (rowIndex === row) {
            return rowArray.map((node, columnIndex) => {
              if (columnIndex === column) {
                  if(value === 1 && node["value"] === 2) {
                    initOverEnd = true;
                    initOrEndPositions["column"] = node.column;
                    initOrEndPositions["row"] = node.row;
                    initOrEndPositions["value"] = node.value;
                  }
                  if(value === 2 && node["value"] === 1) {
                    initOverEnd = true;
                    initOrEndPositions["column"] = node.column;
                    initOrEndPositions["row"] = node.row;
                    initOrEndPositions["value"] = node.value;
                  }
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
      let newT;
      if(!initOverEnd){
        const newTable = new Table(updatedTable, [], [],
          table["startNode"],
          table["endNode"],
          table["dispatch"]
        );
        newT = newTable;
        return newTable;
      }else{
        if(initOrEndPositions["value"] === 1)
        {
          const newTable = new Table(updatedTable, [], [],
          table["startNode"],
          table["endNode"],
          table["dispatch"]
          );

          newTable.createInit(initOrEndPositions["row"], initOrEndPositions["column"]);
          if(initOrEndPositions["row"] === 1 && initOrEndPositions["column"] === 1)
          {
            newTable.createEnd(0, 1);
          }else{
            newTable.createEnd(0, 0);
          }
          newT = newTable;
        }
        if(initOrEndPositions["value"] === 2)
        {
          const newTable = new Table(updatedTable, [], [],
            table["startNode"],
            table["endNode"],
            table["dispatch"]
            );
  
            newTable.createEnd(initOrEndPositions["row"], initOrEndPositions["column"]);
            if(initOrEndPositions["row"] === 1 && initOrEndPositions["column"] === 1)
            {
              newTable.createInit(0, 1);
            }else{
              newTable.createInit(0, 0);
            }
            newT = newTable;
            return newTable;
        }
      }
      return newT
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
  }, [isMouseDown, changingCellsOnOver])

  useEffect(() => {
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