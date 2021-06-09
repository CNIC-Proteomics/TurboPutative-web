// When user uploads a file, get its name
document.querySelector("#infile").addEventListener("change", () => {
    defaultValues.Ubiquitous.filename = document.querySelector('#infile').files[0].name;

    let baseName = defaultValues.Ubiquitous.filename.split('.');
    if (baseName.length != 0 ) baseName.pop();
    baseName = baseName.join('.') + '.tsv';

    // set output default name in tooltips
    document.querySelector('#TaggerONTTT').innerHTML += `${workflowObject.modules.indexOf("Tagger")+1}_Tagged_${baseName}`;
    document.querySelector('#REnameONTTT').innerHTML += `${workflowObject.modules.indexOf("REname")+1}_REnamed_${baseName}`;
    document.querySelector('#RowMergerONTTT').innerHTML += `${workflowObject.modules.indexOf("RowMerger")+1}_RowMerged_${baseName}`;
    document.querySelector('#TableMergerONTTT').innerHTML += `${workflowObject.modules.indexOf("TableMerger")+1}_TableMerged_${baseName}`;
});