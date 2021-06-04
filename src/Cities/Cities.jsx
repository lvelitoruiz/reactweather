import React from "react";
import data from './city.list.partial_PE_US.json'

const peru = data.filter( data => data.country === 'PE');
peru.sort((a, b) => (a.name > b.name) ? 1 : -1);

const usa = data.filter( data => data.country === 'US');
usa.sort((a, b) => (a.name > b.name) ? 1 : -1);

let searchArray = [];

class Cities extends React.Component {

  constructor(props) {
    super(props);
    this.state = { datas: peru, peru: true };
    this.paginate = this.paginate.bind(this);
    this.searchByTerm = this.searchByTerm.bind(this);
  }

  componentDidMount() {
    this.paginate('peru',10,1);
  }

  searchByTerm(event) {
    let term = event.target.value;
    if(term.length > 0) {
      searchArray = [];
      if(this.state.peru) {
        for(let i = 0; i < peru.length; i++) {
          let toCompare = peru[i].name;
          if(toCompare.toLowerCase().includes(term.toLowerCase())){
            searchArray.push(peru[i]);
          }
        }
      } else {
        for(let i = 0; i < usa.length; i++) {
          let toCompare = usa[i].name;
          if(toCompare.toLowerCase().includes(term.toLowerCase())){
            searchArray.push(usa[i]);
          }
        }
      }
      searchArray = searchArray.slice(0,10);
      this.setState({datas: searchArray});
    } else {
      if(this.state.peru) {
        this.paginate('peru',10,1);
      } else {
        this.paginate('usa',10,1);
      }
    }
  }

  paginate(country, page_size, page_number) {
    // human-readable page numbers usually start with 1, so we reduce 1 in the first argument
    if(country === 'peru') {
      let dataCall = peru.slice((page_number - 1) * page_size, page_number * page_size);
      this.setState({ datas: dataCall, peru: true });
    } else {
      let dataCall = usa.slice((page_number - 1) * page_size, page_number * page_size);
      this.setState({ datas: dataCall, peru: false });
    }
  }

  render() {
    const { whenClicked } = this.props;
    return <div className="text-left grid col-span-12">
      <h2 className="cities-container pl-2 font-black text-2xl text-blue-500">CITIES TO CHECK</h2>
      <p className="text-sm py-4 pl-2 text-gray-700 font-light">Lorem ipsum dolor sit amet, consectetur adipiscing elit. In ac quam at est scelerisque pretium at ac elit. Proin pellentesque nibh id nunc aliquam tempor. Cras tristique sollicitudin feugiat. Mauris odio augue, tempor at nunc sit amet, egestas luctus arcu.</p>
      <div className="flex  text-right mb-8 pt-4">
        <input placeholder="Search by city name" onChange={this.searchByTerm} className="border border-gray-300 focus:outline-none rounded mr-2 flex-grow py-1 px-4 font-light text-gray-600" type="text" />
        <button onClick={() => this.paginate('peru',10,1)} className={`text-white font-light py-0 px-4 border-b-4 mr-2 rounded focus:outline-none ${this.state.peru ? 'bg-red-400 hover:bg-red-300 border-red-700 hover:border-red-500': 'bg-blue-500 hover:bg-blue-400 border-blue-700 hover:border-blue-500'}`}>
          Peru
        </button>
        <button onClick={() => this.paginate('usa',10,1)} className={`text-white font-light py-0 px-4 border-b-4 mr-2 rounded focus:outline-none ${this.state.peru ? 'bg-blue-500 hover:bg-blue-400 border-blue-700 hover:border-blue-500': 'bg-red-400 hover:bg-red-300 border-red-700 hover:border-red-500'}`}>
          Usa
        </button>
      </div>
      <div className="shadow md:overflow-hidden overflow-auto border-8 sm:rounded-lg border-light-blue-500 border-opacity-25">
        <table className="table-auto min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">País</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Coords</th>
            </tr>
          </thead>
          <tbody  className="bg-white divide-y divide-gray-200">
            {
              this.state.datas.map((data,key) => {
                return (
                  <tr className="text-sm text-gray-700 font-light hover:bg-gray-50 cursor-pointer" key={key} onClick={function(){whenClicked(data.id)}}>
                    <td className="px-6 py-4 whitespace-nowrap">{data.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{data.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap"><span className="px-3 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">{data.country}</span></td>
                    <td className="px-6 py-4 whitespace-nowrap">{data.coord.lon},{data.coord.lat}</td>
                  </tr>
                );
              })
            }
          </tbody>
        </table>
      </div>
    </div>
  };
};

export default Cities;
