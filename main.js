const Discord = require('discord.js'); //Création de la constante Discord 
const client = new Discord.Client(); //Création de la constante client 
const prefix = "$"; //Création du préfixe
const bdd = require("./bdd.json"); //Lien vers la bdd
const fs = require("fs"); //Création de la variable fs pour naviguer dans la bdd


//Toutes les actions à faire quand le bot se connecte
client.on("ready", function () {
    console.log("LULU est Connectée");
    client.user.setActivity("la balle", {type: "PLAYING"});
});

// Répondre à un message
client.on("message", function (message) {

    //eviter le spam
    if (message.author.bot ) return;

    //message privé
    if(message.channel.type == "dm"){message.channel.send("MIAOU !")}

    //variable autour de l'utilisateur
    idAuthor = message.author.tag;
    idAuthor = idAuthor.slice(0,-5);
    idAuthorId = message.author.id;
    idP = message.content.slice(5) 
    idP = idP.slice(0,-1);

    //variable Date et Heure
    maDate = new Date();
    nMinutes = maDate.getMinutes();
    nHeure = maDate.getHours();
    nDay = maDate.getDay();

    //variable avatar du user
    let member = message.mentions.users.first() || message.author
    let avatar = member.displayAvatarURL()

    //------------------------------------------------------------------------------NOUS--------------------------------------------------------------------
    //première fois que la personne parle dans le discord, a mettre tout en haut des autres commandes OBLIGATOIREMENT
    if(`${bdd[`${idAuthorId}`]}` === "undefined"){
        bdd[`${idAuthorId}`] = {};
        bdd[`${idAuthorId}`]["Punition"] = false;
        Savebdd();
    }

    //quoi ou Quoi
    if (message.content.includes("quoi")|| message.content.includes("Quoi")){
        message.channel.send("Feur, *mdr c'est un sacré bouffon =>* " + message.author.username)
        message.react("809169993698246658");
    }

    //Oui ou oui
    if (message.content.includes("Oui")|| message.content.includes( "oui" )){
        message.channel.send("Stiti, *Ahah c'est un singe =>* " + message.author.username)
        message.react("810917829837717534");
    }

    //marche ou Marche
    if (message.content.includes("marche")|| message.content.includes( "Marche" )){
        message.channel.send("Normal ça n'a pas de pieds, *Boloss* =>" + message.author.username)
        message.react("813419097362137098");
    }

    //$w
    if (message.content === prefix + "w" ) { message.channel.send("Je pense que ce n'est pas le bon discord !")}
    
    //miaou ou Miaou ou cat ou Cat
    if (message.content.includes("Miaou") || message.content.includes("miaou") || message.content.includes("cat") || message.content.includes("Cat")) {
        
       // var random = 8
        var random = Math.floor((Math.random() * 9) + 0)
        var embed = new Discord.MessageEmbed()
            .setColor(`${bdd["cat"][random]["color"]}`)
            .setTitle(`Quel chat suis-je ? ${random+1}/9`)
            .setDescription(`Je suis ${bdd["cat"][random]["name"]}`)
            .addFields(
                {name: `${bdd["cat"][random]["titre1"]}`, value:`${bdd["cat"][random]["value1"]}`},
                {name: `${bdd["cat"][random]["titre2"]}`, value:`${bdd["cat"][random]["value2"]}`},
                {name: `${bdd["cat"][random]["titre3"]}`, value:`${bdd["cat"][random]["value3"]}`}
            )
            .setImage(`${bdd["cat"][random]["image"]}`)
            .setFooter(`Requested by ${message.author.tag}`);
        message.channel.send(embed);
    }

    //vérification de l'état de punition
    if(message.content.startsWith(prefix)){ 
        if(message.mentions.members.first()){
            if(idP != idAuthorId){
            
                if( bdd[`${idP}`]["Punition"] ){
                    bdd[`${idP}`]["Punition"] = false;
                    Savebdd();
                }
                else{
                    bdd[`${idP}`]["Punition"] = true;
                    Savebdd();
                }
                
                punition(bdd[`${idP}`]["Punition"]);
            }else{
                if( bdd[`${idP}`]["Punition"] ){message.channel.send("Tu ne peux pas te dépunir tout(e) seul(e) !")}
                else{message.channel.send("Tu ne peux pas te punir tout(e) seul(e) !")}
            }
        }
    }
    
    // fonction de punition
    function punition(id){
        var ChainePuni =`Selon ${idAuthor}, `;
       // message.channel.send(`Selon ${idAuthorId},`);
        if(id){
            ChainePuni += "tu mérites d'être dépuni(e) !\n";
            ChainePuni +="Alors Lulu te dépunie tu as été gentil !";
        }
        else{
            ChainePuni += "tu mérites d'être puni(e) !\n";
            ChainePuni +="Alors Lulu te punie tu as été méchant !";
        }
        message.channel.send(ChainePuni);
    }
    //réaction suite à la punition
    if(`${bdd[`${idAuthorId}`]["Punition"]}` === "true"){
        message.react("💩");
        message.react("🤡");
        message.react("809169993698246658");
    }

});

//sauvegarde de la bdd
function Savebdd(){
    fs.writeFile("./bdd.json", JSON.stringify(bdd, null, 4), (err) => {
        if (err) message.channel.send("une erreur est survenue");
    });
}

client.login(process.env.TOKEN);
