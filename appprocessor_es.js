var fs = require('fs')

var es = require('event-stream')
var HashMap = require('hashmap');

var filePath = './obfuscated_data';
var firstLaunch = new HashMap();
var totalLaunches = new HashMap();
var count = 0;
 
console.log("Processing Data...");
var stream = fs.createReadStream(filePath, {flags: 'r', encoding: 'utf-8'})        
  .pipe(es.split())
  .pipe(es.mapSync(function (data) {
    try {
      json = JSON.parse(data);
    }
    catch(err) {
      console.log("End of file reached");      
    }
    if (json.type === "launch") {
       if (!(totalLaunches.has(json.source))) { 
         totalLaunches.set(json.source,1)
         firstLaunch.set(json.event_id,json.source)                  
       }
       else {
         count = totalLaunches.get(json.source);
         totalLaunches.set(json.source,count+1)
       }                
    } 
     
  }))
  .on('error', function onErr(err) { 
    console.log("Oops !" + err);
  })
  
stream.on('end', function onStreamEnd() {  
  console.log('Processing Completed.\n');
  displayResults(); 
});

function displayResults() {
  console.log("Number of product launches during this time period");
  totalLaunches.forEach(function print(value, key) {
    console.log(key + " : " + value + " launches");
  });
  console.log("\n");
  console.log("First product launches:\nProduct   : Event Id");
  firstLaunch.forEach(function print(value, key) {
    console.log(value + " : " + key);
  });
}