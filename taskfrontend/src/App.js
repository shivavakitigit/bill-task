import {useState,useEffect} from 'react';
import CreateBill from './components/CreateBill';
import Items from './components/Items';
import MyBills from './components/MyBills';
import MySales from './components/MySales';

function App() {
  const [update,setUpdate]=useState("false");
  const [updateitems,setUpdateitems]=useState("false");
  useEffect(() => {
    return () => {
      // console.log("Refresh Page");
      setUpdate("false");
      setUpdateitems("false");
    }
  }, [update,updateitems])

  return (
    <div>
      <div className="row m-3 justify-content-center">
        <div className="col-md-6">
      <CreateBill onUpdate={()=>setUpdate("true")} refreshPage={updateitems}/>
      </div>
      <div className="col-md-6">
      <Items onUpdate={()=>setUpdateitems("true")} refreshPage={update}  />
      </div>
      </div>
      <div className="row m-3 justify-content-center">
      <div className="col-md-6">
      <MyBills refreshPage={update}/>
      </div>
      <div className="col-md-6">
      <MySales refreshPage={update}/>
      </div>
      </div>
    </div>
  );
}

export default App;
