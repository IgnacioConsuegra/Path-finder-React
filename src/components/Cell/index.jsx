import './index.css'
const index = ({info, myClass}) => {
  const handleClick = () => {
    console.log(info)
  }
  return (
    <div className={`cell ${myClass}`} onClick={handleClick}>
    </div>
  )
}

export default index