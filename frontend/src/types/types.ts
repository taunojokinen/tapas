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

  export interface MyObjective {
    nimi: string;
    mittari: string;
    seuranta: string;
  } 

  export interface MyTask {
    nimi: string;
    mittari: string;
    seuranta: string;
  } 
  export interface MyObjectivesJson {
    user: string;
    title: string;
    date: string;
    mission: string;
    objectives: MyObjective[];
    tasks: MyTask[];
    hindrances: string[];
    promoters: string[];
  } 