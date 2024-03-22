//Importing our sheet.
import { WildseaItem } from "./item/item.mjs"
import { WildseaItemSheet } from "./sheets/item-sheet.mjs";

//Importing our configs
import { WILDSEA } from "./helpers/config.mjs";

Hooks.once('init', function () {
	game.wildsea = {
		WildseaItem,
	};


	CONFIG.WILDSEA = WILDSEA;
	CONFIG.Item.documentClass = WildseaItem;

	Items.unregisterSheet('core', ItemSheet);
	Items.registerSheet('wildsea', WildseaItemSheet, {
		makeDefault: true,
	});

	return loadTemplates([
		'systems/wildsea/templates/item/item-track-sheet.hbs',
		'systems/wildsea/templates/item/item-aspect-sheet.hbs',
	]);

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
});
