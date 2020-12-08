const express = require('express');

const bookTestRouter = express.Router();

bookTestRouter.post('/booktest', (req, res, next) => {
    console.log(req.body);
    return res.redirect('/success');
});

module.exports = bookTestRouter;