import {documentCreationDTO} from './documents.model'


export default function convertDocumentToFormData(document: documentCreationDTO): FormData{
    const formData = new FormData();

    if (document.picture){
        formData.append('picture', document.picture);
    }

    formData.append('title', document.title);

    if (document.serialNumber){
        formData.append('serialNumber', document.serialNumber);
    }

    if (document.body){
        formData.append('body', document.body);
    }

    if (document.createdDate){
        formData.append('createdDate', formatDate(document.createdDate))
    }
    
    
    return formData;
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