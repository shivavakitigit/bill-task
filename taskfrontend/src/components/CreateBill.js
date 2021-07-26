import React, { Component } from 'react'
import {siteURL} from '../siteURL';
class CreateBill extends Component {
    constructor(props){
        super(props);
        this.state={
            items:[],
            itemsInBill:[],
            name:"",
            quantity:"",
            totalSum: 0,
            formSubmitted: false,
            success:false,
            error:"",
        }
    }
    componentDidMount(){
        this.fetchItems();
        this.fetchItemsInBill();
    }
    componentDidUpdate(){
        if(this.props.refreshPage==="true")
        {
            this.fetchItems();
        }
    }
    fetchItemsInBill(){
        let billedItems = JSON.parse(localStorage.getItem("billItems"));
        if(billedItems!==null){
            this.setState({itemsInBill:billedItems});
            let totalSum=0;
            billedItems.forEach(item=>{
                totalSum+=item.item_price;
            });
            this.setState({totalSum})
        }else{
            this.setState({itemsInBill:[]});
        }
    }
    fetchItems=()=>{
        fetch(siteURL+"/api/items/myitems")
        .then(res=>res.json())
        .then(data=>{
            if(data.success){
            this.setState({items:data.data});
            }
        });
    }
    addToBill=()=>{
        this.setState({formSubmitted:true});
        if(this.state.name!=="" && this.state.quantity>0){
        let billedItems = JSON.parse(localStorage.getItem("billItems"));
        let item_price = this.state.items.filter(item=>item.item_name===this.state.name)[0]['item_price'];
        let item_id = this.state.items.filter(item=>item.item_name===this.state.name)[0]['id'];
        let item={item_id,item_name:this.state.name,item_price:item_price*this.state.quantity,item_quantity:this.state.quantity};
        let billedData=[];
        if(billedItems!==null){
            // Update
            billedItems.forEach(billItem=>{
                if(billItem.item_name!==this.state.name){
                billedData.push(billItem);
                }
            });
            billedData.push(item);
            localStorage.setItem("billItems",JSON.stringify(billedData));
        } else{
            // Add
            billedData.push(item);
            localStorage.setItem("billItems",JSON.stringify(billedData));
        }
        this.clearForm();
        document.getElementById("closeModal2").click();
        this.fetchItemsInBill();
        }
    }
    clearForm(){
        this.setState({name:"",quantity:"",formSubmitted:false});
    }
    checkOut(){
        let data = JSON.parse(localStorage.getItem("billItems"));
        let bill = {amount:this.state.totalSum,items:data}
        fetch(siteURL+'/api/bills/createBill',{
            method:"POST",
            body: JSON.stringify(bill),
            headers:{
                'Content-Type':'application/json'
            }
        })
        .then(res=>res.json())
        .then(data=>{
            if(data.success){
                localStorage.clear();
                this.setState({success:true})
                setTimeout(() => {
                    this.setState({success:false});
                }, 3000);
                this.fetchItemsInBill();
                this.props.onUpdate();
            } else{
                this.setState({error:data.message});
            }
        });
    }
    render() {
        return (
            <div className="col-md-12 border shadow" style={{height:400}}>
                <h4>New Bill 
                    <p className="float-right" style={{fontSize:16,color:"skyblue"}}>Cart <span className="badge badge-danger badge-pill">{this.state.itemsInBill.length}</span> 
                    &nbsp;&nbsp;&nbsp;<span style={{fontSize:20,cursor:"pointer"}} data-toggle="modal" data-target="#exampleModal2">+</span></p>
                </h4>
                {this.state.itemsInBill.length===0 && <h5 className="text-info">Create New Bill by clicking on + Icon on top right corner.</h5>}
                <div style={{width:'100%',height: 250,overflow: "auto"}}>
                    {this.state.itemsInBill && this.state.itemsInBill.map(item=>(
                <p className="border p-1 m-1" key={item.item_id}>{item.item_name}  <b className="float-right">Rs. {item.item_price}</b><br/>
                Quantity: {item.item_quantity}</p>
                    ))}
                </div>
                {this.state.itemsInBill.length>0 && 
                <div>
                <div className="p-2">
                    <h5>Amount: Rs.{this.state.totalSum}
                    <p className="float-right">Total Items: {this.state.itemsInBill.length}</p>
                    </h5>
                </div>
                <div>
                    <span className="text-danger">{this.state.error}</span>
                    <button className="btn btn-primary float-right" onClick={()=>this.checkOut()}>Check Out</button>
                </div>
                </div>
                }

                {/* select item dialog */}
                <div className="modal fade" id="exampleModal2" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="exampleModalLabel">Select Item</h5>
                        <button type="button" id="closeModal2" onClick={()=>this.clearForm()} className="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div className="modal-body">
                            <select className="form-control form-control-sm" value={this.state.name} onChange={e=>this.setState({name:e.target.value})}>
                                <option value="" defaultValue>Select Item</option>
                                {this.state.items && this.state.items.map(item=>(
                                    <option value={item.item_name} key={item.id}>{item.item_name}</option>
                                ))}
                                </select>
                                {this.state.formSubmitted && this.state.name==="" && <span className="text-danger">Please select item</span>}
                            <br/>
                            <input type="number" placeholder="Quantity" className="form-control form-control-sm"  value={this.state.quantity} onChange={e=>this.setState({quantity:e.target.value})}/>
                            {this.state.formSubmitted && this.state.quantity<1 && <span className="text-danger">Quantity cannot be less than 1</span>}
                    </div>
                    <div className="modal-footer">
                        <button type="button" onClick={()=>this.addToBill()} className="btn btn-primary pl-4 pr-4">Add</button>
                    </div>
                    </div>
                </div>
                </div>

                {this.state.success && <div className="alert alert-success alert-dismissible fade show" role="alert" style={{position:"fixed",top:0,right:0,width:"100%"}}>
                Bill Generate Successfully!
                <button type="button" className="close" data-dismiss="alert" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
                </div>}
            </div>
        )
    }
}

export default CreateBill
