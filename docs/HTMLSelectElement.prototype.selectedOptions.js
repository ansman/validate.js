/**
 * Polyfill for "fixing" IE's lack of support (IE < 9) for applying slice
 * on host objects like NamedNodeMap, NodeList, and HTMLCollection
 * (technically, since host objects are implementation-dependent,
 * IE doesn't need to work this way). Also works on strings,
 * fixes IE to allow an explicit undefined for the 2nd argument
 * (as in Firefox), and prevents errors when called on other
 * DOM objects.
 * @license MIT, GPL, do whatever you want
-* @see https://gist.github.com/brettz9/6093105
*/
(function () {
    'use strict';
    var _slice = Array.prototype.slice;

    try {
        _slice.call(document.documentElement); // Can't be used with DOM elements in IE < 9
    }
    catch (e) { // Fails in IE < 9
        Array.prototype.slice = function (begin, end, testa) {
            var i, arrl = this.length, a = [];
            if (this.charAt) { // Although IE < 9 does not fail when applying Array.prototype.slice
                               // to strings, here we do have to duck-type to avoid failing
                               // with IE < 9's lack of support for string indexes
                for (i = 0; i < arrl; i++) {
                    a.push(this.charAt(i));
                }
            }
            else { // This will work for genuine arrays, array-like objects, NamedNodeMap (attributes, entities, notations), NodeList (e.g., getElementsByTagName), HTMLCollection (e.g., childNodes), and will not fail on other DOM objects (as do DOM elements in IE < 9)
                for (i = 0; i < this.length; i++) { // IE < 9 (at least IE < 9 mode in IE 10) does not work with node.attributes (NamedNodeMap) without a dynamically checked length here
                    a.push(this[i]);
                }
            }
            return _slice.call(a, begin, end || a.length); // IE < 9 gives errors here if end is allowed as undefined (as opposed to just missing) so we default ourselves
        };
    }
}());

/**
* @license MIT, GPL, do whatever you want
* @requires Array.prototype.slice fix {@link https://gist.github.com/brettz9/6093105}
*/
if (!Array.from) {
    Array.from = function (object) {
        'use strict';
        return [].slice.call(object);
    };
}

/*
 * Xccessors Standard: Cross-browser ECMAScript 5 accessors
 * http://purl.eligrey.com/github/Xccessors
 * 
 * 2010-06-21
 * 
 * By Eli Grey, http://eligrey.com
 * 
 * A shim that partially implements Object.defineProperty,
 * Object.getOwnPropertyDescriptor, and Object.defineProperties in browsers that have
 * legacy __(define|lookup)[GS]etter__ support.
 * 
 * Licensed under the X11/MIT License
 *   See LICENSE.md
*/

/*jslint white: true, undef: true, plusplus: true,
  bitwise: true, regexp: true, newcap: true, maxlen: 90 */

/*! @source http://purl.eligrey.com/github/Xccessors/blob/master/xccessors-standard.js*/

