const data = JSON.parse(localStorage.getItem("data"));
const urlParams = new URLSearchParams(window.location.search);
const courseId = urlParams.get("id");
const course = data.courses.find((c) => c.id === courseId);

const courseName = document.getElementById("courseName");
const courseDescription = document.getElementById("courseDescription");
const studentList = document.getElementById("studentList");
const editCourseBtn = document.getElementById("editCourseBtn");
const editModal = document.getElementById("editModal");
const editCourseForm = document.getElementById("editCourseForm");
const editCourseName = document.getElementById("editCourseName");
const editCourseDescription = document.getElementById("editCourseDescription");
const editGradingScale = document.getElementById("editGradingScale");
const editStudentList = document.getElementById("editStudentList");
const deleteCourseBtn = document.getElementById("deleteCourseBtn");
const courseIdElement = document.getElementById("courseId");

const saveData = () => {
	localStorage.setItem("data", JSON.stringify(data));
};

const calculateLetterGrade = (midterm, final, scale) => {
	const grade = midterm * 0.4 + final * 0.6;
	if (scale === "10") {
		if (grade >= 90) return "A";
		if (grade >= 80) return "B";
		if (grade >= 70) return "C";
		if (grade >= 60) return "D";
		return "F";
	} else if (scale === "7") {
		if (grade >= 93) return "A";
		if (grade >= 85) return "B";
		if (grade >= 77) return "C";
		if (grade >= 70) return "D";
		if (grade >= 60) return "E";
		return "F";
	}
	return "N/A";
};

const isPassed = (letterGrade) => {
	return letterGrade !== "F";
};

const renderCourseDetails = () => {
	courseIdElement.textContent = course.id;
	courseName.textContent = course.name;
	courseDescription.textContent = course.description;
	const studentTableBody = document.querySelector("#studentTable tbody");
	studentTableBody.innerHTML = course.students
		.map((s) => {
			const grade = (s.midterm * 0.4 + s.final * 0.6).toFixed(2);
			const letterGrade = calculateLetterGrade(
				s.midterm,
				s.final,
				course.gradingScale
			);
			const status = isPassed(letterGrade) ? "Passed" : "Failed";
			return `
				<tr>
					 <td><a href="student.html?id=${s.id}">${s.name}</a></td>
					<td>${s.id}</td>
					<td>${s.midterm}</td>
					<td>${s.final}</td>
					<td>${grade} (${letterGrade})</td>
					<td>${status}</td>
				</tr>
			`;
		})
		.join("");
};

const renderEditModal = () => {
	editCourseName.value = course.name;
	editCourseDescription.value = course.description;
	editGradingScale.value = course.gradingScale;
	editStudentList.innerHTML = course.students
		.map((s) => {
			const grade = (s.midterm * 0.4 + s.final * 0.6).toFixed(2);
			const letterGrade = calculateLetterGrade(
				s.midterm,
				s.final,
				course.gradingScale
			);
			const status = isPassed(letterGrade) ? "Passed" : "Failed";
			return `
				<li>
					${s.name} ID:${s.id}
					<div class="notes">
					<label for="midterm-${s.id}">Midterm</label>
					<input type="number" id="midterm-${s.id}" value="${s.midterm}" placeholder="Midterm" data-id="${s.id}" data-type="midterm" min="0" max="100" />
					</div>
					<div class="notes">
					<label for="final-${s.id}">Final</label>
					<input type="number" id="final-${s.id}" value="${s.final}" placeholder="Final" data-id="${s.id}" data-type="final" min="0" max="100" />
					</div>
					<span>(${grade} - ${letterGrade}) - ${status}</span>
					<button class="delete-student" data-id="${s.id}">Delete</button>
				</li>
				`;
		})
		.join("");
};

editCourseBtn.addEventListener("click", () => {
	renderEditModal();
	editModal.classList.toggle("hidden");
});

editCourseForm.addEventListener("submit", (e) => {
	e.preventDefault();
	course.name = editCourseName.value;
	course.description = editCourseDescription.value;
	course.gradingScale = editGradingScale.value;
	saveData();
	renderCourseDetails();
	editModal.classList.add("hidden");
});

editStudentList.addEventListener("click", (e) => {
	if (e.target.classList.contains("delete-student")) {
		const studentId = e.target.dataset.id;
		course.students = course.students.filter((s) => s.id !== studentId);
		const studentData = data.students.find((s) => s.id === studentId);
		studentData.courses = studentData.courses.filter((id) => id !== courseId);
		saveData();
		renderEditModal();
		renderCourseDetails();
	}
});

editStudentList.addEventListener("input", (e) => {
	const studentId = e.target.dataset.id;
	const student = course.students.find((s) => s.id === studentId);
	const type = e.target.dataset.type;
	let value = parseFloat(e.target.value);

	if (value < 0 || value > 100 || isNaN(value)) {
		alert(
			`${
				type.charAt(0).toUpperCase() + type.slice(1)
			} grade must be between 0 and 100.`
		);
		e.target.value = student[type];
		return;
	}

	student[type] = Math.min(100, Math.max(0, value));
	saveData();
	renderEditModal();
	renderCourseDetails();
});

deleteCourseBtn.addEventListener("click", () => {
	if (confirm("Are you sure you want to delete this course?")) {
		data.courses = data.courses.filter((c) => c.id !== courseId);
		course.students.forEach((student) => {
			const studentData = data.students.find((s) => s.id === student.id);
			studentData.courses = studentData.courses.filter((id) => id !== courseId);
		});
		saveData();
		window.location.href = "index.html";
	}
});

renderCourseDetails();
