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
		const grade = studentCourse.midterm * 0.4 + studentCourse.final * 0.6;
		if (grade >= 90) return 4.0;
		if (grade >= 80) return 3.0;
		if (grade >= 70) return 2.0;
		if (grade >= 60) return 1.0;
		return 0.0;
	});
	const total = grades.reduce((acc, grade) => acc + grade, 0);
	return (total / grades.length).toFixed(2);
};

const calculateLetterGrade = (midterm, final) => {
	const grade = midterm * 0.4 + final * 0.6;
	if (grade >= 90) return "A";
	if (grade >= 80) return "B";
	if (grade >= 70) return "C";
	if (grade >= 60) return "D";
	return "F";
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

document.getElementById("goBackBtn").addEventListener("click", () => {
	window.history.back();
});

const renderStudentProfile = () => {
	studentName.textContent = student.name;
	studentID.textContent = student.id;
	studentGPA.textContent = calculateGPA(student);
	studentCourses.innerHTML = student.courses
		.map((courseId) => {
			const course = data.courses.find((c) => c.id === courseId);
			const studentCourse = course.students.find((s) => s.id === student.id);
			const letterGrade = calculateLetterGrade(
				studentCourse.midterm,
				studentCourse.final
			);
			return `
				<tr>
					<td>${course.name}</td>
					<td>${studentCourse.midterm}</td>
					<td>${studentCourse.final}</td>
					<td>${letterGrade}</td>
				</tr>
			`;
		})
		.join("");
};

renderStudentProfile();
