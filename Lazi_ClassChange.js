/*:
 * @author Lazislacker, Gimmer_, Sono
 * @target MZ
 * @plugindesc [v1.1.6] Class Change System with more resource.
 * @help
 * This plugin adds the ability for a character to learn multiple classes and 
 * switch between them. There are currenty 3 modes: Shared EXP, 
 * Individual Class EXP, and Actor Mode.
 *
 * --------------
 * |Version: 1.1.6|
 * --------------
 * Updated to allow Icon Add on classes with Note
 * Updated Fix Max Hp and Mp
 * 
 * Updated Fix Menu Remove Option
 * Updated New Parameter Auto Optimize Equipment
 *
 * Added confirmation window before class change.
 * Added a cooldown system for class changes.
 *
 * ---------------
 * |Documentation|
 * ---------------
 * ->Parameters<-
 * *Add Entry To Menu -> If enabled, a Class Change entry will be added to the 
 *  menu. If this is disabled, another plugin will have to add an entry to the 
 *  menu that sends the symbol "classchange" to the handler.
 * 
 * *Menu Option Text -> The text that will be displayed in the menu if
 *  "Add Entry To Menu" is enabled.
 * 
 * *Level System Type -> The Type of level system to use. Currentl two are 
 *  support with a third in development:
 *      *Shared EXP -> The actor has one set of experience and when
 *       switching classes this experience amount will be used to 
 *       calculate their level in the new class.  
 *      *Class EXP -> The actor has an experience amount for each
 *       class. When they change class their experience in that 
 *       specific class will be used to determine their stats and 
 *       level.
 *      *Class EXP + Actor EXP EXPERIMENTAL (Actor Mode) -> The actor has their own level
 *       that determines their stats but grants no skills. The actor's skills are 
 *       determined by the class they currently have active and their level
 *       in that class.
 * 
 *  *Preserve Percentages for HP/MP -> This will look at the percentage of HP/MaxHP
 *  MP/MaxMP of a character before switching classes and ensure that the new class
 *  has the HP/MP set to the same percentage of their MaxHP/MaxMP
 * 
 * *Maintain Level + Percentage -> In Shared EXP mode, this will modify the actor's
 *  total EXP to maintain the same level and percent to next level when changing
 *  classes. This does not actually affect the growth rate of the class, so a class
 *  with a faster growth rate will result in the actor leveling up faster and then
 *  if the actor switches back to a class with a slower growth rate, they will keep
 *  the same level and percent to next.
 * 
 * *Level Up Text -> For use in Actor Mode. This is the text that will be displayed whenever
 *  the actor gains a level in their base class.
 * 
 * *Level Up Mode -> For use in Actor Mode. This is the mode of level up that will be used
 *  when the actor gains a level in their base class. There are two modes:
 *      *Normal -> The parameters for the actor will be based on their base class level and
 *       the parameter curves for that class.
 *      *Stat Gain -> The parameters for the actor will be determined by what class they are
 *       when they gain a level. Based on the stat gain type values will be added to their 
 *       parameters when they level.
 * 
 * Current Level For Stat Gains? -> If this is set to true, the delta between the parameters
 * for an actor's current base level and the next base level will be calculated and the values of the
 * delta will be added to their stats. If this is set to false, the level 1 stats for the 
 * class that the actor has set when they gain a base level will be used to increase their stats.
 * 
 * ->Add A Class To An Actor<-
 * There are two methods to add a class to an actor: notetags or plugin 
 * commands.
 * 
 * =>Notetags<=
 * To add classes that you want an actor to have from the start of the game use 
 * the following two notetags within the actor's note field:
 * *<LaziDenyClass: [classID]> -> This notetag will prevent this actor from ever
 *  having this class added, even if it is directly added by another note tag.
 * *<LaziGiveClassDisable: [classID] -> This notetag will add the class to the 
 *  actor at the start of a new game in a disabled state. It will appear in
 *  the actor's class list but be unselectable. The Modify Actor Classes plugin 
 *  command can be used to enable this class at a different time.
 * *<LaziGiveClass: [classID]> -> This notetag will add the class to the actor
 *  at the start of a new game.
 * *<LaziIcon: iconId> -> This notetag will add a icon in classe system.
 *
 * ==>Examples<==
 * *<LaziGiveClass: 1> will give the Actor class ID 1
 * *<LaziGiveClass: 1,5,7,4> will give the Actor classes 1, 5, 7, and 4
 * *<LaziGiveClassDisable: 1> will give the actor class ID 1 in a disabled form
 * *<LaziGiveClassDisable: 1,5,7> will give the actor classes 1, 5, and 7 in a disabled
 *
 * *<LaziIcon: 64> give the classe a icon
 *
 * =>Plugin Commands<=
 * Classes can also be added to an actor during playtime through the use of a 
 * plugin command.
 * The "Modify Actor Classes" plugin command allows for classes to be 
 * added/enabled, disabled, or removed.
 * The following fields are required for the command:
 * *Type Of Action -> The type of action to perform. There are three possible 
 *                    choices:
 *      *Add        -> Adds the class to the actor's class list or enables the 
 *                     class if the actor already has it but it is disabled.
 *      *Disable    -> Disables the class in the actor's class list making it 
 *                     impossible for them to switch to this class.
 *      *Remove     -> Removes the class from the actor's class list. WARNING: 
 *                     This is a permanent removal, if the class is later added 
 *                     back it will have the level reset to 1 and the exp reset 
 *                     to 0.
 * *Actor -> The ID of the actor who's class list should be modified (The ID in
 * the Database).
 * *Class -> The ID of the class to be modified (The ID in the database)
 * 
 * ->Enable/Disable Menu Option<-
 * If the plugin is managing the Change Class menu option, it can be enabled or 
 * disabled through a plugin command.
 * 
 * ->Show Class Change Menu Without Selecting From Menu Bar<-
 * If you want a game where the player can only switch classes at set locations
 * (say a shrine or training hall), do not enable the menu option and use
 * the following plugin command on the event you wish to open the class change
 * screen. The screen will open with showing the first character in the party
 * and the other characters can be selected using the arrow buttons at the top
 * of the screen.
 * 
 * =>Plugin Commands<=
 * Use the "ShowClassChangeScene" plugin command to show the class change scene.
 * This plugin command takes no arguments and will allow the player to change the
 * classes of any party members they have. Pressing the cancel button will close
 * the scene and return to normal gameplay.
 * 
 * =>Plugin Commands<=
 * The "Enable/Disable Menu Option" plugin command is used to enable or disable 
 * access to the Change Classes menu option. This command has one parameter:
 * *State -> If set to enable, access to the menu option will be allowed. If set 
 * to disable, access to the menu option will not be allowed. If set to remove, the menu option will not appear in the menu at all.
 * 
 * ->Actor Mode<-
 * In actor mode, an actor can be assigned a "Base" class in addition to their currently selected class. The Base class determines 
 * the actor's level and parameters while the currently selected class determines the actor's skills. The currently selected class
 * can be changed as normal through the class selection menu and each of these classes will have it's own independent level. The
 * Base class is intrinsic to the actor and cannot be changed once the game starts. This class can have skills and traits assigned
 * to it, but these will be ignored and only the parameters and exp gain rates will be used from the class. This allows the use of
 * a class that you wish to also be a normal clas as the Base class for an Actor.
 * 
 * =>Setting The Actor's Base Class<=
 * In order to set the Base class for an actor, the <LaziGiveClassDefault:[classId]> notetag should be placed in the notes of the actor.
 * If this notetag is not present for an actor, the first class in the actor's class list will be used. This will be the first class specified
 * with the add class notetag or the actor's current class if no classes are granted through this notetag.
 * 
 * @param menuOption
 * @text Add Entry To Menu
 * @desc Should a "ClassChange" entry be added to the menu? WARNING: If this is disabled, another plugin will need to add a call to the "classchange" handler 
 * in order for functionality to be enabled.
 * @type boolean
 * @default true
 * 
 * @param menuText
 * @text Menu Option Text
 * @desc The text to display in the menu for this option
 * @default Class Change
 * @type string
 * 
 * @param levelSystem
 * @text Level System Type
 * @desc The type of level system to use.
 * @type select
 * @option Shared EXP
 * @value singleLevel
 * @option Class EXP
 * @value individualLevel
 * @option Class EXP + Actor EXP EXPERIMENTAL
 * @value actorMode
 * @default singleLevel
 * 
 * @param usePercentages
 * @text Preserve Percentages for HP/MP
 * @desc Should HP/MP percentages match after a class change
 * @type boolean
 * @on Enable
 * @off Disable
 * @default off
 * 
 * @param autoOptimizeEquip
 * @parent cooldownSettings
 * @text Auto-Optimize Equipment
 * @desc Automatically equip the best items for the new class after changing. If disabled, it only un-equips items the new class cannot use.
 * @type boolean
 * @on Enable
 * @off Disable
 * @default true
 *
 * @param confirmationWindow
 * @parent cooldownSettings
 * @text Enable Confirmation Window
 * @desc Show a "Yes/No" confirmation window before changing class.
 * @type boolean
 * @on Enable
 * @off Disable
 * @default true
 *
 * @param cooldownSettings
 * @text Classe Settings
 *
 * @param enableCooldown
 * @parent cooldownSettings
 * @text Enable Class Change Cooldown
 * @desc If enabled, actors must wait a certain amount of time before changing classes again.
 * @type boolean
 * @on Enable
 * @off Disable
 * @default false
 *
 * @param cooldownDuration
 * @parent cooldownSettings
 * @text Cooldown Duration (seconds)
 * @desc The time in seconds an actor must wait before they can change their class again.
 * @type number
 * @min 1
 * @default 60
 *
 * @param SharedEXPSettings
 * @text Shared EXP Mode Settings
 * 
 * @param sharedModeMaintainLevel
 * @parent SharedEXPSettings
 * @text Maintain Level + Percentage
 * @desc When enabled the current level and percentage to next will be maintained when changing classes
 * @on Enable
 * @off Disable
 * @type boolean
 * @default off
 * 
 * @param ActorModeSettings
 * @text Actor Mode Settings
 * 
 * @param levelUpText
 * @text Level Up Text
 * @parent ActorModeSettings
 * @desc The text to display when the actor level goes up. Use %1 for actor name and %2 for the actor's new level.
 * @type string
 * @default %1 is now Base Level %2
 * 
 * @param levelupMode
 * @text Level Up Mode
 * @parent ActorModeSettings
 * @type select
 * @option Normal
 * @value normalMode
 * @option Stat Gain
 * @value statMode
 * 
 * @param statGainType
 * @text Current Level For Stat Gains?
 * @parent ActorModeSettings
 * @type boolean
 * @on Current Level
 * @off Level 1
 * 
 * @command ModifyClasses
 * @text Modify Actor Classes
 * @desc Command used to modify the classes that are assigned to an actor. Can be used to add or remove a class from the character.
 * WARNING: Once a class is removed, the level and exp for that class will also be lost.
 * 
 * @arg type
 * @text Type Of Action
 * @type select
 * @option Add
 * @option Disable
 * @option Remove
 * @default Add
 * @desc Whether the class should be added or removed.
 * 
 * @arg actorId
 * @text Actor
 * @type number
 * @default -1
 * @desc The ID of the actor we are modifying
 * 
 * @arg classId
 * @text Class
 * @type number
 * @default -1
 * @desc The ID of the class we want to add/remove.
 * 
 * @command ModifyMenuAccess
 * @text Enable/Disable Menu Option
 * @desc Command used to either allow or remove access to the Class Change menu option. WARNING: Only use this function if you have this plugin generating the menu
 * option. If another plugin is generating the option, use that plugin to disable access.
 * 
 * @arg state
 * @text State
 * @type select
 * @option Enabled
 * @value enable
 * @option Disabled
 * @value disable
 * @option Removed
 * @value remove
 * @default enable
 * 
 * 
 * @command ShowClassChangeScene
 * @text Show Class Change Scene
 * @desc Command used to display the class change scene without using the status menu.
 * 
 */



