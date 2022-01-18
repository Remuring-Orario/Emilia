const { CommandInteraction, Permissions } = require('discord.js')

module.exports = {
    name: "뮤트",
    description: '사용자를 타임아웃 해요!',
    options: [
        {
            name: "유저",
            type: "USER",
            description: "유저를 선택해주세요!",
            required: true
        },
        {
            name: "길이",
            type: "INTEGER",
            description: "타임아웃 시간을 입력해주세요! (분) (0 을 입력하면 타임아웃이 제거돼요!)",
            required: true
        },
        {
            name: "사유",
            type: "STRING",
            description: "타임아웃 사유를 입력해주세요!",
            required: false
        }
    ],
    /**
     * @param { CommandInteraction } Interaction
     */

    async execute(interaction) {
        const user = interaction.options.getMember('유저');
        const time = interaction.options.getInteger("길이");
        let reason = interaction.options.getString("사유");

        if (!interaction.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) return interaction.reply({ content: "명령어를 사용할 권한이 없어요!", ephemeral: true });

        if (!reason) reason = "없음";

        user.timeout(time * 60 * 1000, reason).then(() => {
            user.send(`${interaction.guild.name} 서버에서 당신을 타임아웃 했어요! 사유 : ${reason}`).catch(err => { })
            interaction.reply(`${user.user.username} 님을 ${time}분 동안 타임아웃 했어요!`)
        }).catch(err => {
            console.log(err)
            interaction.reply({ content: `오류가 발생했어요\n${err}`, ephemeral: true })
        })
    }
}