import React, { Component } from 'react'
import {siteURL} from '../siteURL';
class Items extends Component {
    constructor(props){
        super(props);
        this.state={
            items:[],
            name:"",
            price:"",
            errors:"",
            error:"",
            formSubmitted: false,
            success:false
        }
    }
    componentDidMount(){
        this.fetchItems();
    }
    componentDidUpdate(){
        if(this.props.refreshPage==="true"){
        this.fetchItems()
        }
    }
    fetchItems=()=>{
        fetch(siteURL+"/api/items/myitems")
        .then(res=>res.json())
        .then(data=>{
            if(data.success){
            this.setState({items:data.data,error:""})
            } else{
                this.setState({error:data.message});
            }
        });
    }
    addItem=()=>{
        this.setState({formSubmitted:true});
        if(this.state.name!=="" && this.state.price>0){
        let item={item_name:this.state.name,item_price:this.state.price};
        fetch(siteURL+"/api/items/addItem",{
            method:"POST",
            body: JSON.stringify(item),
            headers:{
                'Content-Type':'application/json'
            }
        })
        .then(res=>res.json())
        .then(data=>{
            if(data.success===false){
                this.setState({errors:data.message});
            } else{
                this.setState({success:true});
                setTimeout(() => {
                    this.setState({success:false});
                }, 3000);
                document.getElementById("closeModal").click();
                this.fetchItems();
                this.props.onUpdate();
                this.clearForm();
            }
        });
        }
    }
    clearForm(){
        this.setState({name:"",price:"",formSubmitted:false,error:"",errors:""})
    }
    render() {
        return (
            <div className="col-md-12 border shadow" style={{height:400}}>
                <h4>Items</h4>
                <div style={{height:300,overflow:"auto"}}>
                    {this.state.error && <h5 className="text-info">{this.state.error}</h5>}
                    {this.state.items.map(item=>(
                    <p className="border p-1 m-1" key={item.id}>{item.item_name}  <b className="float-right">Rs. {item.item_price}</b><br/>
                    Sold: {item.item_sold}</p>
                    ))}
                </div>
                <div><button className="text-white float-right" data-toggle="modal" data-target="#exampleModal" style={{width:40,height:40,borderRadius:"100px",backgroundColor:"skyblue",border:0}}>+</button></div>
                {/* add item dialog */}
                <div className="modal fade" id="exampleModal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="exampleModalLabel">Add Item</h5>
                        <button type="button" id="closeModal" onClick={()=>this.clearForm()} className="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div className="modal-body">
                            <input type="text" placeholder="Name" value={this.state.name} onChange={(e)=>this.setState({name:e.target.value})} className="form-control form-control-sm"/>
                            {this.state.formSubmitted && this.state.name==="" && <span className="text-danger">Item Name cannot be empty</span>}
                            <br/>
                            <input type="number" placeholder="Price" value={this.state.price} onChange={(e)=>this.setState({price:e.target.value})} className="form-control form-control-sm"/>
                            {this.state.formSubmitted &&  this.state.price<1 && <span className="text-danger">Price cannot be less than 1</span>}
                            {this.state.formSubmitted &&  this.state.errors && <span className="text-danger">{this.state.errors}</span>}
                    </div>
                    <div className="modal-footer justify-content-center">
                        <button type="button" onClick={()=>this.addItem()} className="btn btn-primary pl-4 pr-4">Add</button>
                    </div>
                    </div>
                </div>
                </div>
                {this.state.success && <div className="alert alert-success alert-dismissible fade show" role="alert" style={{position:"fixed",top:0,right:0,width:"100%"}}>
                New Item Created Successfully
                <button type="button" className="close" data-dismiss="alert" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
                </div>}

            </div>
        )
    }
}

export default Items
