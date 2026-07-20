# js实现类的继承

```

var Class = {
    extend:function({initialize,members,protos}){

           

            var _this = this;
            // _this.f = _this.prototype.deepClone;
            var newClass = function(options){ 
                   
                     
                    //---每个类的实例成员都要继承下来(members) ---
                    //如果只继承一层 注释掉该部分即可
                    if(_this.prototype.isFun(_this)){ 

                        var t = new _this();
                        // var o = {};
                        // for(var i in t){
                        //     if(t.hasOwnProperty(i)){ 
                        //         o[i] = t[i];
                        //     }
                        // }
                        // var newO = _this.prototype.deepClone(o);
                        // for(var i in newO){ 
                        //     this[i] = newO[i];
                        // }

                        for(var i in t){
                            if(t.hasOwnProperty(i)){ 
                                this[i] = _this.prototype.deepClone(t[i]);
                            }
                        }


                    }
                    //--------end-----------


                    //实例成员 
                    // var newMember = _this.prototype.deepClone(members); 
                    // for(var i in newMember){ 
                    //     this[i] = newMember[i];
                    // }

                    for(var i in members){
                        if(members.hasOwnProperty(i)){
                            this[i] = _this.prototype.deepClone(members[i]);
                        }
                    }
                 
                    //实例化时的参数对象也并到实例成员中
                    var options = options||{};
                    if(_this.prototype.isObj(options)){
                        for(var i in options){
                            if(this[i] && _this.prototype.isObj(this[i])){
                                this[i] = {
                                    ...this[i],
                                    ..._this.prototype.deepClone(options[i])
                                }
                            }else{
                                this[i] = options[i];   
                            }
                        }
                    }
 

                //执行初始化方法
                initialize && initialize.call(this);
                

                // this.extend = _this.extend;
            }
            newClass.extend = _this.extend

            //原型继承
            newClass.prototype = {
                ..._this.prototype,
                ...protos||{}
            };
            newClass.prototype.constructor = newClass;
            return newClass; 
    },
    prototype:{
        class_f:function(){

        },
        isObj:function(o) {
		    return Object.prototype.toString.call(o) === '[object Object]';
		},
		isFun:function(o) {
		    return Object.prototype.toString.call(o) === '[object Function]';
		},
		isArr:function(o) {
		    return Object.prototype.toString.call(o) === '[object Array]';
		},
		isNum:function(o) {
		    return Object.prototype.toString.call(o) === '[object Number]';
		},
		isBool:function(o) {
		    return Object.prototype.toString.call(o) === '[object Boolean]';
		},
		isStr:function(o) {
		    return Object.prototype.toString.call(o) === '[object String]';
		},
        deepClone:function(obj) {
            var f = obj=>{
                if (obj === null || typeof obj !== 'object') {
                    return obj;
                }
            
                if (obj instanceof Date) {
                    return new Date(obj.getTime());
                }

                if (obj instanceof RegExp) return new RegExp(obj.source, obj.flags);
            
                if (obj instanceof Array) {
                    return obj.reduce((arr, item, i) => {
                        arr[i] = f(item);  


                        return arr;
                    }, []);
                }
            
                if (obj instanceof Object) {
                    return Object.keys(obj).reduce((newObj, key) => {
                        newObj[key] = f(obj[key]);  


                        return newObj;
                    }, {});
                }
            }

            return f(obj);
           
        }
    }
}

var A = Class.extend({
    members:{
       a1:1,
       eventContainer:{
           'click':[],
           'aa':'a'
       }
    },
    initialize:function(){ 
      
    },
    protos:{ 
       a_f:function(){
           console.log('a_f');
       }
    }
}) 
console.log('A');
console.log(new A());

var B = A.extend({
    members:{
        b1:1,
        eventContainer:{
            'click':[],
            'bb':'b'
        }
    },
    initialize:function(){

    },
    protos:{

    }
})

 var b1 = new B();
 console.log('b1')
 console.log(b1);

```
