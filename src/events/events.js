const { MessageEmbed, MessageAttachment } = require('discord.js');
const moment = require('moment');
const fs = require('fs');
const http = require('https');
const { guildId, channelId, welcomeChannelId, byeChannelId, botPath, logChannelId } = require("../config.json")

const ready = async function () {
    const commandFiles = fs.readdirSync('./src/commands').filter(file => file.endsWith('js'));
    var data = []
    for (const file of commandFiles) {
        const command = require(`../commands/${file}`);
        this.commands.set(command.name, command);
        data.push({ name: command.name, description: command.description, options: command.options });
        console.log("명령어 로드됨. /" + command.name)
    }

    console.log(`Logged In as ${this.user.tag}`);
    await this.guilds.cache.get(guildId)?.commands.set(data);
}

const thread = async function (message) {
    const Schema = require('../models/스레드');
    if (message.author.bot) return;
    if (message.channel.id === channelId) {
        if (message.content.includes("")) {
            if (message.content.length > 100) {
                return message.reply("100자 이내로 질문해주세요!\n간단한 내용을 입력 후 스레드가 생성되면 자세한 내용을 설명해주세요!").then((x) => {
                    message.delete()
                    setTimeout(() => x.delete(), 4000)
                })
            }

            const thread = await message.startThread({
                name: message.content,
                autoArchiveDuration: 60,
                type: 'GUILD_PRIVATE_THREAD',
            });

            const threadData = new Schema({
                author: message.author.id,
                id: thread.id,
            })

            threadData.save();

            let embed = new MessageEmbed()
                .setTitle("질문 스레드가 생성되었어요!")
                .setDescription(message.content)
                .addField("질문자", `<@${message.author.id}>`, true)
                .setColor("#b989d5");

            let embed2 = new MessageEmbed()
                .setTitle("질문 전 확인해주세요!")
                .setDescription("먼저 해당 채널에 카테고리를 확인 후 질문해주세요!\n해당 언어에 맞지 않는 질문은 스레드에서 삭제될 수 있어요!\n질문 해결이 완료되었으면 `/닫기 <채택자>` 로 스레드를 닫아주세요!")
                .setColor("#b989d5");

            thread.send({ embeds: [embed] }).then((msg) => {
                msg.channel.send({ embeds: [embed2] }).then((x) => {
                    x.channel.send("오류가 발생하는 코드를 1분 내로 전송해주세요!\n(` 기호 포함 없이 전송해주세요!)").then(a => {
                        a.channel.awaitMessages({ filter: m => m.author.id === message.author.id, time: 60000, max: 1, errors: ['time'] }).then(async collected => {
                            let embed = new MessageEmbed()
                                .setTitle("오류가 발생하는 코드")
                                .setDescription("```js\n" + collected.first().content + "\n```")
                                .setColor("#b989d5");
                            await a.delete();
                            await collected.first().delete();
                            await a.channel.send({ embeds: [embed] }).then((b) => {
                                b.channel.send("오류를 1분 내로 전송해주세요!\n(사진 또는 오류를 복사 / 붙여넣기 해주세요!)").then(c => {
                                    c.channel.awaitMessages({ filter: m => m.author.id === message.author.id, time: 60000, max: 1, errors: ['time'] }).then(async collected => {
                                        if (collected.first().attachments.first()) {
                                            let embed = new MessageEmbed()
                                                .setTitle("오류")
                                                .setImage(collected.first().attachments.first().url)
                                                .setColor("#b989d5");
                                            await c.delete();
                                            await collected.first().delete();
                                            await c.channel.send({ embeds: [embed] }).then((msg) => setTimeout(() => {
                                                b.pin();
                                                msg.pin();
                                            }, 1000))
                                        } else {
                                            let embed = new MessageEmbed()
                                                .setTitle("오류")
                                                .setDescription("```shell\n" + collected.first().content + "\n```")
                                                .setColor("#b989d5");
                                            await c.delete();
                                            await collected.first().delete();
                                            await c.channel.send({ embeds: [embed] }).then((msg) => setTimeout(() => {
                                                b.pin();
                                                msg.pin();
                                            }, 1000))
                                        }
                                    }).catch(err => {
                                        let embed = new MessageEmbed()
                                            .setTitle("질문 취소됨")
                                            .setDescription(`제한시간 \`1분\`이 초과되었어요!\n5초 뒤 스레드가 삭제돼요!\n처음부터 다시 시도해주세요!`)
                                            .setColor("#b989d5");
                                        c.channel.send({ content: `${message.author}`, embeds: [embed] }).then(x => {
                                            setTimeout(() => {
                                                thread.delete();
                                                message.delete();
                                            }, 5000)
                                        })
                                    })
                                })
                            })
                        }).catch(err => {
                            let embed = new MessageEmbed()
                                .setTitle("질문 취소됨")
                                .setDescription(`제한시간 \`1분\`이 초과되었어요!\n5초 뒤 스레드가 삭제돼요!\n처음부터 다시 시도해주세요!`)
                                .setColor("#b989d5");
                            a.channel.send({ content: `${message.author}`, embeds: [embed] }).then(x => {
                                setTimeout(() => {
                                    thread.delete();
                                    message.delete();
                                }, 5000)
                            })
                        })
                    })
                })
            })
        }
    }
}


