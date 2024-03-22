
export class WildseaItemSheet extends ItemSheet {

	// I dont know what this does yet :(
	static get defaultOptions() {
		return foundry.utils.mergeObject(super.defaultOptions, {
			classes: ['wildsea', 'sheet', 'item'],
			width: 520,
			height: 480,
			tabs: [
				{
					navSelector: '.sheet-tabs',
					contentSelector: '.sheet-body',
					initial: 'description',
				},
			],
		});
	}

	// This just returns the handlebars sheet based on the item type.
	get template() {
		const path = 'systems/wildsea/templates/item'

		return  `${path}/item-${this.item.type}-sheet.hbs`;
	}

	/*
	 * Returns an edit-safe copy of the item.
	 */
	getData() {
		const context = super.getData();

		const itemData = context.data;

		context.rollData = this.item.getRollData();


		context.system = itemData.system;
		context.flags = itemData.flags;

		return context;
	}

	activateListeners(html) {
		super.activateListeners(html)

		if (!this.isEditable) return;

		// We can register any listeners for the item sheet here.
		// html.on('click', 'css class', (ev) =>
		// 	 runFunction(ev, anythingelse)
		// );
	}

}
