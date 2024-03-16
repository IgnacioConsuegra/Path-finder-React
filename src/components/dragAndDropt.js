const ignore = document.getElementById("main");
const ignore2 = document.getElementById("table");

const toMove = [];
const divDimensions = [];
let newObject = true;
let firstTime = true;
function handleThisClick()
{
  if(firstTime)
  {
    firstTime = false;
    return ; 
  }
  newObject = true;
  removeDiv();
  toMove.pop();
  divDimensions.pop();
  divDimensions.pop();
  document.removeEventListener("click", handleThisClick);
  document.removeEventListener("mousemove", handleMouseMove);
  firstTime = true;
}
export function dragAndDrop(event){
  if(event.target === ignore){
    return -1;
  }
  if(event.target === ignore2){
    return -1;
  }
  if(newObject)
  {
    createDiv(event.target);
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("click", handleThisClick);
  }
}
function createDiv(e) {
  const newDiv = document.createElement("div");
  newDiv.style.width = e.offsetWidth + "px";
  newDiv.style.height = e.offsetHeight + "px";
  newDiv.style.position = "absolute";
  const color = window.getComputedStyle(e).backgroundColor;
  newDiv.style.backgroundColor = color;
  divDimensions.push(e.offsetWidth);
  divDimensions.push(e.offsetHeight);
  toMove.push(newDiv);
  document.body.appendChild(newDiv);
}


function removeDiv() {
  const lastDiv = toMove[0];
  if (lastDiv) {
    lastDiv.remove();
  }
}


export function handleMouseMove(event) {
  const mouseX = event.clientX;
  const mouseY = event.clientY;
  toMove[0].style.left = `${mouseX - (divDimensions[0] / 2)}px`;
  toMove[0].style.top = `${mouseY - (divDimensions[1] / 2)}px`;
}

