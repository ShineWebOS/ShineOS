export class DomTTYDriver {
  constructor({ terminalElement, promptElement, inputElement }) {
    this.terminalElement = terminalElement;
    this.promptElement = promptElement;
    this.inputElement = inputElement;
  }

  print(text, cssClass = 'output') {
    const line = document.createElement('div');
    line.className = cssClass;
    line.textContent = text;

    const inputLine = this.terminalElement.querySelector('#input-line');
    this.terminalElement.insertBefore(line, inputLine);
    this.terminalElement.scrollTop = this.terminalElement.scrollHeight;
  }

  printHtml(html, cssClass = 'output') {
    const line = document.createElement('div');
    line.className = cssClass;
    line.innerHTML = html;

    const inputLine = this.terminalElement.querySelector('#input-line');
    this.terminalElement.insertBefore(line, inputLine);
    this.terminalElement.scrollTop = this.terminalElement.scrollHeight;
  }

  setPrompt(text) {
    this.promptElement.textContent = text;
  }

  clear() {
    const lines = [...this.terminalElement.querySelectorAll('.output')];
    lines.forEach((line) => line.remove());
  }

  focusInput() {
    this.inputElement.focus();
  }
}
