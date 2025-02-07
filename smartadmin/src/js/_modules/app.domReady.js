/**
 * DOCUMENT LOADED EVENT
 * DOC: Fire when DOM is ready
 * Do not change order a, b, c, d...
 **/
jQuery(document).ready(function() {

	/**
	 * detect desktop or mobile 
	 **/
	initApp.addDeviceType();

	/**
	 * detect Webkit Browser 
	 **/
	initApp.detectBrowserType();

	/**
	 * a. check for mobile view width and add class .mobile-view-activated
	 **/
	initApp.mobileCheckActivation();

 	/**
	 * b. build navigation
	 **/
	initApp.buildNavigation(myapp_config.navHooks);

 	/**
	 * c. initialize nav filter
	 **/
	initApp.listFilter(myapp_config.navHooks, myapp_config.navFilterInput, myapp_config.navAnchor);

 	/**
	 * d. run DOM misc functions
	 **/
	initApp.domReadyMisc();

 	/**
	 * e. run app forms class detectors [parentClass,focusClass,disabledClass]
	 **/
	initApp.appForms('.input-group', 'has-length', 'has-disabled');

	console.log("calling zsi application to start.");
	if( typeof app.init !== "undefined") app.init(); 	

}); 
