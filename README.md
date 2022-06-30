# What is this?
This is a Project64 script that runs a local version of [Track-OoT](https://track-oot.net/) ([Git](https://bitbucket.org/zidargs/track-oot/src/master/)) and automatically updates it based on what you have and have not done in the currently running game.
This was developed using v6.2 of the OoT Randomizer. Version changes might break certain functionality.

# What does it track?
- All items and their upgrades
- What swords/shields/tunics/boots you currently have
- Max health and Double Defense
- Current Big Poe count (including Big Poes in your bottle(s))
- Token Count
- All songs (including scarecrow's song)
- All stones/medallions
- Small keys and Boss keys
- Maps and Compasses
- Whether a dungeon is Vanilla or Master Quest upon visiting it
- Shops (The item being sold, the price, who it's for and whether you've bought it)
- ALL "checks" (anything that gives you a randomized item)
- Randomized Entrances (dugeons/interiors/grottos/overworld/owl/song warps/spawn)

Basically, the only things it doesn't track are:
- Triforce Pieces Count
- FOOL Count
- Refill Item Count
- Randomized Ocarina Notes
- Gossip Stones

# Support
Finding all of the addresses for the flags that control whether or not you've done a check took a MASSIVE amount of time.

If you find this useful, consider supporting me on [Patreon](https://www.patreon.com/Austin0)

# Special Thanks...
...to Faust and Weregoose for helping me find MQ check addresses.

Faust found addresses for:
- MQ Jabu Jabu's Belly
- MQ Forest Temple
- MQ Water Temple

Weregoose found addresses for:
- MQ Spirit Temple
- MQ Bottom of the Well
- MQ Ice Cavern

# Setup
### You will need a nightly build of Project64. This was developed using version Dev-4.0.0.5713-ce6042f although later versions **should** work.
1. In Project64, go to Options->Configuration
2. Under General settings, uncheck Hide advanced settings
3. Under General settings->Advanced, check the following:
   - Enable debugger
   - Always use interpreter core
4. Click OK
5. Go to Debugger->Scripts...
6. Click on the ... button on the bottom left. This will open the Scripts folder that Project64 is looking in.
7. Place the files here. Tracker.js should be visible from this directory, along with the modules folder and its contents.
8. Unless you're using the bundled archive under Releases, you need to place the built version of Track-OoT in: Scripts/modules/Tracker/track-oot
   - Track OoT's index.html should be visible in this directory

### Running the script
1. In Project64, go to Debugger->Scripts...
2. Select Tracker.js
3. Click Run
4. Type in a port to use. 8080 should be fine for most people. If you wish to use this from another computer in your network, make sure to allow it in your firewall.
5. Open your prefered web browser (Firefox and Chrome were tested) and go to the address that the script gave you. For example, if you chose 8080 for the port, then you would navigate to http://127.0.0.1:8080/
   - Using 127.0.0.1 instead of localhost will perform better.
   - If you wish to use the tracker from another computer in your LAN, replace 127.0.0.1 with the LAN IP of the computer
6. Configure the tracker based on the randomizer settings you chose and personal preference
7. Launch the game

Once you're in game, the script will automatically update the tracker based on the current game save.

# Some things to note...
Most item givers (such as chests) won't get updated until you either save in game, or leave the current zone (includes voiding out).

Some item givers (such as golden skulltulas or scrubs) update as soon as you close the relevant dialog.

Small keys will update their count immediately upon getting a key. **HOWEVER**, locked doors won't be counted towards your key count until you save in game, or leave the current zone (includes voiding out).

To ensure the tracker is fully synced up with the game, save the game.
