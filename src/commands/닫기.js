const { CommandInteraction, MessageEmbed } = require('discord.js')
const Schema = require('../models/스레드');
const table = require('../models/채택');

module.exports = {
    name: "닫기",
    description: '질문 스레드를 닫을때 사용해주세요!',
    options: [
        {
            name: "유저",
            description: "채택할 유저를 입력해주세요!",
            type: "USER",
            required: true,
        }
    ],

    /**
     * @param { CommandInteraction } Interaction
     */

    async execute(interaction) {
        const thread = interaction.channel.parent.threads.cache.find(x => x.name === interaction.channel.name);
        const User = interaction.options.getMember('유저');
        let newData

        if (!interaction.channel.isThread()) {
            return interaction.reply({ content: "해당 명령어는 스레드에서만 사용하실 수 있어요!", ephemeral: true })
        }

        const data = await Schema.findOne({ author: interaction.member.id, id: thread.id });

        if (!data) return interaction.reply({ content: "스레드를 생성한 사람만 이 스레드를 닫을 수 있어요!", ephemeral: true });

        if (User.id === interaction.member.id) return interaction.reply({ content: "자기 자신을 채택할 수 없어요!", ephemeral: true });

        let embed = new MessageEmbed()
            .setTitle("질문 스레드 종료")
            .setDescription("질문 스레드가 종료되었어요!")
            .setColor("#b989d5");

        const user = await table.findOne({ userid: User.id });
        if (!user) {
            newData = new table({ count: 1, userid: User.id });
        } else {
            await table.findOneAndRemove({ userid: User.id })
            newData = new table({ count: parseInt(user.count) + 1, userid: User.id });
        }

        newData.save();

        await interaction.reply({ embeds: [embed] })
        await thread.setLocked(true)
        await thread.setArchived(true)
        await Schema.deleteOne({ author: interaction.member.id, id: thread.id });
    }
}