const guildMemberAdd = async function (member) {
    if (member.guild.id === guildId) {
        let welcome = new MessageEmbed()
            .setTitle("환영해요!")
            .setDescription(`${member.user.username} 님이 본 서버에 입장하셨어요!`)
            .addFields(
                { name: "아이디", value: member.id, inline: true },
                { name: "계정 생성일", value: moment(member.user.createdTimestamp).locale('ko').format('ll dddd LTS'), inline: true },
                { name: "서버 가입일", value: moment(member.joinedAt).locale('ko').format('ll dddd LTS'), inline: true }
            )
            .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
            .setColor("#b989d5");
        this.channels.cache.get(welcomeChannelId).send({ embeds: [welcome], content: `<@${member.id}>` })
    }
}

const guildMemberRemove = async function (member) {
    if (member.guild.id === guildId) {
        this.channels.cache.get(byeChannelId).send(`${member.user.username} 님이 본 서버에서 퇴장하셨어요`)
    }
}

const blakcword = async function (message) {
    if (message.channel.type == 'DM') return;
    const Schema = require('../models/금지어');
    await Schema.find({ serverid: message.guild.id }).exec(async (err, res) => {
        for (let i = 0; i < res.length; i++) {
            if (message.content.includes(res[i].금지어)) {
                if (res[i].온오프 == 'on') {
                    await message.delete()
                    await message.channel.send({ embeds: [new MessageEmbed().setTitle("금지어가 감지되었어요!").setDescription(`\`${message.content}\` 에서 금지어가 감지되었어요!`).setColor("#b989d5").addField("감지된 금지어", res[i].금지어.toString())] }).then(msg => {
                        setTimeout(() => {
                            msg.delete();
                        }, 5000);
                    })
                }
            }
        }
    })
}

const cacheImage = async function (message) {
    if (message.attachments.size > 0) {
        if (message.attachments.first().name.includes(".png") || message.attachments.first().name.includes(".jpg") || message.attachments.first().name.includes(".jpeg") || message.attachments.first().name.includes(".webp")) {
            const file = fs.createWriteStream(message.id + ".png");
            http.get(message.attachments.first().url, async function (response) {
                await response.pipe(file);
                await fs.rename(message.id + ".png", "./src/" + "ImageCache/" + message.id + ".png", function (err) {
                    if (err) console.log("이미지 캐시중 오류가 발생했습니다.\n" + err);
                })
            })
        } else {
            if (message.attachments.first().name.includes("gif")) {
                const file = fs.createWriteStream(message.id + ".gif");
                http.get(message.attachments.first().url, async function (response) {
                    await response.pipe(file);
                    await fs.rename(message.id + ".gif", "./src/" + "ImageCache/" + message.id + ".gif", function (err) {
                        if (err) console.log("이미지 캐시중 오류가 발생했습니다.\n" + err);
                    })
                })
            }
        }
    }
}

