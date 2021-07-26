const express = require('express');
const router = express.Router();
const db = require('../db');

/* GET bills list. */
router.get('/mybills', function(req, res) {
      db.query("SELECT * FROM bills ORDER BY bill_id DESC",(err,row)=>{
        if(err) res.send({success:false,message:"Error"})
        else if(row.length>0){
        res.send({success:true,data:row,message:"Success"})
        } else{
          res.send({success:false,message:"No data found!"})
        }
      });
});
/* GET Sales list.*/
router.get('/sales', function(req, res) {
  db.query("SELECT * FROM bills",(err,row)=>{
    if(err) res.send({success:false,message:"Error"})
    else if(row.length>0){
      let today=0;
      let month=0;
      let year=0;
      row.map(data=>{
        if(new Date(data.bill_date.split(" ")[0]).getDate()===new Date().getDate()){
        today += parseFloat(data.amount);
        }
        if(new Date(data.bill_date.split(" ")[0]).getMonth()===new Date().getMonth()){
          month+=parseFloat(data.amount);
        }
        if(new Date(data.bill_date.split(" ")[0]).getFullYear()===new Date().getFullYear()){
          year+=parseFloat(data.amount);
        }
      })
    res.send({success:true,data:{today,month,year},message:"Success"})
    } else{
      res.send({success:false,message:"No data found!"})
    }
  });
});

/*Generate Bill*/
router.post('/createBill', function(req, res) {
  const data = req.body;
  const bill = {
    amount: data.amount,
    bill_date: new Date()
  }
  db.query("SELECT * FROM bills ORDER BY id DESC limit 1",(err,rows)=>{
    if(err) res.send({success: false,message:err});
    else if(rows.length>0){
      var incrementvalue = (+rows[0]['bill_id'].split("BILL")[1]) + 1;
      incrementvalue = ("0000" + incrementvalue).slice(-5);
      bill.bill_id="BILL"+incrementvalue;
      db.query("INSERT INTO bills SET ?",[bill],(err,row)=>{
        if(err) res.send({success:false,message:err});
        else {
          let items = data.items;
          var count = 0;
          let result = items.forEach(item=>{
            let itemData={
              item_name: item.item_name,
              item_sold: item.item_quantity
            }
            db.query("SELECT * FROM items WHERE item_name=?",[itemData.item_name],(errs,rows)=>{
              if(errs) res.send({success:false,message:errs});
              else if(rows.length>0){
                itemData.item_sold= parseInt(rows[0]['item_sold'])+parseInt(itemData.item_sold);
                db.query("UPDATE items SET ? WHERE item_name=?",[itemData,itemData.item_name],(err,row)=>{
                  if(err) res.send({success:false,message:err});
                  else{
                    count++;
                  }
                  if(count===data.items.length){
                    res.send({success:true,message:"New bill generated successfully!"});
                  }
                })
              } else{
                res.send({success:false,message:"Item Not found with name "+itemData.item_name});
              }
            })
          });
        }
      });
    } else{
      bill.bill_id="BILL00001";
      db.query("INSERT INTO bills SET ?",[bill],(err,row)=>{
        if(err) res.send({success:false,message:err});
        else {
          let items = data.items;
          var count = 0;
          items.forEach(item=>{
            let itemData={
              item_name: item.item_name,
              item_sold: item.item_quantity
            }
            db.query("SELECT * FROM items WHERE item_name=?",[itemData.item_name],(err,rows)=>{
              if(err) res.send({success:false,message:err});
              else if(rows.length>0){
                itemData.item_sold= parseInt(rows[0]['item_sold'])+parseInt(itemData.item_sold);
                db.query("UPDATE items SET ? WHERE item_name=?",[itemData,itemData.item_name],(err,row)=>{
                  if(err) res.send({success:false,message:err});
                  else{
                    count++;
                  }
                  if(count===data.items.length){
                    res.send({success:true,message:"New bill generated successfully!"});
                  }
                })
              } else{
                res.send({success:false,message:"Item Not found with name "+itemData.item_name});
              }
            })
          });
        }
      });
      }
  })
});

module.exports = router;
