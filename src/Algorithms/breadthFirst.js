import { ACTIONS } from "../Table/Board";
export async function breadthFirst(startNode, endNode, dispatch, getNeighbors) 
{
  const queue = [];
  const visited = new Set();

  if (startNode && endNode) 
  {
    queue.push(startNode);
    let counter = 0;

    while (queue.length > 0 && counter < 100) 
    {
      let currentNode = queue.shift();
      let neighbors = getNeighbors(currentNode);
      for (let neighbor in neighbors) 
      {
        let myNeighbor = neighbors[neighbor];
        if (myNeighbor === endNode) 
        {
          console.log("Found")
          return;
        }
        if (myNeighbor["value"] === 3) {
          continue;
        }
        if (myNeighbor === startNode) {
          continue;
        }
        if (!visited.has(myNeighbor)) 
        {
          if (myNeighbor["value"] !== 2) 
          {
            dispatch({
              type: ACTIONS.MODIFY_CELL,
              payload: {
                id: myNeighbor["id"],
                value: 4,
                column: myNeighbor["column"],
                row: myNeighbor["row"],
              },
            });
            await new Promise((resolve) =>
              setTimeout(() => {
                dispatch({
                  type: ACTIONS.MODIFY_CELL,
                  payload: {
                    id: myNeighbor["id"],
                    value: 5,
                    column: myNeighbor["column"],
                    row: myNeighbor["row"],
                  },
                });
                resolve();
              }, 100)
            );
          }
          queue.push(myNeighbor);
          visited.add(myNeighbor);
        }
        
      }
      counter++;
    }
  }
}