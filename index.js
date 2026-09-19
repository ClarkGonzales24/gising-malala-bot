const { Client, GatewayIntentBits } = require('discord.js');
const { joinVoiceChannel } = require('@discordjs/voice');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

// Gagawa ng simpleng server para hindi mag-error o mag-sleep ang hosting platform mamaya
const http = require('http');
http.createServer((req, res) => {
    res.write("Gising Malala Bot is Active!");
    res.end();
}).listen(process.env.PORT || 3000);

client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
    
    // Kukuhain nito ang nilagay mong ID sa hosting settings
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

// Gagamitin nito ang Token mo mula sa hosting settings para mag-online
client.login(process.env.DISCORD_TOKEN);
