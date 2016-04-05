import React, { Component } from 'react';
import Tabletop from 'tabletop';
import ReactFauxDOM from 'react-faux-dom';
import d3 from 'd3';
import {ScatterChart} from 'rd3';

export class Card extends Component {
  render() {
    let cName = "mdl-card__title mdl-card--expand "+ this.props.stage.replace(' ', '').toLowerCase();
    return (
      <div className="entry">
        <div className="demo-card-square mdl-card mdl-shadow--2dp">
          <div className={cName}>
            <h2 className="mdl-card__title-text"><a href={this.props.URL}>{this.props.name}</a></h2>
          </div>
          <div className="mdl-card__supporting-text">
          {this.props.status}
          </div>
          <div className="mdl-card__actions mdl-card--border">
            <a className="mdl-button mdl-button--accent mdl-js-button mdl-js-ripple-effect">
            Stage: {this.props.stage}
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
    // console.log("DATA", data, data.Sheet1.elements);
    let things = data.Sheet1.elements.map(function(thing) {
      thing.key = thing.Name;
      return thing;
    })
    this.setState({data: things});
  }

  tooltipFormat(data) {
    return data.data.Name
  }

  clickFunc(data) {
    console.log("in clickFunc", data)
  }
  tickFormat(tickValue) {
    if (tickValue == 30) return 'gate 0';
    if (tickValue == 50) return 'gate 1';
    if (tickValue == 70) return 'gate 2';
    return '';
  }
  render() {
    var cardNodes = this.state.data.map(function(card) {
      return (
        <Card key={card.key} URL={card.URL} name={card.Name} stage={card.Stage} status={card.Status}>
        </Card>
      );
    });
    var conceptItems = [];
    var prototypesItems = [];
    var marketvalidationItems = [];
    var productItems = [];
    var list = null;
    var x = 0, y=0;
    this.state.data.map(function(entry) {
      if (entry.Stage == "Concept") {
        list = conceptItems;
        x = 20;
      } else if (entry.Stage == "Prototype") {
        list = prototypesItems;
        x = 40;
      } else if (entry.Stage == "Market Validation") {
        list = marketvalidationItems;
        x = 60;
      } else if (entry.Stage == "Product") {
        list = productItems;
        x = 80;
      }
      y = 100 - (list.length+1) * (18 + Math.random()*6);
      list.push({x: x, y: y, entry: entry})
    })

    var concepts = {
      name: "Documented concepts",
      values: conceptItems
    };
    var prototypes = {
      name: "Prototypes",
      values: prototypesItems
    };
    var marketvalidation = {
      name: "Initial external validation",
      values: marketvalidationItems
    };
    var products = {
      name: "Significant benefits at Scale",
      values: productItems
    };
    var scatterData = [concepts, prototypes, marketvalidation, products];
    console.log("scatterData", scatterData);
    return (
      <div>
      <ScatterChart
        data={scatterData}
        legend={true}
        circleRadius={12}
        xAxisFormatter={this.tickFormat}
        yAxisTickValues={[]}
        yAxisStrokeWidth={0}
        sideOffset={140}
        colors={d3.scale.category10()}
        domain={{x: [0,100], y: [0,100]}}
        xAxisTickValues={[30,50,70]}
        gridVertical={true}
        gridHorizontalStroke={'#000'}
        showTooltip={true}
        onMouseDown={this.clickFunc}
        tooltipFormat={this.tooltipFormat}
        width={900}
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
            <span className="mdl-layout-title">Innovation Dashboard</span>
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
