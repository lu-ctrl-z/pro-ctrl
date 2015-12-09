/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes map URLs to views and controllers.
 *
 * If Sails receives a URL that doesn't match any of the routes below,
 * it will check for matching files (images, scripts, stylesheets, etc.)
 * in your assets directory.  e.g. `http://localhost:1337/images/foo.jpg`
 * might match an image file: `/assets/images/foo.jpg`
 *
 * Finally, if those don't match either, the default 404 handler is triggered.
 * See `api/responses/notFound.js` to adjust your app's 404 logic.
 *
 * Note: Sails doesn't ACTUALLY serve stuff from `assets`-- the default Gruntfile in Sails copies
 * flat files from `assets` to `.tmp/public`.  This allows you to do things like compile LESS or
 * CoffeeScript for the front-end.
 *
 * For more information on configuring custom routes, check out:
 * http://sailsjs.org/#/documentation/concepts/Routes/RouteTargetSyntax.html
 */

module.exports.routes = {
  '*': function(req, res, next) {
      res.setLocale((req.session.user && req.session.user.lang) || sails.config.i18n.defaultLocale); 
      return next();
  },
  '/': {
      controller: 'MainController',
      action: 'index'
  },
  '/admin/': {
      controller: 'AdminController',
      action: 'index',
      locals: {
          layout: 'layouts/admin_layout'
      }
  },
  'get /admin/login/': {
      controller: 'AdminController',
      action: 'login',
      locals: {
          layout: 'layouts/admin_layout'
      }
  },
  'post /admin/login/': {
      controller: 'UserController',
      action: 'doLoginAdmin',
      locals: {
          layout: 'layouts/admin_layout'
      }
  },
  
};
