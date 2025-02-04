const ExceptionMessages = {
  TOO_MANY_SECTORS: 'There are more than 8 sector names listed in your data. Check the sector column for errors.',
  TOO_MANY_RINGS: 'More than 4 rings.',
  MISSING_HEADERS:
    'Document is missing one or more required headers or they are misspelled. ' +
    'Check that your document contains headers for "name", "ring", "sector", "isNew", "description".',
  MISSING_CONTENT: 'Document is missing content.',
  LESS_THAN_EIGHT_SECTORS:
    'There are less than 8 sector names listed in your data. Check the sector column for errors.',
  SHEET_NOT_FOUND: 'Oops! We can’t find the Google Sheet you’ve entered. Can you check the URL?',
  UNAUTHORIZED: 'UNAUTHORIZED',
}

module.exports = ExceptionMessages
