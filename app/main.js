class Util {
	static qs(element) {
		return document.querySelector(element);
	}
	static qsa(element) {
		return document.querySelectorAll(element);
	}

	static renderPessoa(pessoa) {
		return `<tr>
			<td class="id" contenteditable="false" hidden="true">${pessoa.id}</td>
			<td class="flex-3 nome" contenteditable="false">${pessoa.nome}</td>
			<td class="flex-4 email" contenteditable="false">${pessoa.email}</td>
			<td class="flex-1 idade" contenteditable="false">${pessoa.idade}</td>
			<td class="flex-1 genero" contenteditable="false">${pessoa.genero}</td>
			<td class="flex-2">
				<button class="btn btn-edit float-l">Editar</button>
				<button class="btn btn-delete float-l">Excluir</button>
			</td>
		</tr>`; 
	}


	/**
	 * Gerencia o evento de editar e excluir.
	 * Comunica-se com o servidor para editar ou excluir uma pessoa.
	 */
	static configButtons() {
		let pessoaService = new PessoaService();

		for (let btn of Array.from(this.qsa('.btn-edit'))) {
			btn.addEventListener('click', function (event) {

				let tr = event.target.parentNode.parentNode;
				let tds = Array.from(tr.querySelectorAll('td'));
				tds = tds.slice(0, tds.length - 1);

				for (let td of tds) {
					if (td.getAttribute('contenteditable') === "false") {
						td.setAttribute('contenteditable', true);
						td.classList.add('editable');
					} else {
						td.setAttribute('contenteditable', false);
						td.classList.remove('editable');
					}
				}

				if (tds[0].getAttribute('contenteditable') == 'false') {
					let pessoa = {
						id: tds[0].textContent,
						nome: tds[1].textContent,
						email: tds[2].textContent,
						idade: tds[3].textContent,
						genero: tds[4].textContent
					};

					pessoaService.edit(pessoa).then();
				}
			})
		}

		for (let btn of Array.from(this.qsa('.btn-delete'))) {
			btn.addEventListener('click', function (event) {
				let tbody = event.target.parentNode.parentNode.parentNode;
				let tr = event.target.parentNode.parentNode;

				pessoaService.remove(tr.querySelector('.id').textContent).then();
				tbody.removeChild(tr);
			})
		}
	}
}

class Popup {
	constructor(id) {
		this._popup = Util.qs(id)
	}

	open() {
		this._popup.classList.remove('popup-hidden');
		this._popup.classList.add('popup-visible');
	}

	close() {
		this._popup.classList.add('popup-hidden');
		this._popup.classList.remove('popup-visible');
	}
}

class Http {
	get(url) {
		return fetch(url, {
			method: 'get'
		})
			.then((response) => response)
			.catch((error) => console.log(error));
	}

	delete(url) {
		return fetch(url, {
			method: 'delete'
		});
	}

	put(url, data) {
		return fetch(url, {
			headers: {
				'content-type': 'application/x-www-form-urlencoded'
			},
			method: 'put',
			body: uricomponent(data)
		});
	}

	post(url, data) {
		return fetch(url, {
			headers: {
				'content-type': 'application/x-www-form-urlencoded'
			},
			method: 'post',
			body: uricomponent(data)
		});
	}
}

class PessoaService {
	constructor() {
		this._url = 'http://rest.learncode.academy/api/leoj/pessoas';
		this._http = new Http();
	}

	find(id) {
		return this._http.get(`${this._url}/${id}`)
			.then((response) => response.json())
			.catch((error) => console.log(error))
	}

	findAll() {
		return this._http.get(this._url)
			.then((response) => response.json())
			.catch((error) => console.log(error));
	}

	add(pessoa) {
		return this._http.post(this._url, pessoa)
			.then((response) => response.json())
			.catch((error) => console.log(error));
	}

	remove(id) {
		return this._http.delete(`${this._url}/${id}`)
			.then((response) => response.json())
			.catch((error) => console.log(error));
	}

	edit(pessoa) {
		return this._http.put(`${this._url}/${pessoa.id}`, pessoa)
	}
}

const popup = new Popup('#popup');
const pessoaService = new PessoaService();


/**
 * Parte que gerencia eventos de abrir e fechar popup.
 */
Util.qs('#btn-open').addEventListener('click', function (event) {
	event.preventDefault();
	popup.open();
});

Util.qs('#btn-close').addEventListener('click', function (event) {
	event.preventDefault();
	popup.close();
});

Util.qs('#popup').addEventListener('click', function (event) {
	if (event.target.id === 'popup') {
		popup.close();
	}
});

/**
 * Parte que gerencia o evento de submição do formulario.
 */
Util.qs('form').addEventListener('submit', function (event) {
	event.preventDefault();

	let pessoa = {
		nome: Util.qs('#nome').value,
		email: Util.qs('#email').value,
		idade: Util.qs('#idade').value,
		genero: Util.qs('#genero').value
	}

	pessoaService.add(pessoa)
		.then(function (response) {
			Util.qs('tbody').innerHTML += Util.renderPessoa(response);

			Util.configButtons();
		});

	popup.close();
});

/**
 * Parte que gerencia o carregamento da pagina.
 */

document.body.onload = function () {
	pessoaService.findAll().then(function (pessoas) {
		let tbody = Util.qs('tbody');

		Util.qs('#load').classList.remove('load-visible');
		for (let pessoa of pessoas) {
			tbody.innerHTML += Util.renderPessoa(pessoa);
		}
		Util.configButtons()
	});
};
