/**
 * Route Mappings (sails.config.routes)
 * 
 * Your routes map URLs to views and controllers.
 * 
 * If Sails receives a URL that doesn't match any of the routes below, it will
 * check for matching files (images, scripts, stylesheets, etc.) in your assets
 * directory. e.g. `http://localhost:1337/images/foo.jpg` might match an image
 * file: `/assets/images/foo.jpg`
 * 
 * Finally, if those don't match either, the default 404 handler is triggered.
 * See `api/responses/notFound.js` to adjust your app's 404 logic.
 * 
 * Note: Sails doesn't ACTUALLY serve stuff from `assets`-- the default
 * Gruntfile in Sails copies flat files from `assets` to `.tmp/public`. This
 * allows you to do things like compile LESS or CoffeeScript for the front-end.
 * 
 * For more information on configuring custom routes, check out:
 * http://sailsjs.org/#/documentation/concepts/Routes/RouteTargetSyntax.html
 */

module.exports.routes = {
    '*' : function(req, res, next) {
        res.setLocale((req.session.user && req.session.user.lang)
                || sails.config.i18n.defaultLocale);
        return next();
    },
    '/' : {
        controller : 'HomeController',
        action : 'home',
        locals : {
            layout : 'layouts/layout'
        }
    },
    '/admin' : {
        controller : 'admin/AdminController',
        action : 'index',
        locals : {
            layout : 'layouts/admin_layout'
        }
    },
    'get /login' : {
        controller : 'admin/AdminController',
        action : 'login',
        locals : {
            layout : 'layouts/admin_layout'
        }
    },
    'post /login' : {
        controller : 'admin/UserController',
        action : 'doLoginAdmin',
        locals : {
            layout : 'layouts/admin_layout'
        }
    },
    '/logout' : {
        controller : 'admin/UserController',
        action : 'doLogout',
    },
    '/admin/user' : {
        controller : 'admin/AdminController',
        action : 'index',
        locals : {
            layout : 'layouts/admin_layout'
        }
    },
    // create user in admin
    'get /admin/user/add' : {
        controller : 'admin/AdminController',
        action : 'userForm',
        locals : {
            layout : 'layouts/admin_layout'
        }
    },
    'get /admin/user/edit' : {
        controller : 'admin/AdminController',
        action : 'userFormEdit',
        locals : {
            layout : 'layouts/admin_layout'
        }
    },
    'post /admin/user/edit' : {
        controller : 'admin/AdminController',
        action : 'userEdit',
        locals : {
            layout : 'layouts/admin_layout'
        }
    },
    'post /admin/user/add' : {
        controller : 'admin/AdminController',
        action : 'addUser',
        locals : {
            layout : 'layouts/admin_layout'
        }
    },

    //QL thông tin khách hàng
    '/customer' : {
        controller : 'customer/CustomerController',
        action : 'index',
        locals : {
            layout : 'layouts/layout'
        }
    },
    '/customer/list' : {
        controller : 'customer/CustomerController',
        action : 'actionLoadCustomer',
        locals : {
            layout : null
        }
    },
    'post /customer/save-and-invoice' : {
        controller : 'customer/CustomerController',
        action : 'actionSaveAndInvoice',
        locals : {
            layout : null
        }
    },
    '/customer/edit' : {
        controller : 'customer/CustomerController',
        action : 'actionPrepareUpdate',
        locals : {
            layout : null
        }
    },
    '/customer/delete' : {
        controller : 'customer/CustomerController',
        action : 'actionDelete',
        locals : {
            layout : null
        }
    },
    //QL thông tin đơn hàng
    '/invoice/form' : { // load form nhập đơn hàng
        controller : 'invoice/InvoiceController',
        action : 'actionPrepareUpdate',
        locals : {
            layout : 'layouts/popupLayout'
        }
    },
    'post /invoice/save-invoice' : { // Lưu thông tin đơn hàng
        controller : 'invoice/InvoiceController',
        action : 'actionProcessUpdate',
        locals : {
            layout : null
        }
    },
};
