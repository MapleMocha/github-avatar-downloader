var request = require('request');
var gitHubToken = require('./secret.js')
var fs = require('fs');

console.log("\nHey there!\n\nWelcome to the GitHub Avatar Downloader!\n")

function getRepoContributors(cb){

  var repoOwner = process.argv[2];
  var repoName = process.argv[3];
  if(repoOwner == undefined || repoName == undefined){
    return console.log("You gotta follow the rules man... please ad the repo-owner and the repo-name as command line")
  }

  var options = {
    url: 'https://api.github.com/repos/' + repoOwner + '/' + repoName + '/contributors',
    headers: {
      'User-Agent': 'request',
      'Authorizataion': 'token ' + gitHubToken.GITHUB_TOKEN
    }
  };

  request(options, function(err, res, body){
    cb(err, JSON.parse(body));
  });


}

function downloadImageByURL(imageUrl, filePath){
  request.get(imageUrl)
         .on('error', function(err){
          console.log("I've come across an error :( ")
          throw err;
         })
         .on('response', function(response){
         })
         .pipe(fs.createWriteStream(filePath));
}

getRepoContributors(function(err, result){
  //console.log("Errors: ", err);
  console.log("Downloading images...\n")
  for(i in result){
    var url = result[i]['avatar_url']
    var filePath = 'avatars/' + result[i]['login'] + '.jpg';
    downloadImageByURL(url, filePath);
  }
  console.log("\n...Images downloaded!")
});








