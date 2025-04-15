export interface RowData {
    id: number;
    tehtava: string;
    mittari: string;
    seuranta: string;
  }

 export interface Values {
    nimi: string;
    kuvaus: string;
    tärkeys?: number;
  }
  
 export interface Proposal {
    role: string;
    values:Values[]; 
  }
  