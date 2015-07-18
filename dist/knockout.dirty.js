(function(factory) {
    // CommonJS/Node
    if (typeof require === "function" && typeof exports === "object" && typeof module === "object") {
        factory(require("ko"),  exports);
    }
    // AMD module
    else if (typeof define === "function" && define["amd"]) {
        define(["knockout", "exports"], factory);
    }
    // No module loader
    else {
        factory(ko,ko);
    }
}(function(ko, exports) {
        /*global ko, exports*/
    /**
     * Will create a new Dirty Flag to evaluate if observables in a view model are "dirty".
     * @see https://en.wikipedia.org/wiki/Cache_(computing)#Dirty
     * @see http://www.knockmeout.net/2011/05/creating-smart-dirty-flag-in-knockoutjs.html
     *
     * @constructor
     * @params {object}  target         The view model properties to flag/track.
     * @params {boolean} [startsDirty]  If true, will flag the view model as dirty from the start.
     */

    /* jshint ignore:start */
    exports = ko.DirtyFlag = function () {};
    /* jshint ignore:end */

    /** @section Public API*/
    var DirtyFlag = function (target, startsDirty) { //jshint ignore:line
        "use strict";
        var self         = this,
            _cleanTarget = ko.observable(ko.toJSON(target)),
            _startsDirty = ko.observable(startsDirty),
            status;

        if (!target) {
            throw new Error("You need to pass a \"target\" to flag.");
        }

        status = function () {
            /**
             * Returns the "dirty" observables.
             * @note getDirty it is designed to be a function and not an observable to prevent the
             * overhead of constant evaluation.
             * @public
             * @returns {Array} An array populated with references to "dirty" observables.
             */
            self.getDirty = function () {
                /**
                 * @important Uses same comparison algorithm as restore. @see notes for more details.
                 */
                var unwrappedDirtyTarget = ko.toJS(target),
                    unwrappedCleanTarget = JSON.parse(_cleanTarget()),
                    dirtyArray           = [],
                    key;

                for (key in unwrappedDirtyTarget) {
                    if (unwrappedDirtyTarget.hasOwnProperty(key) &&
                            ko.isObservable(target[key]) &&
                            !ko.isComputed(target[key]) &&
                            JSON.stringify(unwrappedCleanTarget[key]) !== JSON.stringify(unwrappedDirtyTarget[key])) {

                        dirtyArray.push(target[key]);
                    }
                }

                return dirtyArray;
            };

            /**
             * Returns the current "dirty" status (true for dirty, false for "clean").
             * @public
             * returns {Boolean} The status of the "isDirty" flag.
             */
            self.isDirty = ko.computed(function () {
                /***
                 * @note This comparison can take less than a millisecond vs. iterating over all keys.
                 * Comparing objects in this manner is not always as accurate as can be, but it is
                 * good enough for this case use.
                 */

                return _startsDirty() || ko.toJSON(target) !== _cleanTarget();
            });

            /**
             * Restores the values to its initial state.
             * @public
             * @todo Improve algorithm
             */
            self.restore = function () {
                var unwrappedDirtyTarget = ko.toJS(target),
                    /*** @note _cleanTarget is stringyfied JSON, it needs to be parsed. */
                    unwrappedCleanTarget = JSON.parse(_cleanTarget()),
                    key;

                /**
                 * @note While it is more efficient to loop trhu the "clean" object, JSON.stringify(used by ko.toJSON) might have removed
                 * properties that need to be reset (most likely to undefined) in the "dirty" target.
                 */
                for (key in unwrappedDirtyTarget) {
                    /***
                     * @important An observable can hold multiple types of data, an strict comparison would not
                     * be enough since diferent instances of objects holding the same values wouldn't be equal.
                     * As example lodash's isEqual method is just over 150 lines. A compromise in terms of
                     * performance and is made. The other alternative is to set every value on the view model (or segment)
                     * passed to the isDirty plugin.
                     *
                     * @see https://github.com/lodash/lodash/blob/master/lodash.js#L2113
                     * @see http://ecma-international.org/ecma-262/5.1/#sec-11.9.6
                     * @see http://ecma-international.org/ecma-262/5.1/#sec-9.12
                     */
                    if (unwrappedDirtyTarget.hasOwnProperty(key) &&
                            ko.isObservable(target[key]) &&
                            !ko.isComputed(target[key]) &&
                            JSON.stringify(unwrappedCleanTarget[key]) !== JSON.stringify(unwrappedDirtyTarget[key])) {

                        target[key](unwrappedCleanTarget[key]);
                    }
                }

                /*** @note We do not re-set the _startsDirty property, as it is not a reset flag method. */
            };

            /**
             * Resets the flag to false so that the current state becomes "clean".
             * @public
             */
            self.resetFlag = function () {
                _startsDirty(false);
                _cleanTarget(ko.toJSON(target));
            };

            return self;
        };

        return status;
    };

    /***
     * Attach properties to the exports object to define the exported module properties.
     * @todo Extract logic to UMD packager.
     * @see https://github.com/bebraw/grunt-umd
     */
    exports.DirtyFlag = DirtyFlag;

    /***
     * Roughly equivalent to _.merge, will attaches the DirtyFlag function to the exports object.
     * @see https://github.com/knockout/knockout/blob/master/src/utils.js#L10
     */
    ko.utils.extend(ko, exports);

    return exports;
}));