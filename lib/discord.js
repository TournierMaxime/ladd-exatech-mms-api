import { PermissionsBitField } from 'discord.js'

const createChannel = async (server, data, images) => {
  console.log(images)
  const channel = await server.channels.create({
    name: `ticket_${data.ticketId}`
  })

  await channel.permissionOverwrites.set([
    {
      id: process.env.DISCORD_BOT_ID,
      allow: [PermissionsBitField.Flags.SendMessages]
    }, {
      id: process.env.DISCORD_BOT_ID,
      allow: [PermissionsBitField.Flags.ManageChannels]
    },
    {
      id: process.env.DISCORD_BOT_ID,
      allow: [PermissionsBitField.Flags.CreateInstantInvite]
    }
  ])

  await channel.send(`Titre: ${data.title}\nDescription: ${data.description}`)

  if (images && images.length > 0) {
    for (const image of images) {
      await channel.send(image.imagePath)
    }
  }

  const invite = await channel.createInvite({ maxAge: 60 * 60 * 24 * 7 })
  return `https://discord.gg/${invite.code}`
}

const deleteChannel = async (server, data) => {
  const channel = server.channels.cache.find(ch => ch.name === `ticket_${data}`)
  if (channel) {
    await channel.delete()
  }
}

export { createChannel, deleteChannel }
