const express=require("express");
// const ejs=require("ejs");
// const { json } = require("express/lib/response");
const app=express();

app.use(express.json());

app.set("view engine","ejs");

const PORT = process.env.PORT || 3000;





app.get('/',function(req,res){
  //console.log(req.query)
    res.render("index4");
});  


// var fs = require("fs");

// var tot = 1020;

// var arr = new Array(1100); // create an empty array of length 2000
// for (var i = 0; i < 1100; i++) {
//   arr[i] = new Array(4000); // make each element an array
// }

// var iidd = fs.readFileSync("./keywords.txt", "utf8");
// iidd = iidd.toString();
// iidd = iidd.split("\n");

// var idf = fs.readFileSync("./idf.txt", "utf8");
// idf = idf.toString();
// idf = idf.split("\n");

// var tdif = fs.readFileSync("./td-idf.txt", "utf8");
// tdif = tdif.toString();
// tdif = tdif.split("\n");

// var mod = fs.readFileSync("./mod.txt", "utf8");
// mod = mod.toString();
// mod = mod.split("\n");

// var tarr = fs.readFileSync("./problem_titles.txt", "utf8");
// tarr = tarr.toString();
// tarr = tarr.split("\n");

// var uarr = fs.readFileSync("./problem_urls.txt", "utf8");
// uarr = uarr.toString();
// uarr = uarr.split("\n");

// for (var i = 0; i < tdif.length; i++) {
//   var curr = tdif[i].split(" ");
//   var i = parseInt(curr[0]);
//   var j = parseInt(curr[1]);
//   var val = parseFloat(curr[2]);
//   arr[i][j] = val;
// }


app.get('/search',function(req,res){

  var qarr = [4000];
   var mq = 1;
  var qs = req.query; // sum of two numbers
  qs = qs.question;
  qs = qs.split(" ");
  qs = qs.tolocaleLowerCase();
  console.log(qs);

 var mp = new Map();
 var w_count = 0;
 var w_ind = new Map();
 for (var i = 0; i < qs.length; i++) {
   var curr = qs[i];
   var idx = iidd.indexOf(curr);
   if (idx != -1) {
     if (mp.has(curr) == false) {
       mp.set(curr, 1);
       qarr[idx] = 1;
       w_ind.set(curr, idx);
     } else {
       mp.set(curr, mp.get(curr) + 1);
       qarr[idx] = qarr[idx] + 1;
     }
     w_count = w_count + 1;
   }
 }

 for (var i = 0; i < qs.length; i++) {
   var curr = qs[i];
   var idx = iidd.indexOf(curr);
   if (idx != -1 && w_ind.get(curr) != -1) {
     var idf_val = parseFloat(idf[idx]);
     qarr[idx] = qarr[idx] / w_count;
     w_ind.set(curr, -1);
   }
 }

 var fin = [];
 for (var i = 0; i < tot; i++) {
   var dp = 0;
   var mod_val = parseFloat(mod[i]);
   var qm = 0;
   for (var j = 0; j < qs.length; j++) {
     var curr = qs[j];
     var idx = iidd.indexOf(curr);
     if (idx != -1 && arr[i][idx] != undefined) {
       dp = dp + arr[i][idx] * qarr[idx];
       qm = qm + qarr[idx] * qarr[idx];
     }
   }
   qm = Math.sqrt(qm);
   var ans;
   if (qm != 0 && mod_val != 0) {
     ans = dp / (mod_val * qm);
   }
   if (ans != undefined && ans != 0) {
     var temp = { val1: ans, val2: i + 1 };
     fin.push(temp);
   }
 }

 function custom_compare(a, b) {
   return a.val1 > b.val1;
 }

 fin.sort(custom_compare).reverse();
 var farr = [];
 if (fin.length == 0) {
   console.log("No results found");
 } else {
   for (var i = 0; i < fin.size; i++) {
     if (i == 5) {
       break;
     }
     var temp = fin[i];
     var fin_ans = temp.val2;
     farr.push(fin_ans);
   }
 }
 var obj = [];
 for (var i = 0; i < farr.length; i++) {
   var idx = farr[i];
   var bd = fs.readFileSync("./problems/problem" + idx + ".txt", "utf8");
   bd = bd.toString();
   obj.push({
     title: tarr[farr[i]],
     url: uarr[farr[i]],
     body: bd,
     index: idx,
   });
 }
 console.log(obj);
 var exp = json(obj);
 console.log(exp);
 res.render('search',{array:exp});
  //res.render('index3',{array:obj});
});


app.use((req,res)=>{
  app.status(404).render('404',{title:"404"});
});

app.listen(PORT, () => {
  console.log("Server is running on port " + PORT);
});
