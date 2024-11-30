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

const renderCourses = (filteredCourses = data.courses) => {
	coursesList.innerHTML = "";
	filteredCourses.forEach((course) => {
		const courseCard = document.createElement("a");
		courseCard.className = "course-card";
		courseCard.href = `course.html?id=${course.id}`;
		courseCard.innerHTML = `
		<p class="course-id">${course.id}</p>
		<h3>${course.name}</h3>
		<p>Total Students: ${course.students.length}</p>
		<span>View details</span>
	  `;
		coursesList.appendChild(courseCard);
	});
	saveData();
};

const renderStudents = (filteredStudents = data.students) => {
	const studentsList = document.getElementById("studentsList");
	studentsList.innerHTML = "";
	filteredStudents.forEach((student) => {
		const studentCard = document.createElement("a");
		studentCard.className = "student-card";
		studentCard.href = `student.html?id=${student.id}`;
		studentCard.innerHTML = `
		<h3>${student.name}</h3>
		<p>ID: ${student.id}</p>
		<span>View Profile</span>
	  `;
		studentsList.appendChild(studentCard);
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

const toggleGradeInputs = (show) => {
	const gradeInputs = document.querySelectorAll(
		"#studentMidterm, #studentFinal"
	);
	gradeInputs.forEach((input) => {
		input.style.display = show ? "block" : "none";
	});
};

// Event Listeners
addCourseBtn.addEventListener("click", () => openModal(courseModal));
addStudentBtn.addEventListener("click", () => {
	populateCourseSelect();
	openModal(studentModal);
	toggleGradeInputs(false);
});

courseSelect.addEventListener("change", (e) => {
	toggleGradeInputs(e.target.value !== "");
});

courseForm.addEventListener("submit", (e) => {
	e.preventDefault();
	const courseID = document.getElementById("courseID").value;
	const courseName = document.getElementById("courseName").value;
	const courseDescription = document.getElementById("courseDescription").value;
	const gradingScale = document.getElementById("gradingScale").value;

	let course = data.courses.find((c) => c.id === courseID);

	if (course) {
		alert("A course with this ID already exists.");
		return;
	}

	const newCourse = {
		id: courseID,
		name: courseName,
		description: courseDescription,
		gradingScale: gradingScale,
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
	const selectedCourse = courseSelect.value;
	const studentMidterm = selectedCourse
		? parseFloat(document.getElementById("studentMidterm").value)
		: null;
	const studentFinal = selectedCourse
		? parseFloat(document.getElementById("studentFinal").value)
		: null;

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

	let student = data.students.find((s) => s.id === studentID);

	if (student) {
		alert("A student with this ID already exists.");
		return;
	}

	student = {
		id: studentID,
		name: studentName,
		midterm: studentMidterm,
		final: studentFinal,
		courses: [],
	};
	data.students.push(student);

	if (selectedCourse) {
		const course = data.courses.find((c) => c.id === selectedCourse);
		if (!course.students.some((s) => s.id === studentID)) {
			course.students.push(student);
		}
		if (!student.courses.includes(course.id)) {
			student.courses.push(course.id);
		}
	}

	renderCourses();
	closeModal(studentModal);
	saveData();
});

searchBar.addEventListener("input", (e) => {
	const query = e.target.value.toLowerCase();
	const filteredCourses = data.courses.filter(
		(course) =>
			course.name.toLowerCase().includes(query) ||
			course.id.toLowerCase().includes(query)
	);
	const filteredStudents = data.students.filter(
		(student) =>
			student.name.toLowerCase().includes(query) ||
			student.id.toLowerCase().includes(query)
	);
	renderCourses(filteredCourses);
	renderStudents(filteredStudents);
});

// Initialize
renderCourses();
renderStudents();