//------------------------------//
//      Boilerplate/General     //
//------------------------------//
var Imported = Imported || {};
Imported.Lazi_ClassChange = true;

var Lazi = Lazi || {};
Lazi.ClassChange = Lazi.ClassChange || {};
Lazi.Utils = Lazi.Utils || {};
Lazi.ClassChange.version = "1.1.6"; // Updated version
Lazi.Utils.Debug = false;

//------------------------------//
//      Helper Objects          //
//------------------------------//
class Lazi_ClassChange_ClassObject {
    constructor(classID, classExp = 0, enabled = true) {
        this.classID = classID;
        this.classExp = classExp;
        this.enabled = enabled;
    }
}

Lazi.Utils.GetByClassID = function (classList, classID) {
    // Using find() for cleaner, more declarative code.
    // Renamed '_class' to 'classData' for clarity.
    return classList.find(classData => classData.classID == classID);
    // The original loop worked, but find() is more idiomatic in modern JS.
    // for (const classData of classList) { if (classData.classID == classID) return classData; }
}

Lazi.Utils.DebugLog = function (message) {
    if (Lazi.Utils.Debug) {
        console.log(`Lazi_ClassChange: ${message}`);
    }
}

Lazi.ClassChange.initialize = function () {
    Lazi.Utils.DebugLog("Lazi_ClassChange: Initializing...")
    this.initializePluginCommands();
    this.initializeParameters();
}

