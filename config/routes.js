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
      action: 'index',
  },
  '/admin': {
      controller: 'AdminController',
      action: 'index',
      locals: {
          layout: 'layouts/admin_layout'
      }
  },
  'get /login': {
      controller: 'AdminController',
      action: 'login',
      locals: {
          layout: 'layouts/admin_layout'
      }
  },
  'post /login': {
      controller: 'UserController',
      action: 'doLoginAdmin',
      locals: {
          layout: 'layouts/admin_layout'
      }
  },
  '/logout': {
      controller: 'UserController',
      action: 'doLogout',
  },
  '/admin/user': {
      controller: 'AdminController',
      action: 'index',
      locals: {
          layout: 'layouts/admin_layout'
      }
  },
  //create user in admin
  'get /admin/user/add': {
      controller: 'AdminController',
      action: 'userForm',
      locals: {
          layout: 'layouts/admin_layout'
      }
  },
  'get /admin/user/edit': {
      controller: 'AdminController',
      action: 'userFormEdit',
      locals: {
          layout: 'layouts/admin_layout'
      }
  },
  'post /admin/user/edit': {
      controller: 'AdminController',
      action: 'userEdit',
      locals: {
          layout: 'layouts/admin_layout'
      }
  },
  'post /admin/user/add': {
      controller: 'AdminController',
      action: 'addUser',
      locals: {
          layout: 'layouts/admin_layout'
      }
  },
  'get /admin/project' : {
      controller: 'AdminController',
      action: 'projectIndex',
      locals: {
          layout: 'layouts/admin_layout'
      }
  },
  'get /admin/project/edit' : {
      controller: 'AdminController',
      action: 'projectEdit',
      locals: {
          layout: 'layouts/admin_layout'
      }
  },
  'get /admin/project/add' : {
      controller: 'AdminController',
      action: 'projectAdd',
      locals: {
          layout: 'layouts/admin_layout'
      }
  },
  'post /admin/project/add' : {
      controller: 'AdminController',
      action: 'projectAddDo',
      locals: {
          layout: 'layouts/admin_layout'
      }
  },
  'post /admin/project/edit' : {
      controller: 'AdminController',
      action: 'projectEditDo',
      locals: {
          layout: 'layouts/admin_layout'
      }
  },
  '/admin/project/user' : {
      controller: 'AdminController',
      action: 'projectUserModify',
      locals: {
          layout: 'layouts/admin_layout'
      }
  },
  '/sprint/add' : {
      controller: 'MainController',
      action: 'sprintForm',
      locals: {
          layout: null
      }
  },
  '/sprint/doIt' : {
      controller: 'MainController',
      action: 'sprintDo',
      locals: {
          layout: null
      }
  },
  //for TaskController
  'get /task/create' : {
      controller: 'TaskController',
      action: 'getCreate',
      locals: {
          layout: null
      }
  },
  'post /task/create' : {
      controller: 'TaskController',
      action: 'postCreate',
      locals: {
          layout: null
      }
  },
  'get /task/edit/:id' : {
      controller: 'TaskController',
      action: 'getEdit',
      locals: {
          layout: null
      }
  },
  //for IOController
  '/user/welcome' : {
      controller: 'IOController',
      action: 'welcome',
  },
  '/user/join' : {
      controller: 'IOController',
      action: 'joinRoom',
  },
  '/task/delete/:id': {
      controller: 'IOController',
      action: 'deleteTask',
  },
  '/task/change/:id/:status': {
      controller: 'IOController',
      action: 'changeTask',
  },
  '/task/show/:id': {
      controller: 'IOController',
      action: 'showTask',
  },
  '/task/duration/:id': {
      controller: 'TaskController',
      action: 'showDuration',
  },
  //for TaskController
  //for ProductAdminController
  '/product/admin': {
      controller: 'product/admin/ProductAdminController',
      action: 'index',
  },
};
