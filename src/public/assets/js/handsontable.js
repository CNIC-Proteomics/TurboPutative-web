// Table values
const HEADER = ['Lipid', 'Adduct'];
const DEFAULT_NEGATIVE_DATA = Object.freeze([
    ['PC', 'M+HCOOH-H'],
    ['PC', 'M+Cl'],
    ['PE', 'M-H'],
    ['PE', 'M-H+HCOONa'],
    ['PS', 'M-H'],
    ['PG', 'M-H'],
    ['PG', 'M-H+HCOONa'],
    ['PI', 'M-H'],
    ['PI', 'M-H+HCOONa'],
    ['PA', 'M-H'],
    ['PA', 'M-H+HCOONa'],
    ['LPC', 'M+HCOOH-H'],
    ['LPC', 'M+Cl'],
    ['LPE', 'M-H'],
    ['LPE', 'M-H+HCOONa'],
    ['LPS', 'M-H'],
    ['LPS', 'M-2H-Na'],
    ['LPG', 'M-H'],
    ['LPG', 'M-H+HCOONa'],
    ['LPI', 'M-H'],
    ['LPI', 'M-H+HCOONa'],
    ['SM', 'M+HCOOH-H'],
    ['SM', 'M+Cl'],
    ['Cer', 'M+HCOOH-H'],
    ['Cer', 'M+Cl'],
    ['Cer', 'M-H'],
    ['FAHFA', 'M-H'],
    ['FAHFA', 'M+HCOOH-H'],
    ['FA', 'M-H'],
    ['FA', 'M-H-H2O'],
    ['ST', 'M-H'],
    ['ST', 'M-H-H2O'],
    ['ST', 'M+HCOOH-H']
]);

const DEFAULT_POSITIVE_DATA_FA = [
    ['PC', 'M+H'],
    ['PC', 'M+Na'],
    ['PC', 'M+K'],
    ['PE', 'M+H'],
    ['PE', 'M+Na'],
    ['PG', 'M+NH4'],
    ['PI', 'M+NH4'],
    ['PA', 'M+NH4'],
    ['LPC', 'M+H'],
    ['LPC', 'M+Na'],
    ['LPC', 'M+H-H2O'],
    ['LPC', 'M+K'],
    ['LPE', 'M+H'],
    ['LPE', 'M+Na'],
    ['LPE', 'M+H-H2O'],
    ['SM', 'M+H'],
    ['SM', 'M+Na'],
    ['SM', 'M+K'],
    ['SM', 'M+H-H2O'],
    ['Cer', 'M+H'],
    ['Cer', 'M+H-H2O'],
    ['Cer', 'M+Na'],
    ['Cer', 'M+K'],
    ['FAHFA', 'M+NH4'],
    ['FAHFA', 'M+H'],
    ['FAHFA', 'M+H-H2O'],
    ['Cholesterol', 'M+H-H2O'],
    ['Cholesterol', 'M+NH4'],
    ['CE', 'M+Na'],
    ['CE', 'M+NH4'],
    ['MG', 'M+NH4'],
    ['MG', 'M+Na'],
    ['MG', 'M+H'],
    ['DG', 'M+NH4'],
    ['DG', 'M+H-H2O'],
    ['DG', 'M+Na'],
    ['DG', 'M+H'],
    ['TG', 'M+NH4'],
    ['TG', 'M+Na'],
    ['TG', 'M+H'],
    ['CAR', 'M+H'],
    ['CAR', 'M+Na'],
    ['FA', 'M+H'],
    ['FA', 'M+H-H2O'],
    ['ST', 'M+H'],
    ['ST', 'M+H-H2O']
];

