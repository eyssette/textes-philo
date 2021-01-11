var rows;
var title;
var content;
var table_body;
var table_body_start = document.getElementsByTagName("tbody")[0].innerHTML;
Papa.parse("/main/data/textes.tsv", {
	download: true,
	header: false,
	delimiter: "    ",
	complete: function(results) {
		rows = results.data;
		rows = rows.splice(1, rows.length);
		table_body = "<tbody>";
		rows.forEach((element) => {
			recherche = document.getElementById("recherche_dans_le_sujet").value;
			table_body = table_body + "<tr>";
			cellules = element[0].split("\t");
			cellules.forEach((cell) => {
				table_body = table_body + "<td>" + cell + "</td>";
			});
			table_body = table_body + "</tr>";
		});
		table_body = table_body + "</tbody>";
	}
});
var input = document.getElementById("recherche_dans_le_sujet");
input.oninput = handleInput;
let checker = (arr, target) => target.every((v) => arr.includes(v));

function handleInput(e) {
	var search = input.value.toLowerCase();
	if (this.timer) {
		window.clearTimeout(this.timer);
	}
	this.timer = window.setTimeout(function() {
		if (search) {
		search_items = search.split("+");
		table_body = "<tbody>";
		rows.forEach((element) => {
			cellules = element[0].split("\t");
			if (checker(cellules[0].toLowerCase(), search_items)) {
				table_body = table_body + "<tr>";
				cellules.forEach((cell) => {
					table_body = table_body + "<td>" + cell + "</td>";
				});
				table_body = table_body + "</tr>";
			}
		});
		table_body = table_body + "</tbody>";
		document.getElementsByTagName("tbody")[0].innerHTML = table_body;
		var context = document.getElementById("content");
		var instance = new Mark(context);
		instance.mark(search_items, options = {
			"accuracy": "complementary", "separateWordSearch": false
		});
	} else {
		document.getElementsByTagName("tbody")[0].innerHTML = table_body_start;
	}
	}, 300);
}