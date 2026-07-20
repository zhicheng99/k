# promise暂停 继续

```
var queue = function(arr) {
    // 串行执行promise 构建队列 
    var res=[];
    var sequence = Promise.resolve();
    arr.forEach(function (item) {
        sequence = sequence.then(item).then(data=>{
                res.push(data);
                return res
        }).catch(data=>{
            //有reject也返回
            res.push(data);
            return res;
        })
    })

    return sequence 
}

var isPaused =  false;    // 暂停状态标识
var pausePromise = null; // 暂停时的Promise占位符
var pauseResolve = null; // 恢复执行的触发器

function pause() {
    return new Promise(resolve => {
        if(!isPaused){
            resolve()
        }else{
           const interval = setInterval(() => {
                if (!isPaused) {
                    clearInterval(interval);
                    resolve();
                }
            }, 10); // 检查频率为100ms 
        }
        
    });
}

var t = [

    _=>{
        return new Promise((resolve,reject)=>{
            // 执行前检查暂停状态
            pause().then(_=>{
                setTimeout(_=>{
                    console.log("ok1");
                    resolve('ok1')
                },2000)
            })
            

        })
    },
    _=>{
        return new Promise((resolve,reject)=>{
 // 执行前检查暂停状态
            pause().then(_=>{

                setTimeout(_=>{
                    console.log("ok2");

                    resolve('ok2')
                },2000)

            })
           

        })
    },
     _=>{
        return new Promise((resolve,reject)=>{
 // 执行前检查暂停状态
           pause().then(_=>{
            setTimeout(_=>{
                console.log("ok3");

                resolve('ok3')
            },2000)

           })
          

        })
    }, 
     _=>{
        return new Promise((resolve,reject)=>{
 // 执行前检查暂停状态
           pause().then(_=>{
            setTimeout(_=>{
                console.log("ok4");

                resolve('ok4')
            },2000)

           })
          

        })
    }, 
]


document.getElementById('btn1').onclick=function(){
  queue(t).then(res=>{
        console.log(res);
    })
  
}
document.getElementById('btn2').onclick=function(){
  if (!isPaused) {
		      isPaused = true; 
		    }
}

document.getElementById('btn3').onclick=function(){
isPaused = false; 

}
```
