var rows;
var title;
var content;
var table_start;
var table_end;
var table_content;
var table_header;
var table_body;
table_start = "<table>";
table_header = "<thead><tr><th>Textes</th></tr></thead>";
table_end = "</table>";
Papa.parse("https://raw.githubusercontent.com/eyssette/textes-philosophie/main/data/textes.tsv", {
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
		content = table_start + table_header + table_body + table_end;
		document.getElementById("content").innerHTML = content;
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
	}, 300);
}