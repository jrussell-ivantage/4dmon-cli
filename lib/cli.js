/*
 * 4dmon-cli
 */

'use strict';

var fs = require( 'fs' )
  , path = require( 'path' )
  , request = require( 'request' )
  , home = process.env[(process.platform === 'win32') ? 'USERPROFILE' : 'HOME']
  , confFile = path.join( home, '.4dmon' )
  ;

exports.setHostAlias = function( host, alias ) {
  var conf = exports.getSettings();
  conf.aliases[alias] = host;
  exports.saveSettings( conf );
};

exports.getAliasHost = function( alias ) {
  var conf = exports.getSettings()
    , host = alias
    ;

  if( conf.aliases.hasOwnProperty( alias ) ) {
    host = conf.aliases[alias];
    console.log( 'Resolving alias: ' + alias + ' ===> ' + host  );
  }
  return conf.aliases[alias];
};

exports.listAliases = function() {
  var aliases = exports.getSettings().aliases
    , a
    ;

  for( a in aliases ) {
    if( aliases.hasOwnProperty( a ) ) {
      console.log( a + ': ' + aliases[a] );
    }
  }
};

exports.getSettings = function() {
  var conf = {};
  if( fs.existsSync( confFile ) ) {
    conf = JSON.parse( fs.readFileSync( confFile ).toString() );
  }
  conf.aliases = conf.aliases || {};
  return conf;
};

exports.saveSettings = function( obj ) {
  fs.writeFileSync( confFile, JSON.stringify( obj ) );
};

exports.cleanSettings = function() {
  fs.unlinkSync( confFile );
};

exports.stopServer = function( host, port ) {
  host = exports.getAliasHost( host ); // Resolve alias if needed
  host = host + ':' + port;
  request( 'http://' + host + '', function( error, response, body ) {
    if( error || response.statusCode !== 200 ) {
      console.log( 'Whoops! 4dmon-cli could not reach ' + host );
    }
  });
};

exports.stopClient = function( host ) {
};

exports.startClient = function( host ) {
};

exports.startServer = function( host ) {
};

exports.snapshot = function( host ) {
};
