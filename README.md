[![Build Status](https://travis-ci.org/artisanalcode/knockout.dirty.svg)](https://travis-ci.org/artisanalcode/knockout.dirty)

Knockout Dirty
==============
----------
Knockout Dirty is a change tracker (dirty flag) for Knockout view models (and view models' properties). When the value of an observable changes the "flag" is set to "dirty".

The plugin is heavily inspired by the examples and plugins provided by John Papa, Ryan Niemeyer and others. So what is different? It integrates methods to restore your view model (or tracked properties) to is "clean" state.  Additionally the plugin is fully unit tested, and thoroughly commented.

This plug-in is also thought as a "microuniverse" of web development, it includes many of the aspects you would find in larger projects, it presents an opportunity for learning and practicing in a smaller scale. You will encounter principles and practices of: maintainable and testable code, unit testing(QUnit), documentation(JSDoc 3), templating(Handlebars), build tasks(Grunt), versioning(Git), continuous integration(Travis), MV* frameworks/libraries(KnockoutJS), dependency management/injection(UMD), etc. It is ideal for those eager to learn and practice.

Usage
-----
----------
Add ko.dirtyFlag to your view model.

    var myViewModel = function () {
    	var self = this;
    	
    	self.id = ko.observable("");
    	self.myFirstProperty = ko.observable("ID_STRING");
    	self.mySecondProperty = ko.observable("ID_PROPERTY_VALUE");
		
		self.dirtyFlag = new ko.dirtyFlag(self);	
		return self;
    }

Use the dirty flag in your view model. E.g. Advice a user he has not saved his changes:

    myViewModel.canLeave = ko.pureComputed(function () {
	    return myViewModel.dirtyFlag().isDirty();
    });

Reset the dirty flag. E.g. On AJAX request success callback.

    $.ajax({
	    url: "my-api/end-point",
	    method: "POST",
	    data: myData,
	    success: function () {
		    myViewModel.dirtyFlag().resetFlag();
	    }
    });

Restore the view model. E.g The user doesn't want to save/submit changes.

    $(window).unload(function(){
	    myViewModel.dirtyFlag().restore();
    });

Contribute
-----------
----------
Please feel free to contribute, fork and comment. If you decide to do so, please follow these guidelines:

**Feature Requests**
The best way to request a feature is to open an issue, and a pull request, with your desired/needed feature.

**Issues**
If you found a bug, please open an issue in Knockout.dirtyFlag's github repository. You can also open a new pull request to fix it.

**Pull Requests**
Update or add unit tests as needed. Remember we want to provide a 100% tested plug-in. Use a descriptive commit.

**Coding Styles**
There are a few rules to follow:
 - Indentation 4 spaces. 	
 - Camel case.
 - Single variable declaration. 	
 - Use semi-colons.
 - Add documentation using JSDoc 3.
 - File names use train case.
 - Write maintainable, testable code.

**Fun**
Have fun, as fun much as you want.
