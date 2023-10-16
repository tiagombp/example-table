let data, filtered_data;

const variables = ['Country', 'Themes', 'Fund'];

const domains = {};

const selectors = {};

const filter_state = {};

fetch('data.json')
  .then(response => response.json())
  .then(output => init(output))
;

function init(output) {

    data = output;
    filtered_data = data;

    variables.forEach(variable => {

        const variable_domain = get_unique_categories(data, variable);

        selectors[variable] = document.querySelector(`#selector-${variable}`);

        domains[variable] = variable_domain;
        populate_selector(variable, variable_domain);

    })

    update_filter_state();

    const sels = Object.values(selectors);

    sels.forEach(sel => {
        sel.addEventListener('change', filter);
    })

    make_table(filtered_data);


}

function get_unique_categories(data, variable) {

    return data.map(d => d[variable]).filter( (d, i, array) => array.indexOf(d) == i);

}

function populate_selector(selector_name, contents) {

    const sel = selectors[selector_name];

    contents = ['All', ...contents];

    contents.forEach(value => {
        const new_option = document.createElement('option');
        new_option.value = value;
        new_option.innerText = value;
        sel.appendChild(new_option);
    })

}

function get_selector_values(selector_name) {

    const sel = selectors[selector_name];

    if (sel.multiple) {
        let vals = Array.from(sel.selectedOptions).map(d => d.value);
        if (vals.length == 0) vals = ['All'];
        return vals;
    } else {
        return [sel.value];
    }
}

function make_table(contents) {

    const table = document.querySelector('.project-table');

    table.innerHTML = '';

    if (contents.length > 0) {

        const theader = document.createElement('thead');

        const tr = document.createElement('tr');

        const colnames = Object.keys(contents[0]);

        colnames.forEach(colname => {

            const th = document.createElement('th');
            th.innerText = colname;

            tr.appendChild(th);

        })

        theader.appendChild(tr);
        table.appendChild(theader);

        const tbody = document.createElement('tbody');

        contents.forEach(line => {

            const tr = document.createElement('tr');

            cells = Object.values(line);

            cells.forEach(cell => {

                const td = document.createElement('td');
                td.innerText = cell;

                tr.appendChild(td);

            })

            tbody.appendChild(tr);
    
        })

        table.appendChild(tbody);

    }

}

function update_filter_state() {

    variables.forEach(variable => {
        filter_state[variable] = get_selector_values(variable);
    })

}

function filter() {

    update_filter_state();

    filtered_data = data
        .filter(d => filter_state['Country'][0] == 'All' ? true : filter_state['Country'].includes(d['Country']))
        .filter(d => filter_state['Themes'][0]  == 'All' ? true : filter_state['Themes'].includes(d['Themes']))
        .filter(d => filter_state['Fund'][0]    == 'All' ? true : filter_state['Fund'].includes(d['Fund']))
    ;

    make_table(filtered_data);

}