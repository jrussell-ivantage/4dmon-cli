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
  var conf = exports.getSettings();
  if( !conf.aliases.hasOwnProperty( alias ) ) {
    console.log( 'Unrecognized alias: ' + alias );
    process.exit();
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

exports.stopServer = function( host ) {
};

exports.stopClient = function( host ) {
};

exports.startClient = function( host ) {
};

exports.startServer = function( host ) {
};

exports.snapshot = function( host ) {
};
