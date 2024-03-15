import './index.css';
import { ACTIONS } from '../../Board/Board';
const index = ({info, myClass, dispatch, handleMouseDown, isMouseDown, changingCellsOnOver, setChangingCellsOnOver,}) => {


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
  }
  return (
    <div
    onMouseOver={handleMouseOver}
    onMouseDown={handleThisMouseDown}
    className={`cell ${myClass}`}>
    </div>
  )
}

export default index