(function () {
    "use strict";
    var ObjectProto = Object.prototype,
	defineGetter = ObjectProto.__defineGetter__,
	defineSetter = ObjectProto.__defineSetter__,
	lookupGetter = ObjectProto.__lookupGetter__,
	lookupSetter = ObjectProto.__lookupSetter__,
	hasOwnProp = ObjectProto.hasOwnProperty;
	
	if (defineGetter && defineSetter && lookupGetter && lookupSetter) {

		if (!Object.defineProperty) {
			Object.defineProperty = function (obj, prop, descriptor) {
				if (arguments.length < 3) { // all arguments required
					throw new TypeError("Arguments not optional");
				}
				
				prop += ""; // convert prop to string

				if (hasOwnProp.call(descriptor, "value")) {
					if (!lookupGetter.call(obj, prop) && !lookupSetter.call(obj, prop)) {
						// data property defined and no pre-existing accessors
						obj[prop] = descriptor.value;
					}

					if ((hasOwnProp.call(descriptor, "get") ||
					     hasOwnProp.call(descriptor, "set"))) 
					{
						// descriptor has a value prop but accessor already exists
						throw new TypeError("Cannot specify an accessor and a value");
					}
				}

				// can't switch off these features in ECMAScript 3
				// so throw a TypeError if any are false
				if (!(descriptor.writable && 
                    descriptor.enumerable && descriptor.configurable))
				{
					throw new TypeError(
						"This implementation of Object.defineProperty does not support" +
						" false for configurable, enumerable, or writable."
					);
				}
				
				if (descriptor.get) {
					defineGetter.call(obj, prop, descriptor.get);
				}
				if (descriptor.set) {
					defineSetter.call(obj, prop, descriptor.set);
				}
			
				return obj;
			};
		}

		if (!Object.getOwnPropertyDescriptor) {
			Object.getOwnPropertyDescriptor = function (obj, prop) {
				if (arguments.length < 2) { // all arguments required
					throw new TypeError("Arguments not optional.");
				}
				
				prop += ""; // convert prop to string

				var descriptor = {
					configurable: true,
					enumerable  : true,
					writable    : true
				},
				getter = lookupGetter.call(obj, prop),
				setter = lookupSetter.call(obj, prop);

				if (!hasOwnProp.call(obj, prop)) {
					// property doesn't exist or is inherited
					return descriptor;
				}
				if (!getter && !setter) { // not an accessor so return prop
					descriptor.value = obj[prop];
					return descriptor;
				}

				// there is an accessor, remove descriptor.writable;
				// populate descriptor.get and descriptor.set (IE's behavior)
				delete descriptor.writable;
				descriptor.get = descriptor.set = undefined;
				
				if (getter) {
					descriptor.get = getter;
				}
				if (setter) {
					descriptor.set = setter;
				}
				
				return descriptor;
			};
		}

		if (!Object.defineProperties) {
			Object.defineProperties = function (obj, props) {
                var prop;
				for (prop in props) {
					if (hasOwnProp.call(props, prop)) {
						Object.defineProperty(obj, prop, props[prop]);
					}
				}
			};
		}

	}
}());

if (!Array.prototype.filter) {
  Array.prototype.filter = function(fun /*, thisp*/) {
    'use strict';

    if (this == null) {
      throw new TypeError();
    }

    var t = Object(this),
        len = t.length >>> 0,
        res, thisp, i, val;
    if (typeof fun !== 'function') {
      throw new TypeError();
    }

    res = [];
    thisp = arguments[1];
    for (i = 0; i < len; i++) {
      if (i in t) {
        val = t[i]; // in case fun mutates this
        if (fun.call(thisp, val, i, t)) {
          res.push(val);
        }
      }
    }

    return res;
  };
}


/*globals HTMLSelectElement*/
/**
* @requires polyfill: Array.from {@link https://gist.github.com/4212262}
* @requires polyfill: Array.prototype.filter {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter}
* @requires polyfill: Object.defineProperty {@link https://github.com/eligrey/Xccessors}
* @license MIT, GPL, do whatever you want
*/
(function () {
'use strict';
// Inspired by http://stackoverflow.com/a/7754729/271577
function PseudoHTMLCollection(arr) {
    var i, arrl;
    for (i = 0, arrl = arr.length; i < arrl; i++) {
        this[i] = arr[i];
    }

    try {
        Object.defineProperty(this, 'length', {
            get: function () {
                return arr.length;
            }
        });
    }
    catch (e) { // IE does not support accessors on non-DOM objects, so we can't handle dynamic (array-like index) addition to the collection
        this.length = arr.length;
    }
    if (Object.freeze) { // Not present in IE, so don't rely on security aspects
        Object.freeze(this);
    }
}

PseudoHTMLCollection.prototype = {
    constructor: PseudoHTMLCollection,
    item: function (i) {
        return this[i] !== undefined && this[i] !== null ? this[i] : null;
    },
    namedItem: function (name) {
        var i, thisl;
        for (i = 0, thisl = this.length; i < thisl; i++) {
            if (this[i].id === name || this[i].name === name) {
                return this[i];
            }
        }
        return null;
    }
};

Object.defineProperty(HTMLSelectElement.prototype, 'selectedOptions', {get: function () {
    return new PseudoHTMLCollection(Array.from(this.options).filter(function (option) {
        return option.selected;
    }));
}});

}());
