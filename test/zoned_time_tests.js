const {describe, it} = require('mocha')
const {expect} = require('chai')
const zoned_time = require('../timeclock_server/zoned_time')

describe('zoned_time.isoString', () => {
    it('zero', () => expect(zoned_time.isoString(0)).equal('1970-01-01T01:00:00+01'))
    it('DST', () => expect(zoned_time.isoString(1250000000)).equal('2009-08-11T16:13:20+02'))
})
