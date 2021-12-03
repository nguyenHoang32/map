import { useEffect, useState } from "react";

import Two from "two.js";
import "./App.css";
import ZUI from "two.js/extras/jsm/zui.js";
const uid = function () {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

const list = [[{
  name: "1",
  id: uid(),
},
{
  name: "2",
  id: uid(),
},
{
  name: "3",
  id: uid(),
}
],
[
  {
    name: "4",
    id: uid(),
  },
  {
    name: "5",
    id: uid(),
  },
  {
    name: "6",
    id: uid(),
  },
],
[{
  name: "7",
  id: uid(),
},
{
  name: "8",
  id: uid(),
},
{
  name: "9",
  id: uid(),
},]
];
console.log(list);
function App() {
  // const [id, setId] = useState(null);
  const [info, setInfo] = useState({});

  // ----------------------------------------
  useEffect(() => {
    const two = new Two({
      // type: Two.Types.canvas,
      // type: Two.Types.svg,
      fullscreen: true,
      autostart: true,
    }).appendTo(document.body);
    const zui = new ZUI(two.scene);
    zui.addLimits(0.06, 8);
    var stage = new Two.Group();
    const size = 50;
    for (let i = 0; i <= 2; i++) {
      // y
      // let shape;
      for (let j = 0; j <= 2; j++) {
        // x
        var x = size * j - size / 2;
        var y = size * i - size / 2;
        var shape = new Two.Rectangle(x, y, size, size);
        shape.noStroke().fill = "green";
        shape.id = list[i][j]["id"];
        shape.stroke = "black";
        stage.add(shape);
      }
    }
    two.add(stage);
    two.update();

    var domElement = two.renderer.domElement;
    var mouse = new Two.Vector();
    var touches = {};
    var distance = 0;
    var dragging = false;
    addZUI();
  function addZUI() {
    domElement.addEventListener("mousedown", mousedown, false);
    domElement.addEventListener("mousewheel", mousewheel, false);
    domElement.addEventListener("wheel", mousewheel, false);

    // domElement.addEventListener('touchstart', touchstart, false);
    // domElement.addEventListener('touchmove', touchmove, false);
    // domElement.addEventListener('touchend', touchend, false);
    // domElement.addEventListener('touchcancel', touchend, false);

    function mousedown(e) {
      // console.log(e.srcElement.getAttribute('style'));
      // if(e.srcElement.getAttribute('style') && e.target.localName === "path"){
      //   console.log(1);
      //   e.srcElement.removeAttribute('style');
      // }
      // else if(e.target.localName === "path"){
      //   console.log(2);
      //   e.srcElement.setAttribute('style', 'fill: green');
      // }
      // else{
      //   console.log(3)
      // }
      // console.log(e.srcElement.id)
      let path = document.querySelectorAll("path");
      path.forEach((path) => path.removeAttribute("style"));

      if (e.target.localName === "path") {
        console.log(e.srcElement.id);
        e.srcElement.setAttribute("style", "fill: pink");
        let obj;
        for(let i = 0; i <= 2; i++ ){
          for(let j = 0; j <= 2; j++){
            if(list[i][j]["id"] === e.srcElement.id){
              obj = list[i][j];
            }
          }
        }
        // const obj = list.filter((obj) => obj.id === e.srcElement.id)[0];
        // info = obj;
        setInfo(obj);
      }
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      // var rect = shape.getBoundingClientRect();
      // dragging =
      //   mouse.x > rect.left &&
      //   mouse.x < rect.right &&
      //   mouse.y > rect.top &&
      //   mouse.y < rect.bottom;
      window.addEventListener("mousemove", mousemove, false);
      window.addEventListener("mouseup", mouseup, false);
    }
  }

    // -------------

    function mousemove(e) {
      var dx = e.clientX - mouse.x;
      var dy = e.clientY - mouse.y;
      // if (dragging) {
      //   shape.position.x += dx / zui.scale;
      //   shape.position.y += dy / zui.scale;
      // } else {
      //   zui.translateSurface(dx, dy);
      // }
      zui.translateSurface(dx, dy);
      mouse.set(e.clientX, e.clientY);
    }

    function mouseup(e) {
      window.removeEventListener("mousemove", mousemove, false);
      window.removeEventListener("mouseup", mouseup, false);
    }

    function mousewheel(e) {
      var dy = (e.wheelDeltaY || -e.deltaY) / 1000;
      zui.zoomBy(dy, e.clientX, e.clientY);
    }

    function touchstart(e) {
      switch (e.touches.length) {
        case 2:
          pinchstart(e);
          break;
        case 1:
          panstart(e);
          break;
      }
    }

    function touchmove(e) {
      switch (e.touches.length) {
        case 2:
          pinchmove(e);
          break;
        case 1:
          panmove(e);
          break;
      }
    }

    function touchend(e) {
      touches = {};
      var touch = e.touches[0];
      if (touch) {
        // Pass through for panning after pinching
        mouse.x = touch.clientX;
        mouse.y = touch.clientY;
      }
    }

    function panstart(e) {
      var touch = e.touches[0];
      mouse.x = touch.clientX;
      mouse.y = touch.clientY;
    }

    function panmove(e) {
      var touch = e.touches[0];
      var dx = touch.clientX - mouse.x;
      var dy = touch.clientY - mouse.y;
      zui.translateSurface(dx, dy);
      mouse.set(touch.clientX, touch.clientY);
    }

    function pinchstart(e) {
      for (var i = 0; i < e.touches.length; i++) {
        var touch = e.touches[i];
        touches[touch.identifier] = touch;
      }
      var a = touches[0];
      var b = touches[1];
      var dx = b.clientX - a.clientX;
      var dy = b.clientY - a.clientY;
      distance = Math.sqrt(dx * dx + dy * dy);
      mouse.x = dx / 2 + a.clientX;
      mouse.y = dy / 2 + a.clientY;
    }

    function pinchmove(e) {
      for (var i = 0; i < e.touches.length; i++) {
        var touch = e.touches[i];
        touches[touch.identifier] = touch;
      }
      var a = touches[0];
      var b = touches[1];
      var dx = b.clientX - a.clientX;
      var dy = b.clientY - a.clientY;
      var d = Math.sqrt(dx * dx + dy * dy);
      var delta = d - distance;
      zui.zoomBy(delta / 250, mouse.x, mouse.y);
      distance = d;
    }
  }, []);

  // -----------------------------------------------
  // ------------------------------------------

  
  
  return (
    <div>
      {info && (
        <div className="info">
          <h1>{info.name}</h1>
          <h2>{info.id}</h2>
        </div>
      )}
    </div>
  );
}

export default App;
