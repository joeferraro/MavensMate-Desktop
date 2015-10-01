'use babel';

var semver = require('semver');
var https = require('https');
var Promise = require('bluebird');

function GitHubUpdateNotifier(gh) {
  this.repo = gh.repo
  this.currentVersion = gh.currentVersion
}

/**
 * Get tags from this.repo
 */
GitHubUpdateNotifier.prototype._getLatestTag = function(cb) {
  var self = this;
  return new Promise(function(resolve, reject) {
    var options = {
      host: 'api.github.com',
      path: '/repos/'+self.repo+'/releases/latest',
      headers: {
        'User-Agent': 'mavensmate-app'
      }
    };

    callback = function(response) {
      console.log(response.headers);

      var str = '';

      response.on('data', function(chunk) {
        str += chunk;
      });

      response.on('end', function() {
        var latestTag = JSON.parse(str);
        resolve(latestTag);
      });

      response.on('error', function(e) {
        console.error(e);
        reject(e);
      });
    };

    var req = https.request(options, callback);
    req.on('socket', function(socket) {
      socket.setTimeout(5000);  
      socket.on('timeout', function() {
        console.log('timed out reaching github');
        req.abort();
      });
    });
    req.on('error', function(err) {
      // if (err.code === "ECONNRESET") {
      //     console.log("Timeout occurs");
      // }
      console.log('error reaching github', err);
    });
    req.end();
  });
}

/**
 * Get current version from app.
 */
GitHubUpdateNotifier.prototype._getCurrentVersion = function() {
  return this.currentVersion;
}

/**
 * Compare current with the latest version.
 */
GitHubUpdateNotifier.prototype._newVersion = function(latest) {
  // console.log(this._getCurrentVersion());
  // console.log(latest);
  // console.log('comparing versions: ');
  var currentVersion = semver.clean(this._getCurrentVersion());
  var latestVersion = semver.clean(latest);
  // console.log(currentVersion);
  // console.log(latestVersion);
  return semver.lt(currentVersion, latestVersion);
}

/**
 * Check for updates.
 */
GitHubUpdateNotifier.prototype.check = function() {
  var self = this;
  return new Promise(function(resolve, reject) {
    self._getLatestTag()
      .then(function(tag) {
        if (!tag) {
          return resolve({
            needsUpdate: false
          });;
        }
        var latest = tag.tag_name;
        if (!latest || !semver.valid(semver.clean(latest))) {
          return reject(new Error('Could not find a valid release tag.'));
        }
        if (!self._newVersion(latest)) {
          console.log('user is running latest version');
          resolve({
            needsUpdate: false
          });
        } else {
          console.log('user needs to update');
          var currentVersion = semver.clean(self._getCurrentVersion());
          var latestVersion = semver.clean(latest);
          resolve({
            needsUpdate: true,
            currentVersion: 'v'+currentVersion,
            latestVersion: 'v'+latestVersion,
            url: 'https://github.com/'+self.repo+'/releases/latest'
          });
        }
      })
      .catch(function(err) {
        reject(err);
      });
  });
}

module.exports = GitHubUpdateNotifier;