import { instance } from "./axiosInstance";

export async function getTeacherClasses(email) {
  return await instance.get(`/classes/${email}`).then((response) => response);
}

export async function createClass(name, teacherEmail, fileData) {
  return await instance
    .post("/classes", { name, teacherEmail, fileData })
    .then((response) => response);
}

export async function addStudentToClass(classId, studentEmail) {
  return await instance
    .post("/classes/add-student", { classId, studentEmail })
    .then((response) => response.data)
    .catch((error) =>
      console.error("Error al añadir estudiante a la clase:", error)
    );
}

export async function removeStudentFromClass(studentId) {
  return await instance
    .delete(`/classes/remove-student/${studentId}`)
    .then((response) => response.data)
    .catch((error) =>
      console.error("Error al remover estudiante de la clase:", error)
    );
}

export function getClassStudents(classId) {
  return instance
    .get(`/classes/${classId}/students`)
    .then((response) => response);
}

export function getClassAverageScore(classId) {
  return instance
    .get(`/classes/${classId}/average`)
    .then((response) => response);
}

export function getClassPercentage(classId) {
  return instance
    .get(`/classes/${classId}/percentage`)
    .then((response) => response);
}

export function getClassName(classId) {
  return instance.get(`/classes/${classId}/name`).then((response) => response);
}