Lazi.ClassChange.initializePluginCommands = function () {
    Lazi.Utils.DebugLog("Lazi_ClassChange: Initializing Plugin Commands");
    PluginManager.registerCommand("Lazi_ClassChange", "ModifyClasses", this.addActorClass);
    PluginManager.registerCommand("Lazi_ClassChange", "ModifyMenuAccess", this.ModifyMenuAccess);
    PluginManager.registerCommand("Lazi_ClassChange", "ShowClassChangeScene", this.showClassChangeScene);
}

Lazi.ClassChange.initializeParameters = function () {
    Lazi.Utils.DebugLog("Lazi_ClassChange: Initializing Parameters");
    const params = PluginManager.parameters("Lazi_ClassChange");
    this.params = {};
    this.params.createMenuOption = params.menuOption === 'true';
    this.params.menuOptionText = params.menuText;
    this.params.levelSystemType = params.levelSystem;
    this.params.levelUpText = params.levelUpText;
    this.params.levelupMode = params.levelupMode;
    this.params.statGainType = params.statGainType;
    this.params.usePercentages = params.usePercentages;
    this.params.autoOptimizeEquip = params.autoOptimizeEquip === 'true';
    this.params.sharedModeMaintainLevel = params.sharedModeMaintainLevel;
    this.params.confirmationWindow = params.confirmationWindow === 'true';
    this.params.enableCooldown = params.enableCooldown === 'true';
    this.params.cooldownDuration = Number(params.cooldownDuration || 60);

    this.functionParams = {};
    // The menu state will be managed by $gameSystem to persist across saves
}

Lazi.ClassChange.getParam = function (paramName) {
    if (this.params) {
        return this.params[paramName];
    }
    //We don't have params yet, initialize them.
    this.initialize();
    return this.params[paramName];
}

Lazi.ClassChange.showClassChangeScene = function (args) {
    SceneManager.push(Lazi_Scene_ClassChange);
}

Lazi.ClassChange.addActorClass = function (args) {
    if (args.actorId == -1 || args.classId == -1) { // Fixed verification logic
        Lazi.Utils.DebugLog("ERROR!:Cannot have an actor or class with an ID of -1");
        return;
    }
    let actor = $gameActors.actor(parseInt(args.actorId));
    let classId = parseInt(args.classId);
    let currentClasses = actor.LaziClassChange_classes;
    if (args.type === "Add") {
        if(actor.LaziClassChange_unavailableClasses.includes(classId)){ // Using .includes() which is more readable
            Lazi.Utils.DebugLog("ERROR!:attempted to add a class that's disabled for this actor");
            return;
        }

        for (const currentClass of currentClasses) {
            if (currentClass.classID == classId) {
                if (currentClass.enabled) {
                    Lazi.Utils.DebugLog("ERROR!: Class already in Actor's class list and enabled");
                    return;
                }
                currentClass.enabled = true;
                return;
            }
        }
        currentClasses.push(new Lazi_ClassChange_ClassObject(classId, 0));
    }
    if (args.type === "Disable") {
        for (const currentClass of currentClasses) {
            if (currentClass.classID == classId) {
                if (currentClass.enabled) {
                    Lazi.Utils.DebugLog("ERROR!: Class is already disabled!");
                    return;
                }
                currentClass.enabled = false;
                return;
            }
        }
    }
    if (args.type === "Remove") {
        Lazi.Utils.DebugLog("Removing the class with ID " + classId);

        //Uh oh, we are currently that class. We should bump ourselves to something else.
        if (actor._classId == classId) {
            //Uh oh. We only have one class and it's this class, do nothing.
            if (actor.LaziClassChange_classes.length === 1 && actor.LaziClassChange_classes[0].classID == classId) {
                return;
            }
            if (actor.LaziClassChange_classes[0].classID != classId) {
                const newClass = actor.LaziClassChange_classes[0];
                Lazi.ClassChange.performClassSwap(actor, newClass.classID, newClass.classExp);
            }
            //Otherwise just use the second in the list. 
            else {
                const newClass = actor.LaziClassChange_classes[1];
                Lazi.ClassChange.performClassSwap(actor, newClass.classID, newClass.classExp);
            }
        }
        actor.LaziClassChange_classes = currentClasses.filter((item) => {
            return item.classID != classId;
        })
    }
}

Lazi.ClassChange.ModifyMenuAccess = function (args) {
// FIX: The 'this' here does not refer to Lazi.ClassChange when called
// by the PluginManager. We must use the full object path to
// ensure the correct property is updated.
    $gameSystem.setLaziClassMenuAccess(args.state);
}

Lazi.ClassChange.shouldShowLevels = function () {
    return !(this.getParam("levelSystemType") == "singleLevel");
}

Lazi.ClassChange.isActorLevelMode = function () {
    return (Lazi.ClassChange.getParam("levelSystemType") == "actorMode")
}

Lazi.ClassChange.isStatGainMode = function () {
    return (Lazi.ClassChange.getParam("levelupMode") == "statMode") && (this.isActorLevelMode());
}

Lazi.ClassChange.isSharedMaintainLevel = function () {
    return (Lazi.ClassChange.getParam("sharedModeMaintainLevel") == "true") && (Lazi.ClassChange.getParam("levelSystemType") == "singleLevel")
}

Lazi.ClassChange.shouldUsePercentages = function () {
    //Uses string despite being a boolean type.
    return Lazi.ClassChange.getParam("usePercentages") == "true";
}

Lazi.ClassChange.shouldAutoOptimize = function () {
    return Lazi.ClassChange.getParam("autoOptimizeEquip") === true;
}

Lazi.ClassChange.shouldShowConfirmation = function() {
    return this.getParam("confirmationWindow");
}

Lazi.ClassChange.isCooldownEnabled = function() {
    return this.getParam("enableCooldown");
}

Lazi.ClassChange.CurrentLevelForStatGain = function () {
    return Lazi.ClassChange.getParam("statGainType") == "true";
}