const messageDelete = async function (message) {
    if (message.author.bot) return;
    if (message.channel.type == 'dm') return;
    if (message.content.length > 1000) return;
    if (message.attachments.first()) {
        if (message.attachments.first().name.includes(".png") || message.attachments.first().name.includes(".jpg") || message.attachments.first().name.includes(".jpeg") || message.attachments.first().name.includes(".webp")) {
            const embed = new MessageEmbed()
                .setTitle("이미지 삭제로그")
                .addField("메시지 타입", "삭제된 이미지")
                .addField("메시지 전송자", `<@${message.author.id}>`)
                .addField("메시지 전송시간", moment(message.createdTimestamp).locale('ko').format('ll dddd LTS'))
                .addField("메시지 채널", `<#${message.channel.name}>`)
                .setColor("#b989d5")
                .setFooter({ text: message.author.tag, icon_url: message.author.displayAvatarURL({ dynamic: true }) });
            const image = fs.readFileSync(botPath + '/src/ImageCache/' + message.id + '.png');
            const attachment = new MessageAttachment(image, message.id + '.png');
            await message.guild.channels.cache.get(logChannelId).send({ embeds: [embed] })
            return await message.guild.channels.cache.get(logChannelId).send({ files: [attachment] })
        } else {
            if (message.attachments.first().name.includes("gif")) {
                const embed = new MessageEmbed()
                    .setTitle("이미지 삭제로그")
                    .addField("메시지 타입", "삭제된 이미지")
                    .addField("메시지 전송자", `<@${message.author.id}>`)
                    .addField("메시지 전송시간", moment(message.createdTimestamp).locale('ko').format('ll dddd LTS'))
                    .addField("메시지 채널", `<#${message.channel.id}>`)
                    .setColor("#b989d5")
                    .setFooter({ text: message.author.tag, icon_url: message.author.displayAvatarURL({ dynamic: true }) });
                const image = fs.readFileSync('C:\\Users\\ONMO\\Desktop\\REM\\emilia/src/ImageCache/' + message.id + '.gif');
                const attachment = new MessageAttachment(image, message.id + '.gif')
                await message.guild.channels.cache.get(logChannelId).send({ embeds: [embed] })
                return await message.guild.channels.cache.get(logChannelId).send({ files: [attachment] })
            }
        }
    } else {
        const embed = new MessageEmbed()
            .setTitle("메시지 삭제로그")
            .addField("메시지 타입", "삭제된 메시지")
            .addField("메시지 전송자", `<@${message.author.id}>`)
            .addField("메시지 전송시간", moment(message.createdTimestamp).locale('ko').format('ll dddd LTS'))
            .addField("메시지 채널", `<#${message.channel.id}>`)
            .addField("메시지 내용", message.content)
            .setColor("#b989d5")
            .setFooter({ text: message.author.tag, icon_url: message.author.displayAvatarURL({ dynamic: true }) });
        return message.guild.channels.cache.get(logChannelId).send({ embeds: [embed] })
    }
}

const messageUpdate = async function (oldMessage, newMessage) {
    if(oldMessage.content === newMessage.content) return
    if (message.content.length > 1000) return;
    const embed = new MessageEmbed()
    .setTitle("메시지 수정로그")
    .addField("메시지 타입", "수정된 메시지")
    .addField("메시지 전송자", `<@${newMessage.author.id}>`)
    .addField("메시지 전송시간", moment(newMessage.createdTimestamp).locale('ko').format('ll dddd LTS'))
    .addField("메시지 채널", `<#${newMessage.channelId}>`)
    .addField("수정 전 메시지", oldMessage.content)
    .addField("수정 후 메시지", newMessage.content)
    .setColor("#b989d5")
    .setFooter({ text: newMessage.author.tag, icon_url: newMessage.author.displayAvatarURL({ dynamic: true }) });
    return oldMessage.guild.channels.cache.get(logChannelId).send({ embeds: [embed] })
}

module.exports = {
    event: {
        ready: ready,
        guildMemberAdd: guildMemberAdd,
        guildMemberRemove: guildMemberRemove,
    },
    handle: {
        messageCreate: [thread, blakcword, cacheImage],
        messageDelete: [messageDelete],
        messageUpdate: [messageUpdate]
    }
}