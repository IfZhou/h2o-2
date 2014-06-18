/** customQuery javascript

Holds functions for passing between query/results page

*/

//submit the query and redirect to the results page
function query_submit(test,question,num_builds,phase) {
  var data = new Array();
  data[0] = test;
//  data[1] = machine;
  data[1] = question;
  data[2] = num_builds;
  data[3] = phase;
  document.query.query.value = data;
  document.query.submit();

} 

//redirect back to the query page
function new_query() {
  window.location = '../index.html'
}

//helper function to get the param payload from the url after redirect
function GetUrlValue(){
    var loc = document.URL;
    var params = loc.split('?')[1];
    return params;
}

//Perform the query by accessing the appropriate php script and then
//processing the data returned with d3
function doQuery(phpQueryPage) {
    d3.json(phpQueryPage, function(json) {
    //d3.json(phpQueryPage+'?'+GetUrlValue(), function(json) {
        try {
          makeGraph(json, "#graph_area")
        } catch(err) {
          var graph = document.getElementById("graph_area")
          graph.style.height = "20px"
          console.log("No graph...")
        }
        makeTable(json, '#results_table')
    });
}

function showPerfGraphs(test_run_id, total_hosts) {
    if (total_hosts === 1) {
        // Just looks at node 192.168.1.164

        $.ajax({
            url: '../prototype/php/post2.php',
            type: 'GET',
            dataType: 'JSON',
            data: 'SELECT * FROM stats WHERE test_run_id = ' + test_run_id + ' AND node_ip = \'192.168.1.164\'',
            success: function(data) {
                nodePerfGraph(data, '#cpu_svg1', '#rss_svg1');
            }
        });
    } else {
        for (var i = 0; i < total_hosts; ++i) {
            $.ajax({
                url: '../prototype/php/post2.php',
                type: 'GET',
                dataType: 'JSON',
                data: 'SELECT * FROM stats WHERE test_run_id = ' + test_run_id + ' AND node_ip = \'192.168.1.16' + (i+1) + '\'',
                success: function(data) {
                    nodePerfGraph(data, '#cpu_svg'+(i+1), '#rss_svg'+(i+1));
                }
            });
        }
    }
}


$('#accordion').on('show.bs.collapse', function () {
    $('#accordion .in').collapse('hide');
});
