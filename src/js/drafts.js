import transactions from '../json/transactions.json';

transactions.forEach(item => {
  const data = Object.entries(item);
  const keyArr = [];
  data.forEach(([key, value]) => {
    if (key !== 'id' && !keyArr.includes(key)) {
      keyArr.push(key);
    }
  });
  console.log(keyArr);
  for (let index = 0; index < keyArr.length; index++) {
    const element = keyArr[index];
    console.log(element);
  }
});

// Фильтрация уникальных элементов

// const students = [
//   { name: "Манго", courses: ["математика", "физика"] },
//   { name: "Поли", courses: ["информатика", "математика"] },
//   { name: "Киви", courses: ["физика", "биология"] },
// ];

// const allCourses = students.flatMap(student => student.courses);
// // ['математика', 'физика', 'информатика', 'математика', 'физика', 'биология'];
// const uniqueCourses = allCourses.filter(
//   (course, index, array) => array.indexOf(course) === index
// );
