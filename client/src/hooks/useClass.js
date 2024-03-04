import { instance } from "./axiosInstance";

export async function getTeacherClasses(email) {
  return await instance
    .get(`/classes/${email}`)
    .then((response) => response.data)
    .catch((error) => console.error("Error al obtener clases:", error));
}

export async function createClass(name, teacherEmail, fileData) {
  return await instance
    .post("/classes", { name, teacherEmail, fileData })
    .then((response) => response.data)
    .catch((error) => console.error("Error al crear clase:", error));
}

export async function getClassStudents(classId) {
  return await instance
    .get(`/classes/${classId}/students`)
    .then((response) => response.data)
    .catch((error) =>
      console.error("Error al obtener estudiantes de la clase:", error)
    );
}

export async function getClassAverageScore(classId) {
  return await instance
    .get(`/classes/${classId}/average`)
    .then((response) => response.data)
    .catch((error) =>
      console.error("Error al obtener el promedio de la clase:", error)
    );
}
