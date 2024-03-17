const ignore = document.getElementById("main");
const ignore2 = document.getElementById("table");

const toMove = [];
const divDimensions = [];

export function dragAndDrop(event){
  if(event.target === ignore){
    return -1;
  }
  if(event.target === ignore2){
    return -1;
  }
  createDiv(event.target);
  document.addEventListener("mousemove", handleMouseMove);
}
function createDiv(e) {
  const newDiv = document.createElement("div");
  newDiv.style.width = e.offsetWidth + "px";
  newDiv.style.height = e.offsetHeight + "px";
  newDiv.style.position = "absolute";
  newDiv.id = "movingSquare";
  const color = window.getComputedStyle(e).backgroundColor;
  newDiv.style.backgroundColor = color;
  divDimensions.push(e.offsetWidth);
  divDimensions.push(e.offsetHeight);
  toMove.push(newDiv);
  document.body.appendChild(newDiv);
}


export function removeDiv() {
  const square = document.getElementById("movingSquare");
  if(square)
  {
  document.body.removeChild(square);
  }
  while(toMove.length > 0){
    toMove.pop()
  }
}


function handleMouseMove(event) {
  const mouseX = event.clientX;
  const mouseY = event.clientY;
  toMove[0].style.left = `${mouseX - (divDimensions[0] / 2)}px`;
  toMove[0].style.top = `${mouseY - (divDimensions[1] / 2)}px`;
}

