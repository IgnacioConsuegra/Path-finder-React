import './Cell.css';
import { ACTIONS } from '../boar/Board';
import { dragAndDrop, removeDiv } from '../utils/dragAndDrop';
function Cell({info, myClass, dispatch, 
  handleMouseDown, isMouseDown, mouseUp, changingCellsOnOver, 
  nodeIsPressed, setNodeIsPressed,
  setChangingCellsOnOver,}){


  const handleMouseOver = () => 
  {
    if(isMouseDown)
    {
      
      let newValue = 0;
      if(changingCellsOnOver === 0) 
      {
        newValue = 3;
      }
      if(changingCellsOnOver === 3) 
      {
        newValue = 0;
      }
      if(info["value"] === 2)
      {
        return 1;
      }
      if(info["value"] === 1)
      {
        return 1;
      }
      dispatch({
        type: ACTIONS.MODIFY_CELL,
        payload: {
          value: newValue,
          column: info["column"],
          row: info["row"],
        },
      });
    }
  }
  const handleThisMouseDown = () => 
  {
    if(info["value"] === 1 || info["value"] === 2)
    {
      return;
    }

    if(!nodeIsPressed){
      setChangingCellsOnOver(
        {
          type: ACTIONS.UPDATE_SINGLE,
          payload: 
          {
            value: info["value"],
          }
        }
      )
      handleMouseDown();
      handleMouseOver();
      
      let toWhite = info["value"] === 0 ? 3 : 0;
      dispatch({
        type: ACTIONS.MODIFY_CELL,
        payload: {
          value: toWhite,
          column: info["column"],
          row: info["row"],
        },
      });
    }
  }
  const handleMouseUp = () => 
  {
    mouseUp();
  }
  const handleClick = (e) => {
    if(info["value"] === 1 || info["value"] === 2)
    {
      if(!nodeIsPressed){
        dragAndDrop(e);
        dispatch({
          type: ACTIONS.MODIFY_CELL,
          payload: {
            value: info["value"],
            column: info["column"],
            row: info["row"], 
          },
        });
      setNodeIsPressed();
      }else{
        removeDiv();
        dispatch({
          type: ACTIONS.MODIFY_CELL,
          payload: {
            value: info["value"],
            column: info["column"],
            row: info["row"], 
          },
        });
      }
      setNodeIsPressed();
    }
    //This wont change an empty or an wall cell, all this handle click,
    //is used to move ours end and init nodes.
    else{
      dispatch({
        type: ACTIONS.MODIFY_CELL,
        payload: {
          value: info["value"],
          column: info["column"],
          row: info["row"],
        },
      });
      if(nodeIsPressed){
        removeDiv();
      }
    }
  }
  return (
    <div
    onMouseOver={handleMouseOver}
    onMouseDown={handleThisMouseDown}
    onMouseUp={handleMouseUp}
    onClick={handleClick}
    id={`${info["row"]}${info["column"]}`}
    className={`cell ${myClass}`}>
    </div>
  )
}

export default Cell;