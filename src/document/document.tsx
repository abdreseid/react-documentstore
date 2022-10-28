import React, { useState, useEffect } from 'react'
import './documentform.css'
import Button from '../utils/Button';
import jsPDF from "jspdf";
import RoomIcon from '@material-ui/icons/Room';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import ArchiveIcon from '@material-ui/icons/Archive';
import SaveIcon from '@material-ui/icons/Save';
import { Modal } from 'react-bootstrap'
import { urlDocuments } from '../endpoints';
import axios, { AxiosResponse } from "axios";

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
    IsArchived:true
}


export default function Document(props:any) {
    const { addOrEdit, recordForEdit,setShow,show} = props  
   
    const [values, setValues] = useState(initialFieldValues)
    const [lastvalues, setlastValues] = useState([])
    const [errors, setErrors] = useState({})
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

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


    useEffect(() => {
        axios.get(`${urlDocuments}/${333}`)
        .then((res => {
          setlastValues(res.data)
          console.log(lastvalues)
          console.log(lastvalues)
          
      }))
    },[])

    const validate = () => {
        let temp = {title:values.Title == "" ? false : true,
        imageSrc:values.imageSrc == defaultImageSrc ? false : true}
        
        setErrors(temp)
        return Object.values(temp).every(x => x == true)
    }

    function addWaterMark(doc:any) {
        var totalPages = doc.internal.getNumberOfPages();
      var i;
        for (i = 1; i <= totalPages; i++) {
          doc.setPage(i);
          //doc.addImage(imgData, 'PNG', 40, 40, 75, 75);
          doc.setTextColor(150);
          doc.text(200, doc.internal.pageSize.height/2, values.NumberOfCopy>0?"Duplicated":"Origional Copy", 'center', 45);
        }
      
        return doc;
      }
      const archiveDocument= () => {
          values.IsArchived=true;
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

    const pdfGenerate= () => {
        var doc = new jsPDF('p','px','a4',false);
        var strArr = doc.splitTextToSize(values.Body, 400)
        doc.addImage(values.imageFile!,'JPEG',25,20,110,110);
        doc.text(values.Title, 220, 120);
        doc.line(30, 120, 560, 180); // horizontal line  
        doc.setLineWidth(400);
        doc.text(values.SerialNumber, 700, 20);
        doc.text(strArr, 30, 145);
        doc = addWaterMark(doc);
        doc.save("myDocument.pdf");
        values.NumberOfCopy=values.NumberOfCopy+1;
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

<Modal show={show} onHide={handleClose} size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered>

<Modal.Header closeButton>
</Modal.Header>
<Modal.Body>
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
                        <Button className="btn btn-danger ms-5"  onClick={handleClose}>Close</Button>
                    </div>
  </div>
  </div>
  </form>
</Modal.Body>

</Modal>

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
      
  <span>{values.NumberOfCopy>0?<span>Duplicate({values.NumberOfCopy})</span>:<span>Origional Copy</span>}</span>
  <Button 
                 disabled={values.IsArchived}
                onClick={() => { archiveDocument() }}
                className="btn btn-dark ms-5"
                ><ArchiveIcon/>Archive</Button>
                <Button
                disabled={values.IsArchived}
                onClick={() => { pdfGenerate() }}
                className="btn btn-secondary ms-5 "
                ><CloudDownloadIcon/>Download</Button>
                        <button type="submit" disabled={values.IsArchived} className="btn btn-success ms-5"><SaveIcon/>Save</button>
                       
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