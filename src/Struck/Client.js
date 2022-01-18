const { Client, Collection } = require('discord.js');
const fs = require('fs');
const { token, mongooseURL } = require('../config.json');
const events = require("../events/events");
const handler = require('../events/events');
const mongoose = require('mongoose');

module.exports = class EmiliaClient extends Client {
    constructor() {
        super({
            intents: 32767,
            partials: ['MESSAGE', 'CHANNEL', 'REACTION']
        });
        this.token = token;
        this.commands = new Collection();;
    }

    listenEvents() {
        Object.keys(events.event).forEach((evt) => {
            const handler = events.event[evt];
            this.on(evt, handler.bind(this));
        });
    }

    commandHandler() {
        this.on('interactionCreate', async interaction => {
            if (!interaction.isCommand()) return;
            if (!this.commands.has(interaction.commandName)) return;
            const command = this.commands.get(interaction.commandName);
            try {
                if (!command) return;
                await command.execute(interaction)
            } catch (error) {
                console.log(error)
            }
        })
    }

    listenHandler() {
        Object.keys(handler.handle).forEach((evt) => {
            const handle = handler.handle[evt];
            for (var i in handle) {
                this.on(evt, handle[i].bind(this));
            }
        });
    }

    connectDB() {
        mongoose.connect(mongooseURL, {
        }).then(console.log("MongoDB Connected!")).catch(console.error);
    }

    start() {
        this.listenEvents();
        this.commandHandler();
        this.listenHandler();
        this.login();
        this.connectDB();
    }
}