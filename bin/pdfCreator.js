var pdf = require('pdfkit');
var fs = require('fs');
const MARGIN = 40;
const ROWS_ON_FIRST_PAGE = 18;
const ROWS_ON_NEXT_PAGES = 32;
const HEADER_START = 298;
const TEXT_FROM_TOP = 3;
const HEADER_TEXT_START = HEADER_START + TEXT_FROM_TOP;
const LP = 20;
const BENEFIT_NO = 160;
const DATE = 100;
const NAME = 100;
const SIGNATURE = 100;
const HEADER_ROW_HIGH = 30;
const ROW_HIGH = 20;


var users = [];
for (i = 0; i < 100; i++) {
    users.push({lp: i, user: 'a.pozlutko' + i, benefitNo: '1234567'});
}
generatePdf('24-03-17',users);

function generatePdf(date,users){
    var doc = new pdf;
    doc.pipe(fs.createWriteStream('./../output/'+ date +'.pdf'));
    createDocumentHeader(doc);
    createTableHeader(doc);

    var length = users.length;

    var nextPages = length > ROWS_ON_FIRST_PAGE;

    for (i = 0; i < ROWS_ON_FIRST_PAGE; i++) {
        var benefitNo = users[i].benefitNo;
        var user = users[i].user;
        addNewTableRow(doc, HEADER_START + HEADER_ROW_HIGH, 0  , i, benefitNo, date, user);
    }
    //if(nextPages){
    //    var lastPage = (length - ROWS_ON_FIRST_PAGE) % ROWS_ON_NEXT_PAGES;
    //    var noOfPages = Math.floor((length - ROWS_ON_FIRST_PAGE) / ROWS_ON_NEXT_PAGES);
    //    console.log(lastPage);
    //    console.log(noOfPages);
    //    var currentRow = ROWS_ON_FIRST_PAGE;
    //    for(pageNo = 0; pageNo < noOfPages; pageNo++){
    //        console.log('page no ' + pageNo);
    //        doc.addPage();
    //        for (i = currentRow; i < ROWS_ON_NEXT_PAGES + currentRow; i++) {
    //            console.log('currentRow=' + currentRow);
    //            if(i < length) {
    //                var benefitNo = users[i].benefitNo;
    //                var user = users[i].user;
    //                addNewTableRow(doc, 40, ROWS_ON_FIRST_PAGE, (i - (pageNo * ROWS_ON_NEXT_PAGES)), benefitNo, '24/02/2017', user);
    //                currentRow++;
    //            }
    //        }
    //    }
    //
    //}
    if(nextPages) {
        var lastPage = (length - ROWS_ON_FIRST_PAGE) % ROWS_ON_NEXT_PAGES;
        var noOfPages = Math.floor((length - ROWS_ON_FIRST_PAGE) / ROWS_ON_NEXT_PAGES);
        console.log(lastPage);
        console.log(noOfPages);
        var startIndex = ROWS_ON_FIRST_PAGE;
        for(i = 0; i < noOfPages; i++){
            console.log('startIndex' + startIndex);
            doc.addPage();
            var input = users.slice(startIndex, startIndex + ROWS_ON_NEXT_PAGES);
            generateFullPage(doc,input, date);
            startIndex = startIndex + ROWS_ON_NEXT_PAGES;
            console.log('page:' + i);
            console.log(input);
        }

        var lastItems = users.slice(startIndex, users.length);
        console.log('last page');
        console.log(lastItems);
        if(lastItems.length > 0){
            doc.addPage();
            generateFullPage(doc, lastItems, date);
        }
    }

    doc.end();
}

function createDocumentHeader(doc){
    doc.font('./../fonts/comicbd.ttf')
        .fontSize(10)
        .text('Wydania użytkowników MULTIBENEFIT', MARGIN, 50,{width: 200,
            align: 'left'});
    doc.text(' - KARTA BENEFITLUNCH-',  MARGIN + 200, 50,{width: 400,
        align: 'left',
        underline: 'true'});
    doc.text('dla Partnera Bez Terminala oraz',  MARGIN, 62,{width: 400,
        align: 'left',
        underline: 'true'});
    doc.text('Lista Awaryjna Terminalowa',  MARGIN, 72,{width: 400,
        align: 'left',
        underline: 'true'});

    doc.text('w OBIEKCIE…………………………………….', MARGIN, 172,{width: 400, align: 'left'});
    doc.text('W (miasto/ulica)…………………………………………….', MARGIN, 184,{width: 400, align: 'left'});
    doc.text('Miesiąc…………………………………………….', MARGIN, 196,{width: 400, align: 'left'});

    doc.font('./../fonts/verdanab.ttf');
    doc.fontSize(7)
        .text('Uprzejmie prosimy o odnotowanie daty wydania, realizacji usługi na Kartę „BENEFITLUNCH”', MARGIN, 225, {width: 500, align: 'center'});
    doc.font('./../fonts/verdana.ttf')
    doc.fontSize(7)
        .text('W przypadku pytań prosimy o kontakt z działem obsługi klienta pod numerem tel. 22 242 48 50 lub mailem:', MARGIN, 255, {width: 500, align: 'left'});

    doc.fontSize(7)
        .fillColor('blue')
        .text('biuro@benefitlunch.pl', 424, 255, {width: 100, align: 'left', underline: 'true'})

    doc.image('./../res/benefit.png', 350, 85, {scale: 0.70});
}

