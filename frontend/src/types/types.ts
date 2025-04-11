export interface RowData {
    id: number;
    tehtava: string;
    mittari: string;
    seuranta: string;
  }

 export interface Values {
    tärkeys: number;
    nimi: string;
    kuvaus: string;
  }
  
 export interface Proposal {
    nimi: string;
    kuvaus: string;
    role?: string; // Optional because initial proposals may not have a role
  }
  