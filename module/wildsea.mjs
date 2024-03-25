//Importing our sheet.
import { WildseaItem } from "./item/item.mjs";
import { WildseaItemSheet } from "./sheets/item-sheet.mjs";
import { WildseaActor } from "./actor/actor.mjs";
import { WildseaActorSheet } from "./sheets/actor-sheet.mjs";

//Importing our configs
import { WILDSEA } from "./helpers/config.mjs";

async function preloadHandlebarsTemplates() {
	const templatePaths = [
		'systems/wildsea/templates/partials/track-display.hbs',	
		'systems/wildsea/templates/item/item-track-sheet.hbs',
		'systems/wildsea/templates/item/item-aspect-sheet.hbs',
	];

	return loadTemplates(templatePaths);
};

Hooks.once('init', function () {
	game.wildsea = {
		WildseaItem,
	};


	CONFIG.WILDSEA = WILDSEA;
	CONFIG.Item.documentClass = WildseaItem;

	Actors.unregisterSheet('core', ActorSheet);
	Actors.registerSheet('wildsea', WildseaActorSheet, {
		makeDefault: true,
	});
	Items.unregisterSheet('core', ItemSheet);
	Items.registerSheet('wildsea', WildseaItemSheet, {
		makeDefault: true,
	});

	//This helper lets us repeat any html like a for loop.
	//Which is FREAKING CRAZY! It's literally what i want for tracks.
	//Hopefully this works like i hope it does.
	Handlebars.registerHelper("times", function (n, content) {
		let result = "";
		for (let i = 0; i < n; ++i) {
			result += content.fn(i);
		}

		return result;
	});


	Handlebars.registerHelper("track", function (length, marks, burns, breaks, content) {

		const emptyCellPath = 'systems/wildsea/icons/track/track-circle-empty.png';
		const markedCellPath = 'systems/wildsea/icons/track/track-circle-marked.png';
		const burnedCellPath= 'systems/wildsea/icons/track/track-circle-burned.png';
		
		let result = "";

		for (let i = 0; i < length; i++){
			//We assume its an empty cell
			let path = emptyCellPath;
			
			//Unless there are marks, in which case, we want to add those.
			if (i < marks) {
				path = markedCellPath;
			}

			//Burns will overwrite marks.
			if (i < burns) {
				path = burnedCellPath;	
			}

			//Then we just add the cell based on what was used
			result += `<img class=\"track-cell\" src=\"${path}\" height=\"24\">`;

			//We dont want to add a sparator on the last one.
			if (i != length - 1) {
				result += "<img class=\"track-separator\" src=\"systems/wildsea/icons/track/track-separator.png\" height= \"24\">"
			}
		}
		return result;
	});

	return preloadHandlebarsTemplates();
});
