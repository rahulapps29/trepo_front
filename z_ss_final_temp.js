const ss = () => {
  primarydata.then((secondarydata) => {
    console.log(secondarydata);

    // creating initial summary

    let summary_month_year = [];
    console.log(secondarydata);
    secondarydata.forEach((entry) => {
      summary_month_year.push({
        my: entry.tdate.substring(0, 4) + "-" + entry.tdate.substring(5, 7),
        name: entry.name,
        amt: entry.amt,
      });
    });

    // unique month year

    let uniquemonthyear = [];
    uniquemonthyear = summary_month_year.reduce((uniqueValues, obj) => {
      if (!uniqueValues.includes(obj["my"])) {
        uniqueValues.push(obj["my"]);
      }
      return uniqueValues;
    }, []);

    // sorting unique month year

    const sortuniquemonthyear = uniquemonthyear.sort();

    // unique card list

    let uniquecards = [];
    uniquecards = summary_month_year.reduce((uniqueValues, obj) => {
      if (!uniqueValues.includes(obj["name"])) {
        uniqueValues.push(obj["name"]);
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

    let color = selectColor(Math.floor(Math.random() * 10), uniquecards.length);
    console.log(color);
    console.log(colorlist);
    const crossProduct = (a, b) =>
      a.reduce((acc, x) => [...acc, ...b.map((y) => [x, y])], []);

    const crossp = crossProduct(uniquemonthyear, uniquecards);

    crosspd = crossp.map((x) => {
      return { my: x[0], name: x[1], amt: 0 };
    });

    const summary_step1 = [...summary_month_year, ...crosspd];

    let crosspe = summary_step1.map((x) => {
      return { my: x.my + " " + x.name, amt: x.amt };
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
        name: x.my.substring(8, x.my.length),
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
          a[property] < b[property] ? -1 : a[property] > b[property] ? 1 : 0;
        return result * sortOrder;
      };
    }

    const sort1 = crosspf.sort(dynamicSort("name"));
    const sort2 = sort1.sort(dynamicSort("my"));
    const sort3 = sort2.sort(dynamicSort("name"));
    pivotBy = (data, groupby, key, value, colorlist) => {
      let uniqueKeys = [];
      let pivotedData = [];

      let colorlists = colorlist;
      console.log("color");

      uniqueKeys = data.reduce((uniqueValues, obj) => {
        if (!uniqueValues.includes(obj[groupby])) {
          uniqueValues.push(obj[groupby]);
        }
        return uniqueValues;
      }, []);

      const coords = uniqueKeys.map((x, i) => [x, colorlist[i]]);
      console.log("color1");
      console.log(coords);

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
    const dynamicdata = pivotBy(sort3, "name", "my", "amt", colorlist);
    console.log(dynamicdata);
    console.log("step");
    console.log(sort3);
    console.log(sortuniquemonthyear);

    let myContext = document.getElementById("stackedChartID").getContext("2d");
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
            text: "Stacked Bar chart for pollution status",
          },
        },
        scales: {
          x: {
            stacked: true,
          },
          y: {
            stacked: true,
          },
        },
      },
    });

    function selectColor(colorNum, colors) {
      if (colors < 1) colors = 1; // defaults to one color - avoid divide by zero
      return "hsl(" + ((colorNum * (360 / colors)) % 360) + ",100%,50%)";
    }

    // let randomColor = "#000000".replace(/0/g, function () {
    //   return (~~(Math.random() * 16)).toString(16);
    // });
  });
};

ss();
