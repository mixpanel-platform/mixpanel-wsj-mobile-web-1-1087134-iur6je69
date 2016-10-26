// This report has been custom-built for ESPN by Mixpanel's client solutions team, 
// and is not warranted or maintained alongside the core Mixpanel product. 
// As the end-user, you are solely responsible for any bug fixes, feature updates, 
// and ongoing code changes or iterations.


// number of slots to show
var totalSlots = 15;
// number of hours to look back
var totalHours = 4;

// initialize jql script variables
var storiesScript, slotsScript;

// set up dropdowns
var editionDropdown = {
    items: [
        {label: 'All', value: 'all'},
    ]
};
var platformDropdown = {
    items: [
        {label: 'All', value: 'all'},
        {label: 'Desktop', value: 'desktop'},
        {label: 'Mobile', value: 'mobile'}
    ]
};
var sortDropdown = {
    items: [
        {label: 'Slots', value: 'slot'},
        {label: 'Stories', value: 'story'},
    ]  
};
var sortByDropdown = {
    items: [
        {label: 'Slot Number', value: 'slot'},
        {label: 'Page Views', value: 'views'},
        {label: 'Video Plays', value: 'videos'},
        {label: 'Social Shares', value: 'shares'},
    ]
};

// when document loads
$(document).ready(function() {
    // $$RG$$ commented begin
    $('.loading').hide();
    // // get edition names to populate applicable dropdown
    // MP.api.query('api/2.0/events/properties/values', {
    //     event: 'Page View',
    //     name: 'Edition Name',
    // }).done(function(results) {
    //     _.each(results, function(edition) {
    //         // add each edition name to dropdown
    //         editionDropdown.items.push({label: edition, value: edition});
    //     });
    //     // populate edition dropdown div
    //     $('#edition-dropdown').MPSelect(editionDropdown);
    // });
    // $$RG$$ commented end

    // populate platform dropdown div
    $('#platform-dropdown').MPSelect(platformDropdown);
    $('#edition-dropdown').MPSelect(editionDropdown);
    // populate sort dropdown divs
    $('#sort-dropdown').MPSelect(sortDropdown);
    $('#sort-by-dropdown').MPSelect(sortByDropdown);

    // run new queries when dropdowns are changed
    $('#edition-dropdown').on('change', function() {
        // $('.loading').show();
        // $('.slot').hide();
        // getAllData();
    });
    $('#platform-dropdown').on('change', function() {
        // $('.loading').show();
        // $('.slot').hide();
        // getAllData();
    });
    $('#sort-dropdown').on('change', function() {
        // $('.loading').show();
        // $('.slot').hide();
        // getAllData();
    });
    $('#sort-by-dropdown').on('change', function() {
        // $('.loading').show();
        // $('.slot').hide();
        // getAllData();
    });

    // set script variables (taken from html) after html has loaded
    storiesScript = $.trim($('#stories-jql').html());
    slotsScript = $.trim($('#slots-jql').html());

    // $$RG$ commented begin
    // // populate dashboard
    // $('.loading').show();
    // $('.slot').hide();
    // getAllData();
    // $$RG$$ commented end

    // bind toggle event to toggle-story and toggle-prev-stories divs
    $('body').on('click', '.toggle-prev-stories', function() {
        $(this).text() === 'Show' ? $(this).text('Hide') : $(this).text('Show');
        $(this).siblings('.prev-stories').toggle();
    });
    $('body').on('click', '.toggle-story', function() {
        $(this).text() === 'Show' ? $(this).text('Hide') : $(this).text('Show');
        $(this).siblings('.story-detail').toggle();
    });
});

