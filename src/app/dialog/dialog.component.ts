import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup,FormBuilder,Validators } from '@angular/forms';
import { ApiService } from '../services/api.service';
import { MatDialogRef ,MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent implements OnInit {
  freshnessList = ['Brand New','Second Hand','Refurbished']
  actionBtn:string = 'Save';
  constructor(private FormBuilder:FormBuilder,
    private api:ApiService,
    @Inject(MAT_DIALOG_DATA) public editData:any,
    private dialogRef:MatDialogRef<DialogComponent>) { }
  ProductForm!:FormGroup;
  ngOnInit(): void {
    this.ProductForm = this.FormBuilder.group({
      productName :['',Validators.required],
      price:['',Validators.required],
      category:['',Validators.required],
      comment:['',Validators.required],
      date:['',Validators.required],
      freshness:['',Validators.required]
    })
    if(this.editData){
      this.actionBtn = "Update";
      this.ProductForm.controls['productName'].setValue(this.editData.productName);
      this.ProductForm.controls['price'].setValue(this.editData.price);
      this.ProductForm.controls['category'].setValue(this.editData.category);
      this.ProductForm.controls['comment'].setValue(this.editData.comment);
      this.ProductForm.controls['date'].setValue(this.editData.date);
      this.ProductForm.controls['freshness'].setValue(this.editData.freshness);
    }
  }
  addproduct(){
    if(!this.editData){
      if(this.ProductForm.valid){
        this.api.postProduct(this.ProductForm.value)
        .subscribe({
          next: res => {
            this.ProductForm.reset();
            this.dialogRef.close('save');
          },
          error:err=>{
            alert(' Save failed');
          }
        })
      }
  }else{
    this.editProduct();
  }
  }
  editProduct(){
    this.api.putProduct(this.ProductForm.value,this.editData.id)
    .subscribe({
      next: res => {
        this.ProductForm.reset();
        this.dialogRef.close('update');
      },
      error:err=>{
        alert('Update failed');
      }
    })
  }

}
