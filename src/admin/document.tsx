import React, { useState, useEffect } from 'react'
import './documentform.css'




const defaultImageSrc = '/img/logos.png'

var min = 1;
var max = 1000;
var rand =  min + (Math.random() * (max-min));
var auto = rand.toString();



const initialFieldValues = {
    Id:0,
    Title: '',
    CreatedDate:formatDate(new Date),
    SerialNumber:auto,
    Body: '',
    imageSrc: defaultImageSrc,
    imageFile: null,
    NumberOfCopy:0,
    IsUpdated:false,
    IsArchived:false
}



export default function Document(props:any) {
    const { addOrEdit, recordForEdit } = props  

    const [values, setValues] = useState(initialFieldValues)
    const [errors, setErrors] = useState({})

    useEffect(() => {
        if (recordForEdit != null)
        {
            const documentDTO={
                Id:recordForEdit.id,
                Title: recordForEdit.title,
                CreatedDate:recordForEdit.createdDate,
                SerialNumber:recordForEdit.serialNumber,
                Body: recordForEdit.body,
                imageSrc: recordForEdit.logo,
                imageFile: recordForEdit.logo,
                NumberOfCopy:recordForEdit.numberOfCopy,
                IsUpdated:recordForEdit.isUpdated,
                IsArchived:recordForEdit.isArchived
            }
            setValues(documentDTO);
            console.log(recordForEdit)
        }

    }, [recordForEdit])

    const validate = () => {
        let temp = {title:values.Title == "" ? false : true,
        imageSrc:values.imageSrc == defaultImageSrc ? false : true}
        
        setErrors(temp)
        return Object.values(temp).every(x => x == true)
    }

    //const applyErrorClass = field => ((field in errors && errors[field] == false) ? ' invalid-field' : '')
 
    const resetForm = () => {
        setValues(initialFieldValues)
        //const elem: HTMLInputElement =<HTMLInputElement>document.getElementById('image-uploader')</HTMLInputElement>;
        //document.getElementById('image-uploader')!.value = null;
        setErrors({})
    }

    const handleFormSubmit = (e: { preventDefault: () => void }) => {
        e.preventDefault()
        if (validate()) {
            
            const formData = new FormData()
            formData.append('Id',values.Id.toString())
            formData.append('Logo', values.imageFile!)
            formData.append('Title', values.Title)
            formData.append('SerialNumber', values.SerialNumber)
            formData.append('CreatedDate', values.CreatedDate)
            formData.append('Body',values.Body)
            formData.append('NumberOfCopy',values.NumberOfCopy.toString())
            formData.append('IsUpdated',values.IsUpdated.toString())
            formData.append('IsArchived',values.IsArchived.toString())
            
            addOrEdit(formData, resetForm)
        }
    } 
    const handleInputChange = (e: { target: { name: any; value: any } }) => {
        const { name, value } = e.target;
        setValues({
            ...values,
            [name]: value
        })
    }
    const showPreview = (e:any) => {
        if (e.target.files && e.target.files[0]) {
            let imageFile = e.target.files[0];
            const reader = new FileReader();
            reader.onload = x => {
                setValues({
                    ...values,
                    imageFile,
                    imageSrc: x.target!.result!.toString()
                })
            }
            reader.readAsDataURL(imageFile)
        }
        else {
            setValues({
                ...values,
                imageFile: null,
                imageSrc: defaultImageSrc
            })
        }
    }

    return (
        <>
        <form autoComplete="off" noValidate onSubmit={handleFormSubmit}>
        <div className='main'> 
        <div className="div2">  
        <div> <img src={values.imageSrc} className="item1" alt='Nooo' /></div> 
        <div className="form-group  items2">
                        <input type="file" accept="image/*" className={"form-control-file+ applyErrorClass('imageSrc')"}
                            onChange={showPreview} id="image-uploader" />
                    </div>
                     </div>
        
  <div className="div3">
       <div className="form-group">
                        <input className={"form-control" } placeholder="Title here" name="Title"
                            value={values.Title}
                            onChange={handleInputChange} />
                    </div> 
                    </div>
  <div className="div4"> 
  <div className="form-group gap-3 cont" >
                        <input className={"form-control" } placeholder="Serial Number" name="SerialNumber"
                            value={values.SerialNumber}
                            onChange={handleInputChange} />
                    </div>

                    <div className="form-group">
                    <input  className="form-control" type="date" name="CreatedDate" placeholder="Date here"
                    value={values.CreatedDate}
                    onChange={handleInputChange}  />
                    </div>
  
  </div>
  
  <div className="div6"> <div className="form-group">
  
<textarea className="form-control" name='Body' id="exampleFormControlTextarea1" rows={11}
placeholder="Body Here..."
value={values.Body}

onChange={handleInputChange}
></textarea>
</div>
        
 </div>
  <div className="div7">
  <div className="form-group text-center">
                        <button type="submit" className="btn btn-success">Save</button>
                    </div>
  </div>
  </div>
  </form>
    </>
    )
}



function formatDate(date: Date){
    date = new Date(date);
    const format = new Intl.DateTimeFormat("en", {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    });

    const [
        {value: month},,
        {value: day},,
        {value: year}
    ] = format.formatToParts(date);

    return `${year}-${month}-${day}`;
}