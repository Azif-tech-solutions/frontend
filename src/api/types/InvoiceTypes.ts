

export interface state{
    code:string;
    stateCode?:string;//state code is returned for lga objects to refernet the state the lga belongs to
    name:string;

}

export interface StateListResponse{
    data:state[];
}



