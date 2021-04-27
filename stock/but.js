var favour=[];
window.onload=function(){
  search();
  if(!localStorage.fav){
    localStorage.fav="";
  }
  favour=JSON.parse(localStorage.fav);
}
function add(){
  let len=favour.length;
  for(let i=0;i<len;i++){
    if(favour[i]=="'"+sessionStorage.inp+"'"){
      return;
    }
  }
  favour.push("'"+sessionStorage.inp+"'");
  document.getElementById(sessionStorage.inp).style.color="red";
  localStorage.fav=JSON.stringify(favour);
  console.log(localStorage.fav);
}
function rem(){
  let index=-1;
  let len=favour.length;
  var key="'"+sessionStorage.inp+"'";
  for(let i=0;i<len;i++){
    if(favour[i]==key){
      console.log(favour[i]);
        favour.splice(i,1);
        document.getElementById(sessionStorage.inp).style.color="white";
        localStorage.fav=JSON.stringify(favour);
    }
  }
}

//close popup
function pop_close(){
  document.getElementsByClassName("popup1")[0].style.display="none";
  document.getElementsByTagName('body')[0].style.overflow="auto";
}
var srchar=[];
document.getElementsByClassName('content')[0].innerHTML=document.getElementById('inp').value;
var timeout = null;

//Search function
function search() {
  if (timeout) {  
    clearTimeout(timeout);
  }
  timeout = setTimeout(function() {
     searchHelper();
  }, 800);
}
function searchHelper(){
  document.getElementsByClassName('col')[0].innerHTML="";
  srchar=[];
  var x=document.getElementById("inp").value;
  document.getElementsByClassName("content")[0].style.display="block";
  if(x==""){
    document.getElementsByClassName("content")[0].style.display="none";
  }
  sessionStorage.inp=x;
  document.getElementsByClassName("content")[0].innerHTML='Showing results for "'+x+'"';
  var data = null;
  var xhr = new XMLHttpRequest();
  xhr.withCredentials = true;
  xhr.addEventListener("readystatechange", function () {
  if (this.readyState === this.DONE) {
    var txt=JSON.parse(this.responseText);
    show(txt);
    }});
  xhr.open("GET","https://yahoo-finance-low-latency.p.rapidapi.com/v6/finance/autocomplete?lang=en&region=US&query="+x+"",true);
  xhr.setRequestHeader("x-rapidapi-host", "yahoo-finance-low-latency.p.rapidapi.com");
  xhr.setRequestHeader("x-rapidapi-key", "88c5dbf86cmshea49f711696deb7p166d62jsn7b1635cba66b");
  xhr.send(data);
}
function show(txt){
  var l=Object.keys(txt.ResultSet.Result).length;
  for(let i=0;i<l;i++){
    let nm=txt.ResultSet.Result[i].symbol;
    srchar.push(nm);
    let ch=document.createElement('a');
    let f=document.createElement('p');
    ch.setAttribute("class","boxes");
    ch.setAttribute("id",nm);
    ch.addEventListener("click",clik(nm));
    document.getElementsByClassName('col')[0].appendChild(ch);
    var p=document.createElement('p');
    p.innerHTML=txt.ResultSet.Result[i].name+"<br>"+"SED:"+txt.ResultSet.Result[i].exchDisp
    +"<br>Dist Type:"+txt.ResultSet.Result[i].typeDisp;
    sessionStorage.text1=txt.ResultSet.Result[i].name+"<br>"+"SED:"+txt.ResultSet.Result[i].exchDisp;
    document.getElementById(nm).appendChild(p);
    ch.appendChild(f);
    if(localStorage.fav.search("'"+nm+"'")!=-1){
      ch.style.color="red";
      console.log("true");
    }
  }
}
function hov(id){
  return function(){
    let x=document.getElementById(id);
    x.style.height="230px";
  }
}
function clik(id){
  return function(){
  get_val();
  document.getElementsByClassName("popup1")[0].style.display="flex";
  document.getElementsByClassName("background")[0].style.filter = "blur(20px)";
  sessionStorage.inp=(id);
  sessionStorage.name=document.getElementById(id).firstChild.innerText;
  document.getElementById("pop_h").innerHTML=id;
  document.getElementsByClassName("conten")[0].innerHTML=JSON.stringify(sessionStorage.text1).slice(1,-1);
  document.getElementsByClassName("popup")[0].style.backgroundImage="linear-gradient(#33cffa,#b3f1ff)";
  document.getElementsByTagName('body')[0].style.overflow="hidden";
  return true;
  };
 }

 function short(tx){
     document.getElementById("inp").value=tx;
 } 

 //Alpha vantage http request
function get_val(){
  console.log("hello");
  const xhr=new XMLHttpRequest();
    xhr.onreadystatechange =function(){
      if(this.readyState==4 && this.status==200){
      var txt=JSON.parse(this.responseText);
      var dates=[],closed=[];
      var arr=Object.values(txt);
      dates=Object.keys(arr[1]);
      sessionStorage.op=arr[1][dates[0]]["1. open"];
      sessionStorage.cl=arr[1][dates[0]]["4. close"];
      document.getElementById("chartContainer").innerHTML="Open="+arr[1][dates[0]]["1. open"]+" High="+arr[1][dates[0]]["2. high"]+
      " Low="+arr[1][dates[0]]["3. low"]+" Close="+arr[1][dates[0]]["4. close"];
      }
    }
    xhr.open("GET",'https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol='+sessionStorage.inp+'&apikey=SR6SFJRGI2X0W8O5',true);
      xhr.send();
}