import './index.css';
import { ACTIONS } from '../../Board/Board';
const index = ({info, handleInit, myClass, dispatch, handleMouseDown, isMouseDown, mouseUp, changingCellsOnOver, setChangingCellsOnOver,}) => {


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
        handleInit();
      }
      if(info["value"] === 1)
      {
        handleInit();
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
    handleMouseDown();
    handleMouseOver();
    if(info["value"] === 2)
    {
      handleInit();
    }
    if(info["value"] === 1)
    {
      handleInit();
    }
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
  return (
    <div
    onMouseOver={handleMouseOver}
    onMouseDown={handleThisMouseDown}
    onMouseUp={handleMouseUp}
    className={`cell ${myClass}`}>
    </div>
  )
}

export default index