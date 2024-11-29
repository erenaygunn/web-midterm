// Sample data.json simulation
let data = JSON.parse(localStorage.getItem("data")) || {
	courses: [],
	students: [],
};

// DOM Elements
const searchBar = document.getElementById("searchBar");
const coursesList = document.getElementById("coursesList");
const addCourseBtn = document.getElementById("addCourseBtn");
const addStudentBtn = document.getElementById("addStudentBtn");
const courseModal = document.getElementById("courseModal");
const studentModal = document.getElementById("studentModal");
const courseForm = document.getElementById("courseForm");
const studentForm = document.getElementById("studentForm");
const courseSelect = document.getElementById("courseSelect");

// Utility Functions
const saveData = () => {
	localStorage.setItem("data", JSON.stringify(data));
};

const renderCourses = () => {
	coursesList.innerHTML = "";
	data.courses.forEach((course) => {
		const courseCard = document.createElement("a");
		courseCard.className = "course-card";
		courseCard.href = `course.html?id=${course.id}`;
		courseCard.innerHTML = `
		<h3>${course.name}</h3>
		<p>${course.description}</p>
		<p>Total Students: ${course.students.length}</p>
	  `;
		coursesList.appendChild(courseCard);
	});
	saveData();
};

const populateCourseSelect = () => {
	courseSelect.innerHTML = '<option value="">No Course</option>';
	data.courses.forEach((course) => {
		const option = document.createElement("option");
		option.value = course.id;
		option.textContent = course.name;
		courseSelect.appendChild(option);
	});
};

const openModal = (modal) => modal.classList.toggle("hidden");
const closeModal = (modal) => modal.classList.add("hidden");

// Event Listeners
addCourseBtn.addEventListener("click", () => openModal(courseModal));
addStudentBtn.addEventListener("click", () => {
	populateCourseSelect();
	openModal(studentModal);
});

courseForm.addEventListener("submit", (e) => {
	e.preventDefault();
	const newCourse = {
		id: document.getElementById("courseID").value,
		name: document.getElementById("courseName").value,
		description: document.getElementById("courseDescription").value,
		gradingScale: document.getElementById("gradingScale").value,
		students: [],
	};
	data.courses.push(newCourse);
	renderCourses();
	closeModal(courseModal);
	saveData();
});

studentForm.addEventListener("submit", (e) => {
	e.preventDefault();
	const studentID = document.getElementById("studentID").value;
	const studentName = document.getElementById("studentName").value;
	let studentMidterm = parseFloat(
		document.getElementById("studentMidterm").value
	);
	let studentFinal = parseFloat(document.getElementById("studentFinal").value);

	if (studentMidterm < 0 || studentMidterm > 100 || isNaN(studentMidterm)) {
		alert("Midterm grade must be between 0 and 100.");
		return;
	}
	if (studentFinal < 0 || studentFinal > 100 || isNaN(studentFinal)) {
		alert("Final grade must be between 0 and 100.");
		return;
	}

	studentMidterm = Math.min(100, Math.max(0, studentMidterm));
	studentFinal = Math.min(100, Math.max(0, studentFinal));

	const selectedCourse = courseSelect.value;

	const newStudent = {
		id: studentID,
		name: studentName,
		midterm: studentMidterm,
		final: studentFinal,
		courses: [],
	};

	if (selectedCourse) {
		const course = data.courses.find((c) => c.id === selectedCourse);
		course.students.push(newStudent);
		newStudent.courses.push(course.id);
	}
	data.students.push(newStudent);
	renderCourses();
	closeModal(studentModal);
	saveData();
});

// Initialize
renderCourses();
