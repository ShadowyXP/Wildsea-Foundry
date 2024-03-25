export class WildseaActor extends Actor {

	prepareData() {
		super.prepareData();
	}

	prepareBaseData(){

	}

	prepareDerivedData(){
		const actorData = this;
		const systemData = actorData.system;
		const flags = actorData.flags.boilerplate || {};

		//Currently there are no calculated fields (this system is really simple so there may end up never being a need)
		//
		//But if i do want it, i add it here.
	}

	getRollData() {
		const data = { ...super.getRollData() };
		

		//Apparently this code takes the abilities and exposes them to roll formulas.
		//
		//With this, we should be able to calculate roll stuff here.
		//This will be important with the pool system, i want to make a rolling dialogue which lets you drop down the edge, skill, advantage, cut and resource.
		if (data.edges) {
			for (let [k, v] of Object.entries(data.edges)) {
				data[k] = foundry.utils.deepClone(v);
			}
		}

		if (data.skills) {
			for (let [k,v] of Object.entries(data.skills)) {
				data[k] = foundry.utils.deepClone(v);
			}
		}

		if (data.languages) {
			for (let [k,v] of Object.entries(data.languages)) {
				data[k] = foundry.utils.deepClone(v);
			}
		}

		return data;
	}

}