/*
const DEFAULT_POSITIVE_DATA_FA = [
    ['PC', 'M+H'],
    ['PC', 'M+Na'],
    ['PC', 'M+K'],
    ['PE', 'M+H'],
    ['PE', 'M+Na'],
    ['LPC', 'M+H'],
    ['LPC', 'M+Na'],
    ['LPC', 'M+H-H2O'],
    ['LPE', 'M+H'],
    ['LPE', 'M+Na'],
    ['LPE', 'M+H-H2O'],
    ['SM', 'M+H'],
    ['SM', 'M+Na'],
    ['Cer', 'M+H'],
    ['Cer', 'M+H-H2O'],
    ['Cer', 'M+Na'],
    ['FAHFA', 'M+H'],
    ['FAHFA', 'M+H-H2O'],
    ['Cholesterol', 'M+H-H2O'],
    ['CE', 'M+Na'],
    ['MG', 'M+Na'],
    ['MG', 'M+H'],
    ['DG', 'M+H-H2O'],
    ['DG', 'M+Na'],
    ['DG', 'M+H'],
    ['TG', 'M+Na'],
    ['TG', 'M+H'],
    ['CAR', 'M+H'],
    ['CAR', 'M+Na'],
    ['FA', 'M+H'],
    ['FA', 'M+H-H2O'],
    ['ST', 'M+H'],
    ['ST', 'M+H-H2O']
];


const DEFAULT_POSITIVE_DATA_NH4 = [
    ['PC', 'M+H'],
    ['PC', 'M+Na'],
    ['PC', 'M+K'],
    ['PE', 'M+H'],
    ['PE', 'M+Na'],
    ['PG', 'M+NH4'],
    ['PI', 'M+NH4'],
    ['PA', 'M+NH4'],
    ['LPC', 'M+H'],
    ['LPC', 'M+Na'],
    ['LPC', 'M+H-H2O'],
    ['LPC', 'M+K'],
    ['LPE', 'M+H'],
    ['LPE', 'M+H-H2O'],
    ['LPE', 'M+Na'],
    ['SM', 'M+H'],
    ['SM', 'M+Na'],
    ['SM', 'M+K'],
    ['SM', 'M+H-H2O'],
    ['Cer', 'M+H-H2O'],
    ['Cer', 'M+H'],
    ['Cer', 'M+Na'],
    ['Cer', 'M+K'],
    ['Cholesterol', 'M+H-H2O'],
    ['Cholesterol', 'M+NH4'],
    ['CE', 'M+NH4'],
    ['MG', 'M+NH4'],
    ['MG', 'M+H'],
    ['MG', 'M+Na'],
    ['DG', 'M+NH4'],
    ['DG', 'M+H-H2O'],
    ['DG', 'M+Na'],
    ['DG', 'M+H'],    
    ['TG', 'M+NH4'],
    ['TG', 'M+Na'],
    ['CAR', 'M+H'],
    ['CAR', 'M+Na'],    
    ['FAHFA', 'M+NH4'],
    ['FAHFA', 'M+H'],
    ['FAHFA', 'M+H-H2O'],
    ['FA', 'M+H'],
    ['FA', 'M+H-H2O'],
    ['ST', 'M+H'],
    ['ST', 'M+H-H2O']
];
*/

// Create the Lipid Table
function create_lipid_table(divid, data) {
    // clonde the data because JS works by references
    let clonedData = data.map(e => {return {...e}});
    // Create table
    $(`${divid}`).handsontable({
        data: clonedData,
        rowHeaders: true,
        colHeaders: HEADER,
        height: '350px',
        width: '240px',
        minSpareRows: 2,
        columnSorting: true,
        contextMenu: true,
        manualColumnResize: false,
        autoColumnSize: true,
        licenseKey: 'non-commercial-and-evaluation'
    });

    $(`${divid}`).handsontable('scrollViewportTo', 2)
};

// Update table
function update_lipid_table(divid, data) {
    // clonde the data because JS works by references
    let clonedData = data.map(e => {return {...e}});
    // Update table
    $(`${divid}`).handsontable('updateData', clonedData);
};

// Add dafault values for Positive table FA
function add_default_values_positive_FA() {
    let divid = '#lipid-table .hot';
    update_lipid_table(divid, DEFAULT_POSITIVE_DATA_FA);
};

// Add dafault values for Positive table NH4
function add_default_values_positive_NH4() {
    let divid = '#lipid-table .hot';
    update_lipid_table(divid, DEFAULT_POSITIVE_DATA_NH4);
};

// Add dafault values for Negative table
function add_default_values_negative() {
    let divid = '#lipid-table .hot';
    update_lipid_table(divid, DEFAULT_NEGATIVE_DATA);
};

// Extract the Data from the Table and convert to JSON
function convert_data_from_table(divid) {
    // declare variable
    let out = {};
    // This way, you can access Handsontable api methods by passing their names as an argument, e.g.:
    // let data = $('#lipid-table .hot').handsontable('getData');
    let data = $(`${divid}`).handsontable('getData');
    // Convert the list of list into hash of list
    for (let i = 0; i < data.length; i++) {
        let row = data[i];
        if (row.length == 2) {
            let lipid = row[0];
            let adduct = row[1];
            if (lipid != '' && lipid != null && adduct != '' && adduct != null) {
                if ( !(lipid in out ) ) { out[lipid] = [] }
                out[lipid].push(adduct);
            }
        }
    }
    console.log( out );
    return out;
};


// Init with Positive values
let divid = '#lipid-table .hot';
// let divid = '#lipid-table-table';
create_lipid_table(divid, DEFAULT_NEGATIVE_DATA);

function initialize_visualization() {
    setTimeout(() => {
        add_default_values_negative()
    }, 100);
}

$("#tab-TableMerger").one("click", initialize_visualization)