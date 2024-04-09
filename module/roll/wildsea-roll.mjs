export class WildseaRoll extends Roll {
	
	async evaluate(cut, cutHigherDice) {
		await super.evaluate();

		let dice_results = this.terms[0].results;

		dice_results.sort((a, b) => b.result - a.result);

		console.log(dice_results);

		let dupe_array = [];

		let twist = false;
		
		let i = cut == 0 ? 0 : cut;

		for (i; i < dice_results.length; i++) {
			console.log(dice_results[i].result);
			let isInArray = dupe_array.indexOf(dice_results[i].result);
			if(isInArray != -1){
				twist = true;
				break;
			}

			dupe_array.push(dice_results[i].result);
		}

		let returnData = {};
		returnData.twist = twist;
		returnData.resultCat = "";
		
		//TODO Localize this!
		if(this.total === 6) {
			returnData.resultCat = "Triumph";
		} else if (this.total > 3) {
			returnData.resultCat = "Conflict";
		} else {
			returnData.resultCat = "Disaster";
		}

		//When cut is greater than the number of dice or there is nothing in the pool, we just need to treat the result as one worse, no triumphs.
		//Localize this too!
		if(cutHigherDice) {
			console.log("Cut really high!");
			if (returnData.resultCat === "Triumph") {
				returnData.resultCat = "Conflict";
			}
		}

		return returnData;
	}

	//Overrides render with a method that includes our template
	async render(renderData) {
		console.log(renderData);
		const specialRollData = await renderTemplate("systems/wildsea/templates/roll/dice-pool-roll.hbs", renderData);

		const renderedRoll = await super.render();

		return renderedRoll + specialRollData;
	}

	//A special to-message which allows us to pass custom html.
	async toMessage(messageContent) {

		let messageData= {
			speaker: ChatMessage.getSpeaker(),
			content: messageContent
		}

		return await super.toMessage(messageData);
	}
}
