const { CommandInteraction, Permissions } = require('discord.js')

module.exports = {
    name: "청소",
    description: '입력된 개수만큼 메시지를 삭제해요!',
    options: [
        {
            name: "개수",
            description: "메시지 청소 개수를 입력해주세요!",
            type: "INTEGER",
            required: true
        },
    ],
    /**
     * @param { CommandInteraction } Interaction
     */

    async execute(interaction) {
        if (!interaction.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) return interaction.reply({ content: "명령어를 사용할 권한이 없어요!", ephemeral: true });

        const amount = interaction.options.getInteger('개수');

        if (amount > 100) return interaction.reply({content: "100개 이상의 메시지는 지울 수 없어요!", ephemeral: true })

        if (amount < 1) return interaction.reply({content: "1개 미만의 메시지는 지울 수 없어요!", ephemeral: true })

        await interaction.channel.bulkDelete(amount, true).catch(err => interaction.reply(`오류가 발생했어요`))

        return interaction.reply({content: `**${amount}** 개의 메시지를 삭제했어요!`, ephemeral: true})
    }
}