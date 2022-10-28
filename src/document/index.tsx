import React from 'react';
import './document.css'
import { useState, useEffect ,useContext} from 'react'
import Document from './document';
import axios, { AxiosResponse } from "axios";
import Authorized from '../auth/Authorized';
import {urlDocuments} from '../endpoints';
import {ScrollbarWrapper} from "./styles"
import { List, ListItem } from '@material-ui/core';
import { Field, Form, Formik } from "formik"
import AlertContext from '../utils/AlertContext';
import useStyles from "./muistyles";
import AuthenticationContext from '../auth/AuthenticationContext'
import Button from '../auth/forms/Button';
import { documentDTO } from './documents.model';
import customConfirm from '../utils/customConfirm';
import NoteAddIcon from '@material-ui/icons/NoteAdd';
import { Modal } from 'react-bootstrap'

export default function IndexDocument() {

  const [documentList, setdocumentList] = useState([])
    const [recordForEdit, setRecordForEdit] = useState(null)
    const customAlert = useContext(AlertContext);
    const classes = useStyles();
    const {update, claims} = useContext(AuthenticationContext);
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const initialValues: filterDocumentsForm = {
      title: '',
      email:getUserEmail()
  }
    function getUserEmail(): string {
        return claims.filter(x => x.name === "email")[0]?.value;
    }

    useEffect(() => {
        refreshDocumentList();
    }, [])

    function searchDocuments(values: filterDocumentsForm) {
      
      axios.get(`${urlDocuments}/filter`, {params: values})
          .then((res => {
            setdocumentList(res.data)
            
            
        }))
  }

const headers = { 
        'Content-Type': 'multipart/form-data' ,
        'Accept':'application/json'
    };
  const documentAPI = (url = urlDocuments) => {

               return {
            fetchAll: () => axios.get(url, {
              headers : { 
                'Content-Type': 'application/json',
                'Accept': 'application/json'
               }}),
            create: (newRecord: any) => axios.post(url, newRecord),
            update: (id: string, updatedRecord: any) => axios.put(`${url}/${id}`, updatedRecord),
            delete: (id: number) => axios.delete(`${url}/${id}`)
        }
    }

  const addOrEdit = (formData: { get: (arg0: string) => string; }, onSuccess: () => void) => {
    if (formData.get('Id') == "0")
    
    documentAPI().create(formData)
            .then(res => {
                onSuccess(); 
                refreshDocumentList();
            })
            .catch(err => console.log(err))
    else
    documentAPI().update(formData.get('Id'), formData)
            .then(res => {
                onSuccess();
                refreshDocumentList();
            })
            .catch(err => console.log(err))

}
function refreshDocumentList() {
    documentAPI().fetchAll()
      .then(res => {
          setdocumentList(res.data)
      })
      .catch(err => console.log(err))
}

const showRecordDetails = (data:any): void => {
  setRecordForEdit(data)
  
  
}


const onDelete = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, id: number): void => {
  
  console.log(id)
  documentAPI().delete(id)
          .then(res =>{ refreshDocumentList();
          customAlert();})
          .catch(err => console.log(err))
}



const imageCard = (data:any)=> (
  <div className="card bg-gradient-light" >
      <img src={data.logo} className="card-img-top rectangle w-25" />
      <h2 className="text-center">{data.title}</h2>
      <hr></hr>
      <div className="card-body ">
          
          <span>{data.body.substring(0, 35)}...</span> <br /><br />
          <Button
                onClick={() => customConfirm((e: any) => onDelete(e,parseInt(data.id)))}
                className="btn btn-danger ms-4"
                >Delete</Button>

                 <Button
                onClick={() => { showRecordDetails(data) }}
                className="btn btn-info ms-5"
                >View</Button>
      </div>
  </div>
)


  return <div className='Container'>
    <div className='Document-List'> 
    <div className="align-items-center">
            
            <Formik initialValues={initialValues}
                onSubmit={values => {searchDocuments(values);}}
            >
                {(formikProps) => (
                    <Form>
                        <div className="row gx-3 align-items-center">
                            <div className="col-auto">
                                <input type="text" className="form-control" id="title"
                                    placeholder="Title of the document"
                                    {...formikProps.getFieldProps("title")}
                                />
                            </div>
                            <div className="col-auto">
                                <Button className="btn btn-primary ms-1"
                                onClick={() => formikProps.submitForm()}
                                >Filter</Button>
                                <Button className="btn btn-success ms-1"
                                onClick={handleShow}
                                ><NoteAddIcon/>Add</Button>
                            </div>
                        </div>
                    </Form>
                )}
            </Formik>
            </div>
  <ScrollbarWrapper>  
      <div className="">
        <List >
              {
                  documentList.map((item, idx) => (
                      <ListItem key={idx}>
                          {imageCard(item)}
                      </ListItem>
                  ))
              }
        </List>
      </div>
  </ScrollbarWrapper>

</div>
    <div className='Document-Form'>
    
      <div><Document addOrEdit={addOrEdit} recordForEdit={recordForEdit} show={show} setShow={setShow}  onHide={handleClose}/></div> 
     
    </div>
    <div className='Footer'></div>
  </div>;
}


interface filterDocumentsForm {
  title: string;
   email:string;
  
}
