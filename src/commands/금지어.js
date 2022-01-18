const Schema = require('../models/금지어');
const { Permissions, MessageEmbed } = require('discord.js');

module.exports = {
    name: "금지어",
    description: "금지어를 추가할 수 있어요!",
    options: [
        {
            name: "추가",
            description: "금지어를 추가해요!",
            type: "STRING",
            required: false
        },
        {
            name: "제거",
            description: "금지어를 제거해요!",
            type: "STRING",
            required: false
        }
    ],

    async execute(interaction) {
        if (!interaction.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) return interaction.reply({ content: "명령어를 사용할 권한이 없어요!", ephemeral: true });
        if (!interaction.options.getString("제거")) {
            const args = interaction.options.getString("추가");
            if (!args) return interaction.reply({ content: "금지어를 입력해주세요!", ephemeral: true });
            const find = await Schema.findOne({ serverid: interaction.guild.id, 금지어: args });
            if (find) {
                if (find.온오프 == 'on') return interaction.reply({ content: "이미 추가된 금지어예요!", ephemeral: true });
                await Schema.findOneAndUpdate({ serverid: interaction.guild.id, 금지어: args }, {
                    serverid: interaction.guild.id,
                    금지어: args,
                    온오프: 'on'
                })
                await interaction.reply({ embeds: [new MessageEmbed().setTitle("금지어 추가 성공!").setDescription(`\`${args}\` 을/를 금지어 목록에 추가했어요!`).setColor("#b989d5")] });
            } else {
                const newData = new Schema({
                    serverid: interaction.guild.id,
                    금지어: args,
                    온오프: 'on'
                })
                await interaction.reply({ embeds: [new MessageEmbed().setTitle("금지어 추가 성공!").setDescription(`\`${args}\` 을/를 금지어 목록에 추가했어요!`).setColor("#b989d5")] });
                newData.save()
            }
        } else {
            if (!interaction.options.getString("추가")) {
                const args = interaction.options.getString("제거");
                if (!args) return interaction.reply({ content: "금지어를 입력해주세요!", ephemeral: true });
                const find = await Schema.findOne({ serverid: interaction.guild.id, 금지어: args });
                if (!find) return interaction.reply({ content: "추가되지 않은 금지어예요!", ephemeral: true });
                await Schema.findOneAndUpdate({ serverid: interaction.guild.id, 금지어: args }, {
                    serverid: interaction.guild.id,
                    금지어: args,
                    온오프: 'off'
                })
                await interaction.reply({ embeds: [new MessageEmbed().setTitle("금지어 제거 성공!").setDescription(`\`${args}\` 을/를 금지어 목록에서 제거했어요!`).setColor("#b989d5")] });
            }
        }
    }
}