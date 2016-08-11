/**
 * Created by chenli on 8/11/16.
 */
var request = require('supertest')('https://sheets.googleapis.com/v4/spreadsheets');
var chai = require('chai');
var expect = require('chai').expect;

var spreadsheetId = '1HdzbvwDDpebq9vUbCeIPPP7l7B4RxPO5QjhC3QRqQ7w';
var accessToken = 'Bearer ya29.CjA8A8Q30QWDv3mSKCHInI31Tj_eaIKMLLIvfj-7kvNrXlF7Ytyx9BzF56pOKdT9lNQ';


var titleName = "LC2";
var jsonType = 'application/json';
var sheetId;

describe('GOOGLE SHEETS API', function () {

    it('Scenario 4: Add a new sheet -LC1', function (done) {

        this.timeout(10000);

        var singleSheetBody = {
            "requests": [
                {
                    "addSheet": {
                        "properties": {
                            "title": titleName,
                            "gridProperties": {
                                "rowCount": 20,
                                "columnCount": 12
                            },
                            "tabColor": {
                                "red": 1.0,
                                "green": 0.3,
                                "blue": 0.4
                            }
                        }
                    }
                }
            ]
        }

        request.post('/' + spreadsheetId + ':batchUpdate')
            .set('Authorization', accessToken)
            .set('Content-Type', jsonType)
            .send(singleSheetBody)
            .expect(200)
            .expect(function (res) {
                expect(res.body.spreadsheetId).to.equal(spreadsheetId);
                expect(res.body.replies[0].addSheet.properties.title).to.equal(titleName);
            })
            .end(function (err,res) {
                sheetId = res.body.replies[0].addSheet.properties.sheetId;
                done(err);
            })
    });

    it('Scenario 5: Write to multiple ranges', function (done) {

        this.timeout(10000);

        var multipleRangesBody = {
            "valueInputOption": "USER_ENTERED",
            "data": [
                {
                    "range": "LC1!A1:A4",
                    "majorDimension": "COLUMNS",
                    "values": [
                        ["Item", "Wheel", "Door", "Engine"]
                    ]
                },
                {
                    "range": "LC1!B1:D2",
                    "majorDimension": "ROWS",
                    "values": [
                        ["Cost", "Stocked", "Ship Date"],
                        ["$20.50", "4", "3/1/2016"]
                    ]
                }
            ]
        };

        request.post('/' + spreadsheetId + '/values:batchUpdate')
            .set('Authorization', accessToken)
            .set('Content-Type', jsonType)
            .send(multipleRangesBody)
            .expect(function (res) {
                expect(res.body.spreadsheetId).to.equal(spreadsheetId);
                expect(res.body.totalUpdatedCells).to.equal(10);
            })
            .end(done)

    });
});
