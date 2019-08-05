const Command = require('../Command')

module.exports =
class HelpCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'botowner',
      properName: 'BOTOwner',
      aliases: ['botowner'],
      description: 'Tells you who owns RCDVer'
    })
  }

  async fn (msg) {
    let output = `Hello! My owner you ask? The name of my owner is Sudden_Demise aka Sam! His discord tag is samtheman#0001 and his developer ID is 404370304547291147.`

    msg.reply(output)
  }
}
