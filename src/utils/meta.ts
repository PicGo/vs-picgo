import pkg = require('../../package.json')
import nls = require('../../package.nls.json')

export const getNLSText = (field: keyof typeof nls) => {
  return nls[field]
}

export const contributes = pkg.contributes
