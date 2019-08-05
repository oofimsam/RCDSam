const Command = require('../Command')

module.exports =
class AnnounceChannelCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'support',
      properName: 'Support',
      aliases: ['server'],
      userPermissions: [],
      description: 'Posts an invite link to the Official RCDVer Discord where you can easily get help.'
    })
  }

  async fn (msg) {
    try {
      msg.author.send('Having trouble? You can join our official support discord here: discord.gg/uv7Fz35, or you can check out the documentation here: https://rover.link/#readme')
      msg.reply('Sent you a DM with information.')
    } catch (e) {
      msg.reply("I can't seem to message you - please make sure your DMs are enabled!")
    }
  }
}
