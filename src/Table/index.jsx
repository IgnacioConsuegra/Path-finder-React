import { useEffect, useReducer, useRef, useState } from 'react';
import Cell from '../components/Cell';
import Peon from '../assets/peon.png';
import './index.css'

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



const Table = () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [cells, dispatch] = useReducer(reducer, [[], []]);
  const [reRender, setReRender] = useState(1);
  const breathJustOnce = useRef();

  const classes = ["empty", "init", "end", "wall", "searching"];
  // eslint-disable-next-line react-hooks/r~ules-of-hooks
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
    class Node
    {
      constructor(id = 0, value = 0, row = null, column = null, left = null, right = null, top = null, bottom = null, topLeft = null, topRight = null, bottomLeft = null, bottomRight = null)
      {
        this.id = id;
        this.value = value;
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
    table.map((e) => 
    {
      myArrNodes.push(
        e.map((element, index) => 
        {
          return new Node(`${element.row}${element.column}`, 0, element.row, element.column);
        })
      )
    })

    class Table
    {
      constructor(table)
      {
        this.table = table;
        this.queue = [];
        this.visited = new Set();
        this.startNode = null;
        this.endNode = null;
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
      createInit(x, y)
      {
        this.table[x][y]['value'] = 1;
        this.startNode = this.table[x][y];
      }
      createEnd(x, y)
      {
        this.table[x][y]['value'] = 2;
        this.endNode = this.table[x][y];
      }
      createWall(x, y)
      {
        this.table[x][y]['value'] = 3;
      }
      getNode(x, y)
      {
        return this.table[x][y];
      }
      getNeighbors(node)
      {
        const { id, value, row, column, ...rest } = node;
        const filteredNeighbors = {};
      
        for (const key in rest) {
          if (rest[key] !== null) {
            filteredNeighbors[key] = rest[key];
          }
        }
      
        return filteredNeighbors;
      }
      moveNodeToLeft(x, y)
      {
        const node = this.getNode(x, y);
        if(node['left'])
        {
          node['left'].value = 4;
        }
      }

      async bfs()
      {
        let startNode = this.startNode;
        let endNode = this.endNode;
        if(startNode && endNode)
        {
          this.queue.push(startNode);
          this.visited.add(startNode);
          while(this.queue.length > 0)
          {
            let currentNode = this.queue.shift();
            let neighbors = this.getNeighbors(currentNode);
            
            for(let neighbor in neighbors)
            {
              let myNeighbor = neighbors[neighbor];
              if(myNeighbor === this.endNode)
              {
                while(this.queue.length > 0)
                {
                  this.queue.pop();
                }
                break;
              }
              if(myNeighbor["value"] === 3)
              {
                continue;
              }
              if (!this.visited.has(myNeighbor) && myNeighbor !== null) {
                await new Promise(resolve => setTimeout(resolve, 1000)); 
                this.queue.push(myNeighbor);
                this.visited.add(myNeighbor);
                myNeighbor["value"] = 4;
                
              }
              if(myNeighbor === this.startNode)
              {
                continue;
              }
              dispatch({type: ACTIONS.MODIFY_CELL,
                payload: {id: myNeighbor["id"], value: 4, column: myNeighbor["column"], row: myNeighbor["row"]}})
            }
            
          }
        }
      }
    }
    const myTable = new Table(myArrNodes);
    myTable.bindNodes();
    myTable.createInit(5, 5);
    myTable.createEnd(1, 2);
    // myTable.createWall(5, 3);
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
        }, 3 * 1000)
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

export default Table;