function getAllData() {
    // $$RG$$ commented begin
    // var slots, stories = {};
    // // ensure jql queries occur in order, but other code can execute async
    // var slotPromise = getSlots();
    // slotPromise
    //     .then(function(slotData) {
    //         slots = slotData;
    //         var storiesParam = _.pluck(slotData, 'current_story');
    //         return getStories(storiesParam);
    //     })
    //     .then(function(storyData) {
    //         // make stories object
    //         _.each(storyData, function(story) {
    //             var storyHeadline = _.keys(story)[0];
    //             stories[storyHeadline] = story[storyHeadline];
    //         })
    //         // sort and format data
    //         var sort = $('#sort-dropdown').val();
    //         var sortType = $('#sort-by-dropdown').val();
    //         var sortedData = sortData(sort, sortType, slots, stories);
    //         // display formatted data
    //         populateSlots(sortedData);
    //         $('.loading').hide();
    //         $('.slot').show();
    //     });
    // // retrieve data again every 120 seconds
    // setTimeout(getAllData, 120000);
    // $$RG$$ commented end
}

function getSlots() {
    // collect variables
    var platform = $('#platform-dropdown').val();
    var edition = $('#edition-dropdown').val() == '' ? 'all' : $('#edition-dropdown').val();
    // call slots jql
    var slotParams = {
        max_slots: totalSlots,
        from_date: date_to_string(_.now() - 1000*60*60*totalHours),
        to_date: date_to_string(_.now() - 1000*60*60*totalHours),
        edition: edition,
        platform: platform
    }
    return new Promise(function(resolve, reject) {
        resolve(MP.api.jql(slotsScript, slotParams));
        reject(Error('JQL Error'));
    });
}

function getStories(stories) {
    // collect variables
    var platform = $('#platform-dropdown').val();
    var edition = $('#edition-dropdown').val() == '' ? 'all' : $('#edition-dropdown').val();
    // call stories jql
    var storyParams = {
        from_date: date_to_string(_.now() - 1000*60*60*totalHours),
        to_date: date_to_string(_.now() - 1000*60*60*totalHours),
        edition: edition,
        platform: platform,
        stories: stories,
    }
    return new Promise(function(resolve, reject) {
        resolve(MP.api.jql(storiesScript, storyParams));
        reject(Error('JQL Error'));
    });
}

function sortData(sort, sortType, slotData, storyData) {
    // sort slot and story data to display in dashboard
    var sortedData = [];
    var resultData = [];
    var obj = {
        slot: slotData,
        story: storyData,
    }
    sortedData = _.first(_.sortBy(obj[sort], sortType), totalSlots);
    if (sort === 'story') {
        _.each(sortedData, function(val, key) {
            resultData.push({
                slot_num: val.current_slot,
                slot: obj.slot[val.current_slot-1],
                story: obj.story[key]
            });
        });
    } else if (sort === 'slot') {
        _.each(sortedData, function(val, index) {
            var story = {};
            story[val.current_story] = obj.story[val.current_story];
            resultData.push({
                slot_num: index + 1,
                slot: obj.slot[index],
                story: story
            });
        });
    }
    return resultData;
}

function populateSlots(results) {
    // reset slots
    $('.slot').remove();
    // add new slots and display results
    _.each(results, function(slotData) {
        addSlot(slotData.slot_num);
        displaySlotInfo(slotData);
    });
}

function addSlot(num) {
    // add slot div with structure to report body
    $('<div id="slot' + num + '" class="slot">' + 
            '<div class="slot-num">' + num + '</div>' +
            '<div class="card">' +
                '<div class="current-slot">' + 
                    '<h2>Slot Performance</h2>' +
                    '<div class="engagement-stats">' +
                        '<div class="views metric"><div class="label">Views</div></div>' + 
                        '<div class="starts metric"><div class="label">Video Starts</div></div>' + 
                        '<div class="shares metric"><div class="label">Shares</div></div>' +
                    '</div>' + // end engagement-stats div
                    '<div class="slot-graph"></div>' + 
                    '<div class="referral-graph"></div>' +
                    '<h2>Slot History</h2>' +
                    '<div class="toggle-prev-stories">Show</div>' +
                    '<div class="prev-stories"></div>' +
                '</div>' + // end current slot div
                '<div class="current-story">' +
                    '<div class="label current-label">Current Story</div>' +
                    '<div class="story-headline"></div>' +
                    '<div class="story-stats"></div>' +
                    '<h2>Current Story Detail</h2>' +
                    '<div class="toggle-story">Show</div>' +
                    '<div class="story-detail">' +
                        '<div class="story-prev-slots"></div>' +
                        '<div class="story-referral-paths"></div>' +
                    '</div>' + // end story detail div
                '</div>' + // end current story div
            '</div>' + // end card div
        '</div>') // end slot div
        .appendTo('#all-slots'); // add to html
}

