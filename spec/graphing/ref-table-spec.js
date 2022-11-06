const Sector = require('../../src/models/sector.js')
const Ring = require('../../src/models/ring.js')
const Blip = require('../../src/models/blip.js')
const Radar = require('../../src/models/radar.js')

describe('graphingRadar', function () {
  var radar,
    element,
    physicalSector,
    intellectualSector,
    emotionalSector,
    socialSector,
    spiritualSector,
    vocationalSector,
    financialSector,
    environmentalSector

  beforeEach(function () {
    physicalSector = Sector('Physical')
    intellectualSector = Sector('Intellectual')
    emotionalSector = Sector('Emotional')
    socialSector = Sector('Social')
    spiritualSector = Sector('Spiritual')
    vocationalSector = Sector('Vocational')
    financialSector = Sector('Financial')
    environmentalSector = Sector('Environmental')

    radar = new Radar()
    radar.addSector(physicalSector)
    radar.addSector(intellectualSector)
    radar.addSector(emotionalSector)
    radar.addSector(socialSector)
    radar.addSector(spiritualSector)
    radar.addSector(vocationalSector)
    radar.addSector(financialSector)
    radar.addSector(environmentalSector)

    element = { innerHTML: '' }
    spyOn(document, 'querySelector').and.returnValue(element)
  })

  xdescribe('render', function () {
    it('groups blips by ring', function () {
      var adopt = new Ring('Adopt')
      var assess = new Ring('Assess')

      environmentalSector.add([
        new Blip('foo', adopt, true, 'this is foo'),
        new Blip('bar', assess, true, 'this is bar'),
        new Blip('baz', adopt, true, 'this is baz'),
      ])

      /*var table = new tr.graphing.RefTable(radar)
      table.init('#some-id').render()*/

      expect(element.innerHTML).toEqual(
        '<table class="radar-ref-table">' +
          '<tr class="radar-ref-status-group"><td colspan="3">Adopt</td></tr>' +
          '<tr><td>-1</td><td>foo</td><td>this is foo</td></tr>' +
          '<tr><td>-1</td><td>baz</td><td>this is baz</td></tr>' +
          '<tr class="radar-ref-status-group"><td colspan="3">Assess</td></tr>' +
          '<tr><td>-1</td><td>bar</td><td>this is bar</td></tr>' +
          '</table>',
      )
    })

    it('respects the assigned order of rings', function () {
      var adopt = new Ring('Adopt', 1)
      var assess = new Ring('Assess', 3)
      var hold = new Ring('Hold', 2)

      environmentalSector.add([
        new Blip('foo', adopt, true, 'this is foo'),
        new Blip('bar', assess, true, 'this is bar'),
        new Blip('baz', hold, true, 'this is baz'),
      ])

      /*var table = new tr.graphing.RefTable(radar)
      table.init('#some-id').render()*/

      expect(element.innerHTML).toEqual(
        '<table class="radar-ref-table">' +
          '<tr class="radar-ref-status-group"><td colspan="3">Adopt</td></tr>' +
          '<tr><td>-1</td><td>foo</td><td>this is foo</td></tr>' +
          '<tr class="radar-ref-status-group"><td colspan="3">Hold</td></tr>' +
          '<tr><td>-1</td><td>baz</td><td>this is baz</td></tr>' +
          '<tr class="radar-ref-status-group"><td colspan="3">Assess</td></tr>' +
          '<tr><td>-1</td><td>bar</td><td>this is bar</td></tr>' +
          '</table>',
      )
    })
  })
})
