var pdf = require('pdfkit');
var fs = require('fs');


var doc = new pdf;

doc.pipe(fs.createWriteStream('./../output/output.pdf'));

doc.font('Times-Roman')
    .fontSize(22)
    .text('011110101', doc.x, 100,{width: 200,
        align: 'left'})
    .text('011110102', doc.x, 120,{width: 200,
        align: 'left'});
doc.rect(doc.x, 98, 200, 20).stroke();
doc.rect(272, 98, 200, 20).stroke();
doc.rect(doc.x, 118, 200, 20).stroke();
doc.rect(272, 118, 200, 20).stroke();

doc.image('./../res/benefit.png', 0, 150);

doc.end()