function displaySlotInfo(slotData) {
    var $slotDiv = $('#slot' + slotData.slot_num);
    displaySlot($slotDiv, slotData.slot);
    displayStory($slotDiv.find('.current-story'), slotData.story);
}

function displaySlot($div, slotData) {
    // display engagement stats
    displayEngagement($div, slotData);

    // set up graph 
    var graphDivSelector = '#' + $div.attr('id') + ' .slot-graph';

    // format engagement data (line graph)
    var engagementData = [];
    _.each(slotData.timeEngagement, function(total, time) {
        engagementData.push({
            time: parseInt(time),
            engagement: total
        });
    });
    engagementData = _.sortBy(engagementData, 'time');

    // format referral source data (stacked area graph)
    var referralData = [];
    _.each(slotData.referral, function(sourceObject, time) {
        var obj = {
            time: parseInt(time),
            Direct: parseFloat(sourceObject.Direct || 0),
            Internal: parseFloat(sourceObject.Internal || 0),
            Social: parseFloat(sourceObject.Social || 0),
            Search: parseFloat(sourceObject.Search || 0),
            Other: parseFloat(sourceObject.Other || 0)
        };
        referralData.push(obj);
    });
    referralData = _.sortBy(referralData, 'time');

    // format previous story time array
    var prevStoryTimes = _.pluck(slotData.prev_stories, 'start_time');

    // add graph with formatted data
    addGraph(graphDivSelector, engagementData, referralData, prevStoryTimes);

    // display previous story table
    displayPrevStories($div.find('.prev-stories'), slotData.prev_stories);
}

function displayEngagement($div, slotData) {
    var $engageMetrics = $div.find('.engagement-stats');
    // reset engagement stats
    $engageMetrics.find('.engage-metric').remove();
    // add new engagement stats
    $('<div class="engage-metric">' + nFormatter(slotData.views) + '</div>').appendTo($engageMetrics.find('.views'));
    $('<div class="engage-metric">' + nFormatter(slotData.videos) + '</div>').appendTo($engageMetrics.find('.starts'));
    $('<div class="engage-metric">' + nFormatter(slotData.shares) + '</div>').appendTo($engageMetrics.find('.shares'));
}

