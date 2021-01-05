require('dotenv').config();
const Discord = require ('discord.js');
const client = new Discord.Client();
const PREFIX = "!"

var members = [];

client.on('ready', () =>{
    console.log(`${client.user.tag} has logged in`);
    client.user.setActivity(`Your ELO!`, { type: 'WATCHING' });
});

//*********************************************************************************** *//

client.on('message', (message) =>{
    
    if (!message.content.startsWith(PREFIX) || message.author.bot) return;

    const member = message.content.slice(PREFIX.length).trim().split(' ');
    const command = member.shift();

    if (command === 'add') try{

        if (!member.length) {
                 return message.channel.send(`You didn't provide an argument, ${message.author}!`); //If user did not provide an argument
            } 
  
    {

        const [userName, elo] = member.join('').split(':');
        Number(elo);
        console.log(elo);
        members.push([userName, elo]);
        
        console.table(members);

    }
}//End of try
catch{
    message.reply("Something went wrong(devs will look into this)");
    console.log("Something went wrong(devs will look into this)");
}
//-----------------------------------------------------------------------------------------------------------
    else if (command === 'win'){
        try{
        let [userName, elo] = member.join(' ').split('+'); //Splitting argument Ex: XAL+200 = [XAL, 200]

        const eloNumber = parseInt(elo, 10); //Turning the elo value from a string to an integer
    
        if (!member.length || !elo) {
            return message.channel.send(`You didn't provide a valid argument, ${message.author}!`);
        }
        
        var flag = false;
        
        for (let i = 0; i < members.length; i++) {
            
       //     var innerArrayLength = members[i].length;// get the size of the inner array
            if(members[i][0] === userName)
            {
                let  oldElo = members[i][1];
                let oldEloNumber = parseInt(oldElo, 10);
                let newElo = oldEloNumber + eloNumber;          
                members[i][1] = newElo;
            
                const printWin = new Discord.MessageEmbed()
                .setColor('#0099ff')
                .setTitle(`Rating Increased (+ ${eloNumber})`)
                .setAuthor(userName, 'https://yt3.ggpht.com/ytc/AAUvwnh5cX3Hpigfm2Y3X1VAd1QrVBWgzFeaIM8RAuTu=s900-c-k-c0x00ffffff-no-rj')
                .setDescription(`New Elo: ${newElo}`)
                .setThumbnail('https://lh4.googleusercontent.com/proxy/VsUgVFTfy9YgW9XckkSqGvTDJ49tqZtOMmRK__g08BR95WJWbwqGnhx12I1TiJBGeNDgEKT9jzyqlfntUHruk4Ua29zwtvNuyT72CuM16g=s0-d')
                .addFields(
                //    { name: '\u200B', value:'\u200B'},
                    { name: 'Previous Elo', value: oldEloNumber, inline: true},
                )
              //  .setTimestamp();
              .setFooter('Problems? Contact XAL#7777', 'https://pbs.twimg.com/profile_images/538092927814471680/ezuUYLER_400x400.jpeg');

                message.channel.send(printWin);     
                flag = true;  
                console.table(members);
            }
        }
        if(flag === false)
        message.channel.send("That member was not found OR you entered the command incorrectly");
        }
        catch{
            message.reply("Something went wrong(XAL will look into this)");
            console.log("Something went wrong(XAL will look into this)");
        }

    }

});

client.login(process.env.BOT_TOKEN);