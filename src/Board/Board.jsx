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
  const holdingEndNodes = useRef();
  const updatedTable = useRef();
  const initOrEndEnd = useRef();
  const initOrEndStart = useRef();
  const newTable = useRef();
  const [nodeIsPressed, setNodeIsPressed] = useState(false);
  const [table, dispatch] = useReducer(reducer, {});
  const [changingCellsOnOver, setChangingCellsOnOver] = useReducer(changeCellReducer, 0);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [start, setStart] = useState(false);
  const classes = ["empty", "init", "end", "wall", "searching", "searched", "path"];
  useEffect(() => {
    holdingEndNodes.current = false;
    initOrEndEnd.current = {};
    initOrEndStart.current = {};
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
      if(table)
      {
        console.log(table)
        table.bindNodes();
        table.aStar();
      }
    }
  }, [start]);

  useEffect(() => {
  }, [isMouseDown, changingCellsOnOver])

  useEffect(() => {
  }, [changingCellsOnOver])
  useEffect(() => 
  {
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
  function reducer(table, action) {
    switch(action.type)
    {
      case ACTIONS.CREATE_TABLE : 
        return action.payload.arr;
  
      case ACTIONS.MODIFY_CELL:
        // eslint-disable-next-line no-case-declarations
        console.log("Init")
        const { row, column, value } = action.payload;
          // eslint-disable-next-line no-case-declarations
        if(holdingEndNodes.current){
          console.log("Holding end nodes true")
          initOrEndEnd.current["column"] = column;
          initOrEndEnd.current["row"] = row;
          initOrEndEnd.current["value"] = value;
          console.log(initOrEndStart.current, initOrEndEnd.current)
          if((initOrEndStart.current["value"] === 1 && initOrEndEnd.current["value"] === 2) 
          || (initOrEndStart.current["value"] === 2 && initOrEndEnd.current["value"] === 1))
          {
            console.log("We selected two end nodes")
            updatedTable.current = table["table"].map((rowArray, rowIndex) => {
              if (rowIndex === initOrEndStart.current["row"]) {
                console.log("Same row : ", rowIndex, rowArray)
                return rowArray.map((node, columnIndex) => {
                  if (columnIndex === initOrEndStart.current["column"]) {
                    console.log("Same column : ", columnIndex, node)
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
            console.log("MY this updated.current")
            console.log(updatedTable.current);
          }else {
            console.log("They are not equal");
            console.log(initOrEndEnd.current)
            console.log(initOrEndStart.current)
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
          console.log()
          console.log("___________________________");
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
          console.log("Clicked on node")
          if(!holdingEndNodes.current){
            console.log("Holding a node")
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
          console.log("We have and end");
          console.log(initOrEndStart.current)
          console.log(initOrEndEnd.current)
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
          console.log("MY new table ");
          console.log(newTable.current);
          newTable.current.bindNodes();
        }
        return newTable.current;
  
      case ACTIONS.TEST:
  
        return table;
        
      case ACTIONS.MODIFY_ALL : 
        return action.payload.arr;
    }
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
                  nodeIsPressed={nodeIsPressed}
                  setNodeIsPressed={(prev) => setNodeIsPressed(!prev)}
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