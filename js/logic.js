
class CalculateFibonacci {
	constructor(button, input, span, result) {
	  this.button = button;
	  this.input = input;
	  this.span = span;
	  this.result = result;
	  this.value
	  this.button.addEventListener("click", this.launchSearch);
	}
  
	launchSearch = () => {
	  let value = this.calculateFibonacci(this.input.value);
	  this.span.innerText = this.input.value;
	  this.result.innerText = value;
	};
  
	calculateFibonacci = (num, memo) => {
	  memo = memo || {};
	  if (memo[num]) {
		return memo[num];
	  }
	  if (num <= 1) {
		return 1;
	  }
	  return (memo[num] =
		this.calculateFibonacci(num - 1, memo) + this.calculateFibonacci(num - 2, memo));
	};
  }
  
  window.onload = (() => {
  const button = document.getElementById("calculate-button");
  const result= document.getElementById("fibonacci-results");
  const input = document.getElementById("calculate-input");
  const fibonacciInput = document.getElementById("fibonacci-input");
  const fibonacci = new CalculateFibonacci(button, input, fibonacciInput, result);

  console.log(button);
})();