Lazi.ClassChange.ClassLevelByExp = function (classId, expAmount) {
    const classData = $dataClasses[classId];
    if (!classData) {
        return -1;
    }
    const basis = classData.expParams[0];
    const extra = classData.expParams[1];
    const acc_a = classData.expParams[2];
    const acc_b = classData.expParams[3];
    let level = 1;
    while (true) {
        const levelExp = Math.round(
            (basis * Math.pow(level - 1, 0.9 + acc_a / 250) * level * (level + 1)) /
            (6 + Math.pow(level, 2) / 50 / acc_b) +
            (level - 1) * extra
        );
        if (expAmount < levelExp) // Simplified logic: if the actor's exp is less than the exp for this level
        {
            return (level - 1) //Since we're 1 level ahead, return the level before.
        }
        level += 1;
        /* 
                //Debug infinite loop failsafe
                if (level > 99)
                    break;*/
    }
}

Lazi.ClassChange.ExpByClassLevel = function (classId, level) {
    const classData = $dataClasses[classId];
    if (!classData) {
        return -1;
    }
    const basis = classData.expParams[0];
    const extra = classData.expParams[1];
    const acc_a = classData.expParams[2];
    const acc_b = classData.expParams[3];
    return Math.round(
        (basis * Math.pow(level - 1, 0.9 + acc_a / 250) * level * (level + 1)) /
        (6 + Math.pow(level, 2) / 50 / acc_b) +
        (level - 1) * extra);
}

Lazi.ClassChange.performClassSwap = function (actor, newClassID, newClassExp) {
    //Gotta stay proportional
    let HPpercent, MPpercent; // Usando let em vez de var
    if (Lazi.ClassChange.shouldUsePercentages()) {
        HPpercent = actor.hp / actor.mhp; // Real Max HP Value
        MPpercent = actor.mp / actor.mmp; // Real Max MP Value
    }
    //We need to swap out the exp with the correct amount.
    if (Lazi.ClassChange.shouldShowLevels()) {

        actor._classId = newClassID;
        actor._level = Lazi.ClassChange.ClassLevelByExp(newClassID, newClassExp);
        actor._exp[newClassID] = newClassExp;
        actor.initSkills();
        actor.refresh();
    }

    //Keeping exp, can just use default class change function. Woo!
    else {
        actor.changeClass(newClassID, true);
    }

    //Use our already calculated percentages to change HP now that we've changed classes/levels
    if (Lazi.ClassChange.shouldUsePercentages()) {
        actor.setHp(Math.round(actor.mhp * HPpercent));
        actor.setMp(Math.round(actor.mmp * MPpercent));
    }

    // Optimize equipment for the new class if the parameter is enabled
    if (Lazi.ClassChange.shouldAutoOptimize()) {
        actor.optimizeEquipments();
        actor.refresh(); // Ensures that status changes from new items are applied
    }

    if (Lazi.ClassChange.isCooldownEnabled()) {
        const cooldownFrames = Lazi.ClassChange.getParam("cooldownDuration") * 60;
        actor.setClassChangeCooldown(cooldownFrames);
    }
}

Lazi.ClassChange.initialize();

//------------------------------//
//        Data Manager          //
//------------------------------//

const Lazi_ClassChange_DataManager_createGameObjects = DataManager.createGameObjects;
DataManager.createGameObjects = function() {
    Lazi_ClassChange_DataManager_createGameObjects.call(this);
    $gameSystem.initLaziClassMenuAccess();
};

Game_System.prototype.initLaziClassMenuAccess = function() {
    this._laziClassMenuAccess = this._laziClassMenuAccess || "enable";
};

Game_System.prototype.setLaziClassMenuAccess = function(state) {
    this._laziClassMenuAccess = state;
};

//------------------------------//
//        Game Intepreter       //
//------------------------------//
//Change EXP command, needs to change to faciliate modifying the actor base level.
Lazi.ClassChange.GameInterpreter_command315 = Game_Interpreter.prototype.command315;
Game_Interpreter.prototype.command315 = function (params) {
    if (Lazi.ClassChange.isActorLevelMode()) {
        const value = this.operateValue(params[2], params[3], params[4]);
        this.iterateActorEx(params[0], params[1], actor => {
            actor.gainExp(value, true)
        });
    }
    Lazi.ClassChange.GameInterpreter_command315.apply(this, arguments);
    return true;
};

//------------------------------//
//        Scene Base            //
//------------------------------//
const Lazi_ClassChange_Scene_Base_update = Scene_Base.prototype.update;
Scene_Base.prototype.update = function() {
    Lazi_ClassChange_Scene_Base_update.call(this);
    // This ensures the cooldown ticks down every frame, in every scene.
    if ($gameParty && $gameParty.members()) {
        $gameParty.members().forEach(actor => actor.updateClassChangeCooldown());
    }
};

//------------------------------//
//        Game Actor            //
//------------------------------//

///Newly Added Functions///
Game_Actor.prototype.Lazi_GenerateClassList = function (actorId) {
    const actor = $dataActors[actorId]
    const note = actor.note;
    let classList = [];
    classList.push(new Lazi_ClassChange_ClassObject(actor.classId, Lazi.ClassChange.ExpByClassLevel(actor.classId, actor.initialLevel)))
    const matches = note.matchAll(/<\s*Lazi\s?Give\s?Class:\s*(.+)\s*>/ig)
    if (matches) {
        for (const match of matches) {
            const subMatches = match[0].matchAll(/(\d+),?/g)
            for (const subMatch of subMatches) {
                //We already have it, don't add it.
                const alreadyAdded = classList.filter((entry) => {
                    return (entry.classID == parseInt(subMatch[1]))
                }).length != 0
                if ((parseInt(subMatch[1]) == actor._classId) || alreadyAdded || this.LaziClassChange_unavailableClasses.indexOf(parseInt[subMatch[1]]) > -1) {
                    continue;
                }

                classList.push(new Lazi_ClassChange_ClassObject(parseInt(subMatch[1]), 0));
            }
        }
    }
    const DisableMatches = note.matchAll(/<\s*Lazi\s?Give\s?Class\s?Disable:\s*(.+)\s*>/ig)
    if (DisableMatches) {
        for (const match of DisableMatches) {
            const subMatches = match[0].matchAll(/(\d+),?/g)
            for (const subMatch of subMatches) {
                //We already have it, don't add it.
                const alreadyAdded = classList.filter((entry) => {
                    return (entry.classID == parseInt(subMatch[1]))
                }).length != 0
                if ((parseInt(subMatch[1]) == actor._classId) || alreadyAdded || this.LaziClassChange_unavailableClasses.indexOf(parseInt[subMatch[1]]) > -1) {
                    continue;
                }
                classList.push(new Lazi_ClassChange_ClassObject(parseInt(subMatch[1]), 0, false));
            }
        }
    }
    //If we're using actor classes, they should have specified a default. If not we'll just use classList[0]
    if (Lazi.ClassChange.isActorLevelMode()) {

        //If we already have it, no reason to generate
        if (this.LaziClassChange_ACTORMODECLASS != null)
            return;

        //We should only have 1
        const DefaultMatch = note.match(/<\s*Lazi\s?Give\s?Class\s?Default[:]?\s*(\d+)\s*>/ig)
        if (DefaultMatch) {
            this.LaziClassChange_ACTORMODECLASS = new Lazi_ClassChange_ClassObject(RegExp.$1, 0);
        }
        //We don't have a default :( Let's take the first entry in the class list or just null it if there isn't one which means they'll use their intrinsic class for this....SHOULD NOT HAPPEN IF CONFIGURED PROPERLY
        else if (classList.length > 0) {
            this.LaziClassChange_ACTORMODECLASS = classList[0];
        } else {
            this.LaziClassChange_ACTORMODECLASS = null; //We're gonna have issues....
        }
    }
    return classList;
}

