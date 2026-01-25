// Stub assessment types for ConnectPay
export interface DomainObject {
  _id: string;
  title: string;
  url?: string;
  date?: string;
  name?: string;
  status?: string;
}

export interface AssessmentsData {
  exams?: any[];
}

export enum EAssessmentFeature {
  facial = "facial",
  // Add other assessment features here
}