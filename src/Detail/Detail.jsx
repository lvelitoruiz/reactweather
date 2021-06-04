import React from "react";
import axios from "axios";

const months = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];
const days = [
  "Domingo",
  "Lunes",
  "Martes",
  "Miércoles",
  "Jueves",
  "Viernes",
  "Sábado",
];

class Detail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      temperature: "",
      icon: "",
      description: "",
      date: "",
      list: "",
      placeId: "",
      hourly: "",
      forecast: "",
      day: "",
      modal: false
    };
    this.callApi = this.callApi.bind(this);
    this.getDays = this.getDays.bind(this);
    this.closeModal = this.closeModal.bind(this);
  }

  componentDidMount() {
    this.callApi("3699832");
    let d = new Date();
    this.setState({
      date:
        days[d.getDay()] +
        " " +
        String(d.getDate()).padStart(2, "0") +
        " de " +
        months[d.getMonth()] +
        " del " +
        d.getFullYear(),
    });
  }

  alertThis(identification) {
    alert(`This is the id: ${identification}`);
  }

  closeModal() {
    this.setState({modal: false});
  }

  callApi(id) {
    console.log('before days');
    this.setState({placeId: id});
    axios
      .get(
        `https://api.openweathermap.org/data/2.5/weather?id=${id}&appid=cf53893d93414d0e98cabc620021f64f&units=metric`
      )
      .then((res) => {
        const climas = res.data;
        this.setState({ temperature: Math.round(climas.main.temp) });
        this.setState({ name: climas.name });
        this.setState({ icon: climas.weather[0].icon });
        this.setState({ description: climas.weather[0].main });
      });

    axios
      .get(
        `https://api.openweathermap.org/data/2.5/forecast?id=${id}&appid=cf53893d93414d0e98cabc620021f64f&units=metric`
      )
      .then((res) => {
        const forecasted = res.data.list;
        this.setState({forecast: forecasted});
        let noon = [];
        for (let i = 0; i < forecasted.length; i++) {
          let datas = forecasted[i].dt_txt;
          if (datas.includes("12:00:00")) {
            noon.push(forecasted[i]);
          }
        }
        this.setState({ list: noon });
      });
  }

  getDays(date) {
    console.log('check days');
    this.setState({ modal : true });
    const forescastedData = this.state.forecast;
    let onlyDay = date.split(" ");
    let dayToAdd = [];
    for(let i = 0; i < forescastedData.length; i++) {
      let elmnt = forescastedData[i].dt_txt;
      console.log('this are those days: ',elmnt, onlyDay[0]);
      if(elmnt.includes(onlyDay[0])) {
        dayToAdd.push(forescastedData[i]);
        console.log('this is the day: ',dayToAdd);
      }
    }
    this.setState({hourly: dayToAdd});
    console.log(this.state.hourly)
  }

  render() {
    return (
      <div
        className={`container grid justify-items-center items-center lg:py-0 py-16 h-full ${this.state.description}`}
      >
        <div className="grid">
            <div className="flex items-center justify-center pb-6 flex-wrap md:flex-nowrap">
                <div className="text-center">
                    <p className="text-8xl font-bold px-6">{this.state.temperature}°</p>
                </div>
                <div className="md:text-left text-center">
                    <p className="text-6xl font-normal pb-1">{this.state.name}</p>
                    <p className="text-base font-light">{this.state.date}</p>
                </div>
                <div className="text-center">
                    <img
                    className="inline-block"
                    src={`http://openweathermap.org/img/wn/${this.state.icon}@2x.png`}
                    alt=" "
                    />
                    <p className="negative-transform">{this.state.description}</p>
                </div>
            </div>
            <div className="grid grid-cols-12">
                <div className="container col-start-2 col-span-10 grid grid-cols-12 xl:grid-cols-10 gap-3">
                    {
                        Object.entries(this.state.list).map((data,key) => {
                            let days = data[1].dt_txt;
                            let less = days.split(" ");
                            less = less[0].split("-");
                            return (
                                <div className="xl:col-span-2 col-span-6 md:col-span-4 rounded-md shadow-xl bg-white py-4 px-6 cursor-pointer text-center" onClick={() => {this.getDays(data[1].dt_txt)}} key={key}>
                                    <p className="text-xs">{less[2]+'/'+less[1]+'/'+less[0]}</p>
                                    <img src={`http://openweathermap.org/img/wn/${data[1].weather[0].icon}@2x.png`} alt=" " />
                                    <p className="text-4xl lg:text-4xl font-bold pt-1 negative-transform">{Math.round(data[1].main.temp)}°</p>
                                    <p className="text-sm">{data[1].weather[0].description}</p>
                                    <p className="text-sm">{data[1].main.temp_max}° / {data[1].main.temp_min}°</p>
                                </div>
                            );
                        })
                    }
                </div>
            </div>
            <div className={`fixed w-full h-full bg-black bg-opacity-70 justify-center items-center z-70 top-0 left-0 ${this.state.modal ? 'flex' : 'hidden'}`}>
              <div className="inline-block align-bottom bg-white rounded-lg max-h-screen text-left xl:overflow-hidden overflow-auto  shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                    <div className="mt-3 text-center sm:mt-0 sm:text-left grid grid-cols-12">
                      <h3 className="text-lg col-span-12 leading-6 font-bold text-blue-500 uppercase" id="modal-title">
                        Hourly Forecast
                      </h3>
                      <div className="mt-2 col-span-12">
                        <p className="text-sm text-gray-500">
                          This is the forecast for the day selected, it shows every 3 hours weather.
                        </p>
                        <div className="grid grid-cols-8 gap-3 py-4">
                          {
                            Object.entries(this.state.hourly).map((data,key) => {
                              let days = data[1].dt_txt;
                              let less = days.split(" ");
                              let hours = less[1];
                              less = less[0].split("-");
                              return (
                                  <div className="xl:col-span-2 col-span-4 md:col-span-4 rounded-xl shadow-xl bg-white py-4 px-4 text-center" key={key}>
                                      <p className="text-xs">{less[2]+'/'+less[1]+'/'+less[0]}</p>
                                      <img src={`http://openweathermap.org/img/wn/${data[1].weather[0].icon}@2x.png`} alt=" " />
                                      <p className="text-4xl lg:text-4xl font-bold pt-1 negative-transform">{Math.round(data[1].main.temp)}°</p>
                                      <p className="text-sm">{data[1].weather[0].description}</p>
                                      <p className="text-sm">{hours}</p>
                                      <p className="text-sm">{data[1].main.temp_max}° / {data[1].main.temp_min}°</p>
                                  </div>
                              );
                            })
                          }
                        </div>
                      </div>
                    </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button type="button" onClick={this.closeModal} className="text-white font-light py-1 px-3 border-b-4 mr-1 rounded bg-blue-600 text-base border-blue-800 hover:bg-blue-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm">
                    Close
                  </button>
                </div>
              </div>
            </div>
        </div>
      </div>
    );
  }
}

export default Detail;
