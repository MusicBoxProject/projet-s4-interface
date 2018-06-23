const express = require('express'); 
const app = express(); 

app.get('*', function(req, res) {
  res.sendfile('./src/index.html')
})
app.use(express.static(__dirname + '/dist')); 
app.listen(process.env.PORT || 8080);
//Server