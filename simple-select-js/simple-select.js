export default class simpleSelect {
    constructor(element) {
        this.element = element;
        this.options = formatOptions(element.querySelectorAll('option'));

        this.simpleSelectJsElement = document.createElement('div');
        this.simpleSelectJsLabel = document.createElement('span');
        this.simpleSelectJsOptions = document.createElement('ul');

        setupCustomElement(this);

        element.style.display = 'none';
        element.after(this.simpleSelectJsElement);
    };

    get selectedOption() {
        return this.options.find(option => option.selected);
    };

    get selectedOptionIndex() {
        return this.options.indexOf(this.selectedOption);
    };
    
    selectValue(value) {
        const newSelectedOption = this.options.find(option => {
            return option.value === value;
        });
        const prevSelectedOption = this.selectedOption;
        prevSelectedOption.selected = false;
        prevSelectedOption.element.selected = false;

        newSelectedOption.selected = true;
        newSelectedOption.element.selected = true;

        this.simpleSelectJsLabel.innerText = newSelectedOption.label;

        this.simpleSelectJsOptions.querySelector(`[data-value='${prevSelectedOption.value}']`).classList.remove('selected');
        const simpleSelectJsNewOption = this.simpleSelectJsOptions.querySelector(`[data-value='${newSelectedOption.value}']`);
        simpleSelectJsNewOption.classList.add('selected');
        simpleSelectJsNewOption.scrollIntoView({ block: 'nearest' });
    };
};

function setupCustomElement(select) {
    select.simpleSelectJsElement.classList.add('simple-select-js-container');
    select.simpleSelectJsElement.tabIndex = 0;
    select.simpleSelectJsLabel.classList.add('simple-select-js-label');
    select.simpleSelectJsOptions.classList.add('simple-select-js-options');

    select.simpleSelectJsLabel.innerText = select.selectedOption.label;

    select.options.forEach(option => {
        const simpleSelectJsOption = document.createElement('li');
        simpleSelectJsOption.classList.add('simple-select-js-option');
        simpleSelectJsOption.classList.toggle('selected', option.selected);
        simpleSelectJsOption.innerText = option.label;
        simpleSelectJsOption.dataset.value = option.value;
        simpleSelectJsOption.addEventListener('click', () => {
            select.selectValue(option.value);
            select.simpleSelectJsOptions.classList.remove('active');
        });
        select.simpleSelectJsOptions.append(simpleSelectJsOption);
    });

    select.simpleSelectJsElement.append(select.simpleSelectJsLabel);
    select.simpleSelectJsElement.append(select.simpleSelectJsOptions);

    select.simpleSelectJsLabel.addEventListener('click', () => {
        select.simpleSelectJsOptions.classList.toggle('active');
    });

    select.simpleSelectJsElement.addEventListener('blur', () => {
        select.simpleSelectJsOptions.classList.remove('active');
    });

    let debounceTimeout;
    let searchPhrase = "";

    select.simpleSelectJsElement.addEventListener('keydown', e => {
        switch (e.code) {
            case 'Space':
                select.simpleSelectJsOptions.classList.toggle('active');
                break;
            case 'ArrowUp': {
                const prevOption = select.options[select.selectedOptionIndex - 1];
                if (prevOption) {
                    select.selectValue(prevOption.value);
                }
                break;
            }
            case 'ArrowDown': {
                const nextOption = select.options[select.selectedOptionIndex + 1];
                if(nextOption) {
                    select.selectValue(nextOption.value);
                }
                break;
            }
            case 'Enter':
                case 'Escape':
                    select.simpleSelectJsOptions.classList.remove('active');
                    break;
            default: {
                clearTimeout(debounceTimeout);
                searchPhrase += e.key;
                debounceTimeout = setTimeout(() => {
                    searchPhrase = "";
                }, 500);

                const searchResult = select.options.find(option => {
                    return option.label.toLowerCase().startsWith(searchPhrase);
                });
                if (searchResult) {
                    select.selectValue(searchResult.value);
                };
            };
        };
    });
};

function formatOptions(optionElements) {
    return [...optionElements].map(optionElement => {
        return {
            value: optionElement.value,
            label: optionElement.label,
            selected: optionElement.selected,
            element: optionElement
        };
    });
};