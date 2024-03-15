import { ACTIONS } from "../Board/Board";
export async function aStarSearch(start, end, dispatch) 
{
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

    removeFromArray(openSet, current);
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
          if (neighbor["value"] !== 2) 
          {
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
          neighbor.h = heuristic(neighbor, end);
          neighbor.f = neighbor.g + neighbor.h;
          neighbor.previous = current;
        }
      }
    }
  }
  return [];
}
function heuristic(a, b) 
{
  return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
}
function removeFromArray(arr, elt) 
{
  for (let i = arr.length - 1; i >= 0; i--) {
    if (arr[i] === elt) {
      arr.splice(i, 1);
    }
  }
}