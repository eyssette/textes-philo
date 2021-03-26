let rows;
let tableBody;
const tableBodyStart = document.getElementsByTagName("tbody")[0].innerHTML;

const urls = ['https://raw.githubusercontent.com/eyssette/textes-philo/main/data/textes-FINAL.tsv', 'https://raw.githubusercontent.com/eyssette/textes-philo/main/data/textes-new.tsv']

let ready = 0;
let boutonRecherche = document.getElementById("rechercher");
let moteurRecherche = document.getElementById("recherche_dans_le_sujet");
moteurRecherche.value = 'Merci de patienter : chargement de la base de données';
moteurRecherche.disabled = true;
boutonRecherche.style.visibility = 'hidden';

Promise.all(
		urls
		.map(
			url =>
			new Promise(
				(resolve, reject) =>
				Papa.parse(
					url, {
						download: true,
						header: false,
						delimiter: "    ",
						complete: resolve,
						error: reject
					}
				)
			)
		)
	)
	.then(
		function (results) {
			rows = results[0].data;
			for (let i = 1; i < urls.length; i++) {
				rows = rows.concat(results[i].data);
			};
			rows = rows.splice(1, rows.length);
			ready++;
			boutonRecherche.style.visibility = 'visible';
			moteurRecherche.disabled = false;
			moteurRecherche.value = '';
			moteurRecherche.setAttribute("size", "30");
		}
	)
	.catch( //log the error
		err => console.warn("Something went wrong:", err)
	)

let input = document.getElementById("recherche_dans_le_sujet");
boutonRecherche.onclick = handleInput;
input.addEventListener("keyup", function (event) {
	if (event.code === 'Enter') {
		boutonRecherche.click();
	}
});


let checker = (arr, target) => target.every((v) => arr.includes(v));

function handleInput(e) {
	document.getElementsByTagName("tbody")[0].innerHTML = '<td></td><td><span class="loader"></span></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td>';
	let searchInput = input.value.toLowerCase();
	if (this.timer) {
		window.clearTimeout(this.timer);
	}
	this.timer = window.setTimeout(function () {
		if (searchInput.length > 2 && ready > 0) {
			let searchItems = searchInput.split("+");
			tableBody = "<tbody>";

			rows.forEach((element) => {
				let cellules = element[0].split("\t");
				let source = cellules.toString().toLowerCase();
				if (checker(source, searchItems)) {
					let scorePertinence = 0;
					searchItems.forEach((search_item) => {
						let regex = new RegExp('\\b' + search_item + '\\b|\\b' + search_item + 's\\b', 'gi');

						let nombreOccurrencesTexte = cellules[2].toLowerCase().split(search_item).length - 1
						let nombreOccurrencesTextePerfectMatch = ((cellules[2].toLowerCase().match(regex) || []).length) * 2
						scorePertinence = scorePertinence + ((nombreOccurrencesTexte + nombreOccurrencesTextePerfectMatch) * 2);

						let nombreOccurrencesAuteur = cellules[0].toLowerCase().split(search_item).length - 1;
						let nombreOccurrencesAuteurPerfectMatch = ((cellules[0].toLowerCase().match(regex) || []).length) * 2
						scorePertinence = scorePertinence + ((nombreOccurrencesAuteur + nombreOccurrencesAuteurPerfectMatch) * 4);

						if (cellules[3]) {
							let nombreOccurrencesPrecisions = cellules[3].toLowerCase().split(search_item).length - 1;
							scorePertinence = scorePertinence + nombreOccurrencesPrecisions;
						}

						if (cellules[1]) {
							let nombreOccurrencesReference = cellules[1].toLowerCase().split(search_item).length - 1;
							scorePertinence = scorePertinence + nombreOccurrencesReference;
						}
					});
					let texte = '« ' + cellules[2] + ' »';
					tableBody = tableBody + "<tr>";
					let auteur = '<br/><b>' + cellules[0] + '</b>';
					let reference = '';
					let precisions = '';
					if (cellules[1]) {
						reference = ', ' + cellules[1]
					} else {
						reference = ''
					};
					if (cellules[3]) {
						precisions = '<br/>' + cellules[3]
					} else {
						precisions = ''
					};
					if (cellules[4]) {
						c1 = '<td><span class="tooltip">' + cellules[4] + '<span class="tooltiptext">Éthique et philosophie morale</span></span>' + '</td>'
					} else {
						c1 = '<td></td>'
					};
					if (cellules[5]) {
						c2 = '<td><span class="tooltip">' + cellules[5] + '<span class="tooltiptext">Philosophie de l\'esprit</span></span>' + '</td>'
					} else {
						c2 = '<td></td>'
					};
					if (cellules[6]) {
						c3 = '<td><span class="tooltip">' + cellules[6] + '<span class="tooltiptext">Philosophie de la culture</span></span>' + '</td>'
					} else {
						c3 = '<td></td>'
					};
					if (cellules[7]) {
						c4 = '<td><span class="tooltip">' + cellules[7] + '<span class="tooltiptext">Philosophie sociale et politique</span></span>' + '</td>'
					} else {
						c4 = '<td></td>'
					};
					if (cellules[8]) {
						c5 = '<td><span class="tooltip">' + cellules[8] + '<span class="tooltiptext">Épistémologie et métaphysique</span></span>' + '</td>'
					} else {
						c5 = '<td></td>'
					};
					if (cellules[9]) {
						c6 = '<td><span class="tooltip">' + cellules[9] + '<span class="tooltiptext">Philosophie du langage</span></span>' + '</td>'
					} else {
						c6 = '<td></td>'
					};
					tableBody = tableBody + "<td>" + auteur + "</td>" + "<td>" + texte + auteur + reference + precisions + "</td>" + "<td>" + scorePertinence + "</td>" + c1 + c2 + c3 + c4 + c5 + c6;

					tableBody = tableBody + "</tr>";
				}
			});
			tableBody = tableBody + "</tbody>";
			document.getElementsByTagName("tbody")[0].innerHTML = tableBody;
			let context = document.getElementById("content");
			let i_search = 1;
			searchItems.forEach((search_item) => {
				let instance = new Mark(context);
				instance.mark(search_item, options = {
					"element": "span",
					"className": "match" + i_search,
					"accuracy": "complementary",
					"separateWordSearch": false
				});
				i_search = i_search + 1;
			});

			fdTableSort.init("textes");
			fdTableSort.jsWrapper("textes", [2, 0]);
		} else {
			document.getElementsByTagName("tbody")[0].innerHTML = tableBodyStart;
		}
	}, 5);
}