Game_Actor.prototype.setClassChangeCooldown = function(frames) {
    this._classChangeCooldown = frames;
};

Game_Actor.prototype.updateClassChangeCooldown = function() {
    if (this._classChangeCooldown > 0) {
        this._classChangeCooldown--;
    }
};

Game_Actor.prototype.isClassChangeOnCooldown = function() {
    return this._classChangeCooldown > 0;
};


Game_Actor.prototype.Lazi_GenerateClassUnavailableList = function(actorId){
    const actor = $dataActors[actorId]
    const note = actor.note;
    let classList = [];
    const DenyMatches = note.matchAll(/<\s*Lazi\s?Deny\s?Class\s?:\s*(.+)\s*>/ig)
    if (DenyMatches) {
        for (const match of DenyMatches) {
            const subMatches = match[0].matchAll(/(\d+),?/g)
            for (const subMatch of subMatches) {
                //We already have it, don't add it.
                const alreadyAdded = classList.filter((entry) => {
                    return (entry.classID == parseInt(subMatch[1]))
                }).length != 0
                if ((parseInt(subMatch[1]) == actor._classId) || alreadyAdded) {
                    continue;
                }
                classList.push(parseInt(subMatch[1]));
            }
        }
    }
    return classList;
}

Game_Actor.prototype.Lazi_GetACTORMODEClass = function () {
    return $dataClasses[this.LaziClassChange_ACTORMODECLASS.classID];
}

Game_Actor.prototype.Lazi_GetACTORMODELevel = function () {
    return Lazi.ClassChange.ClassLevelByExp(this.LaziClassChange_ACTORMODECLASS.classID, this.LaziClassChange_ACTORMODECLASS.classExp);
}

Game_Actor.prototype.Lazi_ACTORMODEDisplayLevelUp = function () {
    const text = Lazi.ClassChange.getParam("levelUpText").format(
        this._name,
        this.Lazi_GetACTORMODELevel()
    );
    $gameMessage.newPage();
    $gameMessage.add(text);
}

Game_Actor.prototype.Lazi_IncreaseParams = function (amount, paramID) {
    this.laziClassChange_params[paramID] += amount;
}

Game_Actor.prototype.Lazi_StatGainLevelUp = function (originalLvl) {
    const params = $dataClasses[this._classId].params;
    for (let i = 0; i < params.length; ++i) {
        for (let j = (originalLvl + 1); j <= this.Lazi_GetACTORMODELevel(); ++j) {
            //Use current level
            if (Lazi.ClassChange.CurrentLevelForStatGain()) {
                const paramDiff = params[i][j] - params[i][j - 1];
                this.Lazi_IncreaseParams(paramDiff, i);
            }
            //Use level 1 stats
            else {
                this.Lazi_IncreaseParams(params[i][1], i);
            }
        }
    }
}

///Overwritten Functions///
Lazi.ClassChange.GameActor_initMembers = Game_Actor.prototype.initMembers;
Game_Actor.prototype.initMembers = function () {
    Lazi.ClassChange.GameActor_initMembers.apply(this, arguments);
    this.LaziClassChange_unavailableClasses = [];
    this.LaziClassChange_classes = [];
    if (Lazi.ClassChange.isActorLevelMode()) {
        this.LaziClassChange_ACTORMODECLASS = null;
        if (Lazi.ClassChange.isStatGainMode()) {
            this.laziClassChange_params = [];
        }
        this._classChangeCooldown = 0;
    }

}

Lazi.ClassChange.GameActor_setup = Game_Actor.prototype.setup;
Game_Actor.prototype.setup = function (actorId) {
    if (this.LaziClassChange_unavailableClasses == undefined || this.LaziClassChange_unavailableClasses.length == 0) {
        this.LaziClassChange_unavailableClasses = this.Lazi_GenerateClassUnavailableList(actorId);
    }
    //We need to generate a list using their notetag
    if (this.LaziClassChange_classes == undefined || this.LaziClassChange_classes.length == 0) {
        this.LaziClassChange_classes = this.Lazi_GenerateClassList(actorId);
    }
    Lazi.ClassChange.GameActor_setup.apply(this, arguments);
    //Run stat gain based on the starting actor class level.
    if (Lazi.ClassChange.isStatGainMode()) {
        const baseClassParams = this.Lazi_GetACTORMODEClass().params;
        for (let i = 0; i < baseClassParams.length; ++i) {
            this.laziClassChange_params[i] = baseClassParams[i][1];
        }
        this.Lazi_StatGainLevelUp(1);

        //Init values, they won't be naturally due to not using normal params
        this.setHp(this.laziClassChange_params[0]);
        this.setMp(this.laziClassChange_params[1]);
    }
}

Lazi.ClassChange.GameActor_gainExp = Game_Actor.prototype.gainExp;
Game_Actor.prototype.gainExp = function (exp, onlyToBase = false) {
    if (!onlyToBase) {
        Lazi.ClassChange.GameActor_gainExp.apply(this, [exp]);
    }
    if (Lazi.ClassChange.isActorLevelMode()) {
        const currentLVL = this.Lazi_GetACTORMODELevel();
        this.LaziClassChange_ACTORMODECLASS.classExp += Math.round(exp * this.finalExpRate());
        if (currentLVL < this.Lazi_GetACTORMODELevel()) {
            if (Lazi.ClassChange.isStatGainMode()) {
                this.Lazi_StatGainLevelUp(currentLVL);
            }
            this.Lazi_ACTORMODEDisplayLevelUp();
            this.refresh();
        }
    }
}

Lazi.ClassChange.GameActor_changeExp = Game_Actor.prototype.changeExp;
Game_Actor.prototype.changeExp = function (exp, show) {
    Lazi.ClassChange.GameActor_changeExp.apply(this, arguments);
    Lazi.Utils.GetByClassID(this.LaziClassChange_classes, this._classId).classExp = this._exp[this._classId];
}

