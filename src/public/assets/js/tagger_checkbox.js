// When pressing "Select all", check all...
let allTagsElem = document.querySelector("#allTags")

selectTags = function () {

    if (allTagsElem.checked) {

        document.querySelector("#food").checked = true;
        document.querySelector("#drug").checked = true;
        document.querySelector("#peptide").checked = true;
        document.querySelector("#halogenated").checked = true;
        document.querySelector("#microbial_compound").checked = true;
        document.querySelector("#plant").checked = true;
        document.querySelector("#natural_product").checked = true;

    } else {

        document.querySelector("#food").checked = false;
        document.querySelector("#drug").checked = false;
        document.querySelector("#peptide").checked = false;
        document.querySelector("#halogenated").checked = false;
        document.querySelector("#microbial_compound").checked = false;
        document.querySelector("#plant").checked = false;
        document.querySelector("#natural_product").checked = false;

    }
}

allTagsElem.addEventListener("change", selectTags, false);


// If select all is selected and one tag is deselected, deselect all
deselectAll = function () {
    if (!this.checked && allTagsElem.checked) {
        allTagsElem.checked = false;
    } 
}

document.querySelector("#food").addEventListener("change", deselectAll, false);
document.querySelector("#drug").addEventListener("change", deselectAll, false);
document.querySelector("#peptide").addEventListener("change", deselectAll, false);
document.querySelector("#halogenated").addEventListener("change", deselectAll, false);
document.querySelector("#microbial_compound").addEventListener("change", deselectAll, false);
document.querySelector("#plant").addEventListener("change", deselectAll, false);
document.querySelector("#natural_product").addEventListener("change", deselectAll, false);