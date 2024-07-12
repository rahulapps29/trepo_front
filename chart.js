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

      //table

      // Generate HTML table from JSON data
      const table = document.createElement("table");

      // Create table header row
      //   const headers = Object.keys(data.tasks[0]);
      const headers = ["transtype", "desc", "date_string", "amt"];
      console.log(headers);
      const headerRow = table.insertRow();
      headers.forEach((headerText) => {
        const th = document.createElement("th");
        th.textContent = headerText;
        headerRow.appendChild(th);
      });

      // Create table rows with data
      data.tasks.forEach((obj) => {
        const row = table.insertRow();
        headers.forEach((header) => {
          const cell = row.insertCell();
          cell.textContent = obj[header];
        });
      });

      // Append table to container
      document.getElementById("table-container").appendChild(table);

      /// table

      const ss = (mandict) => {
        // console.log(mandict);

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

        let gave_to_rovin_summary_temp = gave_to_rovin.reduce(
          (a, { my, amt }) => {
            a[my] = a[my] || { my, amt: 0 };
            a[my].amt += amt;
            return a;
          },
          {}
        );

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

        let summary_step2 = crosspe.reduce((a, { my, amt }) => {
          a[my] = a[my] || { my, amt: 0 };
          a[my].amt += amt;
          return a;
        }, {});
        let summary_step3 = Object.values(summary_step2);

        let crosspf = summary_step3.map((x) => {
          return {
            my: x.my.substring(0, 7),
            desc: x.my.substring(8, x.my.length),
            amt: x.amt,
          };
        });

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
              a[property] < b[property]
                ? -1
                : a[property] > b[property]
                ? 1
                : 0;
            return result * sortOrder;
          };
        }

        const sort1 = crosspf.sort(dynamicSort("desc"));
        const sort2 = sort1.sort(dynamicSort("my"));
        const sort3 = sort2.sort(dynamicSort("desc"));
        pivotBy = (data, groupby, key, value, colorlist) => {
          let uniqueKeys = [];
          let pivotedData = [];

          let colorlists = colorlist;

          uniqueKeys = data.reduce((uniqueValues, obj) => {
            if (!uniqueValues.includes(obj[groupby])) {
              uniqueValues.push(obj[groupby]);
            }
            return uniqueValues;
          }, []);

          const coords = uniqueKeys.map((x, i) => [x, colorlist[i]]);

          coords.forEach((item) => {
            let data7 = [];
            pivotedData.push(
              data.reduce((pivotedObj, obj, i, arr) => {
                if (item[0] == obj[groupby]) {
                  pivotedObj["label"] = obj[groupby]; // retain the property class
                  // pivotedObj[obj[key]] = obj[value]; // transforms rows into columns
                  pivotedObj["backgroundColor"] = item[1][0];
                  data7.push(obj[value]);
                  pivotedObj["data"] = data7;
                }
                return pivotedObj;
              }, {})
            );
          });

          return pivotedData;
        };
        const dynamicdata = pivotBy(sort3, "desc", "my", "amt", colorlist);

        console.log("step");
        console.log(Object.values(dynamicdata));
        console.log(Object.values(gave_to_rovin_summary_sorted));
        console.log(Object.values(monthlysummary_sorted));
        console.log(got_from_rovin_summary);
        let myContext = document
          .getElementById("stackedChartID")
          .getContext("2d");
        let myChart = new Chart(myContext, {
          type: "bar",
          data: {
            labels: uniquemonthyear,
            datasets: dynamicdata,
          },
          options: {
            plugins: {
              title: {
                display: true,
                text: "Stacked Bar chart",
              },
            },
            scales: {
              x: {
                stacked: true,
                // type: time,
              },
              y: {
                stacked: true,
              },
            },

            // scales: {
            //   yAxes: [
            //     {
            //       ticks: {
            //         beginAtZero: true,
            //       },
            //     },
            //   ],
            // },
          },
        });

        function selectColor(colorNum, colors) {
          if (colors < 1) colors = 1; // defaults to one color - avoid divide by zero
          return "hsl(" + ((colorNum * (360 / colors)) % 360) + ",100%,50%)";
        }

        // let randomColor = "#000000".replace(/0/g, function () {
        //   return (~~(Math.random() * 16)).toString(16);
        // });
      };
      ss();
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });
});
