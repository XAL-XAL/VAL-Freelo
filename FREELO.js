require('dotenv').config();
const Discord = require ('discord.js');
const client = new Discord.Client();
const PREFIX = "!"

const Keyv = require('keyv'); // require keyv
const KeyvPostgres = require('./KeyvPg'); // require our own custom version of keyv/postgres
const keyv = new Keyv(process.env.DATABASE_URL, {
    store: new KeyvPostgres({ // create a new version of our keyv with the database url
        uri: process.env.DATABASE_URL
    })
});

var members = [];

client.on('ready', () =>{
    console.log(`${client.user.tag} has logged in`);
    client.user.setActivity(`Your ELO!`, { type: 'WATCHING' });
});

//*********************************************************************************** *//

client.on('message', async (message) =>{
    
    if (!message.content.startsWith(PREFIX) || message.author.bot) return;

    const member = message.content.slice(PREFIX.length).trim().split(' ');
    const command = member.shift();

    if (command === 'add'){
     try{
        if(!message.member.roles.cache.find(r => r.name === "Admin")){
            return message.reply("You do not have permission to use this command");
            }
            else{
        if (!member.length) {return message.channel.send(`You didn't provide an argument, ${message.author}!`);} //If user did not provide an argument
  
    
        const [userName, elo] = member.join('').split(':');
        await keyv.set(userName, elo);

        message.channel.send(`Successfully Added ${userName} with ${elo} Elo!`)

            }
      }//End of try
     catch{
         message.reply("Something went wrong(devs will look into this)");
        console.log("Something went wrong(devs will look into this)");
        }
    }
//-----------------------------------------------------------------------------------------------------------
    else if (command === 'win'){
        try{
            if(!message.member.roles.cache.find(r => r.name === "Admin")){
                return message.reply("You do not have permission to use this command");
                }
                else{
        let [userName, eloGained] = member.join(' ').split('+'); //Splitting argument Ex: XAL+200 = [XAL, 200]

        //const eloNumber = parseInt(elo, 10); //Turning the elo value from a string to an integer
    
        if (!member.length || !eloGained) { return message.channel.send(`You didn't provide a valid argument, ${message.author}!`);}
        
        const oldElo = await keyv.get(userName);

        if (oldElo == undefined){ 
            const printWin = new Discord.MessageEmbed()
            .setColor('#0099ff')
            .setTitle(`Invalid User`)
            .setDescription("Please enter an existing user")
            .setTimestamp()
            .setFooter('Help - XAL#7777', 'https://pbs.twimg.com/profile_images/538092927814471680/ezuUYLER_400x400.jpeg');

            message.channel.send(printWin);
        }
        else
        {
            const oldEloNumber = parseInt(oldElo, 10);

            const newEloGained = parseInt(eloGained, 10);

            const newElo = oldEloNumber + newEloGained;

            await keyv.set(userName, newElo);

            if(eloGained >= 30){
                const printWin = new Discord.MessageEmbed()
                .setColor('#0099ff')
                .setTitle(`Rating Greatly Increased (+ ${newEloGained})`)
                .setAuthor(userName, 'https://yt3.ggpht.com/ytc/AAUvwnh5cX3Hpigfm2Y3X1VAd1QrVBWgzFeaIM8RAuTu=s900-c-k-c0x00ffffff-no-rj')
                .setDescription(`New Elo: ${newElo}`)
                .setThumbnail('https://www.clker.com/cliparts/2/0/4/8/12065699592053529969pitr_green_double_arrows_set_3.svg.hi.png')
                .addFields(
                //    { name: '\u200B', value:'\u200B'},
                    { name: 'Previous Elo', value: oldEloNumber, inline: true},
                )
            //  .setTimestamp();
            .setFooter('Problems? Contact XAL#7777', 'https://pbs.twimg.com/profile_images/538092927814471680/ezuUYLER_400x400.jpeg');

                message.channel.send(printWin);
            }
            else if(eloGained > 0 && eloGained < 30 ){
                const printWin = new Discord.MessageEmbed()
                .setColor('#0099ff')
                .setTitle(`Rating Increased (+ ${newEloGained})`)
                .setAuthor(userName, 'https://yt3.ggpht.com/ytc/AAUvwnh5cX3Hpigfm2Y3X1VAd1QrVBWgzFeaIM8RAuTu=s900-c-k-c0x00ffffff-no-rj')
                .setDescription(`New Elo: ${newElo}`)
                .setThumbnail('https://lh4.googleusercontent.com/proxy/VsUgVFTfy9YgW9XckkSqGvTDJ49tqZtOMmRK__g08BR95WJWbwqGnhx12I1TiJBGeNDgEKT9jzyqlfntUHruk4Ua29zwtvNuyT72CuM16g=s0-d')
                .addFields(
                //    { name: '\u200B', value:'\u200B'},
                    { name: 'Previous Elo', value: oldEloNumber, inline: true},
                )
                .setTimestamp()
                .setFooter('Problems? Contact XAL#7777', 'https://pbs.twimg.com/profile_images/538092927814471680/ezuUYLER_400x400.jpeg');

                message.channel.send(printWin);
                }
            else if(eloGained <= 0){

                const printWin = new Discord.MessageEmbed()
                .setColor('#0099ff')
                .setTitle(`You did that bad? :frowning:`)
                //.setAuthor(userName, 'https://yt3.ggpht.com/ytc/AAUvwnh5cX3Hpigfm2Y3X1VAd1QrVBWgzFeaIM8RAuTu=s900-c-k-c0x00ffffff-no-rj')
            // .setDescription(`Please enter a value greater than 0`)
                .addFields(
                    { name: 'Please Try Again', value:'The Elo you want to add must be greater than 0'},
                    )
                .setTimestamp()
                .setFooter('Help - XAL#7777', 'https://pbs.twimg.com/profile_images/538092927814471680/ezuUYLER_400x400.jpeg');

                message.channel.send(printWin);
                }
          }
        }
    }
        catch{
            message.reply("Something went wrong(XAL will look into this)");
            console.log("Something went wrong(XAL will look into this)");
             }
        }//end of else if statement for "win"
//-----------------------------------------------------------------------------------------------------------
    else if (command === 'loss'){
         try{
            if(!message.member.roles.cache.find(r => r.name === "Admin")){
                return message.reply("You do not have permission to use this command");
                }
                else{
                let [userName, eloLossed] = member.join(' ').split('-'); //Splitting argument Ex: XAL+200 = [XAL, 200]
        
                //const eloNumber = parseInt(elo, 10); //Turning the elo value from a string to an integer
            
                if (!member.length || !eloLossed) { return message.channel.send(`You didn't provide a valid argument, ${message.author}!`);}
                
                const oldElo = await keyv.get(userName);
        
                if (oldElo == undefined){ 
                    const printWin = new Discord.MessageEmbed()
                    .setColor('#0099ff')
                    .setTitle(`Invalid User`)
                    .setDescription("Please enter an existing user")
                    .setTimestamp()
                    .setFooter('Help - XAL#7777', 'https://pbs.twimg.com/profile_images/538092927814471680/ezuUYLER_400x400.jpeg');
        
                    message.channel.send(printWin);
               }
            else
            {
                const oldEloNumber = parseInt(oldElo, 10);
    
                const newEloLossed = parseInt(eloLossed, 10);
    
                const newElo = oldEloNumber - newEloLossed;

                if(newElo < 0){

                    const printErr = new Discord.MessageEmbed()
                    .setColor('#0099ff')
                    .setTitle(`You did that bad? :frowning:`)
                    .addFields(
                        { name: 'Please Try Again', value:'Elo after Elo loss must be greater than 0'},
                        )
                    .setTimestamp()
                    .setFooter('Help - XAL#7777', 'https://pbs.twimg.com/profile_images/538092927814471680/ezuUYLER_400x400.jpeg');
                    message.channel.send(printErr);
                    }
                
                else{

                await keyv.set(userName, newElo);
        
                if(eloLossed >= 30){
                    
                    const printLoss = new Discord.MessageEmbed()
                    .setColor('#0099ff')
                    .setTitle(`Rating Greatly Decreased (+ ${newEloLossed})`)
                    .setAuthor(userName, 'https://yt3.ggpht.com/ytc/AAUvwnh5cX3Hpigfm2Y3X1VAd1QrVBWgzFeaIM8RAuTu=s900-c-k-c0x00ffffff-no-rj')
                    .setDescription(`New Elo: ${newElo}`)
                    .setThumbnail('https://iconsetc.com/icons-watermarks/simple-red/classic-arrows/classic-arrows_double-chevron-down/classic-arrows_double-chevron-down_simple-red_512x512.png')
                    .addFields(
                    //    { name: '\u200B', value:'\u200B'},
                        { name: 'Previous Elo', value: oldEloNumber, inline: true},
                    )
                //  .setTimestamp();
                .setFooter('Problems? Contact XAL#7777', 'https://pbs.twimg.com/profile_images/538092927814471680/ezuUYLER_400x400.jpeg');
    
                    message.channel.send(printLoss);
                }
                else if(eloLossed > 0 && eloLossed < 30 ){
                    const printLoss = new Discord.MessageEmbed()
                    .setColor('#0099ff')
                    .setTitle(`Rating Decreased (+ ${newEloLossed})`)
                    .setAuthor(userName, 'https://yt3.ggpht.com/ytc/AAUvwnh5cX3Hpigfm2Y3X1VAd1QrVBWgzFeaIM8RAuTu=s900-c-k-c0x00ffffff-no-rj')
                    .setDescription(`New Elo: ${newElo}`)
                    .setThumbnail('https://cdn3.iconfinder.com/data/icons/action-states-vol-3-flat/48/Action___States_-_Vol._3-16-512.png')
                    .addFields(
                    //    { name: '\u200B', value:'\u200B'},
                        { name: 'Previous Elo', value: oldEloNumber, inline: true},
                    )
                    .setTimestamp()
                    .setFooter('Problems? Contact XAL#7777', 'https://pbs.twimg.com/profile_images/538092927814471680/ezuUYLER_400x400.jpeg');
    
                    message.channel.send(printLoss);
                    }
                }
              }
            }
             }
            catch{
                message.reply("Something went wrong(XAL will look into this)");
                console.log("Something went wrong(XAL will look into this)");
                 }
             }//end of else if statement for "lose"
//-----------------------------------------------------------------------------------------------------------
        else if(command === 'leaderboard'){
        try{            
            const all = await keyv.getAll();
           
            all.sort((a, b) =>  b.value - a.value); // generic sort function that sorts high to low (so the first item is the person with the highest value)

            let entry = '';
            let first = '';
        
            first = `1. ${all[0].key}: ${all[0].value}\n`;
            
            for (let i = 1; i < 1000; i++) {
                if (!all[i]) break;
                entry += `${i + 1}. ${all[i].key}: ${all[i].value}\n`;
            }
    
            const printLeaderboard = new Discord.MessageEmbed()
                    .setColor('#0099ff')
                    .setTitle(`Leaderboard`)
                    .setAuthor('Freelo', 'https://yt3.ggpht.com/ytc/AAUvwnh5cX3Hpigfm2Y3X1VAd1QrVBWgzFeaIM8RAuTu=s900-c-k-c0x00ffffff-no-rj')
                    .setDescription(`**${first}**\n ${entry}`)
                    .setThumbnail('https://static.wikia.nocookie.net/valorant/images/2/24/TX_CompetitiveTier_Large_24.png/revision/latest/top-crop/width/450/height/450?cb=20200623203621')
                    .setTimestamp()
                    .setFooter('XAL', 'https://pbs.twimg.com/profile_images/538092927814471680/ezuUYLER_400x400.jpeg');
                    message.channel.send(printLeaderboard);
                
            }
        catch{
            const printErr = new Discord.MessageEmbed()
                .setColor('#0099ff')
                .setTitle(`Something went wrong :frowning:`)
                .addFields(
                    { name: 'Please Try Again', value:'Either the leaderboard is empty or an unknown error occurred\nNotify XAL#7777'},
                    )
                .setTimestamp()
                .setFooter('Help - XAL#7777', 'https://pbs.twimg.com/profile_images/538092927814471680/ezuUYLER_400x400.jpeg');

                message.channel.send(printErr);
            console.log("Something went wrong(XAL will look into this)");
             }

       }//end of leaderboard
//---------------------------------------------------------------------------------------------------------------------
    else if(command === "help"){// *help command

        const printHelp = new Discord.MessageEmbed()
        
        .setColor('#0099ff')
        .setTitle('How to use FREELO')
        //.setURL('https://discord.js.org/')
        .setAuthor('!help', 'https://files.cults3d.com/uploaders/15024335/illustration-file/a86d53e4-2bd9-4a8f-9550-986686c3131a/gi0mAjIh_400x400_large.png')
        .setDescription(`Basic commands for FREELO BOT`)
        .setThumbnail('https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Question_mark_%28black%29.svg/200px-Question_mark_%28black%29.svg.png')
        .addFields(
            { name: '\u200B', value: '\u200B' },
            { name: ':robot:  BOT Commands', value: '\u200B' },
            { name: '!add Name:StartElo', value: 'Adds member to roster with a base elo', inline: true },
            { name: '!win Name+Elo',  value: 'Adds Elo from desired member', inline: true },
            { name: '!loss Name-Elo',   value: 'Subtracts Elo from desired member', inline: true },
            { name: '\u200B', value: '\u200B' },
            { name: '!leaderboard',  value: 'Displays all members and associated Elo from highest to lowest', inline: true },
            { name: '!help',  value: 'uhmm. yeah, this stuff', inline: true },
            { name: '\u200B', value: '\u200B' },
            { name: 'Example for adding a person, adding elo for wins, and subtracting elo for losses',  value: '!add daddy:100, !win daddy+35, !loss daddy-80', inline: false },
            { name: '\u200B', value: '\u200B' },
            )
        .setTimestamp()
        .setFooter('Help - XAL#7777', 'https://lh5.googleusercontent.com/7j8XeYBmyh2FbnYNmr3Ktenb8iYwj1_ZmT-RBq_DpGOG0_gN2X8K26MGqjL8WxxLyznyyD4j=w1280');
    
        message.channel.send(printHelp);

        }//end of help
//---------------------------------------------------------------------------------------------------------------------
       else if(command === "clearAllData"){
            try{
                if(!message.member.roles.cache.find(r => r.name === "Admin")){
                    return message.reply("You do not have permission to use this command");
                    }
                    else{
                message.reply("Damn... you just cleared all data")
                keyv.clear();
            /*    const filter = (m) => m.author.id === message.author.id;

                message.channel.send('Are you sure you want to clear All player data?')

                const yesOrNo = await message.channel.awaitMessages(filter, { time:5000 });
                
                if(yesOrNo[0] === 'Yes' || yesOrNo[0] === 'yes'){       
                message.channel.send('You have been warned! All data has been cleared') 
                
                keyv.clear();
                }
                else{
                    message.reply("Good thinking")
                }
                */
            }
            }
            catch{
                message.reply("Something went wrong(XAL will look into this)");
                console.log("Something went wrong(XAL will look into this)");
            }
       }
//---------------------------------------------------------------------------------------------------------------------
       else if(command === "clear"){
           try{
        const amount = member.join(' ');

        if (!amount) return message.reply('You haven\'t given an amount of messages which should be deleted!'); // Checks if the `amount` parameter is given
        if (isNaN(amount)) return message.reply('That is not a number!'); // Checks if the `amount` parameter is a number. If not, the command throws an error

        if (amount > 100) return member.reply('You can`t delete more than 100 messages at once!'); // Checks if the `amount` integer is bigger than 100
        if (amount < 1) return member.reply('You have to delete at least 1 message!'); // Checks if the `amount` integer is smaller than 1

        await message.channel.messages.fetch({ limit: amount }).then(messages => { // Fetches the messages
            message.channel.bulkDelete(messages // Bulk deletes all messages that have been fetched and are not older than 14 days (due to the Discord API)
        )});
       }
       catch{
        message.reply("Value must be greater than 0 and less than 100");
        console.log("Something went wrong(XAL will look into this)");
    }
    }
});

client.login(process.env.BOT_TOKEN);

