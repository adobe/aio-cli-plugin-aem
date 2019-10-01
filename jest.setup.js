const { stdout } = require('stdout-stderr')

jest.setTimeout(30000)

beforeEach(() => {
  stdout.start()
  jest.clearAllMocks()
})
afterEach(() => { stdout.stop() })