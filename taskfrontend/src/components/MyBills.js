import React, { Component } from 'react'
import {siteURL} from '../siteURL';
import moment from 'moment';
class MyBills extends Component {
    constructor(props){
        super(props);
        this.state={
            error:"",
            bills:[]
        }
    }
    componentDidMount(){
        this.fetchBills();
    }
    componentDidUpdate(){
        if(this.props.refreshPage==="true"){
            this.fetchBills();
        }
    }
    fetchBills(){
        fetch(siteURL+'/api/bills/mybills')
            .then(res=>res.json())
            .then(data=>{
                if(data.success){
                    this.setState({bills:data.data})
                } else{
                    this.setState({error:data.message});
                }
            });
    }
    render() {
        return (
            <div className="col-md-12 border shadow" style={{height:400}}>
                <h4>My Bills</h4>
                {this.state.bills.length===0 && <h5 className="text-info">No Bills Generated Yet</h5>}
                {this.state.bills.length>0 &&
                <div style={{height:320,overflow:"auto"}}>
                {this.state.bills && this.state.bills.map(bill=>(
                    <p className="border p-1 m-1" key={bill.id}>{bill.bill_id}  <b className="float-right">Rs. {bill.amount}</b><br/>
                    {moment(bill.bill_date).format("DD/MM/YYYY")}</p>
                ))}
                </div>
                }
            </div>
        )
    }
}

export default MyBills
