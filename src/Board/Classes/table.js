import { breadthFirst } from "../../Algorithms/breadthFirst";
import {aStarSearch} from "../../Algorithms/aStarSearch";
import {myOwn} from '../../Algorithms/myOwn'
export class Table {
  constructor(table, queue = [],
    visited = new Set(), startNode = null,
    endNode = null, dispatch = null) {
    this.table = table;
    this.queue = queue;
    this.visited = visited;
    this.startNode = startNode;
    this.endNode = endNode;
    this.dispatch = dispatch;
  }
  bindNodes() {
    for (let i = 0; i < this.table.length; i++) {
      for (let j = 0; j < this.table[i].length; j++) {
        this.table[i][j]["left"] = j > 0 ? this.table[i][j - 1] : null;
        this.table[i][j]["right"] =
          j < this.table[i].length - 1 ? this.table[i][j + 1] : null;
        this.table[i][j]["top"] = i > 0 ? this.table[i - 1][j] : null;
        this.table[i][j]["bottom"] =
          i < this.table.length - 1 ? this.table[i + 1][j] : null;
        this.table[i][j]["topLeft"] =
          i > 0 && j > 0 ? this.table[i - 1][j - 1] : null;
        this.table[i][j]["topRight"] =
          i > 0 && j < this.table[i].length - 1
            ? this.table[i - 1][j + 1]
            : null;
        this.table[i][j]["bottomLeft"] =
          i < this.table.length - 1 && j > 0 ? this.table[i + 1][j - 1] : null;
        this.table[i][j]["bottomRight"] =
          i < this.table.length - 1 && j < this.table[i].length - 1
            ? this.table[i + 1][j + 1]
            : null;
        this.table[i][j]["neighbors"] = [this.getNeighbors(this.table[i][j])];
      }
    }
  }
  updateTable(arr) {
    this.table  = arr;
  }
  printAll() {
    console.log(this.table);
  }
  createInit(x, y) {
    this.table[x][y]["value"] = 1;
    this.table[x][y]["parent"] = true;
    this.table[x][y]["minDistance"] = 0;
    this.startNode = this.table[x][y];
    return this.startNode;
  }
  createEnd(x, y) {
    this.table[x][y]["value"] = 2;
    this.endNode = this.table[x][y];
    return this.endNode;
  }
  createWall(x, y) {
    this.table[x][y]["value"] = 3;
    this.table[x][y]["obstacle"] = true;
  }
  getNode(x, y) {
    return this.table[x][y];
  }
  getNeighbors(node) {
    const {
      id,
      neighbors,
      previous,
      value,
      row,
      column,
      g,
      f,
      h,
      obstacle,
      parent,
      position,
      minDistance,
      ...rest
    } = node;
    const filteredNeighbors = {};
    for (const key in rest) {
      if (rest[key] !== null) {
        filteredNeighbors[key] = rest[key];
      }
    }

    return filteredNeighbors;
  }

  async bfs() 
  {
    breadthFirst(this.startNode, this.endNode, this.dispatch, this.getNeighbors)
  }

  async aStar()
  {
    aStarSearch(this.startNode, this.endNode, this.dispatch);
  }
  async myOwn()
  {
    myOwn(this.startNode, this.endNode, this.dispatch);
  }
  
}

