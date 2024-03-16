import './index.css';
import { ACTIONS } from '../../Board/Board';
import { dragAndDrop } from '../dragAndDropt';
const index = ({info, myClass, dispatch, handleMouseDown, isMouseDown, mouseUp, changingCellsOnOver, setChangingCellsOnOver,}) => {


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
    setChangingCellsOnOver(
      {
        type: ACTIONS.UPDATE_SINGLE,
        payload: 
        {
          value: info["value"],
        }
      }
    )
    if(info["value"] === 2)
    {
      return ;
    }
    if(info["value"] === 1)
    {
      return ;
    }
    handleMouseDown();
    handleMouseOver();
    
    let newValue = info["value"] === 0 ? 3 : 0;
    dispatch({
      type: ACTIONS.MODIFY_CELL,
      payload: {
        value: newValue,
        column: info["column"],
        row: info["row"],
      },
    });
  }
  const handleMouseUp = () => 
  {
    mouseUp();
  }
  const handleClick = (e) => {
    if(info["value"] == 1 || 2)
    {
      dragAndDrop(e);
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

export default index