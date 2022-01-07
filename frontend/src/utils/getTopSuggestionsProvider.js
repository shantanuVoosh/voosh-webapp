export const getTopSuggestionsProvider = (OH, LS) => {
  console.log(OH, LS);

  // ! iterate object, check if data is present, the grab the comapre then to see
  // !what type of comparision we have to do
  const OG_filter_objs = OH.filter((item) => item.isDataPresent);
  const OG_suggestion = OG_filter_objs.map((item) => {
    const { compareThen, benchmark, value, recommendations } = item;
    if (compareThen === "grater") {
      return !(value >= benchmark) ? recommendations[0] : null;
    } else {
      return !(value <= benchmark) ? recommendations[0] : null;
    }
  });

  const LS_filter_objs = LS.filter((item) => item.isDataPresent);
  const LS_suggestion = LS_filter_objs.map((item) => {
    let { compareThen, type, benchmark, value, suggestions } = item;

    let resultValue = 0;
    let resultBenchmark = 0;

    // Todo: String Working
    if (type === "string") {
      // ? Possible String Compariso
      // ! Yes No
      if (compareThen === "yes or no") {
        resultValue = value === benchmark ? 100 : 0;
        resultBenchmark = 100;
      }
      // ! String Number
      else if (benchmark === "4.0") {
        console.log("here");
        // resultValue=value===benchmark?100:0;
        // compare="equal";
        if (value.includes("<")) {
          value = value.replace("<", "");
          resultValue = parseFloat(value);
          resultBenchmark = parseFloat(benchmark);
        } else if (value.includes(">")) {
          value = value.replace(">", "");
          resultValue = parseFloat(value);
          resultBenchmark = parseFloat(benchmark);
        } else if (value.includes("=")) {
          value = value.replace("=", "");
          value = parseFloat(value);
          resultValue = parseFloat(value);
          resultBenchmark = parseFloat(benchmark);
        } else if (value.includes("to")) {
          value = value.split("to")[1];
          value = parseFloat(value);
          resultValue = parseFloat(value);
          resultBenchmark = parseFloat(benchmark);
        }
      } else if (value === "Not Applicable" || value === "Applicable") {
        resultValue = value === "Not Applicable" ? 0 : 100;
        resultBenchmark = 100;
      }
    } else if (type === "High Medium Low") {
    } else if (type === "percentage") {
      if (compareThen === "High Medium Low") {
        resultBenchmark = benchmark;
        if (value === "High") {
          resultValue = 90;
        } else if (value === "Medium") {
          resultValue = 70;
        } else if (value === "Low") {
          resultValue = 50;
        }
      } else {
        resultValue = value;
        resultBenchmark = benchmark;
      }
    }
    // Todo: Dont Touch this

    return !(resultValue >= resultBenchmark) ? suggestions[0] : null;
  });

  // console.log("OG_suggestion", OG_suggestion);
  // console.log("LS_suggestion", LS_suggestion);
  const all_suggestions = [
    ...OG_suggestion.filter((item) => item !== null),
    ...LS_suggestion.filter((item) => item !== null && item !== undefined),
  ];

  //   console.log(all_suggestions);

  return shuffleArray(all_suggestions);
};

function shuffleArray(res_array) {
  let array = [...res_array];
  for (var i = array.length - 1; i > 0; i--) {
    // Generate random number
    var j = Math.floor(Math.random() * (i + 1));

    var temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }

  return array;
}
