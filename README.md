# FoundryVTT - Typescript + Gulp + Less Module/System Template

This is a relatively barebones module template for FoundryVTT. It is built using Gulp + Typescript and serves as a starter point for all module development. The [LESS](https://lesscss.org/) CSS pre-processor is used for stylesheets. The main purpose of this methodolgy is allowing easy usage of third party libraries, utility functions, etc.

## Notes
- The entry point is index.ts inside of the Source folder.
- The output files will go inside of a "dist" folder after a build. There will be one JavaScript file called "bundle.js", and a list of css files, as well as any other assets you include.
- This template has an automatic build and publish pipeline to streamline the process of developing and updating modules.
- The Logger class inside of Utils exists to log with neat colours and proper timestamps with all log messages. Use this over console.log.

## Foundry Path
For the build pipeline to work properly you must define an environment variable called `FOUDNRY_PATH` that points to the save data directory. Example: 
Windows Powershell:
`[Environment]::SetEnvironmentVariable("FOUNDRY_PATH", ${Env:localappdata}+"\FoundryVTT", "User")`
`EX: export FOUNDRY_PATH="/c/Users/Jacob/AppData/Local/FoundryVTT"`
export FOUNDRY_PATH="/c/Users/Jacob/Desktop/FoundryDev/Data/modules/dice-stats-ts"

Linux:
Add `FOUNDRY_PATH="~/PATH/TO/FOUNDRY"; export FOUNDRY_PATH` to ~/.profile

## Running
There are a few in-built commands as part of package.json. If you just want to get started with the template, you can jump right in with the following commands:
```bash
git clone git@github.com:Lazrius/FoundryVTT-Typescript-Module-Template.git

: Replace MyCoolModule with whatever you want to call it.
mv FoundryVTT-Typescript-Module-Template MyCoolModule
cd MyCoolModule

: You\'ll need to change the remote to be away from the template remote.
git remote set-url origin git@github.com:YourName/YourRepo.git

: Install our dependcies
npm add --include=dev github:League-of-Foundry-Developers/foundry-vtt-types#main  -- Add the V12 declerations
npm install
npm install @types/google.visualization     // Import Coocle charts stuff
: Run the build!
npm run build
```

Ideally, you should use the GitHub template system over the above method, but the instructions are there should you need them.

### Commands:
The following commands are built into the project.
- npm run build
- npm run build:watch
- npm run clean
- npm run package "1.0.0" (replace the version number here with whatever version you are publishing)

Build will convert all of your TS files into a single bundle.js, and all of your less style sheets into css versions (remember to have them included in your module.json)
build:watch will rebuild whenever the files change
Clean will remove the dist folder and any remaining build artefacts.

Package will perform all the prior steps, but will then change all references to the internal version with the new version specified. After doing such, it will generate a new zip file inside of a "package" folder, and automatically commit the file for you.
This commit can then be pushed, and properly updated for people using the module to easily update their own copies.

## Renaming the project.
Due to the build pipeline, it's not as simple as just changing a few names and being done with it. In order to properly name your module, you'll need to update the name/path inside of: 
- package.json 
- foundryconfig.json
- Source/Style/lazrius-foundry-template.less (rename the file to the new project name)
- Source/module.json (update the following fields: url, manifest, download, styles)
- Source/Globals.ts - Change ModuleName to match what is written in module.json

## Contributing / Ideas
I am happy for anyone to create issues or pull requests for extra things inside of this template. Please do inform me of any errors that you find.

## Main Credits
- [League of Foundry Developers](https://github.com/League-of-Foundry-Developers/foundry-vtt-types) for their work on Foundry VTT Types.
- [studio315b](https://gitlab.com/studio315b/foundryvtt-tools) for his/her work on the Foundry Toolkit, which I used as basis for this project.
- [Foundry Gaming](https://foundryvtt.com) for their amazing work on the VTT we all know and love.

___

# DEVELOPER NOTES

### Dice Stats Overview 
Dice stats stores roll data for players to allow users to track and view how they're rolling thoughout a session or a compaign. **The main design goal to to get session stats.** Over long term play all graphs end up leading to the average. You can see this by rolling lots of dice and getting the average. I want to display per session stats as that can very drasticaly. Nothings better than seeing the fighters roll 4 20's and 4 1's with nothing in the middle. 

#### Players joining the game & Syncing data between players
Dice Stats, as with all FoundryVTT modules, is a client side module. All players in foundry load their own instance of the modue. Becasue of this when a player joins, dice stats tries to load in data from the database. From that point on clients never pull data from the database unless the user presses the UI button on a form to reload from database or leaves and rejoins. 

Whenever somone else rolls from this point on each client will parse the chat message and save the data locally. The person who created the chat message will update the database with whatever values they have saved for themselves. **NOTE: This means if a player joins, Clears their data and makes a roll. All their data in the DB will be removed**

#### Handling chat messages
1. Dice Stats waits for a Foundry Chat Message using the *createChatMessage* hook. 
2. Checks if the message was a roll using Foundry built in Foundry.isRoll()
3. Make a system_specific_message_parser (Or a generic_message_parser if none are defined). Passes the entire message object into the parser which tries to convert the system specifc structure into the generic **MSG_ROLL_OBJ**. 
4. Return the msg_obj to then gets passed into the top level of dice_stats to add it to local data storage
5. If database is enabled whoever is the owner if the chat msg updates their dice info in the database

#### Handling UI Components
1. User Opens a form page using the scene buttons **NOTE: Because of this You must be in a scene for these buttons to be visible. Otherwise you can open the displays by copying the open-displays-macro.js into a macro file for players to use**
2. UI gets rendered. As the form loads a getData() method is run where the form asks DiceStats to convert whatever data is needed for the form into a HBS data sctructure. **NOTE: Handlebars is bad a dealing with arrays especially multi dim arrays. Because all the dice data is stored in multi dimentional arrays I need to convert the local data into a HBS specific object that turns multi dim arrays into 1d arrays.**
3. Render the HBS html using the HBS data received

### What does each piece do
- database: Interacting with FoundryVTT Flags to store and load player data betweegames
- forms:    UI Components that extend foundrys default UI classes
- import:   Google Charts lib for displaying nice graphs
- local_storage:    The main storage Object structure for Dice Stats
    Player /* Top level storage object */
        System Info /* Roll Information that usually tied to specific systems */
            Degree Success Info         ( Fails / Success / Crits / etc )
            System Specifc Roll Info    ( Attacks / Saves / Initiative / etc )
            Dice Pools                  ( Advantage / Disadvantage / # Successes EX:BitD )
        Dice /* Array of DICE Objects */
            DieType /* D2, D4, D6, D8 ... etc */
            DieMax  /* max possible value from die roll */
            RollResults=[0:DieMax] /* Array of size DieMax thats an int to track num of times each value was rolled */
            BlindRollResults /* Same as above but hidden from players untill GM pushes from this chart to RollResults */
            Streaks /* Increasing numbers in a row 4,5,6 : 17,18,19 etc */
    Message Roll Info       /* All data from message thats important, System Parsers handle getting what we need. This gets sorted and placed in local Info */
        Message Die info    /* Die Specifc info from message thats important */
- message_parsers:  /* System specific implementation to pull data from Foundry Message objects to be stored in Message Objects */
- utils: Utility funtions
    hbs_helpers:/* Helper funtions for handlebars templates */
    hbs_packer: /* Convert local_storage into objects that handlebars templates can use */
    hooks:      /* Deal with any foundry specifc hooks like init & createChatMessage */
    sockets:    /* A way to update data between different clients (players) */
    utils:      /* Misc Utility funtions */
