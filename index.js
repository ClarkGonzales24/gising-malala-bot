const { Client, GatewayIntentBits } = require('discord.js');
const { joinVoiceChannel } = require('@discordjs/voice');
const http = require('http');

// 1. Siguraduhing tama ang Intents para sa Discord Portal Settings mo ngayon
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

// 2. TAMA AT STABLE NA PORT BINDING PARA SA RENDER WEB SERVICE
const PORT = process.env.PORT || 10000; 
http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.write("Gising Malala Bot is Active!");
    res.end();
}).listen(PORT, '0.0.0.0', () => {
    console.log(`Web server running and listening on port ${PORT}`);
});

client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
    
    const channelId = process.env.VOICE_CHANNEL_ID;
    const channel = client.channels.cache.get(channelId);
    
    if (channel) {
        try {
            joinVoiceChannel({
                channelId: channel.id,
                guildId: channel.guild.id,
                adapterCreator: channel.guild.voiceAdapterCreator,
                selfDeaf: true
            });
            console.log(`Successfully joined voice channel: ${channel.name}`);
        } catch (error) {
            console.error("Failed to join voice channel:", error);
        }
    } else {
        console.error("Voice channel ID is invalid or bot cannot access it.");
    }
});

// 3. Login execution
client.login(process.env.DISCORD_TOKEN);
