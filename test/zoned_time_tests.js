const {describe, it} = require('mocha')
const {expect} = require('chai')
const zoned_time = require('../timeclock_server/zoned_time')

describe('zoned_time.isoTimestamp', () => {
    it('zero', () => expect(zoned_time.isoTimestamp(0)).equal('1970-01-01T01:00:00+01'))
    it('DST', () => expect(zoned_time.isoTimestamp(1250000000)).equal('2009-08-11T16:13:20+02'))
})

describe('zoned_time.parseIsoTimestamp', () => {
    it('zero', () => expect(zoned_time.parseIsoTimestamp('1970-01-01T00:00:00Z')).equal(0))
    it('zero+0000', () => expect(zoned_time.parseIsoTimestamp('1970-01-01T00:00:00+00:00')).equal(0))
    it('zero+0100', () => expect(zoned_time.parseIsoTimestamp('1970-01-01T00:00:00+01')).equal(-3600))
    it('DST', () => expect(zoned_time.parseIsoTimestamp('2009-08-11T16:13:20+02')).equal(1250000000))
    it('UTC', () => expect(zoned_time.parseIsoTimestamp('2009-08-11T14:13:20Z')).equal(1250000000))
})
