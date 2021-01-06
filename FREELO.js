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

    if (command === 'add') try{

        if (!member.length) {
                 return message.channel.send(`You didn't provide an argument, ${message.author}!`); //If user did not provide an argument
            } 
  
    {

        const [userName, elo] = member.join('').split(':');
        await keyv.set(userName, elo);
      /*  Number(elo);
        console.log(elo);
        members.push([userName, elo]);
        
        console.table(members);
        */
    }
}//End of try
catch{
    message.reply("Something went wrong(devs will look into this)");
    console.log("Something went wrong(devs will look into this)");
}
//-----------------------------------------------------------------------------------------------------------
    else if (command === 'win'){
        try{
        let [userName, eloGained] = member.join(' ').split('+'); //Splitting argument Ex: XAL+200 = [XAL, 200]

        //const eloNumber = parseInt(elo, 10); //Turning the elo value from a string to an integer
    
        if (!member.length || !eloGained) { return message.channel.send(`You didn't provide a valid argument, ${message.author}!`);}
        

        const oldElo = await keyv.get(userName);
        const oldEloNumber = parseInt(oldElo, 10);

        const newEloGained = parseInt(eloGained, 10);

        const newElo = oldEloNumber + newEloGained;

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
        catch{
            message.reply("Something went wrong(XAL will look into this)");
            console.log("Something went wrong(XAL will look into this)");
        }

    }

});

client.login(process.env.BOT_TOKEN);