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
import AuthenticationContext from '../auth/AuthenticationContext'
import Button from '../auth/forms/Button';
import { userDTO } from '../auth/auth.models';
import customConfirm from '../utils/customConfirm';
import { urlAccounts } from '../endpoints';
import { IconContext } from 'react-icons';
import { FiPlus, FiMinus } from 'react-icons/fi';
import {AccordionSection,Container,Wrap,Dropdown} from './components/Accordion'



export default function AdminIndex() {
 
  const [documentList, setdocumentList] = useState([])
    const [recordForEdit, setRecordForEdit] = useState(null)
    const customAlert = useContext(AlertContext);
    const [entities, setEntities] = useState([]);
    const {update, claims} = useContext(AuthenticationContext);
    const [users,setUsers] = useState<userDTO[]>();
    const [email,setEmail] = useState('');
    const [clicked, setClicked] = useState(false);
    
    const initialValues: filterDocumentsForm = {
      title: '',
      email:getUserEmail()
  }
    function getUserEmail(): string {
        return claims.filter(x => x.name === "email")[0]?.value;
    }

    useEffect(() => {
      
        refreshDocumentList();
        axios.get(urlAccounts)
        .then((response:AxiosResponse<userDTO[]>)=>{
          setUsers(response.data);
          
        })
          axios.get(`${urlDocuments}/filter`, {params: initialValues})
              .then((res => {
                setdocumentList(res.data)
            }))
    }, [])
   
 

  const toggle = (index: boolean | ((prevState: boolean) => boolean),emailo: React.SetStateAction<string>) => {
    setEmail(emailo)
    console.log(email)
    if (clicked === index) {
      return setClicked(false);
    }

    setClicked(index);
  };

const headers = { 
        'Content-Type': 'multipart/form-data' ,
        'Accept':'application/json'
    };
  const documentAPI = (url = urlDocuments) => {

               return {
            fetchAll: () => axios.get(`${urlDocuments}/filter`, {params: initialValues}),
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
            
            <p></p>
            </div>

            
  <ScrollbarWrapper>  
  
  <IconContext.Provider value={{ color: '#00FFB9', size: '25px' }}>
      <AccordionSection>
        <Container>
          {users?.map((item, index:any) => {
            return (
              <>
                <Wrap onClick={ () => toggle(index,item.email)} key={index}>
                  <h4>{item.email}</h4>
                  <span>{clicked === index ? <FiMinus /> : <FiPlus />}</span>
                </Wrap>
                {clicked === index ? (
                  <Dropdown>
                      <div className="col-md-12">
                        
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
                  </Dropdown>
                ) : null}
              </>
            );
          })}
        </Container>
      </AccordionSection>
    </IconContext.Provider>

    
  </ScrollbarWrapper>

</div>
    <div className='Document-Form'>
      
      <div className='w-90'><Document addOrEdit={addOrEdit} recordForEdit={recordForEdit}/></div> 
     
    </div>
    <div className='Footer'></div>
  </div>;
}


interface filterDocumentsForm {
  title: string;
   email:string;
  
}
