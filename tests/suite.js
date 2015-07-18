/*global QUnit, ko*/
var viewModel1 = {},
    createViewModel,
    destroyViewModel;

createViewModel = function () {
    viewModel1.property1 = ko.observable();
    viewModel1.property2 = ko.observable("ORIGINAL");
    viewModel1.property3 = ko.observableArray(["ORIGINAL"]);
    viewModel1.property4 = ko.computed(function () {
        return viewModel1.property2() + "_COMPUTED";
    });
    viewModel1.property5 = ko.pureComputed(function () {
        return viewModel1.property2() + "_" + viewModel1.property2();
    });
};

destroyViewModel = function () {
    viewModel1 = {};
};

QUnit.module("Knockout", {});

QUnit.test("The property \"dirtyFlag\" should exist in Knockout", function (assert) {
    assert.ok(ko.DirtyFlag, "We expect property \"dirtyFlag\" to exist in Knockout");
});

QUnit.module("The constructor", {
    beforeEach: function () {
        createViewModel();

    },
    afterEach: function () {
        destroyViewModel();
    }
});

QUnit.test("should return a function", function (assert) {
    viewModel1.dirtyFlag = new ko.DirtyFlag(viewModel1);

    assert.equal(typeof viewModel1.dirtyFlag, "function", "We expect the constructor to return a function.");
});

QUnit.test("should return an error when no parameters are passed", function (assert) {
    var callback = function () {
        viewModel1.dirtyFlag = new ko.DirtyFlag();
    };

    assert.throws(callback, "We expect the constructor to throw and error when no arguments are passed.");
});

/** Validate the properties in dirtyFlag */


QUnit.module("The returned dirtyFlag method", {
    beforeEach: function () {
        createViewModel();
    },
    afterEach: function () {
        destroyViewModel();
    }
});

QUnit.test("should return an object with an isDirty property", function (assert) {
    viewModel1.dirtyFlag = new ko.DirtyFlag(viewModel1);

    assert.ok(viewModel1.dirtyFlag().isDirty, "We expect property \"isDirty\" to exist in dirtyFlag");
    assert.equal(typeof viewModel1.dirtyFlag().isDirty, "function", "We expect the property to be a function");
    assert.ok(ko.isObservable(viewModel1.dirtyFlag().isDirty), "We expect the property to be an observable");
});

QUnit.test("should return an object with a restore property", function (assert) {
    viewModel1.dirtyFlag = new ko.DirtyFlag(viewModel1);

    assert.ok(viewModel1.dirtyFlag().restore, "We expect property \"restore\" to exist in dirtyFlag");
    assert.equal(typeof viewModel1.dirtyFlag().restore, "function", "We expect the property to be a function");
    assert.notOk(ko.isObservable(viewModel1.dirtyFlag().restore), "We expect the property NOT to be an observable");
});

QUnit.test("should return an object with a resetFlag property", function (assert) {
    viewModel1.dirtyFlag = new ko.DirtyFlag(viewModel1);

    assert.ok(viewModel1.dirtyFlag().resetFlag, "We expect property \"resetFlag\" to exist in dirtyFlag");
    assert.equal(typeof viewModel1.dirtyFlag().resetFlag, "function", "We expect the property to be a function");
    assert.notOk(ko.isObservable(viewModel1.dirtyFlag().resetFlag), "We expect the property NOT to be an observable");
});

QUnit.test("should return an object with a getDirty method", function (assert) {
    viewModel1.dirtyFlag = new ko.DirtyFlag(viewModel1);

    assert.ok(viewModel1.dirtyFlag().getDirty, "We expect property \"getDirty\" to exist in dirtyFlag");
    assert.equal(typeof viewModel1.dirtyFlag().getDirty, "function", "We expect the property to be a function");
    assert.notOk(ko.isObservable(viewModel1.dirtyFlag().getDirty), "We expect the property NOT to be an observable");
});

QUnit.module("The isDirty method", {
    beforeEach: function () {
        createViewModel();
    },
    afterEach: function () {
        destroyViewModel();
    }
});

