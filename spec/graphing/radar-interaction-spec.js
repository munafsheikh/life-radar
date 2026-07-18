process.env.ENVIRONMENT = 'production'

// Autocomplete is independently tested browser-widget behaviour. Replace it
// here so this suite can exercise the SVG renderer in JSDOM.
const autoCompletePath = require.resolve('../../src/util/autoComplete')
require.cache[autoCompletePath] = { exports: function () {} }

const GraphingRadar = require('../../src/graphing/radar')
const Radar = require('../../src/models/radar')
const Sector = require('../../src/models/sector')
const Ring = require('../../src/models/ring')
const Blip = require('../../src/models/blip')

window.SVGSVGElement.prototype.createSVGPoint = function () {
  return {
    x: 0,
    y: 0,
    matrixTransform: function () {
      return this
    },
  }
}
window.SVGElement.prototype.getScreenCTM = function () {
  return {
    inverse: function () {
      return this
    },
  }
}

describe('eight-sector radar interactions', function () {
  var radar

  function buildRadar() {
    const ring = new Ring('Adopt', 0)
    const result = new Radar()

    ;[
      'Physical',
      'Intellectual',
      'Emotional',
      'Social',
      'Spiritual',
      'Vocational',
      'Financial',
      'Environmental',
    ].forEach(function (name) {
      const sector = new Sector(name)
      sector.add(new Blip(name + ' entry', ring, false))
      result.addSector(sector)
    })

    return result
  }

  function click(selector) {
    document.querySelector(selector).dispatchEvent(new window.MouseEvent('click', { bubbles: true }))
  }

  function normalizeDegrees(angle) {
    return ((angle % 360) + 360) % 360
  }

  beforeEach(function () {
    document.body.innerHTML = ''
    document.title = 'Life Radar'
    window.print = function () {}
    radar = buildRadar()
    new GraphingRadar(800, radar).init().plot()
  })

  it('renders all eight sectors and one entry in each sector', function () {
    expect(document.querySelectorAll('.sector-group').length).toBe(8)
    expect(document.querySelectorAll('.sector-group .blip-link').length).toBe(8)
    expect(document.querySelectorAll('.sector-btn--group .button').length).toBe(8)
  })

  it('keeps each entry inside the same 45 degree wedge as its sector', function () {
    const center = 400

    radar.sectors().forEach(function (wrapper) {
      const text = document.querySelector('.sector-group-' + wrapper.order + ' .blip-text')
      const x = Number(text.getAttribute('x'))
      const y = Number(text.getAttribute('y')) - 4
      const entryAngle = (Math.atan2(x - center, center - y) * 180) / Math.PI
      const offsetInsideWedge = normalizeDegrees(entryAngle - (wrapper.startAngle - 45))

      expect(offsetInsideWedge).withContext(wrapper.sector.name()).toBeGreaterThanOrEqual(0)
      expect(offsetInsideWedge).withContext(wrapper.sector.name()).toBeLessThanOrEqual(45)
    })
  })

  it('focuses one sector and disables the other seven', function () {
    click('.button.third')

    expect(document.querySelector('#radar-plot').classList.contains('interaction-started')).toBeTrue()
    expect(document.querySelector('.button.third').classList.contains('selected')).toBeTrue()
    expect(document.querySelector('.sector-table.third').classList.contains('selected')).toBeTrue()

    const otherSectors = Array.from(document.querySelectorAll('.sector-group:not(.sector-group-third)'))
    expect(otherSectors.length).toBe(7)
    otherSectors.forEach(function (sector) {
      expect(sector.style.opacity).toBe('0')
      expect(sector.style.pointerEvents).toBe('none')
    })
  })

  it('restores all eight sectors when returning home', function () {
    click('.button.sixth')
    click('.home-link')

    Array.from(document.querySelectorAll('.sector-group')).forEach(function (sector) {
      expect(sector.style.opacity).toBe('1')
      expect(sector.style.pointerEvents).toBe('auto')
    })
    expect(document.querySelectorAll('.sector-table.selected').length).toBe(0)
  })
})
