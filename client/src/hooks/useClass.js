import { instanceWithAuth } from "./axiosInstance";

export function getTeacherClasses(uid, token) {
  const instanceToken = instanceWithAuth(token);
  return instanceToken.get(`/classes/${uid}`).then((response) => response);
}

export async function createClass(name, uid, fileData, token) {
  const instanceToken = instanceWithAuth(token);
  return await instanceToken
    .post("/classes", { name, uid, fileData })
    .then((response) => response);
}

export function addStudentToClass(classId, studentEmail, token) {
  const instanceToken = instanceWithAuth(token);
  return instanceToken
    .post("/classes/add-student", { classId, studentEmail })
    .then((response) => response);
}

export function removeStudentFromClass(studentId, token) {
  const instanceToken = instanceWithAuth(token);
  return instanceToken
    .delete(`/classes/remove-student/${studentId}`)
    .then((response) => response.data)
    .catch((error) =>
      console.error("Error al eliminar estudiante de la clase:", error)
    );
}

export function getClassStudents(classId, token) {
  const instanceToken = instanceWithAuth(token);
  return instanceToken
    .get(`/classes/${classId}/students`)
    .then((response) => response);
}

export function getClassAverageScore(classId, token) {
  const instanceToken = instanceWithAuth(token);
  return instanceToken
    .get(`/classes/${classId}/average`)
    .then((response) => response);
}

export function getClassPercentage(classId, token) {
  const instanceToken = instanceWithAuth(token);
  return instanceToken
    .get(`/classes/${classId}/percentage`)
    .then((response) => response);
}

export function getClassName(classId, token) {
  const instanceToken = instanceWithAuth(token);
  return instanceToken
    .get(`/classes/${classId}/name`)
    .then((response) => response);
}
