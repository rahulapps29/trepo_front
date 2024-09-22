// Example JSON data from an API endpoint
const apiUrl = "https://treporting.onrender.com/api/tasks/d";

// Fetch data from the API
fetch(apiUrl)
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
      ).innerHTML = `Closing Balance: ${totalAmt}`;
    }
    grandtotal();

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

    let uniquemonthyear_dummy = uniquemonthyear.map((x) => {
      return { my: x, amt: 0 };
    });

    // sorting unique month year

    const sortuniquemonthyear = uniquemonthyear.sort();

    // gave to rovin

    const gave_to_rovin = filterTransactionsByType(
      summary_month_year,
      "gave to rovin"
    );

    let gave_to_rovin_summary_temp = gave_to_rovin.reduce((a, { my, amt }) => {
      a[my] = a[my] || { my, amt: 0 };
      a[my].amt += amt;
      return a;
    }, {});

    let gave_to_rovin_summary_temp2 = [
      ...Object.values(uniquemonthyear_dummy),
      ...Object.values(gave_to_rovin_summary_temp),
    ];

    let gave_to_rovin_summary = gave_to_rovin_summary_temp2.reduce(
      (a, { my, amt }) => {
        a[my] = a[my] || { my, amt: 0 };
        a[my].amt += amt;
        return a;
      },
      {}
    );

    // got from rovin

    const got_from_rovin = filterTransactionsByType(
      summary_month_year,
      "got from rovin"
    );

    let got_from_rovin_summary_temp = got_from_rovin.reduce(
      (a, { my, amt }) => {
        a[my] = a[my] || { my, amt: 0 };
        a[my].amt += amt;
        return a;
      },
      {}
    );

    let got_from_rovin_summary_temp2 = [
      ...Object.values(uniquemonthyear_dummy),
      ...Object.values(got_from_rovin_summary_temp),
    ];

    let got_from_rovin_summary = got_from_rovin_summary_temp2.reduce(
      (a, { my, amt }) => {
        a[my] = a[my] || { my, amt: 0 };
        a[my].amt += amt;
        return a;
      },
      {}
    );

    // combine summary

    const rovin_summary = [
      ...Object.values(got_from_rovin_summary),
      ...Object.values(gave_to_rovin_summary),
    ];

    const got_from_rovin_summary_sorted = Object.values(
      got_from_rovin_summary
    ).sort(dynamicSort("my"));
    const gave_to_rovin_summary_sorted = Object.values(
      gave_to_rovin_summary
    ).sort(dynamicSort("my"));

    // console.log(filteredTransactions);

    // monthly summary

    let monthlysummary = summary_month_year.reduce((a, { my, amt }) => {
      a[my] = a[my] || { my, amt: 0 };
      a[my].amt += amt;
      return a;
    }, {});

    const monthlysummary_sorted = Object.values(monthlysummary).sort(
      dynamicSort("my")
    );
    let runningTotal = 0;
    Object.values(monthlysummary_sorted).forEach((item) => {
      runningTotal += item.amt;
      item.running_total = runningTotal;
    });

    let closingbalance = [];
    monthlysummary_sorted.forEach((num1, index) => {
      const num2 = gave_to_rovin_summary_sorted[index];
      const num3 = got_from_rovin_summary_sorted[index];
      closingbalance.push({
        year_month: num1.my,

        gave_to_rovin: num2.amt,
        got_from_rovin: num3.amt,
        ClosingBalance: num1.running_total,
      });
    });

    // table 2

    // Generate HTML table from JSON data
    const table = document.createElement("table");

    // Create table header row
    //   const headers = Object.keys(data.tasks[0]);
    const headers = [
      "year_month",
      "gave_to_rovin",
      "got_from_rovin",
      "ClosingBalance",
    ];
    console.log(headers);
    const headerRow = table.insertRow();
    headers.forEach((headerText) => {
      const th = document.createElement("th");
      th.textContent = headerText;
      headerRow.appendChild(th);
    });

    // Create table rows with data
    closingbalance.forEach((obj) => {
      const row = table.insertRow();
      headers.forEach((header) => {
        const cell = row.insertCell();
        cell.textContent = obj[header];
      });
    });

    // Append table to container
    document.getElementById("table-container").appendChild(table);

    // table 2

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
  })

  .catch((error) => console.error("Error fetching data:", error));
