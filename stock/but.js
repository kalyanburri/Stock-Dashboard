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
  document.getElementById(sessionStorage.inp).lastChild.style.color="red";
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
        document.getElementById(sessionStorage.inp).lastChild.style.color="white";
        localStorage.fav=JSON.stringify(favour);
    }
  }
  console.log(favour[0]);
}
// var bd=document.getElementsByTagName('body')[0];
// bd.addEventListener('click',pop_close);
function pop_close(){
  document.getElementsByClassName("popup1")[0].style.display="none";
  document.getElementsByTagName('body')[0].style.overflow="auto";
}
var srchar=[];
document.getElementsByClassName('content')[0].innerHTML=document.getElementById('inp').value;
var timeout = null;
////////
function search() {
  if (timeout) {  
    clearTimeout(timeout);
  }
  timeout = setTimeout(function() {
     search1();
  }, 800);
}
function search1(){
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
    styl(ch);
    ch.setAttribute("class","boxes");
    ch.setAttribute("id",nm);
    ch.addEventListener("click",clik(nm));
   // ch.addEventListener("mouseover",hov(nm));
    f.innerHTML="&#10084";
    styl_fav(f);
    document.getElementsByClassName('col')[0].appendChild(ch);
    var p=document.createElement('p');
    p.innerHTML=txt.ResultSet.Result[i].name+"<br>"+"SED:"+txt.ResultSet.Result[i].exchDisp
    +"<br>Dist Type:"+txt.ResultSet.Result[i].typeDisp;
    sessionStorage.text1=txt.ResultSet.Result[i].name+"<br>"+"SED:"+txt.ResultSet.Result[i].exchDisp;
    document.getElementById(nm).appendChild(p);
    ch.appendChild(f);
    if(localStorage.fav.search("'"+nm+"'")!=-1){
      ch.lastChild.style.color="red";
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
  sessionStorage.inp=(id);
  sessionStorage.name=document.getElementById(id).firstChild.innerText;
  document.getElementById("pop_h").innerHTML=id;
  document.getElementsByClassName("conten")[0].innerHTML=JSON.stringify(sessionStorage.text1).slice(1,-1);
  if(Number(sessionStorage.cl)<Number(sessionStorage.op)){
    document.getElementsByClassName("popup")[0].style.backgroundImage="linear-gradient(#ff6130,white)";
    console.log("decreased")
  }
  else{
    document.getElementsByClassName("popup")[0].style.backgroundImage="linear-gradient(#33cffa,#b3f1ff)";
    console.log("increased");
  }
  document.getElementsByTagName('body')[0].style.overflow="hidden";
  return true;
  };
 }
 function styl(ch){
  ch.style.padding="10px";
  ch.style.height="200px";
  ch.style.textAlign="center";
  ch.style.width="180px";
  ch.style.color="rgb(14, 6, 48)";
  ch.style.textDecoration="none";
  ch.style.backgroundImage="linear-gradient(to right,#94bbe9,#eeaeca)";
  ch.style.margin="10px";
  ch.style.boxShadow="10px 10px 5px grey";
  ch.style.cursor="pointer";
 }
 function styl_fav(f){
  f.style.color="white";
  f.style.fontSize="60px";
  f.style.display="relative";
  f.style.margin="0";
  f.style.bottom="30px";
 }
 function short(tx){
     document.getElementById("inp").value=tx;
 } 
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