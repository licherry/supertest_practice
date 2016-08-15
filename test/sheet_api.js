/**
 * Created by chenli on 8/11/16.
 */
var request = require('supertest')('https://sheets.googleapis.com/v4/spreadsheets');
var chai = require('chai');
var expect = require('chai').expect;

var spreadsheetId = '1HdzbvwDDpebq9vUbCeIPPP7l7B4RxPO5QjhC3QRqQ7w';
var accessToken = 'Bearer ya29.CjBAA_DrxoMfpCwIUbYm3X58262aC8m7-zzN9RyHFODaVGRyFh8ebQtr0KZrTkrvxlQ';


var titleName = "LC";
var jsonType = 'application/json';
var singleBody = {
    "majorDimension": "ROWS",
    "values": [
        ["Item", "Cost", "Stocked", "Ship Date"],
        ["Wheel", "$20.50", "4", "3/1/2016"],
        ["Door", "$15", "2", "3/15/2016"],
        ["Engine", "$100", "1", "30/20/2016"],
        ["Totals", "=SUM(B2:B4)", "=SUM(C2:C4)", "=MAX(D2:D4)"]
    ]
};
var range = 'LC!A1:D5';
var deleteId;

describe('GOOGLE SHEETS API', function () {

    it('Scenario 4: Add a new sheet -LC', function (done) {

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
                console.log(res.body.spreadsheetId);
                expect(res.body.spreadsheetId).to.equal(spreadsheetId);
                expect(res.body.replies[0].addSheet.properties.title).to.equal(titleName);
            })
            .end(function (err,res) {

                deleteId = res.body.replies[0].addSheet.properties.sheetId;
                done(err);

            })
    });

    it('Scenario 5: Write to multiple ranges', function (done) {

        this.timeout(10000);

        var multipleRangesBody = {
            "valueInputOption": "USER_ENTERED",
            "data": [
                {
                    "range": "LC!A1:A4",
                    "majorDimension": "COLUMNS",
                    "values": [
                        ["Item", "Wheel", "Door", "Engine"]
                    ]
                },
                {
                    "range": "LC!B1:D2",
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

    it('Scenario 6: Write a single range', function (done) {

        request.put('/' + spreadsheetId + '/values/' + range)
            .query({valueInputOption: 'USER_ENTERED'})
            .set('Authorization', accessToken)
            .set('Content-Type', jsonType)
            .send(singleBody)

            .expect(function (res) {

                expect(res.body.spreadsheetId).to.equal(spreadsheetId);
                expect(res.body.updatedRange).to.equal(range);
                expect(res.body.updatedRows).to.equal(5);
            })
            .end(function (err, res) {
            done(err);
        })

    });

    it('Scenario 7: Read a single range', function (done) {

        request.get('/' + spreadsheetId + '/values/' + range)
            .set('Authorization', accessToken)

            .expect(function (res) {
                expect(res.body.range).to.equal(range);
            }).end(done)

    });

    it('Scenario 8: Delete a sheet by ID', function (done) {

        var deleteBody = {
            "requests": [
                {
                    "deleteSheet": {
                        "sheetId": deleteId
                    }

                }
            ]
        }
        request.post('/' + spreadsheetId + ':batchUpdate')
            .set('Authorization', accessToken)
            .set('Content-Type', jsonType)
            .send(deleteBody)

            .expect(function (res) {

                expect(res.body.spreadsheetId).to.equal(spreadsheetId)
            }).end(done)

    });
});
