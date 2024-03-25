export class WildseaActorSheet extends ActorSheet {

	static get defaultOptions() {
		return foundry.utils.mergeObject(super.defaultOptions, {
			classes: ['wildsea', 'sheet', 'actor'],
			width: 600,
			height: 600,
			tabs: [
				{
					navSelector: '.sheet-tabs',
					contentSelector: '.sheet-body',
					initial: 'narrative',
				}
			],
		});
	}

	get template () {
		return `systems/wildsea/templates/actor/actor-${this.actor.type}-sheet.hbs`;
	}

	getData(){
		const context = super.getData();

		const actorData = context.data;

		context.system = actorData.system;
		context.flags = actorData.flags;

		this._prepareItems(context);
		
		for (let [k, v] of Object.entries(context.system.edges)) {
			v.label = game.il8n.localize(CONFIG.WILDSEA.edges[k]) ?? k;
		}

		for (let [k, v] of Object.entries(context.system.skills)) {
			v.label = game.il8n.localize(CONFIG.WILDSEA.skills[k]) ?? k;
		}

		for (let [k,v] of Object.entries(context.system.languages)) {
			v.label = game.il8n.localize(CONFIG.WILDSEA.languages[k]) ?? k;
		}

		context.rolldata = context.actor.getRollData();

		return context;
	}

	_prepareItems(context) {
		const salvage = [];
		const specimens = [];
		const whispers = [];
		const charts = [];
		const mires = [];
		const aspects = [];

		for (let i of context.items) {
			i.img = i.img || Item.DEFAULT_ICON;

			if (i.type === 'aspect') {
				aspects.push(i);
			}

			else if (i.type === 'mire') {
				mires.push(i);
			}

			else if (i.type === 'gear') {
				if (i.gear_type === 'salvage') {
					salvage.push(i);
				} else if (i.gear_type === 'specimen') {
					specimens.push(i);
				} else if (i.gear_type === 'whisper') {
					whispers.push(i);
				} else {
					charts.push(i);
				}
			}
		}
	}

	//Surely this will get filled up soon, right now its chillin though.
	activateListeners(html) {

	}
}