Lazi.ClassChange.GameActor_paramBase = Game_Actor.prototype.paramBase;
Game_Actor.prototype.paramBase = function (paramId) {
    if (Lazi.ClassChange.isActorLevelMode()) {
        if (this.LaziClassChange_ACTORMODECLASS == null) {
            Lazi.Utils.DebugLog("ERROR!: We're in ActorLevel mode and don't have an actor mode class set!");
            return 0;
        }
        if (Lazi.ClassChange.isStatGainMode()) {
            if (this.laziClassChange_params == null) {
                Lazi.Utils.DebugLog("ERROR!: We're using stat gain but don't have any params set!");
                return 0;
            }
            return this.laziClassChange_params[paramId];
        }
        return this.Lazi_GetACTORMODEClass().params[paramId][this.Lazi_GetACTORMODELevel()]
    } else {
        return Lazi.ClassChange.GameActor_paramBase.apply(this, arguments);
    }
}


Lazi.ClassChange.GameActor_changeClass = Game_Actor.prototype.changeClass;
Game_Actor.prototype.changeClass = function (classId, keepExp) {
    let classData = Lazi.Utils.GetByClassID(this.LaziClassChange_classes, classId);
    if (!classData) {
        //We don't have it but they clearly want to add it for this character, let's add a new entry to list
        this.LaziClassChange_classes.push(new Lazi_ClassChange_ClassObject(classId, 0, true));
        classData = Lazi.Utils.GetByClassID(this.LaziClassChange_classes, classId);
    } else if (Lazi.ClassChange.isSharedMaintainLevel()) {
        const currentLvl = this._level;
        const currentEXP = this._exp[this._classId];
        const EXPForCurrent = Lazi.ClassChange.ExpByClassLevel(this._classId, currentLvl);
        const EXPForNext = Lazi.ClassChange.ExpByClassLevel(this._classId, currentLvl + 1);
        const percentToNext = (currentEXP - EXPForCurrent) / (EXPForNext - EXPForCurrent);
    }
    Lazi.ClassChange.GameActor_changeClass.apply(this, arguments);
    if (!keepExp) {
        this._exp[classData.classID] = classData.classExp;
        this._level = Lazi.Utils.ClassLevelByExp(classData.classExp);
    } else if (Lazi.ClassChange.isSharedMaintainLevel()) {
        let EXPForNewNext = Lazi.ClassChange.ExpByClassLevel(this._classId, currentLvl + 1);
        let EXPForNewCurrent = Lazi.ClassChange.ExpByClassLevel(this._classId, currentLvl);
        this._level = currentLvl;
        this._exp[this._classId] = Math.round(EXPForNewCurrent + ((EXPForNewNext - EXPForNewCurrent) * percentToNext));
        this.refresh();
        this.initSkills();
    }
}


Lazi.ClassChange.GameActor_isMaxLevel = Game_Actor.prototype.isMaxLevel;
Game_Actor.prototype.isMaxLevel = function () {
    if (!Lazi.ClassChange.isActorLevelMode()) {
        return Lazi.ClassChange.GameActor_isMaxLevel.apply(this, arguments);
    }
    return this.Lazi_GetACTORMODELevel() >= this.maxLevel();
}

//------------------------------//
//        Window_StatusBase     //
//------------------------------//

Lazi.ClassChange.WindowStatusBase_drawActorClass = Window_StatusBase.prototype.drawActorClass;
Window_StatusBase.prototype.drawActorClass = function (actor, x, y, width) {
    if (!Lazi.ClassChange.isActorLevelMode()) {
        Lazi.ClassChange.WindowStatusBase_drawActorClass.apply(this, arguments);
    } else {
        width = width || 168;
        this.resetTextColor();
        const text = `${actor.currentClass().name} Lv. ${actor._level}`;
        this.drawText(text, x, y, width);
    }
}


Lazi.ClassChange.WindowStatusBase_drawActorLevel = Window_StatusBase.prototype.drawActorLevel;
Window_StatusBase.prototype.drawActorLevel = function (actor, x, y) {
    if (!Lazi.ClassChange.isActorLevelMode()) {
        Lazi.ClassChange.WindowStatusBase_drawActorLevel.apply(this, arguments);
    } else {
        this.changeTextColor(ColorManager.systemColor());
        this.drawText(TextManager.levelA, x, y, 48);
        this.resetTextColor();
        this.drawText(actor.Lazi_GetACTORMODELevel(), x + 84, y, 36, "right");
    }
};

//------------------------------//
//        Window_Status         //
//------------------------------//
Lazi.ClassChange.WindowStatus_expTotalValue = Window_Status.prototype.expTotalValue;
Window_Status.prototype.expTotalValue = function () {
    if (!Lazi.ClassChange.isActorLevelMode()) {
        return Lazi.ClassChange.WindowStatus_expTotalValue.apply(this, arguments);
    }
    if (this._actor.isMaxLevel()) {
        return "-------";
    } else {
        return this._actor.LaziClassChange_ACTORMODECLASS.classExp;
    }
}

Lazi.ClassChange.WindowStatus_expNextValue = Window_Status.prototype.expNextValue;
Window_Status.prototype.expNextValue = function () {
    if (!Lazi.ClassChange.isActorLevelMode()) {
        return Lazi.ClassChange.WindowStatus_expNextValue.apply(this, arguments);
    }
    if (this._actor.isMaxLevel()) {
        return "-------";
    } else {
        return Lazi.ClassChange.ExpByClassLevel(this._actor.LaziClassChange_ACTORMODECLASS.classID, this._actor.Lazi_GetACTORMODELevel() + 1) - this._actor.LaziClassChange_ACTORMODECLASS.classExp;
    }
};

//------------------------------//
//     Window MenuCommand       //
//------------------------------//
Lazi.ClassChange.WindowMenuCommand_addMainCommands = Window_MenuCommand.prototype.addMainCommands;
Window_MenuCommand.prototype.addMainCommands = function () {
    Lazi.ClassChange.WindowMenuCommand_addMainCommands.apply(this, arguments);
    if (Lazi.ClassChange.getParam("createMenuOption") === true) {
        const menuAccess = $gameSystem._laziClassMenuAccess || "enable";
        if (menuAccess === "enable") {
            this.addCommand(Lazi.ClassChange.getParam("menuOptionText"), "classchange", this.areMainCommandsEnabled());
        } else if (menuAccess === "disable") {
            this.addCommand(Lazi.ClassChange.getParam("menuOptionText"), "classchange", false);
        } else {
            //Don't add it, the option must set to remove.
        }
    }
}


