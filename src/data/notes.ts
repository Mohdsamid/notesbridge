export const subjects = ["DSA", "DBMS", "Java", "Operating Systems", "Computer Networks", "Web Development"];
export const semesters = ["Sem 1", "Sem 2", "Sem 3", "Sem 4", "Sem 5", "Sem 6"];

export type Note = {
  id: string;
  title: string;
  subject: string;
  semester: string;
  description: string | null;
  file_path: string;
  file_name: string;
  file_size: number;
  downloads: number;
  user_id: string;
  created_at: string;
};
