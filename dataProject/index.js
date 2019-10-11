import * as d3 from "d3";
import "./styles/style.css";

const padding = 40;
const w = 800;
const h = 400;

function makeAYear(str) {
  let q = 4;
  if (str[5] === '0') {
    let quater = 12 / +str[6];
    if (quater >= 4) {
      q = 1;
    } else if (quater >= 2) {
      q = 2;
    } else {
      q = 3;
    }

  }
  return `${str.slice(0, 4)} Q${q}`;
}

function getBillion(str) {
  let result = '';
  let k = 0;
  if (str.length === 6) {
    result += str[0] + ',';
    k = 1;
  }
  if (str.length === 7) {
    result += str[0] + str[1] + ',';
    k = 2;
  }
  for (let i = 1; i < str.length; i++) {
    result += str[i];
  }
  console.log(str, result)
  return result;
}

async function render() {
  const tooltip = d3.select('.tooltip')
    .attr("id", "tooltip");

  console.log(211111);
  let dataFetch, allData;
  await fetch(
    "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json"
  )
    .then(data => data.json())
    .then(data => {
      dataFetch = data.data;
      allData = data;
    });
  console.log(1);
  console.log(allData);
  d3.select('#title').text(`${allData.source_name}`)
  const svg = d3
    .select(".container")
    .append("svg")
    .attr("width", w)
    .attr("height", h);
  const years = dataFetch.map(i => new Date(i[0]));
  let xMax = new Date(d3.max(years));
  xMax.setMonth(xMax.getMonth() + 3);
  const xScale = d3
    .scaleTime()
    .domain([d3.min(years), xMax])
    .range([0, w - 2 * padding]);
  const date = years.map(item => new Date(item).getFullYear());
  
  const yScale = d3
    .scaleLinear()
    .domain([0, d3.max(dataFetch, d => d[1])])
    .range([0, h - padding]);

  const yAxisScale = d3
    .scaleLinear()
    .domain([0, d3.max(dataFetch, d => d[1])])
    .range([h - padding, 0]);
  svg
    .selectAll("rect")
    .data(dataFetch)
    .enter()
    .append("rect")
    .attr("x", (d, i) => xScale(years[i]) + padding)
    .attr("y", (d, i) => h - yScale(d[1]) - padding + 5)
    .attr("width", (w - padding) / 275)
    .attr("height", d => yScale(d[1]))
    .attr("fill", "navy")
    .attr('class', 'bar')
    .attr('data-date', d => `${d[0]}`)
    .attr('data-gdp', d => `${d[1]}`)
    .on("mouseover", (d) => {
      tooltip
        .style('opacity', '.9')
        .attr('data-date', `${d[0]}`)
    })
    .on('mouseout', () => {
      tooltip
        .style('opacity', '0')
    })

  const yAxis = d3.axisLeft(yAxisScale);
  const xAxis = d3.axisBottom(xScale);

  svg
    .append("g")
    .attr("transform", "translate(40," + 5 + ")")
    .call(yAxis)
    .attr("id", "y-axis")

  svg
    .append("g")
    .attr("transform", "translate(40," + (h - padding + 5) + ")")
    .call(xAxis)
    .attr("id", "x-axis");

    document.querySelectorAll('rect').forEach((item, i) => {
      item.addEventListener('mouseover', (e) => {
        tooltip
          .style('right', `${document.body.clientWidth -  e.clientX}px`)
          .style('top', `${document.body.clientHeight - document.body.clientHeight / 2}px`)
          .html(`${makeAYear(dataFetch[i][0])}<br />${getBillion('' + dataFetch[i][1])} billion`)
      })
    });
  

}

render();
