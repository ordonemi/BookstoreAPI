const express = require('express');
const router = express.Router();
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('../swagger.json');
const passport = require('passport');
const authCheck = require('../util/checkUser');
require('../util/auth');

router.use('/api-docs', swaggerUi.serve);
router.get('/api-docs', swaggerUi.setup(swaggerDocument));

router.use('/books', authCheck.isLoggedIn, require('./books'));
router.use('/users', authCheck.isLoggedIn, require('./users'));

router.get('/auth/google',
    passport.authenticate('google', { scope: ['email', 'profile'] })
);

router.get('/google/callback',
    passport.authenticate('google', {
        successRedirect: '/protected',
        failureRedirect: '/auth/failure',
    })
);

router.get('/auth/failure', (req, res) => {
    res.send('Something went wrong..')
})

router.get('/protected', authCheck.isLoggedIn, (req, res) => {
    res.send(`Hello ${req.user.displayName}`);
});

router.get('/logout', (req, res) => {
    //req.logout();
    req.session.destroy();
    res.send('Goodbye!')
})

module.exports = router;