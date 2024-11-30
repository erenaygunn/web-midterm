const data = JSON.parse(localStorage.getItem("data"));
const urlParams = new URLSearchParams(window.location.search);
const studentId = urlParams.get("id");
const student = data.students.find((s) => s.id === studentId);

const studentName = document.getElementById("studentName");
const studentID = document.getElementById("studentID");
const studentGPA = document.getElementById("studentGPA");
const studentCourses = document.getElementById("studentCourses");
const deleteStudentBtn = document.getElementById("deleteStudentBtn");

const saveData = () => {
	localStorage.setItem("data", JSON.stringify(data));
};

const calculateGPA = (student) => {
	const grades = student.courses.map((courseId) => {
		const course = data.courses.find((c) => c.id === courseId);
		const studentCourse = course.students.find((s) => s.id === student.id);
		return (studentCourse.midterm * 0.4 + studentCourse.final * 0.6).toFixed(2);
	});
	const total = grades.reduce((acc, grade) => acc + parseFloat(grade), 0);
	return (total / grades.length).toFixed(2);
};

deleteStudentBtn.addEventListener("click", () => {
	if (confirm("Are you sure you want to delete this student?")) {
		data.students = data.students.filter((s) => s.id !== studentId);
		data.courses.forEach((course) => {
			course.students = course.students.filter((s) => s.id !== studentId);
		});
		saveData();
		window.location.href = "index.html";
	}
});

const renderStudentProfile = () => {
	studentName.textContent = student.name;
	studentID.textContent = student.id;
	studentGPA.textContent = calculateGPA(student);
	studentCourses.innerHTML = student.courses
		.map((courseId) => {
			const course = data.courses.find((c) => c.id === courseId);
			const studentCourse = course.students.find((s) => s.id === student.id);
			return `<li>${course.name} - Midterm: ${studentCourse.midterm}, Final: ${studentCourse.final}</li>`;
		})
		.join("");
};

renderStudentProfile();
