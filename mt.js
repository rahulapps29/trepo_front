const form = document.getElementById("filterForm");
form.addEventListener("submit", function (event) {
  event.preventDefault();

  const formData = new URLSearchParams(new FormData(form)); // Get form data

  // Build URL with query parameters
  const url = `${"https://treporting.onrender.com/api/tasks/d"}?${formData.toString()}`;

  console.log(formData.toString());
  // Fetch API data
  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      let totalAmt = 0;
      data.tasks.forEach((card) => {
        totalAmt += card.amt;
      });
      // console.log(totalAmt);

      function grandtotal() {
        document.getElementById(
          "grandtotal"
        ).innerHTML = `Filter total: ${totalAmt}`;
      }
      grandtotal();

      const resultsDiv = document.getElementById("results");
      //   resultsDiv.innerHTML = JSON.stringify(data, null, 2); // Display JSON data
      let mandict = data.tasks;
      console.log(mandict);

      // creating initial summary
      let summary_month_year = [];
      data.tasks.forEach((entry) => {
        summary_month_year.push({
          my: entry.tdate.substring(0, 4) + "-" + entry.tdate.substring(5, 7),
          desc: entry.desc,
          amt: entry.amt,
          transtype: entry.transtype,
        });
      });

      function filterTransactionsByType(transactions, type) {
        return transactions.filter(
          (transaction) => transaction.transtype === type
        );
      }

      // unique month year

      let uniquemonthyear = [];
      uniquemonthyear = summary_month_year.reduce((uniqueValues, obj) => {
        if (!uniqueValues.includes(obj["my"])) {
          uniqueValues.push(obj["my"]);
        }
        return uniqueValues;
      }, []);

      // monthly summary

      let monthlysummary = summary_month_year.reduce((a, { my, amt }) => {
        a[my] = a[my] || { my, amt: 0 };
        a[my].amt += amt;
        return a;
      }, {});

      const monthlysummary_sorted = Object.values(monthlysummary).sort(
        dynamicSort("my")
      );

      // unique card list

      let uniquecards = [];
      uniquecards = summary_month_year.reduce((uniqueValues, obj) => {
        if (!uniqueValues.includes(obj["desc"])) {
          uniqueValues.push(obj["desc"]);
        }
        return uniqueValues;
      }, []);

      const colorNumberlist = Array.from(
        { length: uniquecards.length },
        (_, i) => i + 1
      );

      colorlist = colorNumberlist.map((x) => {
        return [selectColor(x, uniquecards.length)];
      });

      const crossProduct = (a, b) =>
        a.reduce((acc, x) => [...acc, ...b.map((y) => [x, y])], []);

      const crossp = crossProduct(uniquemonthyear, uniquecards);

      crosspd = crossp.map((x) => {
        return { my: x[0], desc: x[1], amt: 0 };
      });

      const summary_step1 = [...summary_month_year, ...crosspd];

      let crosspe = summary_step1.map((x) => {
        return { my: x.my + " " + x.desc, amt: x.amt };
      });

      let crossnew = summary_month_year.map((x) => {
        return { Desc_year_month: x.desc + " " + x.my, Amt: x.amt };
      });

      let crossnew_summary = crossnew.reduce((a, { Desc_year_month, Amt }) => {
        a[Desc_year_month] = a[Desc_year_month] || { Desc_year_month, Amt: 0 };
        a[Desc_year_month].Amt += Amt;
        return a;
      }, {});

      const crossnew_summary_sorted = Object.values(crossnew_summary).sort(
        dynamicSort("Desc_year_month")
      );

      //table

      // Generate HTML table from JSON data
      const table = document.createElement("table");

      // Create table header row
      const headers = Object.keys(crossnew_summary_sorted[0]);
      // const headers = ["my", "amt"];
      console.log(headers);
      const headerRow = table.insertRow();
      headers.forEach((headerText) => {
        const th = document.createElement("th");
        th.textContent = headerText;
        headerRow.appendChild(th);
      });

      // // Create table rows with data
      crossnew_summary_sorted.forEach((obj) => {
        const row = table.insertRow();
        headers.forEach((header) => {
          const cell = row.insertCell();
          cell.textContent = obj[header];
        });
      });

      // // Append table to container
      document.getElementById("table-container").appendChild(table);

      /// table

      function dynamicSort(property) {
        var sortOrder = 1;
        if (property[0] === "-") {
          sortOrder = -1;
          property = property.substr(1);
        }
        return function (a, b) {
          /* next line works with strings and numbers,
           * and you may want to customize it to your needs
           */
          var result =
            a[property] < b[property] ? -1 : a[property] > b[property] ? 1 : 0;
          return result * sortOrder;
        };
      }

      function selectColor(colorNum, colors) {
        if (colors < 1) colors = 1; // defaults to one color - avoid divide by zero
        return "hsl(" + ((colorNum * (360 / colors)) % 360) + ",100%,50%)";
      }
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });
});
