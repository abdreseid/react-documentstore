export interface documentDTO{
    Id:number,
    UserId:string,
    Title: string,
    CreatedDate:Date,
    SerialNumber:number,
    Body: string,
    imageSrc: string,
    imageFile: null,
    NumberOfCopy:number,
    IsUpdated:boolean,
    IsArchived:boolean
}

export interface documentCreationDTO{
    
    
    picture?: File;
    pictureURL?: string;
    title: string;
    body?: string;
    createdDate?: Date;
    serialNumber: string;
}

