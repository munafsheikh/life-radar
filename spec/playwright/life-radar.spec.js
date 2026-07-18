const { test, expect } = require('@playwright/test')

const sectors = [
  'Physical',
  'Intellectual',
  'Emotional',
  'Social',
  'Spiritual',
  'Vocational',
  'Financial',
  'Environmental',
]
const rings = ['Adopt', 'Trial', 'Assess', 'Hold']

function demoEntries() {
  return sectors.flatMap(function (sector, sectorIndex) {
    return rings.map(function (ring, ringIndex) {
      return {
        name: sector + ' ' + ring,
        ring,
        sector,
        is_new: ringIndex === 1,
        description: '<p>Playwright fixture</p>',
        display_order: sectorIndex * 4 + ringIndex + 1,
      }
    })
  })
}

test.beforeEach(async function ({ page }) {
  await page.route('**/rest/v1/radar_entries**', async function (route) {
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(demoEntries()) })
  })
})

test('renders eight sectors and keeps all entries inside their wedges', async function ({ page }) {
  const runtimeErrors = []
  page.on('pageerror', function (error) {
    runtimeErrors.push(error.message)
  })
  await page.goto('/')

  await expect(page.locator('.sector-group')).toHaveCount(8)
  await expect(page.locator('.blip-link')).toHaveCount(32)
  await expect(page.locator('.sector-btn--group .button')).toHaveCount(8)

  const geometry = await page.locator('#radar-plot').evaluate(function (svg) {
    const center = Number(svg.getAttribute('width')) / 2
    const starts = [45, 0, -45, -90, 90, 135, -135, -180]
    const normalize = (angle) => ((angle % 360) + 360) % 360
    const orders = ['first', 'second', 'third', 'fourth', 'fifth', 'sixth', 'seventh', 'eighth']

    return starts.map(function (startAngle, index) {
      return Array.from(svg.querySelectorAll('.sector-group-' + orders[index] + ' .blip-text')).every(function (text) {
        const x = Number(text.getAttribute('x'))
        const y = Number(text.getAttribute('y')) - 4
        const angle = (Math.atan2(x - center, center - y) * 180) / Math.PI
        const offset = normalize(angle - (startAngle - 45))
        return offset >= 0 && offset <= 45
      })
    })
  })

  expect(geometry).toEqual([true, true, true, true, true, true, true, true])
  expect(runtimeErrors).toEqual([])
})

test('focus hides seven sectors and home restores eight', async function ({ page }) {
  await page.goto('/')
  await page.locator('.button.third').click()

  await expect(page.locator('#radar-plot')).toHaveClass(/interaction-started/)
  await expect(page.locator('.sector-table.third')).toHaveClass(/selected/)
  await expect(page.locator('.sector-group-third')).toBeVisible()

  const hidden = page.locator('.sector-group:not(.sector-group-third)')
  await expect(hidden).toHaveCount(7)
  for (let index = 0; index < 7; index++) await expect(hidden.nth(index)).toBeHidden()

  await page.locator('.home-link').click()
  for (let index = 0; index < 8; index++) await expect(page.locator('.sector-group').nth(index)).toBeVisible()
  await expect(page.locator('.sector-table.selected')).toHaveCount(0)
})

test('radar remains within desktop and mobile viewports', async function ({ page }) {
  await page.goto('/')
  await expect(page.locator('#radar-plot')).toBeVisible()

  const dimensions = await page.evaluate(function () {
    return {
      viewportWidth: document.documentElement.clientWidth,
      contentWidth: document.documentElement.scrollWidth,
      radarWidth: document.querySelector('#radar-plot').getBoundingClientRect().width,
    }
  })

  expect(dimensions.radarWidth).toBeGreaterThan(0)
  expect(dimensions.contentWidth).toBeLessThanOrEqual(dimensions.viewportWidth + 2)
})
