export interface RowData {
  id: number;
  tehtava: string;
  mittari: string;
  seuranta: string;
}

// interfaces for Values and Proposal
export interface Values {
  nimi: string;
  kuvaus: string;
  tärkeys?: number;
}

export interface Proposal {
  role: string;
  values: Values[];
}

// interfaces for MyObjectives

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

export interface TeamObjective {
  _id: string; // MongoDB ID for the objective
  type: string;
  nimi: string;
  mittari: string;
  seuranta: string;
  tasks: MyTask[];
  hindrances: string[];
  promoters: string[];
}

export interface Team {
  _id: string; // MongoDB ID for the team
  owner: string;
  name: string;
  type: string;
  mission: string;
  members: string[];
  teamObjectives: TeamObjective[];
}

export interface Strategia {
  tavoite: string;
  toimenpide: string;
  seuranta: "green" | "yellow" | "red";
}

export interface OsaTiedot {
  otsikko: string;
  rivit: string[];
}

export interface ProsJaCons {
  pros: string[];
  cons: string[];
}

export interface CompanyObjectives {
  perustehtava: string; 
  paamaara: string;
  avainstrategiat: Strategia[];

  nykytila: ProsJaCons[];
  createdAt: string;
  updatedAt: string;
  __v: number;
  _id: string;
}