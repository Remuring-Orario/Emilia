const { CommandInteraction, MessageEmbed } = require('discord.js')
const Schema = require('../models/채택');
const client = require('../../index');

module.exports = {
    name: "채택순위",
    description: '채택 순위를 보여드려요!',

    /**
     * @param { CommandInteraction } Interaction
     */

    async execute(interaction) {
        Schema.find().sort([['count', 'descending']]).limit(10).exec((err, res) => {
            const embed = new MessageEmbed().setTitle("출석체크 순위").setColor("#b989d5").setTimestamp()
            for (let i = 0; i < res.length; i++) {
                let searchuser = client.users.cache.get(res[i].userid)
                const user = searchuser || "찾을 수 없는 유저"
                embed.addField(`${i + 1}. ${user.tag || user}`, `${res[i].count} 회`)
            }
            interaction.reply({ embeds: [embed] })
        })
    }
}