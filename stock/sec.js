
window.addEventListener("load",buttonclick());
function buttonclick(){
  document.getElementById("titl").innerHTML="Showing stock details of "+sessionStorage.name;
  var op=document.getElementById("filter");
  var z="";
  if(op.selectedIndex==0){
    z="&interval=5min"
  }
  var y=op.options[op.selectedIndex].value;
  console.log(y);
    const xhr=new XMLHttpRequest();
    xhr.onreadystatechange =function(){
      if(this.readyState==4 && this.status==200){
      var txt=JSON.parse(this.responseText);
      var dates=[],closed=[];
      var arr=Object.values(txt);
      dates=Object.keys(arr[1]);
      console.log(dates.length+"-----------");
      for(let i=0;i<dates.length;i++){
        closed.push(arr[1][dates[i]]["4. close"]);
      }
      draw(dates,closed);
      }
    }
      xhr.open("GET",'https://www.alphavantage.co/query?function='+y+'_ADJUSTED&symbol='+sessionStorage.inp+z+'&apikey=VI4O392A84HTYI9O',true);
      xhr.send();
}
function draw(arx,ary){
  var format="DD MMM YYYY";
  if(document.getElementById("filter").selectedIndex==0)
    format="hh:mm TT";
    var ctx = document.getElementById('myChart');
    var Chart = new CanvasJS.Chart(ctx, {
      title:{
        text: "Stock Price"
      },
      animationEnabled: true,
      zoomEnabled:true,
      theme:'dark1',
      animationDuration: 3000,
      axisX:{
        valueFormatString: format,
        crosshair: {
          enabled: true,
          snapToDataPoint:true
        }
      },
      axisY: {
        title: "Closing Price (in USD)",
        valueFormatString: "$##0.00",
        crosshair: {
          enabled: true,
          snapToDataPoint: true,
          labelFormatter: function(e) {
            return "$" + CanvasJS.formatNumber(e.value, "##0.00");
          }
        }
      },
        data: [{
          type: "area",
          lineThickness:5,
          fillOpacity: .6,
          lineColor:"rgb(0,0,0)",
          xValueFormatString: "DD MM YYYY",
          yValueFormatString: "$##0.00",
          dataPoints:dataPoints(arx,ary) 
        }],
        
    });
    Chart.render();
  }
  function dataPoints(arx,ary){
    var res=[];
    console.log(typeof(arx));
    for(let i=0;i<arx.length;i++){
        var t={x:new Date(arx[i]),y:Number(ary[i])};
        res.push(t);
    }
    console.log(res);
    return res;
  }