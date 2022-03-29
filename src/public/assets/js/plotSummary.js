
// Plot line plot indicating number of rows per module
function plotRowNumber(metadata, jsonRows){

    let rowNumbers = [];

    metadata.types.forEach(element => {
        rowNumbers.push(
            jsonRows[
                metadata.type2tablename[element]
            ].length
        );
    });

    $('#div-TP-summary').append(`
        <div class="pt-4">
            <div class="display-4 text-center mb-2" style="font-family:'Open Sans', verdana, arial, sans-serif; font-size:2em;">Table Complexity</div>
            <div id="rowNumberPlot" class="container"></div>
        </div>
    `)

    let data = [
        {
            x:metadata.types.map(elem => metadata.type2basename[elem]),
            y:rowNumbers,
            type:'scatter'
        }
    ]

    let layout = {
        /*title:{
            text: 'Table Complexity',
            font: {
                size: 24
            }
            
        },*/
        margin:{t:0},
        yaxis: {
            title: {
                text: 'Row Number',
                font: {
                    size: 16
                }
            }
        }
    }

    Plotly.newPlot('rowNumberPlot', data, layout, {staticPlot:true, responsive:true});

    return rowNumbers;
}


// Plot number of classified compounds by Tagger
function plotTagger(taggerRows){

    let shape = [taggerRows.length, taggerRows[0].length];

    // Identify tags present in the table
    let tags = [];
    let tag_idx = []
    
    for (let i=0; i<shape[1]; i++){
        let colName = $(`#${resJSON.metadata.type2tablename['Tagger']}`).children('thead').children('tr').children()[i].textContent;
        if (['Peptide', 'Plant', 'NaturalProduct', 'MDM', 'Drug', 'Food'].includes(colName)){
            tags.push(colName);
            tag_idx.push(i);
        }
    }

    // Count each tag type
    let tag_n = tags.map(e => 0);
    let tag_any = 0

    taggerRows.forEach(row => {
        let tagCells = row.filter((e, i) => tag_idx.includes(i));
        let tag_bool = tagCells.map(e => e!='-');
        tag_bool.some(e => e) && tag_any++;
        tag_bool.forEach((e, i) => {
            e && tag_n[i]++;
        });
    });

    // Plot Pie chart
    $('#div-TP-summary').append(`
        <div class="mt-2">
            <div class="display-4 text-center mb-2" style="font-family:'Open Sans', verdana, arial, sans-serif; font-size:2em;">Classified Compounds</div>
            <div id="TaggerPlot" class="container d-flex flex-wrap justify-content-around">
                <div id="TaggerPlot1" class="d-flex justify-content-center container" style="width:450px"></div>
                <div id="TaggerPlot2" class="d-flex justify-content-center container" style="width:650px"></div>
            </div>
        </div>
    `)

    let data = [
        {
            values: [tag_any, shape[0]-tag_any],
            labels: ['Tagged', 'Untagged'],
            type: 'pie',
            textinfo: "label+percent+value",
            textpostiion: "outside",
        
            opacity: 0.8
        
        }
    ]

    let layout = {
        /*title: {
            text: "Classified compounds",
            font: {
                size: 24
            }
        },*/
        height: 400,
        width: 400,
        //margin: {'t':0, 'b':0, 'l':0, 'r':0},
        showlegend: false,
        hovermode: false,
    }

    Plotly.newPlot('TaggerPlot1', data, layout, {staticPlot:true, responsive:true});
    
    // Plot separated tags
    /*
    data = tags.map( (e,i) => {
        return {
            values: [tag_n[i], shape[0]-tag_n[i]],
            labels: [e, 'Untagged'],
            type:'pie',
            textinfo: "label+percent+value",
            textpostiion: "outside",
            domain:{row: Math.floor(i/3), column:i%3}
        }
    } );

    layout = {
        height:400,
        width: 400,
        grid:  {rows: Math.floor(tags.length/3), columns: 3},
        showlegend: false,
        hovermode: false,
    };*/

    data = [{
        y: tag_n,
        x: tags,
        type: 'bar',
        marker: {
            opacity: 0.6
        }
    }]

    layout = {
        height:400,
        width: 600,
        
        showlegend: false,
        hovermode: false,
    };


    Plotly.newPlot('TaggerPlot2', data, layout, {staticPlot:true, responsive:true});
    
    
    
    return [tag_any, tag_n]
}

