// Global variables
var workflowObject = {
    
    "modules": [],

    "featInfoFile": false,

    "ini": {},

    "iniMakerTagger": function () {
        this.ini.Tagger = "";

        this.ini.Tagger += "[Tagger]";
        this.ini.Tagger += "####";
        this.ini.Tagger += "food = ";
        this.ini.Tagger += document.querySelector("#food").checked;
        this.ini.Tagger += "####";
        this.ini.Tagger += "drug = ";
        this.ini.Tagger += document.querySelector("#drug").checked;
        this.ini.Tagger += "####"
        this.ini.Tagger += "microbial_compound = ";
        this.ini.Tagger += document.querySelector("#microbial").checked;
        this.ini.Tagger += "####"
        this.ini.Tagger += "plant = ";
        this.ini.Tagger += document.querySelector("#plant").checked;
        this.ini.Tagger += "####"
        this.ini.Tagger += "natural_product = ";
        this.ini.Tagger += document.querySelector("#naturalProduct").checked;
        this.ini.Tagger += "####"
        this.ini.Tagger += "halogenated = ";
        this.ini.Tagger += document.querySelector("#halogenated").checked;
        this.ini.Tagger += "####"
        this.ini.Tagger += "peptide = ";
        this.ini.Tagger += document.querySelector("#peptide").checked;
        this.ini.Tagger += "####"

        this.ini.Tagger += "halogenated_regex = ";
        this.ini.Tagger += document.querySelector("#halogenatedRegex").value == "" ? defaultValues.Tagger.halogenatedRegex : document.querySelector("#halogenatedRegex").value;
        this.ini.Tagger += "####";
        this.ini.Tagger += "peptide_regex = ";
        this.ini.Tagger += document.querySelector("#peptideRegex").value == "" ? defaultValues.Tagger.peptideRegex : document.querySelector("#peptideRegex").value;
        this.ini.Tagger += "####";
        this.ini.Tagger += "output_columns = "
        this.ini.Tagger += document.querySelector("#outputColumnsTagger").value;
        this.ini.Tagger += "####";
        this.ini.Tagger += "output_name = ";
        this.ini.Tagger += document.querySelector("#outputNameTagger").value != "" ? document.querySelector("#outputNameTagger").value : 
            `${this.modules.indexOf("Tagger")+1}_Tagged_${document.querySelector("#infile").files[0].name}`;
        this.ini.Tagger += "####";
        
        this.ini.Tagger = this.ini.Tagger.replace(/####/g, "\n");
    },

    "iniMakerREname": function () {
        this.ini.REname = "";

        this.ini.REname += "[REname]";
        this.ini.REname += "####";
        this.ini.REname += "remove_row = ";
        this.ini.REname += document.querySelector("#removeRowRegex").value == "" ? defaultValues.REname.removeRowRegex: document.querySelector("#removeRowRegex").value;
        this.ini.REname += "####";
        this.ini.REname += "separator = ";
        this.ini.REname += document.querySelector("#separator").value == "" ? defaultValues.REname.compoundSeparator : document.querySelector("#separator").value;
        this.ini.REname += "####";
        this.ini.REname += "aminoacid_separator = ";
        this.ini.REname += document.querySelector("#aaSeparator").value == "" ? defaultValues.REname.aminoAcidSeparator : document.querySelector("#aaSeparator").value;
        this.ini.REname += "####";
        this.ini.REname += "output_columns = ";
        this.ini.REname += document.querySelector("#outputColumnsREname").value;
        this.ini.REname += "####";
        this.ini.REname += "output_name = "
        this.ini.REname += document.querySelector("#outputNameREname").value != "" ? document.querySelector("#outputNameREname").value : 
            `${this.modules.indexOf("REname")+1}_REnamed_${document.querySelector("#infile").files[0].name}`;
        this.ini.REname += "####";
        this.ini.REname = this.ini.REname.replace(/####/g, "\n");
    },

    "iniMakerRowMerger": function () {
        this.ini.RowMerger = "";

        this.ini.RowMerger += "[RowMerger]";
        this.ini.RowMerger += "####";
        this.ini.RowMerger += "compared_columns = ";
        this.ini.RowMerger += document.querySelector("#comparedCol").value == "" ? defaultValues.RowMerger.comparedColumns : document.querySelector("#comparedCol").value;
        this.ini.RowMerger += "####";
        this.ini.RowMerger += "conserved_columns = ";
        this.ini.RowMerger += document.querySelector("#conservedCol").value == "" ? defaultValues.RowMerger.conservedColumns : document.querySelector("#conservedCol").value;
        this.ini.RowMerger += "####";
        this.ini.RowMerger += "output_columns = ";
        this.ini.RowMerger += document.querySelector("#outputColumnsRowMerger").value;
        this.ini.RowMerger += "####";
        this.ini.RowMerger += "output_name = "
        this.ini.RowMerger += document.querySelector("#outputNameRowMerger").value != "" ? document.querySelector("#outputNameRowMerger").value : 
            `${this.modules.indexOf("RowMerger")+1}_RowMerged_${document.querySelector("#infile").files[0].name}`;
        this.ini.RowMerger += "####";
        this.ini.RowMerger = this.ini.RowMerger.replace(/####/g, "\n");
    },

    "iniMakerTableMerger": function () {
        this.ini.TableMerger = "";

        this.ini.TableMerger += "[TableMerger]";
        this.ini.TableMerger += "####";
        this.ini.TableMerger += "n_digits = ";
        this.ini.TableMerger += document.querySelector("#decimalPlaces").value == "" ? defaultValues.TableMerger.decimalPlaces : document.querySelector("#decimalPlaces").value;
        this.ini.TableMerger += "####";
        this.ini.TableMerger += "output_columns = ";
        this.ini.TableMerger += document.querySelector("#outputColumnsTableMerger").value;
        this.ini.TableMerger += "####";
        this.ini.TableMerger += "output_name = "
        this.ini.TableMerger += document.querySelector("#outputNameTableMerger").value != "" ? document.querySelector("#outputNameTableMerger").value : 
            `${this.modules.indexOf("TableMerger")+1}_TableMerged_${document.querySelector("#infile").files[0].name}`;
        this.ini.TableMerger += "####";
        this.ini.TableMerger = this.ini.TableMerger.replace(/####/g, "\n");
    },

};

var viewExecute = -2;   // Variable to indicate which view is being showed in execute.html
                        // -2: Select modules
                        // -1: Input file
                        // 0-3: Selected modules

// Create form used to send job to server
var workflowForm = document.createElement("form");
workflowForm.setAttribute('style', 'display:none;')
workflowForm.setAttribute('id', 'workflowForm');
workflowForm.setAttribute('method', 'post');
workflowForm.setAttribute('action', '/execute');
workflowForm.setAttribute('enctype', "multipart/form-data");
document.querySelector('body').appendChild(workflowForm);

var iniInput = document.createElement("input");
iniInput.setAttribute("form", "workflowForm");
iniInput.setAttribute("id", "iniInput");
iniInput.setAttribute("name", "iniInput");
iniInput.setAttribute("type", "text");
workflowForm.appendChild(iniInput);