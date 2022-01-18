const { CommandInteraction, Permissions } = require('discord.js')

module.exports = {
    name: "밴",
    description: '사용자를 차단해요!.',
    options: [
        {
            name: "유저",
            description: "밴할 유저를 선택해주세요!",
            type: "USER",
            required: true
        },
        {
            name: '사유',
            description: "사유를 입력해주세요!",
            type: "STRING",
            required: false
        }
    ],
    /**
     * @param { CommandInteraction } Interaction
     */

    async execute(interaction) {
        let user = interaction.options.getMember('유저')
        let reason = interaction.options.getString("사유")
        if(!reason) reason = '없음';
        if (!interaction.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) return interaction.reply({ content: "명령어를 사용할 권한이 없어요!", ephemeral: true });
        await user.send(`${interaction.guild.name} 서버에서 당신을 차단했어요!\n관리자 : ${interaction.user.username}\n사유: ${reason}`).catch(err => console.log(err))
        await user.ban({reason: reason})
        await interaction.reply(`**${user.user.tag}** 님을 차단했어요!`)
    }
}