function createTableHeader(doc){
    doc.font('./../fonts/verdanab.ttf')
        .fillColor('black')
        .fontSize(9);

    doc.rect(MARGIN, HEADER_START, LP, HEADER_ROW_HIGH).stroke();
    doc.text('LP.',MARGIN + 2,HEADER_TEXT_START, {width: 40, align: 'left'});
    doc.rect(MARGIN, HEADER_START, LP + BENEFIT_NO, HEADER_ROW_HIGH).stroke();
    doc.text('NUMER KARTY',MARGIN + 30 + LP ,HEADER_TEXT_START, {width: 100, align: 'center'});
    doc.rect(MARGIN, HEADER_START, LP + BENEFIT_NO + DATE, HEADER_ROW_HIGH).stroke();
    doc.text('DATA WYDANIA',MARGIN + 160 + LP ,HEADER_TEXT_START, {width: 100, align: 'center'});
    doc.rect(MARGIN, HEADER_START, LP + BENEFIT_NO + DATE + NAME, HEADER_ROW_HIGH).stroke();
    doc.text('UŻYTKOWNIK',MARGIN + 260 + LP ,HEADER_TEXT_START, {width: 100, align: 'center'});
    doc.rect(MARGIN, HEADER_START, LP + BENEFIT_NO + DATE + NAME + SIGNATURE, HEADER_ROW_HIGH).stroke();
    doc.text('PARAFA UŻYTKOWNIKA',MARGIN + 360 + LP ,HEADER_TEXT_START, {width: 100, align: 'center'});
}

function addTableRowOnFullPage(doc, offset, index, lp, benefitNo, date, name){
    var rowY = offset + (index * ROW_HIGH);
    doc.font('./../fonts/verdana.ttf')
        .fillColor('black')
        .fontSize(9);
    doc.rect(MARGIN, rowY, LP, ROW_HIGH).stroke();
    doc.text(lp+1 + '.' ,MARGIN + 2 ,rowY + TEXT_FROM_TOP, {width: 100, align: 'left'});
    doc.rect(MARGIN, rowY, LP + BENEFIT_NO, ROW_HIGH).stroke();
    doc.text(benefitNo, MARGIN + 30 + LP ,rowY + TEXT_FROM_TOP, {width: 100, align: 'left'});
    doc.rect(MARGIN, rowY, LP + BENEFIT_NO + DATE, ROW_HIGH).stroke();
    doc.text(date,MARGIN + 160 + LP ,rowY + TEXT_FROM_TOP, {width: 100, align: 'center'});
    doc.rect(MARGIN, rowY, LP + BENEFIT_NO + DATE + NAME, ROW_HIGH).stroke();
    doc.text(name, MARGIN + 260 + LP ,rowY + TEXT_FROM_TOP, {width: 100, align: 'center'});
    doc.rect(MARGIN, rowY, LP + BENEFIT_NO + DATE + NAME + SIGNATURE, ROW_HIGH).stroke();
}

function addNewTableRow(doc, startIndex, offset, lp, benefitNo, date, name){
    var rowY = startIndex + (lp * ROW_HIGH) - (offset * ROW_HIGH);
    doc.font('./../fonts/verdana.ttf')
        .fillColor('black')
        .fontSize(9);
    doc.rect(MARGIN, rowY, LP, ROW_HIGH).stroke();
    doc.text(lp+1 + '.' ,MARGIN + 2 ,rowY + TEXT_FROM_TOP, {width: 100, align: 'left'});
    doc.rect(MARGIN, rowY, LP + BENEFIT_NO, ROW_HIGH).stroke();
    doc.text(benefitNo, MARGIN + 30 + LP ,rowY + TEXT_FROM_TOP, {width: 100, align: 'left'});
    doc.rect(MARGIN, rowY, LP + BENEFIT_NO + DATE, ROW_HIGH).stroke();
    doc.text(date,MARGIN + 160 + LP ,rowY + TEXT_FROM_TOP, {width: 100, align: 'center'});
    doc.rect(MARGIN, rowY, LP + BENEFIT_NO + DATE + NAME, ROW_HIGH).stroke();
    doc.text(name, MARGIN + 260 + LP ,rowY + TEXT_FROM_TOP, {width: 100, align: 'center'});
    doc.rect(MARGIN, rowY, LP + BENEFIT_NO + DATE + NAME + SIGNATURE, ROW_HIGH).stroke();
}

function generateFullPage(doc, input, date) {
    for (j = 0; j < input.length; j++) {
        var lp = input[j].lp;
        var user = input[j].user;
        var benefitNo = input[j].benefitNo;
        addTableRowOnFullPage(doc, 40, j, lp, benefitNo, date, user);
    }
}