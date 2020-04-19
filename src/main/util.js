export function responsePromise (event, sender, options, executor) {
  const resolve = function (data) {
    sender.send(`${event}.${options.uuid}`, {
      success: true,
      data
    })
  }
  const reject = function (data) {
    sender.send(`${event}.${options.uuid}`, {
      success: false,
      data
    })
  }
  executor(resolve, reject)
}