//------------------------------//
//        Scene Menu            //
//------------------------------//
Lazi.ClassChange.SceneMenu_createCommandWindow = Scene_Menu.prototype.createCommandWindow;
Scene_Menu.prototype.createCommandWindow = function () {
    Lazi.ClassChange.SceneMenu_createCommandWindow.apply(this, arguments);
    this._commandWindow.setHandler("classchange", this.commandPersonal.bind(this));
}

Lazi.ClassChange.SceneMenu_onPersonalOk = Scene_Menu.prototype.onPersonalOk;
Scene_Menu.prototype.onPersonalOk = function () {
    if (this._commandWindow.currentSymbol() != "classchange") {
        Lazi.ClassChange.SceneMenu_onPersonalOk.apply(this, arguments);
        return;
    }

    SceneManager.push(Lazi_Scene_ClassChange);
}

//------------------------------//
//    Scene ClassChange         //
//------------------------------//
function Lazi_Scene_ClassChange() {
    this.initialize(...arguments);
}

Lazi_Scene_ClassChange.prototype = Object.create(Scene_ItemBase.prototype);
Lazi_Scene_ClassChange.prototype.constructor = Lazi_Scene_ClassChange;

Lazi_Scene_ClassChange.prototype.initialize = function () {
    Scene_ItemBase.prototype.initialize.call(this);
};

Lazi_Scene_ClassChange.prototype.create = function () {
    Scene_ItemBase.prototype.create.call(this);
    this.createHelpWindow();
    this.createStatusWindow();
    this.createItemWindow();
    this.createActorWindow();
    this.createConfirmationWindow();
    this._itemWindow.activate();
    this._itemWindow.selectLast();
};

Lazi_Scene_ClassChange.prototype.start = function () {
    Scene_ItemBase.prototype.start.call(this);
    this.refreshActor();
};

Lazi_Scene_ClassChange.prototype.createStatusWindow = function () {
    const rect = this.statusWindowRect();
    this._statusWindow = new Window_SkillStatus(rect); //Want same info, just piggyback
    this.addWindow(this._statusWindow);
};

Lazi_Scene_ClassChange.prototype.statusWindowRect = function () {
    const ww = Graphics.boxWidth
    const wh = this.calcWindowHeight(3, true);
    const wx = this.isRightInputMode() ? Graphics.boxWidth - ww : 0;
    const wy = this.mainAreaTop();
    return new Rectangle(wx, wy, ww, wh);
};

Lazi_Scene_ClassChange.prototype.createConfirmationWindow = function() {
    const rect = this.confirmationWindowRect();
    this._confirmationWindow = new Window_ClassChangeConfirm(rect);
    this._confirmationWindow.setHandler("yes", this.onConfirmOk.bind(this));
    this._confirmationWindow.setHandler("no", this.onConfirmCancel.bind(this));
    this.addWindow(this._confirmationWindow);
};

Lazi_Scene_ClassChange.prototype.confirmationWindowRect = function() {
    const ww = 240;
    const wh = this.calcWindowHeight(2, true);
    const wx = (Graphics.boxWidth - ww) / 2;
    const wy = (Graphics.boxHeight - wh) / 2;
    return new Rectangle(wx, wy, ww, wh);
};

Lazi_Scene_ClassChange.prototype.createItemWindow = function () {
    const rect = this.itemWindowRect();
    this._itemWindow = new Window_ClassList(rect);
    this._itemWindow.setHelpWindow(this._helpWindow);
    this._itemWindow.setHandler("ok", this.onItemOk.bind(this));
    this._itemWindow.setHandler("cancel", this.popScene.bind(this));
    this._itemWindow.setHandler("pagedown", this.nextActor.bind(this));
    this._itemWindow.setHandler("pageup", this.previousActor.bind(this));
    this.addWindow(this._itemWindow);
};

Lazi_Scene_ClassChange.prototype.itemWindowRect = function () {
    const wx = 0;
    const wy = this._statusWindow.y + this._statusWindow.height;
    const ww = Graphics.boxWidth;
    const wh = this.mainAreaHeight() - this._statusWindow.height;
    return new Rectangle(wx, wy, ww, wh);
};

Lazi_Scene_ClassChange.prototype.needsPageButtons = function () {
    return true;
};

Lazi_Scene_ClassChange.prototype.arePageButtonsEnabled = function () {
    return !this.isActorWindowActive();
};

Lazi_Scene_ClassChange.prototype.refreshActor = function () {
    const actor = this.actor();
    this._statusWindow.setActor(actor);
    this._itemWindow.setActor(actor);
};

Lazi_Scene_ClassChange.prototype.user = function () {
    return this.actor();
};

Lazi_Scene_ClassChange.prototype.playSeForItem = function () {
    SoundManager.playUseSkill();
};

Lazi_Scene_ClassChange.prototype.useItem = function () {
    this.playSeForItem();
    this._statusWindow.refresh();
    this._itemWindow.refresh();
    this.checkCommonEvent();
    this.checkGameover();
    this._actorWindow.refresh();
    this._itemWindow.activate();
};

Lazi_Scene_ClassChange.prototype.performClassSwap = function (item) {
    const actor = this.actor();
    Lazi.ClassChange.performClassSwap(actor, item.classID, item.classExp);
    this.useItem();
    this._itemWindow.startCooldownRefresh(); // Starts the cooldown refresh
}

Lazi_Scene_ClassChange.prototype.onActorChange = function () {
    // Chama a função base para atualizar o ator
    Scene_ItemBase.prototype.onActorChange.call(this);
    // Reativa a janela de lista de classes para que o controle não seja perdido
    this.refreshActor();
    this._itemWindow.activate(); // Reactivates the class list window so control is not lost
};

Lazi_Scene_ClassChange.prototype.onItemOk = function () {
    if (Lazi.ClassChange.shouldShowConfirmation()) {
        this._confirmationWindow.open();
        this._confirmationWindow.activate();
    } else {
        this.performClassSwap(this.item());
    }
};

Lazi_Scene_ClassChange.prototype.onConfirmOk = function() {
    this.performClassSwap(this.item());
    this.closeConfirmationWindow();
};

Lazi_Scene_ClassChange.prototype.onConfirmCancel = function() {
    this.closeConfirmationWindow();
};

Lazi_Scene_ClassChange.prototype.closeConfirmationWindow = function() {
    this._confirmationWindow.close();
    this._itemWindow.activate();
};

//------------------------------//
//    Window ClassList          //
//------------------------------//
function Window_ClassList() {
    this.initialize(...arguments);
}

function Window_ClassChangeConfirm() {
    this.initialize(...arguments);
}

