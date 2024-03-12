import './index.css'
const index = ({url, info, update}) => {
  const handleClick = () => {
    console.log(info)
  }
  return (
    <div className='cell' onClick={handleClick}>
      {
        url && ( <img src={url} alt="Chess piece" />)
      }
      {/* <p>
        Row:{info.row}
        <br />
        Column:{info.column}
        <br />
        Piece:{info.piece}
      </p> */}
    </div>
  )
}

export default index