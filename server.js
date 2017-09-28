'use strict'

const
express = require('express'),
app = express(),
port = 3000,
route = require('./api/routes/route');

route(app);
app.listen(port);

console.log("Server started on " + port);

