import { WildseaRoll } from "/systems/wildsea/module/roll/wildsea-roll.mjs"

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

		context.rolldata = context.actor.getRollData();
		context.edges = CONFIG.WILDSEA.Edges;
		context.skills = CONFIG.WILDSEA.Skills;
		context.languages = CONFIG.WILDSEA.Languages;
		context.gearTypes = CONFIG.WILDSEA.GearTypes;
		context.aspectTypes = CONFIG.WILDSEA.AspectTypes;

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
				if (i.system.gear_type === 'salvage') {
					salvage.push(i);
				} else if (i.system.gear_type === 'specimen') {
					specimens.push(i);
				} else if (i.system.gear_type === 'whisper') {
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

		html.on('click', '.item-edit', (ev) => {
			const li = $(ev.currentTarget).parents('.item');
			const item = this.actor.items.get(li.data('itemId'));
			item.sheet.render(true);
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
			if (item.system.track_marks != item.system.track_length) {
				item.update({'system.track_marks': item.system.track_marks + 1});
			}
			console.log('clicked');
		});

		html.on('contextmenu', '.aspect-track-img', (ev) => {
			const li = $(ev.currentTarget).parents('.item');
			const item = this.actor.items.get(li.data('itemId'));
			if (item.system.track_marks != 0) {
				item.update({'system.track_marks': item.system.track_marks -1 });
			}
		});

		html.on('click', '.repeated-track-img', (ev) => {
			let css_class = $(ev.currentTarget.classList)[1].split('-');
			let property_clicked = css_class[1];
			let category = css_class[0] + 's';

			let data_item = this.actor.system[category];
			let property_value = `system.${category}.${property_clicked}.value`;

			let value = data_item[property_clicked].value;
			let calculatedValue;

			if(category === 'edges'){
				calculatedValue = (value + 1 > 1) ? 1 : value + 1
			} else {
				calculatedValue = (value + 1 > 3) ? 3 : value + 1
			}
			
			this.actor.update({[property_value]: calculatedValue})
		});

		html.on('contextmenu', '.repeated-track-img', (ev) => {
			let css_class = $(ev.currentTarget.classList)[1].split('-');
			let property_clicked = css_class[1];
			let category = css_class[0] + 's';

			let data_item = this.actor.system[category];
			let property_value = `system.${category}.${property_clicked}.value`;

			let value = data_item[property_clicked].value;
			let calculated = (value - 1 < 0) ? 0 : value - 1;

			this.actor.update({[property_value]: calculated})
		});

		html.on('click', '.roll-button', (ev) => {
			console.log(html);
			this._createRollDialog(ev);
		});

		html.on('click', '.item-quantity-update', (ev) => {
			let li = $(ev.currentTarget).parents('.item')
			const item = this.actor.items.get(li.data('itemId'));

		
			//Obviously we need to have the class gotten for whether its increase or decreaese, but i just want to check if it works.
			let updatedValue = $(ev.currentTarget)[0].classList[1];
			if (updatedValue === "item-quantity-increase") {
				item.update({"system.amount": item.system.amount + 1});
			} else {
				//Ternary operator, if it would go under 0, just dont.
				item.update({"system.amount": item.system.amount == 0 ? item.system.amount : item.system.amount - 1});
			}
		});
		
		html.on('click', '.aspect-name', (ev) => {
			let description = $(ev.currentTarget.parentNode.parentNode).find('.aspect-notes');
			console.log(description);
			//I need it to star slid up and then slide down, not sure how to manage that.
			if (description.is(":hidden")) {
				description.slideDown();
			} else {
				description.slideUp();
			}
		});

		//This allows the user to change the name of the mire without opening the item.
		html.on('change', '.mire-name', (ev) => {
			let li = $(ev.currentTarget).parents('.item');
			const item = this.actor.items.get(li.data('itemId'));
			const newVal = $(ev.currentTarget)[0].value;

			item.update({"name": newVal });
		});
	}

	async _createRollDialog(ev) {
		const context = {};

		context.edges = CONFIG.WILDSEA.Edges;
		context.skills = CONFIG.WILDSEA.Skills;
		context.languages = CONFIG.WILDSEA.Languages;
		context.advantage = {value: 0};
		context.selectors = {
			edge: "",
			skill: ""
		};

		const myContent = await renderTemplate("systems/wildsea/templates/partials/roll-dialog.hbs", context);

		const myDialog = new Dialog({
			title: "Roll",
			content: myContent,
			buttons: {
				button1: {
					label: "Roll!",
					callback: (html) => this._rollPool(html)
				}
			},
			default: "button1",
			render: (html) => {
				html.on('change', 'input.advantage-value', (event) => {
					let advantageValue = $(event.currentTarget)[0].value;
					if(advantageValue > 2){
						$(event.currentTarget)[0].value = 2;
					} else if(advantageValue < 0 || advantageValue === ""){
						$(event.currentTarget)[0].value = 0;
					}
				});
				html.on('change', 'input.cut-value', (event) => {
					let cutValue = $(event.currentTarget)[0].value;
					//We just control for negative values and null because that breaks things.
					//If they go over the number of dice in the roll, thats handled below.
					if(cutValue < 0 || cutValue === "") {
						$(event.currentTarget)[0].value = 0;
					}
				});
			}
		}).render(true);
	}

	async _rollPool(html) {
		let edge_selected = $(html.find('[name="edgeSelection"]'))[0].selectedOptions[0].value;
		let skill_category = $(html.find('[name="skillSelection"]'))[0].selectedOptions[0].parentNode.attributes[0].nodeValue;
		let skill_selected = $(html.find('[name="skillSelection"]'))[0].selectedOptions[0].value;
		let advantage = $(html.find('[name="advantage"]'))[0].value;
		let cut = $(html.find('[name="cut"]'))[0].value;

		const context = super.getData();

		const actorData = context.data;

		context.system = actorData.system;

		let edge_dice = context.system.edges[edge_selected].value;
		let skill_dice = context.system[skill_category][skill_selected].value;

		let total_dice = edge_dice + skill_dice + parseInt(advantage);
		
		let roll_formula = ""
		if(cut > 0){
			roll_formula = `${total_dice}d6dh${cut}kh` 
		} else {
			roll_formula = `${total_dice}d6kh`
		}

		//Special logic for cut being larger than the total dice.
		if(cut > total_dice || total_dice == 0) {
			roll_formula = '1d6';

			let wildseaRoll = new WildseaRoll(roll_formula);

			await wildseaRoll.toMessage(await wildseaRoll.render(await wildseaRoll.evaluate(parseInt(cut), true)));

			return;
		}

		let wildseaRoll = new WildseaRoll(roll_formula);

		await wildseaRoll.toMessage(await wildseaRoll.render(await wildseaRoll.evaluate(parseInt(cut), false)));

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

