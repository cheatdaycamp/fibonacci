window.onload = (() => {
    
    const button = document.getElementById('calculate-button');
	console.log(button);
})();

class CalculateFibonacci {
	constructor(element) {
		this.element = element;
		this.element.addEventListener('click', this.launchSearch);
	}

	launchSearch = () => {
		console.log('this');
	};
}
