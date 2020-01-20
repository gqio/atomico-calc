import { customElement, useState } from "atomico";
import html from "atomico/html";

let keys = [
  ["C", "CE", "/", "+"],
  ["7", "8", "9", "-"],
  ["4", "5", "6", "x"],
  ["1", "2", "3", "="],
  ["+-", "0", "."]
];

function AtomicoCalc() {
  let [state, setState] = useState([]);
  return html`
		<host shadowDom>
			<div class="display">
				<div class="history">
					${state.map(
            value =>
              html`
								<span>${value}</span>
							`
          )}
				</div>
				<div class="title">
					${[...state].reverse().find(value => typeof value == "number") || 0}
				</div>
			</div>
			<div class="keys">
				${keys.map(row =>
          row.map(
            value => html`
							<button
								onclick=${() => setState(calc(state, value))}
								data-key=${value}
							>
								${value}
							</button>
						`
          )
        )}
			</div>
			<style>
				:host {
					color: white;
					font-family: monospace;
				}
				.keys {
					display: grid;
					grid-gap: 5px;
					grid-template-rows: repeat(5, 50px);
					grid-template-columns: repeat(3, 1fr) 60px;
				}
				.display {
					width: 100%;
					display: flex;
					flex-flow: column;
				}

				.display .history {
					font-size: 12px;
				}
				.display .history span {
					padding: 0px 0.1rem;
				}
				.display .title {
					height: 50px;
					font-size: 40px;
				}
				.display .history {
					height: 20px;
				}
				.display .history,
				.display .title {
					display: flex;
					align-items: center;
					justify-content: flex-end;
				}

				[data-key] {
					background: transparent;
					border: none;
					color: unset;
					font-family: unset;
					background: rgba(255, 255, 255, 0.1);
					border-radius: 2px;
				}
				[data-key="="] {
					grid-row: 4/6;
					grid-column: 4;
					background: #6200ff;
				}
			</style>
		</host>
	`;
}

const operators = {
  "+": (a = 0, b = 0) => a + b,
  "-": (a = 0, b = 0) => a - b,
  x: (a = 0, b = 0) => a * b,
  "/": (a = 0, b = 0) => a / b
};

const isStrNumber = value => /([\d\.]+)/.test(value);

function calc(state, value) {
  let last = state.pop() || "";
  switch (value) {
    case "=":
      state = [...state, last];
      let total = state.reduce((total, value, index) => {
        if (isStrNumber(value)) {
          let prev = state[index - 1];
          value = Number(value);
          return operators[prev] ? operators[prev](total, value) : value;
        }
        return total;
      }, 0);
      return [total];
    case "C":
      return [];
    case "CE":
      return state;
    case "+-":
      return [...state, last * -1];
    default:
      return [
        ...state,
        ...(isStrNumber(last) && isStrNumber(value)
          ? [last + value]
          : [last, value])
      ];
  }
}

export default customElement(AtomicoCalc);
