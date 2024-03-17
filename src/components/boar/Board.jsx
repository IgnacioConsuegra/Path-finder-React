/* eslint-disable no-case-declarations */
import { useEffect, useReducer, useRef, useState } from 'react';
import { Node } from '../classes/node';
import { Table } from '../classes/table';
import Cell from '../cells/Cell';
import './Board.css'
export const ACTIONS = { 
  CREATE_TABLE: 'create-table',
  MODIFY_ALL : 'modify-all',
  UPDATE_SINGLE: 'update-single',
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
  const holdingEndNodes = useRef();
  const updatedTable = useRef();
  const initOrEndEnd = useRef();
  const initOrEndStart = useRef();
  const newTable = useRef();
  const [nodeIsPressed, setNodeIsPressed] = useState(false);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [start, setStart] = useState(false);
  const [table, dispatch] = useReducer(reducer, {});
  const [changingCellsOnOver, setChangingCellsOnOver] = useReducer(changeCellReducer, 0);
  const classes = ["empty", "init", "end", "wall", "searching", "searched", "path"];
  useEffect(() => {
    resetTable();
  }, [])

  useEffect(() => {
    if(start)
    {
      if(table)
      {
        table.bindNodes();
        table.aStar();
      }
    }
  }, [start]);

  function handleStart()
  {
    setStart(true);
  }
  function resetTable(){
    holdingEndNodes.current = false;
    updatedTable.current = {};
    initOrEndEnd.current = {};
    initOrEndStart.current = {};
    newTable.current = {};
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
    myTable.createInit(0, 0);
    myTable.createEnd(7, 7);


    dispatch({type: ACTIONS.CREATE_TABLE, payload: {arr: myTable}});
  }
  function handleMouseDown() 
  {
    setIsMouseDown(true);
  }
  function handleMouseUp() 
  {
    setIsMouseDown(false);
  }
  function reducer(table, action) {
    switch(action.type)
    {
      case ACTIONS.CREATE_TABLE : 
        return action.payload.arr;
  
      case ACTIONS.MODIFY_CELL:
        const { row, column, value } = action.payload;
        if(holdingEndNodes.current){
          initOrEndEnd.current["column"] = column;
          initOrEndEnd.current["row"] = row;
          initOrEndEnd.current["value"] = value;
          if((initOrEndStart.current["value"] === 1 && initOrEndEnd.current["value"] === 2) 
          || (initOrEndStart.current["value"] === 2 && initOrEndEnd.current["value"] === 1))
          {
            updatedTable.current = table["table"].map((rowArray, rowIndex) => {
              if (rowIndex === initOrEndStart.current["row"]) {
                return rowArray.map((node, columnIndex) => {
                  if (columnIndex === initOrEndStart.current["column"]) {
                      const updatedNode = new Node(
                        node.id,
                        initOrEndStart.current["value"],
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
          }else {
            updatedTable.current = table["table"].map((rowArray, rowIndex) => {
              if (rowIndex === initOrEndEnd.current["row"]) {
                  return rowArray.map((node, columnIndex) => {
                    if (columnIndex === initOrEndEnd.current["column"]) {
                        const updatedNode = new Node(
                          node.id,
                          3,
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
          }
        }else{
          updatedTable.current = table["table"].map((rowArray, rowIndex) => {
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
        }
        if(value === 1 || value === 2) {
          if(!holdingEndNodes.current){
            initOrEndEnd.current = {};
            initOrEndStart.current = {};
            initOrEndStart.current["column"] = column;
            initOrEndStart.current["row"] = row;
            initOrEndStart.current["value"] = value;
            holdingEndNodes.current = true;
            updatedTable.current = table["table"].map((rowArray, rowIndex) => {
            if (rowIndex === row) {
                return rowArray.map((node, columnIndex) => {
                  if (columnIndex === column) {
                      const updatedNode = new Node(
                        node.id,
                        0,
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
          }
        }
        
        newTable.current = new Table(updatedTable.current, [], [],
          table["startNode"],
          table["endNode"],
          table["dispatch"])
        if(initOrEndEnd["current"].hasOwnProperty("value")){
          if((initOrEndStart.current["value"] === 1 && initOrEndEnd.current["value"] === 2)
            || initOrEndStart.current["value"] === 2 && initOrEndEnd.current["value"] === 1
          )
          {
            if(initOrEndStart.current["value"] === 1){
              newTable.current.createInit(initOrEndStart.current["row"], initOrEndStart.current["column"]);
            }
            if(initOrEndStart.current["value"] === 2){
              newTable.current.createEnd(initOrEndStart.current["row"], initOrEndStart.current["column"]);
            }
          }else {
            if(initOrEndStart.current["value"] === 1){
              newTable.current.createInit(initOrEndEnd.current["row"], initOrEndEnd.current["column"]);
            }
            if(initOrEndStart.current["value"] === 2){
              newTable.current.createEnd(initOrEndEnd.current["row"], initOrEndEnd.current["column"]);
            }
          }
          initOrEndEnd.current = {};
          initOrEndStart.current = {};
          holdingEndNodes.current = false;
          setNodeIsPressed(false);
          newTable.current.bindNodes();
        }
        return newTable.current;

      case ACTIONS.MODIFY_ALL : 
        return action.payload.arr;
    }
  }
  function handleReset() {
    setStart(false);
    resetTable();
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
                  nodeIsPressed={nodeIsPressed}
                  setChangingCellsOnOver={setChangingCellsOnOver}
                  setNodeIsPressed={(prev) => setNodeIsPressed(!prev)}
                  />)
              })
              })
          )
      }
      </div>
      <div className='starButton' onClick={handleStart}>Start</div>
      <div className='resetButton' onClick={handleReset}>Reset</div>
    </section>
  )
}

export default Board;