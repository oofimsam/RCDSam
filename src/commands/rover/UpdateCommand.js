const Command = require('../Command')
const DiscordServer = require('../../DiscordServer')
const { Role } = require('discord.js')

async function recursiveUpdate (memberArray, server, msg) {
  let nextMember = memberArray.pop()
  if (!nextMember) {
    return msg.reply(`:white_check_mark: Finished bulk update! ${server.bulkUpdateCount} members affected.`).then(() => {
      server.bulkUpdateCount = 0
      server.ongoingBulkUpdate = false
    })
  }

  if (!nextMember.user.bot) {
    let member = await server.getMember(nextMember.id)
    if (member) {
      await member.verify({ skipWelcomeMessage: true })
      server.bulkUpdateCount++
    }
  }
  return recursiveUpdate(memberArray, server, msg)
}

module.exports =
class UpdateCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'update',
      properName: 'Update',
      aliases: ['rcdverupdate'],
      description: '`<Discord User>` Forcibly update verification status of a user, same as them running !verify. Make sure you @mention the user.',

      args: [
        {
          key: 'user',
          prompt: 'User to update',
          type: 'user|role'
        }
      ]
    })
  }

  hasPermission (msg) {
    return this.client.isOwner(msg.author) || msg.member.hasPermission(this.userPermissions) || msg.member.roles.find(role => role.name === 'RCDVer Admin') || msg.member.roles.find(role => role.name === 'RCDVer Updater')
  }

  async fn (msg, args) {
    let target = args.user
    DiscordServer.clearMemberCache(target.id)

    let server = await this.discordBot.getServer(msg.guild.id)
    if (!(target instanceof Role)) { // They want to update a specific user (roles have .hoist, users do not)
      let member = await server.getMember(target.id)
      if (!member) {
        return msg.reply('User not in guild.')
      }

      member.verify({ message: msg, skipWelcomeMessage: true })
    } else if (!this.discordBot.isPremium()) {
      return msg.reply('Sorry, updating more than one user is only available with RCDVer Plus: <https://www.patreon.com/erynlynn>.')
    } else { // They want to update a whole role (premium feature)
      let roleMembers = target.members.array()
      let affectedCount = roleMembers.length // # of affected users
      let server = await this.discordBot.getServer(msg.guild.id)

      if (server.ongoingBulkUpdate) {
        return msg.reply('There is already an ongoing bulk update in this server.')
      }

      if (affectedCount > 250) {
        return msg.reply(`Sorry, but RCDVer only supports updating up to 250 members at once. Updating this role would affect ${affectedCount} members.`)
      }

      server.ongoingBulkUpdate = true
      msg.reply(`:hourglass_flowing_sand: Updating ${affectedCount} members. We'll let you know when we're done.`)

      recursiveUpdate(roleMembers, server, msg)
    }
  }
}