function addGraph(divSelector, engagementData, referralData, prevStoryData) {
    // set up graph components
    var margin = {top: 20, right: 50, bottom: 50, left: 50},
        width = 850 - margin.left - margin.right,
        height = 180 - margin.top - margin.bottom;

    var formatPercent = d3.format('.0%');

    var x = d3.scaleTime()
        .range([0, width]);

    var y = d3.scaleLinear()
        .range([height, 0]);

    var yRight = d3.scaleLinear()
        .range([height, 0]);

    var line = d3.line()
        .x(function(d) { return x(d.time); })
        .y(function(d) { return y(d.engagement); });

    var area = d3.area()
        .x(function(d) { return x(d.data.time); })
        .y0(function(d) { return yRight(d[0]); })
        .y1(function(d) { return yRight(d[1]); });

    var stack = d3.stack()
        .keys(['Direct', 'Internal', 'Social', 'Search', 'Other'])
        .offset(d3.stackOffsetNone);

    var color = d3.scaleWarm();

    var svg = d3.select(divSelector).append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
      .append('g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    // set domain ranges
    x.domain(d3.extent(engagementData, function(d) { return d.time; }));
    y.domain(d3.extent(engagementData, function(d) { return d.engagement; }));
    yRight.domain([0,1]);
    // color domain
    color.domain(['Direct', 'Internal', 'Social', 'Search', 'Other']);

    // format referral source data
    var series = stack(referralData);

    // add x axis
    svg.append('g')
        .attr('class', 'axis axis--x')
        .attr('transform', 'translate(0,' + height + ')')
        .call(d3.axisBottom(x));

    // add y axis on left (for Engagement)
    svg.append('g')
        .attr('class', 'axis y-axis-left')
        .call(d3.axisLeft(y).ticks(6))
      .append('text')
        .attr('class', 'axis-title y-axis-left-title')
        .attr('y', -18)
        .attr('x', 11)
        .attr('dy', '.71em')
        .style('text-anchor', 'end')
        .text('Engagement');

    // add y axis on right (for Referral Traffic)
    svg.append('g')
        .attr('class', 'axis y-axis-right')
        .attr('transform', 'translate(' + width + ',0)')
        .call(d3.axisRight(yRight).ticks(5).tickFormat(formatPercent))
      .append('text')
        .attr('class', 'axis-title y-axis-right-title')
        .attr('y', -18)
        .attr('x', 34)
        .attr('dy', '.71em')
        .style('text-anchor', 'end')
        .text('Percentage');

    // add line
    svg.append('path')
        .datum(engagementData)
        .attr('class', 'line')
        .attr('d', line);

    // define colors for stacked area chart
    var colors = {
        'Direct': 'gray',
        'Internal': 'red',
        'Social': 'deepskyblue',
        'Search': 'blue',
        'Other': 'green',
    };

    // add stacked area chart
    _.each(series, function(arr) {
        // for each referral source, add area to stacked area chart
        var source = svg.append('g')
          .datum(arr)
          .attr('class', 'source')
          .attr('d', area);
        source.append('path')
          .attr('class', 'area')
          .attr('d', function(d) { return area(d); })
          .style('fill', function(d) { return colors[d.key]; })
          .style('opacity', '0.2');
    });

    // add legend for stacked area chart
    addGraphLegend($(divSelector), colors);

    // add previous story lines
    var maxEngagement = _.max(_.pluck(engagementData, 'engagement'));
    var minTime = _.min(_.pluck(engagementData, 'time'));
    var maxTime = _.max(_.pluck(engagementData, 'time'));
    // loop through each previous story start time
    _.each(prevStoryData, function(time) {
        // only show story changes that occur after first tick in x axis
        if (time < minTime) return;
        // determine story number
        var num = prevStoryData.indexOf(time) + 1;
        // determine offset for story number label
        var numOffset = num < 10 ? 3 : 7;
        // add line
        svg.append('path')
          .datum([{time: time, engagement: 0}, {time: time, engagement: maxEngagement}])
          .attr('class', 'graph-story-line')
          .attr('d', line);
        // add label (story number) to end of line
        svg.append('text')
          .attr('class', 'story-line-num')
          .attr('dy', height + margin.bottom)
          // x axis ratio calculated by width/(maxTime-minTime)
          // multiply by x axis location of path (time-minTime)
          // subtract offset to center over line
          .attr('dx', (width / (maxTime - minTime)) * (time - minTime) - numOffset)
          .text(num);
    });
}

function addGraphLegend($div, colorObject) {
    // add legend div
    var $legend = $('<div class="graph-legend"></div>').appendTo($div);
    // add series
    _.each(colorObject, function(color, label) {
        // for each label & color in object, add series to legend
        $('<div class="legend-series">' + 
                '<div class="series-color" style="background-color: ' + color + '"></div>' +
                '<div class="series-label">' + label + '</div>' +
            '</div>')
            .appendTo($legend);
    });
}

function displayPrevStories($div, stories) {
    // add headers
    addPrevStory($div, 'header');

    // add row for each previous story in slot
    _.each(stories, function(story) {
        story.num = stories.indexOf(story) + 1;
        addPrevStory($div, story);
    });
}

function addPrevStory($div, story) {
    // format stats 
    var header, num, storyName, startStat, timeStat, engagement;
    if (story === 'header') {
        header = ' header-row';
        num = '';
        storyName = 'Story';
        startStat = 'Publish Time'
        timeStat = 'Time Since Publish';
        engagement = 'Engagement';
    }
    else {
        header = '';
        num = story.num;
        storyName = story.story;
        startStat = new Date(story.start_time).toISOString().substr(11,5);
        timeStat = story.total_hr + '<span class="prev-time-label">H</span>' +
                             story.total_min + '<span class="prev-time-label">M</span>';
        engagement = nFormatter(story.engagement);
    }

    // add story to div
    $('<div class="prev-story' + header + '">' + 
            '<div class="prev-cell prev-story-num">' + num + '</div>' +
            '<div class="prev-cell prev-story-headline">' + storyName + '</div>' +
            '<div class="prev-cell prev-story-stats">' +
                '<div class="prev-story-stat">' + startStat + '</div>' +
                '<div class="prev-story-stat">' + 
                    '<div class="prev-stat">' + timeStat + '</div>' +
                '</div>' +
                '<div class="prev-story-stat">' + engagement + '</div>' +
            '</div>' + // end prev story stats div
        '</div>') // end prev story div
        .appendTo($div);  
}

function displayStory($div, storyData) {
    var story = _.keys(storyData)[0];
    var data = storyData[story];

    // populate current story headline
    $div.find('.story-headline').text(story);

    // reset time stats
    $div.find('.time-stat').remove();
    // populate time stats
    $('<div class="story-stat">' +
            '<div class="stat">' +
                new Date(data.overall_start).toISOString().substr(11,5) +
            '</div>' +
            '<div class="label">Publish Time</div>' +
        '</div>' +
        '<div class="story-stat">' +
            '<div class="stat">' +
                data.overall_hr + '<span class="time-label">H</span>' +
                data.overall_min + '<span class="time-label">M</span>' +
            '</div>' +
            '<div class="label">Since Publish</div>' +
        '</div>' +
        // populate engagement stat
        '<div class="story-stat">' +
            '<div class="stat">' +
                nFormatter(data.engagement) +
            '</div>' +
            '<div class="label">Engagement</div>' +
        '</div>')
        .appendTo($div.find('.story-stats'));

    // populate story history
    displayTable($div.find('.story-prev-slots'), data.stats);

    // populate referral paths
    displayReferrals($div.find('.story-referral-paths'), data.referral);
}

function displayTable($div, tableArray) {
    // reset table
    $div.empty();
    // add title
    $('<div class="chart-title true">Story History</div>').appendTo($div);

    // add table header
    var headerData = {
        slot: 'Slot',
        placement: 'Placement Type',
        page: 'Page Type',
        start: 'Published',
        total_time: 'Total Time',
        engagement: 'Total Engagement',
        change: 'Engagement Change',
    }
    addRow($div, headerData, 'header-row');

    // add row for each row of data in array
    for (var i = 0; i < tableArray.length; i++) {
        var row = tableArray[i];
        // format slot
        if (row.slot == 'undefined') row.slot = 'N/A';
        // format total time in position and start time
        row.total_time = row.total_hr + 'H ' + row.total_min + 'M';
        row.start = new Date(row.start_time).toISOString().substr(11,5);

        // calculate change in engagement from last position
        var lastEngagement = i > 0 ? tableArray[i-1].engagement : 0;
        row.change = lastEngagement === 0 ? 'N/A' : ((row.engagement - lastEngagement) / lastEngagement * 100).toFixed();
        
        //add row to table
        addRow($div, row);
    }
}

function addRow($div, data, header) {
    // add header class if applicable
    header = header ? header : '';

    // format % change
    // only add percent sign if percentage exists
    var change = header || data.change === 'N/A' ? '' : '%';
    // add color styling to numbers based on positive/negative change
    var color = header ? '' : ' style="color: ' + colorFormat(data.change) + ';"';

    // add row to table
    $('<div class="row ' + header + '">' + 
            '<div class="cell">' + data.slot + '</div>' + 
            '<div class="cell">' + data.placement + '</div>' + 
            '<div class="cell">' + data.page + '</div>' + 
            '<div class="cell">' + data.start + '</div>' + 
            '<div class="cell">' + data.total_time + '</div>' + 
            '<div class="cell">' + data.engagement + '</div>' + 
            '<div class="cell"' + color + '>' + data.change + change + '</div>' + 
        '</div>')
        .appendTo($div);
}

function displayReferrals($div, referrals) {
    // format data for highcharts
    var referralGraph = {};
    _.each(referrals, function(referralObject) {
        referralGraph[referralObject.placement] = referralObject.views;
    });

    // add pie chart
    addEngageChart('pie', $div, 'engage-graph', '', 'Top Referral Paths', referralGraph);
}

function addEngageChart(type, div, divName, number, title, data) {
    // add chart of type line, bar, or pie (all of which supported by Mixpanel ReportKit library) to specific div

    // set up highcharts options
    // see http://api.highcharts.com/highcharts for options
    var highcharts = {
            colors: ['#2276ca', '#ca2222', 'rgb(37,192,190)', 'rgb(112,120,146)', 'rgb(223,225,234)'],
            chart: {
                    marginBottom: 30,
                    borderWidth: 0,
                    borderRadius: 0,
            },
            xAxis: {
                    labels: {
                            style: {
                                'fontWeight': 'bold',
                            },
                    },
            },
            yAxis: {
                    gridLineColor: '#E6E8EB',
                    gridLineDashStyle: 'Dash',
                    gridLineWidth: 1,
                    labels: {
                            style: {
                                'fontWeight': 'bold',
                            },
                    },
            },
    }
    
    // set up graph params; dependent on type of graph
    var params;
    if (type == 'bar') {
        params = {
            chartType: type,
            stacked: true,
            highchartsOptions: highcharts,
            data: data
        }
    } else if (type == 'line') {
        params = {
            chartType: type,
            highchartsOptions: highcharts,
            data: data
        }
    } else if (type == 'pie') {
        // extend highcharts options in case of pie chart
        $.extend(highcharts, {
            plotOptions: {
                pie: {
                    dataLabels: {
                        distance: 20,
                        style: {
                            'fontSize': '12px',
                            'fontWeight': 'bold',
                        },
                    },
                }
            }
        });
        params = {
            chartType: type,
            highchartsOptions: highcharts,
            data: data
        }
    }
    
    // reset graphs
    div.find('.graph-container').remove();
    // add new graph container with extra classes if needed
    var $graphDiv = $('<div class="graph-container"></div>').appendTo(div);
    $('<div class="chart-header">' + 
            '<div class="chart-title-container">' + 
                '<div class="chart-title"><span style="color: ' + colorFormat(number) + '">' + numberFormatCommas(number) + '</span> ' + title + '</div>' +
            '</div>' + // end chart-title-container div
        '</div>') // end chart-header div
        .appendTo($graphDiv);
    // add actual graph div with extra classes if needed, initialize MPChart in div with defined params
    $('<div class="mp-graph ' + divName + '"></div>').appendTo($graphDiv).MPChart(params);
    // hide default chart header (because we added a custom one)
    $('.' + divName + ' .mixpanel-platform-chart_header').hide();
}

// utility functions

function date_to_string(d) {
    // format date in '2016-05-01' format (for jql query input)
    var timezone = 4; // utc to et offset (4 during dst, 5 otherwise)
    d -= 1000*60*60*timezone;
    return new Date(d).toISOString().split('T')[0];
}
function colorFormat(n) {
    // style numbers as green if positive, red if negative, black otherwise
    return n > 0 ? '#22ca76' : n < 0 ? '#ca2222' : 'black';
}
function numberFormatRound(n) {
    // round number
    return Math.round(n);
}
function nFormatter(num) {
    // format larger numbers such that millions are formatted as 3.1M, thousands as 138.4K, etc.
    if (num >= 1000000000) {
        return (num / 1000000000).toFixed(1).replace(/\.0$/, '') + 'G';
    }
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
    }
    if (num >= 1000) {
        return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
    }
    return num;
}
function numberFormatCommas(n) {
    // format large numbers to include commas to separate thousands, millions, etc.
    var parts = n.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
}
