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

		/*
				<div class=column grid_4><h1 class="charname"><input name="name" type="text" value="{{actor.name}}" placeholder="Name"/></h1></div>
		for (let [k, v] of Object.entries(context.system.edges)) {
			v.label = game.il8n.localize(CONFIG.WILDSEA.edges[k]) ?? k;
		}

		for (let [k, v] of Object.entries(context.system.skills)) {
			v.label = game.il8n.localize(CONFIG.WILDSEA.skills[k]) ?? k;
		}

		for (let [k,v] of Object.entries(context.system.languages)) {
			v.label = game.il8n.localize(CONFIG.WILDSEA.languages[k]) ?? k;
		}*/

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

		context.salvage = salvage;
		context.specimens = specimens;
		context.whispers = whispers;
		context.charts = charts;
		context.mires = mires;
		context.aspects = aspects;

		console.log(salvage);
		console.log(specimens);
		console.log(whispers);
		console.log(charts);
		console.log(mires);
		console.log(aspects);

	}

	//Surely this will get filled up soon, right now its chillin though.
	activateListeners(html) {
		super.activateListeners(html)

		if (!this.isEditable) return;

		html.on('click', '.item-create', this._onItemCreate.bind(this));

		// Delete Inventory Item
		html.on('click', '.item-delete', (ev) => {
		  const li = $(ev.currentTarget).parents('.item');
		  const item = this.actor.items.get(li.data('itemId'));
		  item.delete();
		  li.slideUp(200, () => this.render(false));
		});

		html.on('click', '.mire-track-img', (ev) => {
			const li = $(ev.currentTarget).parents('.track-display').parents('.item');
			const item = this.actor.items.get(li.data('itemId'));
			if (item.system.marks != 2) {
				item.update({'system.marks': item.system.marks + 1});
			}
		});

		html.on('contextmenu', '.mire-track-img', (ev) => {
			const li = $(ev.currentTarget).parents('.item');
			const item = this.actor.items.get(li.data('itemId'));
			if (item.system.marks != 0) {
				item.update({'system.marks': item.system.marks -1 });
			}
		});

		html.on('click', '.aspect-track-img', (ev) => {
			const li = $(ev.currentTarget).parents('.track-display').parents('.item');
			const item = this.actor.items.get(li.data('itemId'));
			if (item.system.marks != 2) {
				item.update({'system.track_marks': item.system.track_marks + 1});
			}
			console.log('clicked');
		});

		html.on('contextmenu', '.aspect-track-img', (ev) => {
			const li = $(ev.currentTarget).parents('.item');
			const item = this.actor.items.get(li.data('itemId'));
			if (item.system.marks != 0) {
				item.update({'system.track_marks': item.system.track_marks -1 });
			}
		});
	}

	async _onItemCreate(event){
		event.preventDefault();
		const header = event.currentTarget;

		const type = header.dataset.type;
		const data = duplicate(header.dataset);
		const name = `New ${type.capitalize()}`;

		const itemData = {
			name: name,
			type: type,
			system: data,
		}

		//Deleting the type because its provided in the actual item.
		delete itemData.system['type'];

		return await Item.create(itemData, { parent: this.actor });
	}
}
