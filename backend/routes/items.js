const express = require('express');
const router = express.Router();
const db = require('../db');

/* GET bills list. */
router.get('/myitems', function(req, res) {
      db.query("SELECT * FROM items",(err,row)=>{
        if(err) res.send({success:false,message:"Error"})
        else if(row.length>0){
        res.send({success:true,data:row,message:"Success"})
        } else{
          res.send({success:false,message:"No data found!"})
        }
      });
});

router.post('/addItem', function(req, res) {
  const data = req.body;
  const item = {
    item_name: data.item_name,
    item_price: data.item_price
  }
  db.query("SELECT * FROM items WHERE item_name=?",[item.item_name],(err,rows)=>{
    if(err) res.send({success: false,message:err});
    else if(rows.length>0){
      res.send({success:false,message:"Item with the same name already exists"});
    } else{
      db.query("INSERT INTO items SET ?",[item],(err,row)=>{
        if(err) res.send({success:false,message:err});
        else res.send({success:true,message:"New Item Created Successfully!"});
      });
  }
  })
});

module.exports = router;
