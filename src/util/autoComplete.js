const $ = require('jquery')
require('jquery-ui/ui/widgets/autocomplete')

$.widget('custom.radarcomplete', $.ui.autocomplete, {
  _create: function () {
    this._super()
    this.widget().menu('option', 'items', '> :not(.ui-autocomplete-sector)')
  },
  _renderMenu: function (ul, items) {
    let currentSector = ''

    items.forEach((item) => {
      const sectorName = item.sector.sector.name()
      if (sectorName !== currentSector) {
        ul.append(`<li class='ui-autocomplete-sector'>${sectorName}</li>`)
        currentSector = sectorName
      }
      const li = this._renderItemData(ul, item)
      if (sectorName) {
        li.attr('aria-label', `${sectorName}:${item.value}`)
      }
    })
  },
})

const AutoComplete = (el, sectors, cb) => {
  const blips = sectors.reduce((acc, sector) => {
    return [...acc, ...sector.sector.blips().map((blip) => ({ blip, sector }))]
  }, [])

  $(el).radarcomplete({
    source: (request, response) => {
      const matches = blips.filter(({ blip }) => {
        const searchable = `${blip.name()} ${blip.description()}`.toLowerCase()
        return request.term.split(' ').every((term) => searchable.includes(term.toLowerCase()))
      })
      response(matches.map((item) => ({ ...item, value: item.blip.name() })))
    },
    select: cb.bind({}),
  })
}

module.exports = AutoComplete
