import _ from 'lodash'
// @ts-expect-error
import * as _db from 'lodash-id'

interface ILoDashMixins extends _.LoDashStatic {
  insert: (...args: any[]) => any
}

_.mixin(_db)

export default _ as ILoDashMixins
