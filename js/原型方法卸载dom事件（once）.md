# 原型方法卸载dom事件

> 实现once的原理

```
<button id="a">A</button>

<button id="b">去掉事件</button>
```



```
var addEvent = function(target, eventType, handle) {
     if (target.addEventListener) { 
          target.addEventListener(eventType, handle, false); 
      } else { 
          target.attachEvent("on" + eventType, function () {
            handle.call(target, arguments);
          }); 
      }
};
var removeEvent = function(target, eventType, handle) {
    if (target.removeEventListener) {                   // // 所有浏览器，除了 IE 8 及更早IE版本
        target.removeEventListener(eventType, handle,false);
    } else if (target.detachEvent) {                   // IE 8 及更早IE版本
        target.detachEvent("on"+eventType, handle);
    }
}
var f = function(){
    console.log('ddd')

    removeEvent(document.getElementById('a'),'click',f)
}

var A = function(){ 
    this.init();
}
A.prototype.remove = function(){
    console.log('fff')
    this.removeEvent(document.getElementById('a'),'click',this.f)

}
A.prototype.f = function(){
     console.log('ddd') 
     console.log(this instanceof A);
// this.removeEvent(document.getElementById('a'),'click',this.f.bind(this))

//document.getElementById('a').removeEventListener('click',this.f,false)

}
A.prototype.init = function(){
    this.f = this.f.bind(this);
//   this.addEvent(document.getElementById('a'),'click',this.f.bind(this))
  document.getElementById('a').addEventListener('click',this.f,false)
}
A.prototype.addEvent = function(target, eventType, handle) {
     if (target.addEventListener) { 
          target.addEventListener(eventType, handle, false); 
      } else { 
          target.attachEvent("on" + eventType, function () {
            handle.call(target, arguments);
          }); 
      }
};
A.prototype.removeEvent = function(target, eventType, handle) {
    if (target.removeEventListener) {                   // // 所有浏览器，除了 IE 8 及更早IE版本
        target.removeEventListener(eventType, handle,false);
    } else if (target.detachEvent) {                   // IE 8 及更早IE版本
        target.detachEvent("on"+eventType, handle);
    }
}

var a= new A();  
//addEvent(document.getElementById('a'),'click',f)

addEvent(document.getElementById('b'),'click',function(){
    a.remove();
    // removeEvent(document.getElementById('a'),'click',f)
})
```
