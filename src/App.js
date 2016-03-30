import React, { Component } from 'react';
import Tabletop from 'tabletop';
import ReactFauxDOM from 'react-faux-dom';
import d3 from 'd3';
import {ScatterChart} from 'rd3';

export class Chart extends Component {
  render() {
    var data = this.props.data
    var margin = {top: 20, right: 20, bottom: 30, left: 50}
    var width = this.props.width;
    var height = this.props.height;

    var parseDate = d3.time.format('%d-%b-%y').parse

    var x = d3.scale.linear()
    .range([0, width])
    var y = d3.scale.linear()
    .range([height, 0])
    var z = d3.scale.category10();

    var xAxis = d3.svg.axis()
    .scale(x)
    .innerTickSize(2)
    .outerTickSize(-1)
    .ticks(5)
    .orient('bottom')

    var yAxis = d3.svg.axis()
    .outerTickSize(1)
    .scale(y)
    .orient('left')

    var line = d3.svg.line()
    .x(function (d) { return x(d.x) })
    .y(function (d) { return y(d.y) })

    var node = ReactFauxDOM.createElement('svg')
    var svg = d3.select(node)
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

    x.domain(d3.extent(data, function (d) { return d.x })).nice();
    y.domain(d3.extent(data, function (d) { return d.y })).nice();

    svg.append('g')
    .attr('class', 'x axis')
    .attr('transform', 'translate(0,' + height + ')')
    .call(xAxis)

    svg.append('g')
    .attr('class', 'y axis')
    .call(yAxis)
    .append('text')
    .attr('transform', 'rotate(-90)')
    .attr('y', 2)
    .attr('dy', '.01em')
    .style('text-anchor', 'end')
    // .text('Price ($)')
    //
    svg.selectAll(".point")
        .data(data)
      .enter().append("path")
        .attr("class", "point")
        .style("fill", function(d, i) { return z(i); })
        .attr("d", d3.svg.symbol().type("circle"))
        .attr("transform", function(d) { return "translate(" + x(d.x) + "," + y(d.y) + ")"; });

    return node.toReact()
  }
}

export class Card extends Component {
  render() {
    return (
      <div className="entry">
        <div className="demo-card-square mdl-card mdl-shadow--2dp">
          <div className="mdl-card__title mdl-card--expand">
            <h2 className="mdl-card__title-text">{this.props.name}</h2>
          </div>
          <div className="mdl-card__supporting-text">
          {this.props.status}
          </div>
          <div className="mdl-card__actions mdl-card--border">
            <a className="mdl-button mdl-button--accent mdl-js-button mdl-js-ripple-effect">
            {this.props.stage}
            </a>
          </div>
        </div>
      </div>
    )
  }
};

class CardList extends Component {
  constructor(props) {
    super();
    this.state = {data: []};
  }

  componentDidMount() {
    var showInfo = this.showInfo;
    var that = this;
    var url = 'https://docs.google.com/spreadsheets/d/1PRKO81QQBFCd9Vpz3w_MTfb4Ab9H0F6nBPsKUtwREp0/pubhtml';
    this.tabletop = Tabletop.init( { key: url,
                     callbackContext: that,
                     callback: showInfo,
                     parseNumbers: true } );
  }
  showInfo(data, tabletop) {
    console.log("DATA", data, data.Sheet1.elements);
    let things = data.Sheet1.elements.map(function(thing) {
      thing.key = thing.Name;
      return thing;
    })
    console.log(things);
    this.setState({data: things});
  }

  tooltipFormat(data) {
    console.log(data);
    return JSON.stringify(data);
  }

  clickFunc(data) {
    console.log("in clickFunc", data)
  }
  render() {

    // var scatterData = [{ x: 15, y: 20 }, { x: 24, y: 12 }, {x: 74, y:84} ];
    var cardNodes = this.state.data.map(function(card) {
      return (
        <Card key={card.key} name={card.Name} stage={card.Stage} status={card.Status}>
        </Card>
      );
    });
    var scatterData = [
      {
        name: "series1",
        values: [ { x: 0, y: 20 }, { x: 24, y: 10 } ]
      },
      {
        name: "series3",
        values: [ { x: 70, y: 82 }, { x: 76, y: 82 } ]
      }
    ];
    return (
      <div>
      <ScatterChart
        data={scatterData}
        showTooltip={false}
        onMouseDown={this.clickFunc}
        XtooltipFormat={this.tooltipFormat}
        width={500}
        height={400}
      />
        <div className="cardList">
          {cardNodes}
        </div>
      </div>
    );
  }
}

export default class App extends Component {
  formatter () {
    return "foo";
  }
  render() {
    return (
      <div>
        <div className="demo-layout mdl-layout mdl-js-layout">
          <header className="mdl-layout__header mdl-layout__header">
            <div className="mdl-layout__header-row">
              <span className="mdl-layout-title">Innovation Dashboard</span>
              <div className="mdl-layout-spacer"></div>
              <nav className="mdl-navigation">
                <a className="mdl-navigation__link" href="">About this site</a>
              </nav>
            </div>
          </header>
          <div className="mdl-layout__drawer">
            <span className="mdl-layout-title">MoFo Research</span>
            <nav className="mdl-navigation">
              <a className="mdl-navigation__link" href="">About this site</a>
            </nav>
          </div>
          <main className="mdl-layout__content">

            <CardList></CardList>
          </main>
        </div>
      </div>
    );
  }
}

          //
          //
          //
          //
          // <script id="cat-template" type="text/x-handlebars-template">

          // </script>
          // <script type="text/javascript">
          //   var public_spreadsheet_url = 'https://docs.google.com/spreadsheets/d/1pehFtPOhTQZkrAXFuVtQBkXznMKZpGlLASY7wL2LBh8/pubhtml?gid=0&single=true';
          //
          //   $(document).ready( function() {
          //     Tabletop.init( { key: public_spreadsheet_url,
          //                      callback: showInfo,
          //                      parseNumbers: true } );
          //   });
          //
          //   function showInfo(data, tabletop) {
          //     var source   = $("#cat-template").html();
          //     var template = Handlebars.compile(source);
          //
          //     $.each( tabletop.sheets("Past reports").all(), function(i, cat) {
          //       console.log(cat);
          //       var html = template(cat);
          //       $("#content").append(html);
          //     });
          //   }
          // </script>
          //
