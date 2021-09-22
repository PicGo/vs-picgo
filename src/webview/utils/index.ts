/**
 * Utils that can only work in webview
 */

import { showMessage } from '../pages/channel'

// Turn an async function to an ordinary function to avoid ESLint complaints
// This function will turn an async function from return promise to return void, in this way you don't need to wait the async function finished
export function asyncWrapper<Args extends any[], T>(
  fn: (...args: Args) => Promise<T>
) {
  return (...args: Parameters<typeof fn>): void => {
    ;(async () => {
      // return T here
      return await fn(...args)
    })().catch(async (e) => {
      await showMessage({
        type: 'error',
        message: `Unexpected error: ${String(e)}`
      })
    })
    // return void here
  }
}
