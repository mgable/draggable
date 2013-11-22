/*jslint ass: true, plusplus: true, indent: 2 */
/*global document, window */
(function (which) {
  "use strict";
  var items = document.getElementsByClassName(which),
    selectWidget = document.getElementById("borderSize"),
    borderWidth = selectWidget.value,
    i,
    limit,
    console = window.console || { },
    // object which maps border colors to status messages
    colors = { "dormant": "black", "dragging": "black", "respecting": "red", "selected": "black" };
  //
  function mouseDown(e) {
    var el = e.currentTarget || e.srcElement, collisionObj, currentCollisionObj,
      evt = e || window.event,
      startX = evt.clientX + window.pageXOffset - el.offsetLeft,
      startY = evt.clientY + window.pageYOffset - el.offsetTop,
      statusDiv = el.getElementsByClassName("status")[0];
    //
    function setStatus(status, obj) {
      console.log("Item " + el.id + " is being " + status);
      statusDiv.innerHTML = status;
      el.style.borderColor = colors[status];
      if (obj) {
        obj.style.borderColor = colors[status];
        currentCollisionObj = obj;
      } else if (currentCollisionObj) {
        currentCollisionObj.style.borderColor = colors[status];
        currentCollisionObj = null;
      }
    }
    //
    function setZindex(obj, idx) {
      obj.style.zIndex = idx;
    }
    //
    function isCollide(a, b) {
      return !(
        ((a.y + a.height) < (b.y)) ||
          (a.y > (b.y + b.height)) ||
          ((a.x + a.width) < b.x) ||
          (a.x > (b.x + b.width))
      );
    }
    //
    function makeCollideObj(which) {
      return {
        x: which.offsetLeft,
        y: which.offsetTop,
        width: which.clientWidth,
        height: which.clientHeight
      };
    }
    //
    function collisionCheck(which) {
      for (i = 0, limit = items.length; i < limit; i++) {
        if (which.id !== items[i].id) {
          if (isCollide(which, makeCollideObj(items[i]))) {
            return items[i];
          }
        }
      }
      return false;
    }
    //
    function mouseMove(e) {
      var innerX, innerY;
      innerX = e.clientX + window.pageXOffset - startX;
      innerY = e.clientY + window.pageYOffset - startY;
      /* create an object which contains the parameters of where you want to move the item. Test that for collision and if it 
      passes then move the actual item. Boundary width is correct here. collisionObj holds the object the current dragging item 
      has collided with */
      if ((collisionObj = collisionCheck({ x: innerX - borderWidth, y: innerY - borderWidth, width: (el.clientWidth + (borderWidth * 2)), height: (el.clientHeight + (borderWidth * 2)), id: el.id })) !== false) {
        setStatus("respecting", collisionObj);
      } else {
        el.style.left = innerX + "px";
        el.style.top = innerY  + "px";
        setStatus("dragging");
      }
    }
    window.addEventListener("mousemove", mouseMove, false);
    window.addEventListener("mouseup", function () { window.removeEventListener("mousemove", mouseMove, false); setZindex(el, 1); setStatus("dormant"); }, false);
    setStatus("selected");
    setZindex(el, 10);
  }
  //this is the initalization function
  (function addEventListeners() {
    // adding event listeners to items <div>'s'
    for (i = 0, limit = items.length; i < limit; i++) {
      items[i].addEventListener("mousedown", mouseDown, false);
    }
    // adding event listener to select widget
    function onChange(which) {
      borderWidth = which.value;
      for (i = 0, limit = items.length; i < limit; i++) {
        items[i].style.border = borderWidth + "px dashed black";
      }
    }
    selectWidget.onchange = function () { onChange(this); };
  }()); // immediately invoked
}("movable"));