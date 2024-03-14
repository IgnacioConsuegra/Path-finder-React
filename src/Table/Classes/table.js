import { breadthFirst } from "../../Algorithms/breadthFirst";
export class Table {
  constructor(table, dispatch) {
    this.table = table;
    this.queue = [];
    this.visited = new Set();
    this.startNode = null;
    this.endNode = null;
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
  printAll() {
    console.log(this.table);
  }
  createInit(x, y) {
    this.table[x][y]["value"] = 1;
    this.table[x][y]["parent"] = true;
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

  heuristic(a, b) {
    return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
  }
  removeFromArray(arr, elt) {
    for (let i = arr.length - 1; i >= 0; i--) {
      if (arr[i] === elt) {
        arr.splice(i, 1);
      }
    }
  }
  async aStar(grid, start, end) {
    const openSet = [];
    const closedSet = [];

    openSet.push(start);

    while (openSet.length > 0) {
      let winner = 0;
      for (let i = 0; i < openSet.length; i++) {
        if (openSet[i].f < openSet[winner].f) {
          winner = i;
        }
      }

      const current = openSet[winner];

      if (current === end) {
        const path = [];
        let temp = current;
        while (temp) {
          path.push(temp);
          temp = temp.previous;
        }
        console.log(path);
        path.map((element) => {
          if (element["value"] === 1 || element["value"] === 2) {
            return [];
          }
          dispatch({
            type: ACTIONS.MODIFY_CELL,
            payload: {
              id: element["id"],
              value: 6,
              column: element["column"],
              row: element["row"],
            },
          });
        });
        return path;
      }

      this.removeFromArray(openSet, current);
      closedSet.push(current);

      const neighbors = current.neighbors[0];
      for (let neigh in neighbors) {
        const neighbor = neighbors[neigh];
        if (neighbor["value"] === 3) {
          continue;
        }
        if (!closedSet.includes(neighbor)) {
          const tempG = current.g + 1;
          let newPath = false;
          if (openSet.includes(neighbor)) {
            if (tempG < neighbor.g) {
              neighbor.g = tempG;
              newPath = true;
            }
          } else {
            neighbor.g = tempG;
            newPath = true;
            openSet.push(neighbor);
            if (neighbor["value"] !== 2) {
              dispatch({
                type: ACTIONS.MODIFY_CELL,
                payload: {
                  id: neighbor["id"],
                  value: 4,
                  column: neighbor["column"],
                  row: neighbor["row"],
                },
              });
              await new Promise((resolve) =>
                setTimeout(() => {
                  dispatch({
                    type: ACTIONS.MODIFY_CELL,
                    payload: {
                      id: neighbor["id"],
                      value: 5,
                      column: neighbor["column"],
                      row: neighbor["row"],
                    },
                  });
                  resolve();
                }, 100)
              );
            }
          }
          if (newPath) {
            neighbor.h = this.heuristic(neighbor, end);
            neighbor.f = neighbor.g + neighbor.h;
            neighbor.previous = current;
          }
        }
      }
    }
    return [];
  }
}

