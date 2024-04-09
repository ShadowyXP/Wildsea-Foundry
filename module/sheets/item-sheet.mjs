
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

		console.log(this.item);
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
		context.gearTypes = CONFIG.WILDSEA.GearTypes;
		context.aspectTypes = CONFIG.WILDSEA.AspectTypes;

		return context;
	}

	activateListeners(html) {
		super.activateListeners(html)

		if (!this.isEditable) return;

		// We can register any listeners for the item sheet here.
		if (this.item.type == "track") {
			this.registerTrackListeners(html);
		// Right now else means aspect.
		} else {
			this.registerAspectListeners(html);
		}
	}

	async registerAspectListeners(html){
		html.on('click', '.track-display', (ev) => {
			if (this.item.system.track_marks != this.item.system.track_length) {
				this.item.update({'system.track_marks': this.item.system.track_marks + 1});
			}
		});

		html.on('contextmenu', '.track-display', (ev) => {
			if (this.item.system.track_marks != 0) {
				this.item.update({'system.track_marks': this.item.system.track_marks - 1});
			}
		});
	}
}
