# 日常记录 

  

读书不是让你记住多少知识，是让你更容易识破别人的谎言！

```chart
// ==BlockCodeConfig==
// @align            center
// @width            auto
// @height           300px
// @backgroundColor  transparent
// ==/BlockCodeConfig==

// Built-in variables:
//   1. Chart:   chart Class
//   2. config:  chart option object
//   3. this:    chart plugin instance
// API:  https://chart.nodejs.cn/docs/latest/configuration/
// NOTE: Code within this block will be evaluated. Exercise caution

config = {
  type: "bar",
  data: {
    labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
    datasets: [{
      label: "图表",
      data: [12, 19, 3, 5, 2, 3],
      backgroundColor: [
        "rgba(255, 99, 132, 0.2)", "rgba(54, 162, 235, 0.2)", "rgba(255, 206, 86, 0.2)",
        "rgba(75, 192, 192, 0.2)", "rgba(153, 102, 255, 0.2)", "rgba(255, 159, 64, 0.2)"
      ],
      borderColor: [
        "rgba(255, 99, 132, 1)", "rgba(54, 162, 235, 1)", "rgba(255, 206, 86, 1)",
        "rgba(75, 192, 192, 1)", "rgba(153, 102, 255, 1)", "rgba(255, 159, 64, 1)"
      ],
      borderWidth: 1
    }]
  }
}
```

