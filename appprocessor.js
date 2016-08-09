var fs = require('fs');

var split = require('split');
var HashMap = require('hashmap');

var filePath = './obfuscated_data';
var totalLaunches = new HashMap();
var firstLaunch = new HashMap();
var count = 0;
var stream;

console.log("Processing Data...")    
stream = fs.createReadStream(filePath, {flags: 'r', encoding: 'utf-8'})        
  .pipe(split(JSON.parse, null, { trailing: false }))
  .on('data', function onData(json) { 	    
    if (json.type == "launch") {
      if (!(totalLaunches.has(json.source))) { 
        totalLaunches.set(json.source,1);
        firstLaunch.set(json.event_id,json.source);             
      }
      else {
        count = totalLaunches.get(json.source);
        totalLaunches.set(json.source,count+1);
      }                
    }        
  })
  .on('error', function onError(err) {
    console.log("Oops !" + err);
  });

stream.on('end', function onEnd() {
  console.log('Processing Completed.\n');
  console.log("Number of product launches during this time period");
  totalLaunches.forEach(function print(value, key) {
    console.log(key + " : " + value + " launches");
  });
  console.log("\n");
  console.log("First product launches:\nProduct   : Event Id");
  firstLaunch.forEach(function print(value, key) {
    console.log(value + " : " + key);
  });
});
 			
		