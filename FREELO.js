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

        if (!member.length) {return message.channel.send(`You didn't provide an argument, ${message.author}!`);} //If user did not provide an argument
  
    
        const [userName, elo] = member.join('').split(':');
        await keyv.set(userName, elo);

        message.channel.send(`Successfully Added ${userName} with ${elo} Elo!`)

        
      }//End of try
     catch{
         message.reply("Something went wrong(devs will look into this)");
        console.log("Something went wrong(devs will look into this)");
        }
    }
//-----------------------------------------------------------------------------------------------------------
    else if (command === 'win'){
        try{
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
        catch{
            message.reply("Something went wrong(XAL will look into this)");
            console.log("Something went wrong(XAL will look into this)");
             }
        }//end of else if statement for "win"
//-----------------------------------------------------------------------------------------------------------
    else if (command === 'loss'){
         try{
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
                    { name: 'Please Try Again', value:'Either the leaderboard is empty or an unknown error\nNotify XAL#7777'},
                    )
                .setTimestamp()
                .setFooter('Help - XAL#7777', 'https://pbs.twimg.com/profile_images/538092927814471680/ezuUYLER_400x400.jpeg');

                message.channel.send(printErr);
            console.log("Something went wrong(XAL will look into this)");
             }

       }
       else if(command === "clearAllData"){
            try{
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
            catch{
                message.reply("Something went wrong(XAL will look into this)");
                console.log("Something went wrong(XAL will look into this)");
            }
       }

});

client.login(process.env.BOT_TOKEN);

