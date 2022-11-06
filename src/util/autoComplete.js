const $ = require('jquery')
require('jquery-ui/ui/widgets/autocomplete')

$.widget('custom.radarcomplete', $.ui.autocomplete, {
  _create: function () {
    this._super()
    this.widget().menu('option', 'items', '> :not(.ui-autocomplete-quadrant)')
  },
  _renderMenu: function (ul, items) {
    let currentSector = ''

    items.forEach((item) => {
      const quadrantName = item.quadrant.quadrant.name()
      if (quadrantName !== currentSector) {
        ul.append(`<li class='ui-autocomplete-quadrant'>${quadrantName}</li>`)
        currentSector = quadrantName
      }
      const li = this._renderItemData(ul, item)
      if (quadrantName) {
        li.attr('aria-label', `${quadrantName}:${item.value}`)
      }
    })
  },
})

const AutoComplete = (el, sectors, cb) => {
  const blips = sectors.reduce((acc, quadrant) => {
    return [...acc, ...quadrant.quadrant.blips().map((blip) => ({ blip, quadrant }))]
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
