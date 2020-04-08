let data;
const url = 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json';

//GET json from url using fetch
async function getData(Url) {
  const fetchRes = await fetch(Url);
  const fetchResData = await fetchRes.json();
  
  return fetchResData.data;
}

//Get data and use it to make bar chart
getData(url).then(val => {
  data = val;

//Used to get the year for the tooltip
function getYearFromDate(date) {
  let arr = date.split('-');
  
  return arr[0];
}

//Used to get the month and turn it into the full word for the tooltip  
function getMonthFromDate(date) {
  let arr = date.split('-');
  if (arr[1] == '01') {
    return 'January'
  } else if (arr[1] == '04') {
    return 'April'
  } else if (arr[1] == '07') {
    return 'July'
  } else if (arr[1] == '10') {
    return 'October'
  }
}
  
//Bar chart\\
  
const w = 1000;
const h = 400;
const padding = 70;
const minYear = d3.min(data, (d) => new Date(d[0]));
const maxYear = d3.max(data, (d) => new Date(d[0]));
const minGdp = d3.min(data, d => d[1]);
const maxGdp = d3.max(data, d => d[1]);

//Scales
const xScale = d3.scaleTime()
                 .domain([minYear, maxYear])
                 .range([padding, w - padding]);

const yScale = d3.scaleLinear()
                 .domain([0, maxGdp])
                 .range([h - padding, padding]);   

//Tooltip
const tooltip = d3.select('body')
                  .append('div')
                  .attr('id', 'tooltip');  
//Rect
const svg = d3.select('#chart')
              .append('svg')
              .attr('width', w)
              .attr('height', h);

svg.selectAll('rect') 
   .data(data)
   .enter()
   .append('rect')
   .attr('width', w/data.length)
   .attr('height', d => h - padding - yScale(d[1]))
   .attr('x', d => xScale(new Date(d[0])))
   .attr('y', d => yScale(d[1]))
   .attr('class', 'bar')
   .attr('data-date', d => d[0])
   .attr('data-gdp', d => d[1])
   .on('mouseover', (d, i) => {
      tooltip.style('left', d3.event.pageX - 100 + 'px')
             .style('top', d3.event.pageY - 90 + "px")
             .style('opacity', 1)
             .html(`${getYearFromDate(d[0])} - ${getMonthFromDate(d[0])}<br>$${d[1]} Billion`)
             .attr('data-date', d[0]);
   })
   .on('mouseout', d => { tooltip.style('opacity', '0');
   });

//Axes
const xAxis = d3.axisBottom(xScale);

const yAxis = d3.axisLeft(yScale);

svg.append('g')
   .attr('transform', `translate(0, ${(h - padding)})`)
   .attr('id', 'x-axis')
   .call(xAxis);

svg.append('g')
   .attr('transform', `translate(${padding}, 0)`)
   .attr('id', 'y-axis')
   .call(yAxis);
  
//Axes labels
svg.append('text')
   .attr('transform', `translate(${(w/2)}, ${(h - padding + 50)})`)
   .attr('class', 'label')
   .text('Year');
  
svg.append('text')
        .attr('transform', 'rotate(-90)')
        .attr('y', padding - 50)
        .attr('x', -(h / 2))
        .attr('class', 'label')
        .text('GDP'); 
});