Window_ClassChangeConfirm.prototype = Object.create(Window_Command.prototype);
Window_ClassChangeConfirm.prototype.constructor = Window_ClassChangeConfirm;

Window_ClassChangeConfirm.prototype.initialize = function(rect) {
    Window_Command.prototype.initialize.call(this, rect);
    this.openness = 0; // Starts the window completely closed to prevent flickering
    this.deactivate(); // Keeps the window inactive until called
};

Window_ClassChangeConfirm.prototype.makeCommandList = function() {
    this.addCommand("Sim", "yes");
    this.addCommand("Não", "no");
};


Window_ClassList.prototype = Object.create(Window_Selectable.prototype);
Window_ClassList.prototype.constructor = Window_ClassList;

Window_ClassList.prototype.initialize = function (rect) {
    Window_Selectable.prototype.initialize.call(this, rect);
    this._actor = null;
    this._data = [];
    this._lastCooldownFrames = 0; // Tracks frames to know when to update
    this._lastCooldownSeconds = 0; // Tracks seconds to know when to redraw
    this._cooldownRefresh = false;
};

Window_ClassList.prototype.setActor = function (actor) {
    if (this._actor !== actor) {
        this._actor = actor;
        this.refresh();
        this.scrollTo(0, 0);
        this._lastCooldownFrames = 0; // Resets the cooldown tracker on actor change
        this._lastCooldownSeconds = 0;
        this._cooldownRefresh = this._actor.isClassChangeOnCooldown();
    }
};

Window_ClassList.prototype.startCooldownRefresh = function() {
    this._cooldownRefresh = true;
};

Window_ClassList.prototype.maxCols = function () {
    return 2;
};

Window_ClassList.prototype.colSpacing = function () {
    return 16;
};

Window_ClassList.prototype.maxItems = function () {
    return this._data ? this._data.length : 1;
};

Window_ClassList.prototype.item = function () {
    return this.itemAt(this.index());
};

Window_ClassList.prototype.itemAt = function (index) {
    return this._data && index >= 0 ? this._data[index] : null;
};

Window_ClassList.prototype.isCurrentItemEnabled = function () {
    if (this.index() == -1) {
        return;
    }
    return this.isEnabled(this._data[this.index()]);
};

Window_ClassList.prototype.includes = function (item) {
    return item;
};

Window_ClassList.prototype.isEnabled = function (item) {
    if (!this._actor || !item.enabled || this._actor._classId === item.classID) {
        return false;
    }
    if (Lazi.ClassChange.isCooldownEnabled() && this._actor.isClassChangeOnCooldown()) {
        return false;
    }
    return true;
};

Window_ClassList.prototype.makeItemList = function () {
    if (this._actor) {
        this._data = this._actor.LaziClassChange_classes.filter((classData)=>{
            // Ensures the class actually exists in the game data before displaying it.
            if ($dataClasses[classData.classID])
                return true;
            return false;
        });
    } else {
        this._data = [];
    }
};

Window_ClassList.prototype.selectLast = function () {
    this.smoothSelect(0);
};

Window_ClassList.prototype.drawItemName = function(item, x, y, width) {
    if (item) {
        const iconY = y + (this.lineHeight() - ImageManager.iconHeight) / 2;
        const textMargin = ImageManager.iconWidth + 4;
        const itemWidth = Math.max(0, width - textMargin);
        this.resetTextColor();
        this.drawIcon(item.iconIndex, x, iconY);
        this.drawText(item.name, x + textMargin, y, itemWidth);
    }
};

Window_ClassList.prototype.drawItem = function (index) {
    const classData = this.itemAt(index);
    const classInfo = $dataClasses[classData.classID];
    if (classData && classInfo) {
        const levelWidth = this.levelWidth();
        const rect = this.itemLineRect(index);
        this.changePaintOpacity(this.isEnabled(classData));
        this.drawItemName({
            name: classInfo.name,
            iconIndex: Lazi.ClassChange.getClassIcon(classData.classID)
        }, rect.x, rect.y, rect.width - levelWidth);

        // Check if we should draw cooldown or level
        if (this._actor.isClassChangeOnCooldown() && this._actor.currentClass().id !== classData.classID) {
            this.drawCooldownTime(this._actor, rect.x, rect.y, rect.width);
        } else if (Lazi.ClassChange.shouldShowLevels()) {
            this.drawclassLevel(classData, rect.x, rect.y, rect.width);
        }

        this.changePaintOpacity(1);
    }
};

Window_ClassList.prototype.drawCooldownTime = function(actor, x, y, width) {
    const remainingFrames = actor._classChangeCooldown || 0;
    const remainingSeconds = Math.ceil(remainingFrames / 60);
    this.drawText(remainingSeconds + "s", x, y, width, "right");
};

Window_ClassList.prototype.levelWidth = function () {
    if (Lazi.ClassChange.shouldShowLevels()) {
        return this.textWidth("Lvl. 000");
    } else {
        return 0;
    }
};

Window_ClassList.prototype.drawclassLevel = function (classData, x, y, width) {
    this.drawText("Lvl. " + Lazi.ClassChange.ClassLevelByExp(classData.classID, classData.classExp), x, y, width, "right");
};

Window_ClassList.prototype.updateHelp = function () {
    if (this._actor)
        this.setHelpWindowItem({
            description: `Select the new class for ${this._actor.name()}.`
        });
    else
        this.setHelpWindowItem({
            description: ``
        });
};

Window_ClassList.prototype.refresh = function () {
    this.makeItemList();
    Window_Selectable.prototype.refresh.call(this);
};

Window_ClassList.prototype.update = function() {
    Window_Selectable.prototype.update.call(this);
    if (this._actor && this._cooldownRefresh) {
        const currentFrames = this._actor._classChangeCooldown || 0;
        // Checks if the cooldown has changed or just ended
        if (this._lastCooldownFrames > 0 && currentFrames <= 0) {
            this._cooldownRefresh = false; // Stops checking
            this.refresh(); // Final update to re-enable items
        } else {
            const currentSeconds = Math.ceil(currentFrames / 60);
            // Only redraws the window if the number of seconds has changed (performance optimization)
            if (this._lastCooldownSeconds !== currentSeconds) {
                this.refresh();
            }
        }

        this._lastCooldownFrames = currentFrames;
        this._lastCooldownSeconds = Math.ceil(currentFrames / 60);
    }
};

Lazi.ClassChange.getClassIcon = function(classId) {
    const classData = $dataClasses[classId];
    if (!classData) return 0;
    const note = classData.note;
    const match = note.match(/<\s*LaziIcon\s*:\s*(\d+)\s*>/i);
    if (match) return parseInt(match[1]);
    return 0; //Fallback to default icon if no notetag
}
