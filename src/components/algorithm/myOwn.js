import { ACTIONS } from "../boar/Board";
export async function myOwn(start, end, dispatch) 
{
  const toVisit = [];
  const distance = 1;
  let counter = 0;
  const limitIterations = 1000;
  toVisit.push(start);
  while (toVisit.length > 0 && counter < limitIterations) 
  {
    const current = toVisit[0];
    const currentNeighbors = current["neighbors"];
    for(let neighbor in currentNeighbors[0])
    {
      const nodeNeighbor = currentNeighbors[0][neighbor];
      if(nodeNeighbor["value"] === 3)
      {
        continue;
      }
      if(nodeNeighbor === start)
      {
        continue;
      }
    
      if((current["minDistance"] + distance) < nodeNeighbor["minDistance"])
      {
        nodeNeighbor["minDistance"] = current["minDistance"] + distance;
        nodeNeighbor["previous"] = current;
        toVisit.push(nodeNeighbor);
      }
      if(nodeNeighbor === end)
      {
        continue
      }
      dispatch({
        type: ACTIONS.MODIFY_CELL,
        payload: {
          id: nodeNeighbor["id"],
          value: 4,
          column: nodeNeighbor["column"],
          row: nodeNeighbor["row"],
        },
      });
  
      await new Promise((resolve) => 
        setTimeout(() => 
        {
          dispatch({
            type: ACTIONS.MODIFY_CELL,
            payload: {
              id: nodeNeighbor["id"],
              value: 5,
              column: nodeNeighbor["column"],
              row: nodeNeighbor["row"],
            },
          });
          resolve();
        }, 100)
      )
    }
    toVisit.shift();
    counter++;
  
  }
  const path = [];
  const endPath = [];
  endPath.push(end);
  while(endPath[0]["previous"] !== null)
  {
    path.push(endPath[0]["previous"]);
    endPath.push(endPath[0]["previous"]);
    endPath.shift();
  }
  path.pop();
  console.log(path);
  path.reverse();
  for(let i = 0; i < path.length; i++) 
  {
    dispatch({
      type: ACTIONS.MODIFY_CELL,
      payload: {
        id: path[i]["id"],
        value: 6,
        column: path[i]["column"],
        row: path[i]["row"],
      },
    });

  
  }
  console.log(path);

}