import React from 'react';
import ListTask from './Component/ListTask'
import Header from './Component/Header'
import AddTask from './Component/AddTask'
import io from 'socket.io-client/dist/socket.io';
import './asset/css/bootstrap.min.css';
import './asset/css/App.css';
import Loading from './Component/Loading'
const connectionConfig = {
  jsonp: false,
  reconnection: true,
  reconnectionDelay: 100,
  reconnectionAttempts: 100000
};
const socket = io('https://todolist.mumoinhat.net/',connectionConfig);

function App() {
  const [Data, changeData] = React.useState([]);
  const [DisplayLoading, changeDisplayLoading] = React.useState('none');
  const [FormType, changeFormType] = React.useState('Submit');
  const [FormDisplay, changeFormDisplay] = React.useState('none');
  const [FormValue, changeFormValue] = React.useState({});
  const [SearchValue, changeSearchValue] = React.useState('');
  const [SearchData, changeSearchData] = React.useState([]);
  const [Sort, changeSort] = React.useState('none');
  React.useEffect(()=>{
    socket.on('get-data',data=>{
      changeData([...data])
      
    })
  },[])
  React.useEffect(()=>{
    changeSearchData([...Data])
  },[Data])
  return (
    <div className="container">
        <Header/>
        <AddTask 
        Sort={Sort}
        changeSort={changeSort}
        SearchData={SearchData}
        changeSearchData={changeSearchData}
        SearchValue={SearchValue}
        changeSearchValue={changeSearchValue}
        FormValue={FormValue} 
        changeFormValue={changeFormValue} 
        FormDisplay={FormDisplay} 
        changeFormDisplay={changeFormDisplay} 
        FormType={FormType} 
        changeFormType={changeFormType} 
        socket={socket} 
        changeDisplayLoading={changeDisplayLoading} 
        Data={Data}
        changeData={changeData}/>
        <ListTask 
        SearchData={SearchData}
        changeFormDisplay={changeFormDisplay} 
        changeFormType={changeFormType} 
        changeFormValue={changeFormValue} 
        data={Data} 
        socket={socket} 
        changeDisplayLoading={changeDisplayLoading} 
        changeData={changeData}/>
        <Loading DisplayLoading={DisplayLoading}/>
    </div>
  );
}

export default App;
