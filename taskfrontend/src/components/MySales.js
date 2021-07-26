import React, { Component } from 'react'
import {siteURL} from '../siteURL';
class MySales extends Component {
    constructor(props){
        super(props);
        this.state={
            error:"",
            sales:{}
        }
    }
    componentDidMount(){
        this.fetchSales();
    }
    componentDidUpdate(){
        if(this.props.refreshPage==="true"){
            this.fetchSales();
        }
    }
    fetchSales(){
        fetch(siteURL+'/api/bills/sales')
            .then(res=>res.json())
            .then(data=>{
                if(data.success){
                    this.setState({sales:data.data})
                } else{
                    this.setState({error:data.message});
                }
            });
    }
    render() {
        return (
            <div className="col-md-12 border shadow p-3" style={{height:400}}>
                <h4>Sales</h4>
                {Object.values(this.state.sales).length===0 && <h5 className="text-info">No Sales Created Yet</h5>}
                {Object.values(this.state.sales).length>0 &&
                <div className="row justify-content-center">
                <div className="col-md-3 border p-3 m-3 text-center">
                    <h3>Rs. {this.state.sales.today}</h3>
                    <h6>Today</h6>
                </div>
                <div className="col-md-3 border p-3 m-3 text-center">
                    <h3>Rs. {this.state.sales.month}</h3>
                    <h6>This Month</h6>
                </div>
                <div className="col-md-3 border p-3 m-3 text-center">
                    <h3>Rs. {this.state.sales.year}</h3>
                    <h6>This Year</h6>
                </div>
                </div>
        }
            </div>
        )
    }
}

export default MySales