QUnit.test("should return \"false\" if the viewModel has not been modified", function (assert) {
    viewModel1.dirtyFlag = new ko.DirtyFlag(viewModel1);

    assert.notOk(viewModel1.dirtyFlag().isDirty(), "We expect the isDirty to return false");
});

QUnit.test("should return \"true\" if the viewModel has been modified", function (assert) {
    viewModel1.dirtyFlag = new ko.DirtyFlag(viewModel1);
    viewModel1.property1("MODIFIED");

    assert.ok(viewModel1.dirtyFlag().isDirty(), "We expect the isDirty to return true");
});

QUnit.module("The restore method", {
    beforeEach: function () {
        createViewModel();
    },
    afterEach: function () {
        destroyViewModel();
    }
});

QUnit.test("should restore the view model to its original value", function (assert) {
    viewModel1.dirtyFlag = new ko.DirtyFlag(viewModel1);
    viewModel1.property1("MODIFIED");
    viewModel1.property2(["MODIFIED", "AND", "CHANGED", "CONTENT", "TYPE"]);
    viewModel1.property3([]);

    assert.ok(viewModel1.dirtyFlag().isDirty(), "We expect the isDirty to return true before restoring");

    viewModel1.dirtyFlag().restore();

    assert.notOk(viewModel1.dirtyFlag().isDirty(), "We expect the isDirty to return false after restoring");
});

QUnit.module("The resetFlag method", {
    beforeEach: function () {
        createViewModel();
    },
    afterEach: function () {
        destroyViewModel();
    }
});

QUnit.test("should set the \"isDirty\" flag to false, with \"startsDirty\" set to false", function (assert) {
    viewModel1.dirtyFlag = new ko.DirtyFlag(viewModel1);

    assert.notOk(viewModel1.dirtyFlag().isDirty(), "We expect the isDirty to return false for an unmodified object.");

    viewModel1.property1("MODIFIED");
    viewModel1.property2(["MODIFIED", "AND", "CHANGED", "CONTENT", "TYPE"]);
    viewModel1.property3([]);

    assert.ok(viewModel1.dirtyFlag().isDirty(), "We expect the isDirty to return true for a modified object.");

    viewModel1.dirtyFlag().resetFlag();

    assert.notOk(viewModel1.dirtyFlag().isDirty(), "We expect the isDirty to return false for a modified object.");
});

QUnit.test("should set the \"isDirty\" flag to false, with \"startsDirty\" set to true", function (assert) {
    viewModel1.dirtyFlag = new ko.DirtyFlag(viewModel1, true);

    assert.ok(viewModel1.dirtyFlag().isDirty(), "We expect the isDirty to return true for an unmodified object.");

    viewModel1.property1("MODIFIED");
    viewModel1.property2(["MODIFIED", "AND", "CHANGED", "CONTENT", "TYPE"]);
    viewModel1.property3([]);

    assert.ok(viewModel1.dirtyFlag().isDirty(), "We expect the isDirty to return true for a modified object.");

    viewModel1.dirtyFlag().resetFlag();

    assert.notOk(viewModel1.dirtyFlag().isDirty(), "We expect the isDirty to return false for a modified object.");
});

QUnit.module("The getDirty method", {
    beforeEach: function () {
        createViewModel();
    },
    afterEach: function () {
        destroyViewModel();
    }
});

QUnit.test("should return an array of modified view model properties", function (assert) {
    viewModel1.dirtyFlag = new ko.DirtyFlag(viewModel1);

    assert.equal(viewModel1.dirtyFlag().getDirty().length, 0, "We expect an empty array when no changes.");

    viewModel1.property1("MODIFIED");

    assert.equal(viewModel1.dirtyFlag().getDirty().length, 1, "We expect an item in the array when one modified property.");

    viewModel1.property2(["MODIFIED", "AND", "CHANGED", "CONTENT", "TYPE"]);
    viewModel1.property3([]);

    assert.equal(viewModel1.dirtyFlag().getDirty().length, 3, "We expect three items in the array when three modified properties.");

    viewModel1.dirtyFlag().restore();

    assert.equal(viewModel1.dirtyFlag().getDirty().length, 0, "We expect an empty array when restored.");
});