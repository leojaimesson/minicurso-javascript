/********************Util********************/
let qs = document.querySelector.bind(document);
let qsa = document.querySelectorAll.bind(document);

function addClass(element, name) {
	element.classList.add(name);
}

function removeClass(element, name) {
	element.classList.remove(name);
}

function addEvent(selector, event, callback) {
	let elements = qsa(selector);
	Array.prototype.forEach.call(elements, function (element, key) {
		element.addEventListener(event, callback);
	});
}


/********************Popup********************/
function popup(id) {
	let sectionPopup = qs(id)
	return {
		open: function () {
			removeClass(sectionPopup, 'popup-hidden');
			addClass(sectionPopup, 'popup-visible');
		},
		close: function () {
			addClass(sectionPopup, 'popup-hidden');
			removeClass(sectionPopup, 'popup-visible');
		}
	}
}


/********************Crud********************/
function remove(node) {
	let tbody = node.parentNode.parentNode.parentNode;
	let tr = node.parentNode.parentNode;
	tbody.removeChild(tr);
}

function edit(node) {
	let tr = node.parentNode.parentNode;
	let tds = Array.from(tr.querySelectorAll('td'));
	tds = tds.slice(0, tds.length - 1);

	for (let td of tds) {
		if (td.getAttribute('contenteditable') === "false") {
			td.setAttribute('contenteditable', true);
			addClass(td, 'editable');
		} else {
			td.setAttribute('contenteditable', false);
			removeClass(td, 'editable');
		}
	}
}

/********************Upload********************/

function normalizeRow(row) {
	return row.filter(function (column) {
		return column !== "";
	});
}

function createMarkupTr(row) {
	return (`<tr>
				<td class="flex-3 nome" contenteditable="false">${row[0]}</td>
				<td class="flex-4 email" contenteditable="false">${row[1]}</td>
				<td class="flex-1 idade" contenteditable="false">${row[2]}</td>
				<td class="flex-1 genero" contenteditable="false">${row[3]}</td>
				<td class="flex-2">
					<button class="btn btn-edit" onclick="edit(this)">Editar</button>
					<button class="btn btn-delete" onclick="remove(this)">Excluir</button>
				</td>
			</tr>`);
}

function createMarkupTbody(file) {
	return file.map(function (row) {
		row = normalizeRow(row.split(','));
		return createMarkupTr(row)
	}).join('');
}

function renderTbody(file) {
	let tbody = qs('#tbody-content');
	tbody.innerHTML = createMarkupTbody(file);
}

function Upload(file) {
	let fileReader = new FileReader();
	fileReader.onloadend = function (event) {
		let splitFile = normalizeRow(fileReader.result.split(/\n/));
		renderTbody(splitFile);
	}
	fileReader.readAsText(file);
}

function loadUpload(inputFile) {
	Upload(inputFile.files[0]);
}


/********************Events********************/
addEvent('#btn-open', 'click', function (event) {
	event.preventDefault();
	popup("#popup").open();
});

addEvent('#btn-close', 'click', function (event) {
	event.preventDefault();
	popup("#popup").close();
});

addEvent('#popup', 'click', function (event) {
	if (event.target.id === 'popup') {
		popup("#popup").close();
	}
});