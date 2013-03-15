'use strict';

var pkg = require( '../package.json' )
  , version = pkg.version
  , desc = pkg.description
  , helpHeader
  , helpFooter
  ;

exports.version = function() {
  return [
    pkg.name + ' v' + version
  ].join( '\n' );
};
