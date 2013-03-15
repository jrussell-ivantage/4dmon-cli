/*
 * 4dmon-cli
 */

'use strict';

var fs = require( 'fs' )
  , path = require( 'path' )
  , request = require( 'request' )
  , async = require( 'async' )
  , home = process.env[(process.platform === 'win32') ? 'USERPROFILE' : 'HOME']
  , confFile = path.join( home, '.4dmon' )
  , getSettings
  , saveSettings
  , getAliasHost
  , getBaseUrl
  ;

// -----------------------------------------------------
// Defaults
// -----------------------------------------------------
exports.host = 'localhost';
exports.port = '4077';
exports.protocol = 'http';

exports.setHostAlias = function( alias, cb ) {
  var conf = getSettings();
  conf.aliases[alias] = exports.host;
  saveSettings( conf );
  cb();
};

getAliasHost = function( alias, cb ) {
  var conf = getSettings()
    , host = alias
    ;

  if( conf.aliases.hasOwnProperty( alias ) ) {
    host = conf.aliases[alias];
    console.log( 'Resolving alias: ' + alias + ' ===> ' + host  );
  }

  return host;
};

exports.listAliases = function( cb ) {
  var aliases = getSettings().aliases
    , a
    ;

  for( a in aliases ) {
    if( aliases.hasOwnProperty( a ) ) {
      console.log( a + ': ' + aliases[a] );
    }
  }
  cb();
};

getSettings = function() {
  var conf = {};
  if( fs.existsSync( confFile ) ) {
    conf = JSON.parse( fs.readFileSync( confFile ).toString() );
  }
  conf.aliases = conf.aliases || {};
  return conf;
};

saveSettings = function( obj ) {
  fs.writeFileSync( confFile, JSON.stringify( obj ) );
};

exports.cleanSettings = function( cb ) {
  fs.unlinkSync( confFile );
  cb();
};

exports.stopServer = function( cb ) {
  var host = exports.host
    , port = exports.port
    ;

  host = getAliasHost( host ); // Resolve alias if needed
  host = host + ':' + port;
  request( 'http://' + host + '', function( error, response, body ) {
    if( error || response.statusCode !== 200 ) {
      console.log( 'Whoops! 4dmon-cli could not reach ' + host );
    }
    cb();
  });
};

exports.stopClient = function( cb ) {
};

exports.startClient = function( cb ) {
};

exports.startServer = function( cb ) {
};

exports.snapshot = function( cb ) {
};

getBaseUrl = function() {
  var alias = exports.host
    , host = getAliasHost( alias )
    , port = exports.port
    , prot = exports.protocol
    , url = prot + '://' + host + ':' + port
    ;
  
  return url;
};

exports.snapshot = function( cb ) {
    var baseUrl = getBaseUrl()
      , url = baseUrl + '/trackers/list'
      ;

  request( url, function( error, response, body ) {
    if( error || response.statusCode !== 200 ) {
      console.log( 'Whoops! 4dmon-cli could not reach ' + exports.host );
      process.exit();
    }

    var list = JSON.parse( body )
      , trackers = list.snapshot
      ;

    trackers.forEach( function( tracker ) {
      var url = baseUrl + '/snapshot/' + tracker
        ;

      request( url, function( error, response, body ) {
        if( error || response.statusCode !== 200 ) {
          console.log( 'Whoops! 4dmon-cli count not get info for tracker: ' + tracker );
          process.exit();
        }
        var stats = JSON.parse( body ).data
          , output = '' // Buffer this so we aren't inerrupted
          ;

        output += '\n';
        output += tracker + '\n';
        output += '---------------- \n';

        if( stats ) {
          stats.forEach( function( stat ) {
            output += stat.name + ': ' + stat.value;
          });
          console.log( output );
        } else {
          console.log( 'Whoops! 4dmon-cli could not get info for tracker: ' + tracker );
        }

      });
    });
  });

};
