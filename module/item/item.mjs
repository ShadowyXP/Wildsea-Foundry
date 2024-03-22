
export class WildseaItem extends Item {
	/* 
	 * This is where any dynamic data for an item goes.
	 */
	prepareData() {}

	/*
	 * Passes this item into any roll formulas.
	 */
	// I do need to be able to get roll data though, because tracks need to pass their value on for rolls.
	getRollData() {
		const rollData = { ...super.getRollData() };

		if (!this.actor) return rollData;

		rollData.actor = this.actor.getRollData();

		return rollData
	}

	/*
	 * What you do with any clickable rolls.
	 */
	// I dont think i need to override roll, im not sure there will be any items that can be rolled.
	// The rules are really simple, so i reckon this may stay that way.
	async roll() {}
}
