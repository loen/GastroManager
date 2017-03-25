var pdf = require('pdfkit');
var fs = require('fs');
var joinPath = require('path.join');
var ordersDao = require ('./ordersDao');
var configHelper = require('./configHelper');
var _ = require('underscore');
var moment = require('moment');
var dateUtil = require ('./dateUtil');

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

//var users = [];
//for (i = 0; i < 2; i++) {
//    users.push({lp: i, user: 'a.pozlutko' + i, benefitNo: '1234567'});
//}
//generatePdf('test',users, function(date){
//   restUtil.postPdf(date);
//});
function generatePdf(restaurant, successCallback){
    var userIds = ordersDao.getCustomersFromRestaurant(restaurant);
    var benefitNoLength = configHelper.getBenefitNoLength(restaurant);
    if(userIds.length === 0){ return;}
    var users = [];
    var userLp=1;
    _.each(userIds, function(userId){
        var benefitNo = configHelper.getBenefitNo(userId);
       if(benefitNo) {
           benefitNo = trimBenefitNo(benefitNoLength, benefitNo);
           users.push({
               lp: userLp,
               user: userId,
               benefitNo: benefitNo
           });
           userLp++;
       }
    });
    console.log(users);
    var doc = new pdf;
    var date = dateUtil.formatFileTimestamp(moment());
    var text = joinPath(__dirname + './../output/',restaurant + '-' + date + '.pdf');

    console.log(text);
    var stream = fs.createWriteStream(text);
    doc.pipe(stream);
    stream.on('finish', function () { successCallback(restaurant + '-' + date)});
    createDocumentHeader(doc);
    createTableHeader(doc);

    var length = users.length;

    var nextPages = length > ROWS_ON_FIRST_PAGE;

    var firstPageCount = users.length;
    var totalPageCount = 1;
    if(nextPages){
        firstPageCount = ROWS_ON_FIRST_PAGE;
        totalPageCount = totalPageCount +  Math.floor((length - ROWS_ON_FIRST_PAGE) / ROWS_ON_NEXT_PAGES);
        if(((length - ROWS_ON_FIRST_PAGE) % ROWS_ON_NEXT_PAGES) > 0){
            totalPageCount++;
        }
    }
    var firstPage = users.slice(0, firstPageCount);
    generateFullPage(doc,328, firstPage, date);
    generateFooter(doc,1,totalPageCount);

    if(nextPages) {
        var lastPage = (length - ROWS_ON_FIRST_PAGE) % ROWS_ON_NEXT_PAGES;
        var noOfPages = Math.floor((length - ROWS_ON_FIRST_PAGE) / ROWS_ON_NEXT_PAGES);
        var startIndex = ROWS_ON_FIRST_PAGE;
        for(i = 0; i < noOfPages; i++){
            doc.addPage();
            var input = users.slice(startIndex, startIndex + ROWS_ON_NEXT_PAGES);
            generateFullPage(doc, 40, input, date);
            generateFooter(doc, i + 2, totalPageCount);
            startIndex = startIndex + ROWS_ON_NEXT_PAGES;
            console.log('page:' + i);
            console.log(input);
        }

        var lastItems = users.slice(startIndex, users.length);
        console.log('last page');
        console.log(lastItems);
        if(lastItems.length > 0){
            doc.addPage();
            generateFullPage(doc, 40, lastItems, date);
            generateFooter(doc, totalPageCount, totalPageCount);
        }
    }

    doc.end();
}

function createDocumentHeader(doc){
    doc.font(joinPath(__dirname + './../fonts', 'comicbd.ttf'))
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

    doc.font(joinPath(__dirname + './../fonts/verdanab.ttf'));
    doc.fontSize(7)
        .text('Uprzejmie prosimy o odnotowanie daty wydania, realizacji usługi na Kartę „BENEFITLUNCH”', MARGIN, 225, {width: 500, align: 'center'});
    doc.font(joinPath(__dirname + './../fonts/verdana.ttf'))
    doc.fontSize(7)
        .text('W przypadku pytań prosimy o kontakt z działem obsługi klienta pod numerem tel. 22 242 48 50 lub mailem:', MARGIN, 255, {width: 500, align: 'left'});

    doc.fontSize(7)
        .fillColor('blue')
        .text('biuro@benefitlunch.pl', 424, 255, {width: 100, align: 'left', underline: 'true'})

    doc.image(joinPath(__dirname + './../res/benefit.png'), 350, 85, {scale: 0.70});
}

function createTableHeader(doc){
    doc.font(joinPath(__dirname + './../fonts/verdanab.ttf'))
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
    doc.font(joinPath(__dirname + './../fonts/verdana.ttf'))
        .fillColor('black')
        .fontSize(9);
    doc.rect(MARGIN, rowY, LP, ROW_HIGH).stroke();
    doc.text(lp + '.' ,MARGIN + 2 ,rowY + TEXT_FROM_TOP, {width: 100, align: 'left'});
    doc.rect(MARGIN, rowY, LP + BENEFIT_NO, ROW_HIGH).stroke();
    doc.text(benefitNo, MARGIN + 30 + LP ,rowY + TEXT_FROM_TOP, {width: 100, align: 'left'});
    doc.rect(MARGIN, rowY, LP + BENEFIT_NO + DATE, ROW_HIGH).stroke();
    doc.text(date,MARGIN + 160 + LP ,rowY + TEXT_FROM_TOP, {width: 100, align: 'center'});
    doc.rect(MARGIN, rowY, LP + BENEFIT_NO + DATE + NAME, ROW_HIGH).stroke();
    doc.text(name, MARGIN + 260 + LP ,rowY + TEXT_FROM_TOP, {width: 100, align: 'center'});
    doc.rect(MARGIN, rowY, LP + BENEFIT_NO + DATE + NAME + SIGNATURE, ROW_HIGH).stroke();
}

function generateFooter(doc, pageNo, totalPageNo){
    doc.font(joinPath(__dirname + './../fonts/verdana.ttf'));
    doc.fontSize(7);
    doc.text('MultiBenefit Sp. z o. o., ul. Plac Europejski 2 00-844 Warszawa;',
        MARGIN + 70,700, {width: 300, align: 'center'});
    doc.text('tel. 22 242 48 50, e-mail:', MARGIN + 3 ,710, {width: 300, align: 'center'});
    doc.fontSize(7)
        .fillColor('blue')
        .text('e-mail: biuro@benefitlunch.pl; www.benefitsystems.pl;', MARGIN + 147 ,710, {width: 300, align: 'center', underline: 'true'});
    doc.fontSize(7)
        .fillColor('black')
        .text('NIP: 525 252 46 10', MARGIN + 280 ,710, {width: 300, align: 'center'});
    doc.text('Strona ' + pageNo + ' z ' + totalPageNo, MARGIN + 320 ,690, {width: 300, align: 'center'});
}

function generateFullPage(doc ,offset, input, date) {
    for (j = 0; j < input.length; j++) {
        var lp = input[j].lp;
        var user = input[j].user;
        var benefitNo = input[j].benefitNo;
        addTableRowOnFullPage(doc, offset, j, lp, benefitNo, date, user);
    }
}

function trimBenefitNo(benefitNoLength, benefitNo){
    if(benefitNoLength && benefitNo.length > benefitNoLength){
        var prefix = benefitNo.length - benefitNoLength;
        benefitNo = benefitNo.substr(prefix);
    }
    return benefitNo;
}
exports.generatePdf=generatePdf;