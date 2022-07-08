
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

    $('#plotContainer').append(`
        <div class="" style="width:1075px">
            <div class="display-4 text-center mb-4" style="font-family:'Open Sans', verdana, arial, sans-serif; font-size:2em;">Table Complexity</div>
            <div id="rowNumberPlot" class="container"></div>
        </div>
    `);


    let data = [
        {
            //x:metadata.types.map(elem => metadata.type2basename[elem]),
            x:metadata.types,
            y:rowNumbers,
            type:'scatter',
            marker : {
                color: `rgba(0,0,255,0.6)`
            }
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
        },
        height:350,
        //width:1050
        autosize:true
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
        if (['Peptide', 'Plant', 'NaturalProduct', 'MDM', 'Drug', 'Food', 'Halogenated'].includes(colName)){
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

    $('#plotContainer').append(`
        <div class="" style="width:610px">
            <div class="display-4 text-center mb-4" style="font-family:'Open Sans', verdana, arial, sans-serif; font-size:2em;">Tagged Compounds</div>
            <div id="TaggerPlot2" class=""></div>
        </div>
    `)


    // Sort tags ascending
    pair = tags.map((e, i) => [tag_n[i], e]);
    pair.sort((a,b) => a[0]-b[0]);
    tag_n = pair.map(e => e[0]);
    tags = pair.map(e => e[1]);

    // Color of tags
    max = Math.max(...tag_n)
    color = tag_n.map(e => `rgba(0,0,255,${Math.max(0.8*e/max, 0.20)})`);

    data = [{
        y: tag_n,
        x: tags,
        type: 'bar',
        marker: {
            color:color
        },
        width:0.6
    }]

    layout = {
        height:350,
        //width: 600,
        autosize:true,
        
        showlegend: false,
        hovermode: false,
        margin:{t:0}
    };


    Plotly.newPlot('TaggerPlot2', data, layout, {staticPlot:true, responsive:true});
    
    
    
    return [tag_any, tag_n]
}

