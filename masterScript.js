const url =
  "https://gist.githubusercontent.com/josejbocanegra/b1873c6b7e732144355bb1627b6895ed/raw/d91df4c8093c23c41dce6292d5c1ffce0f01a68b/newDatalog.json";

fetch(url)
  .then((res) => res.json())
  .then((res) => {
    loadEventTableData(res);
    const map = calculateMCC(res);
    generateCorrelationTable(map);
  });

function loadEventTableData(items) {
  const table = document.getElementById("eventTableBody");
  i = 1;
  items.forEach((item) => {
    let row = table.insertRow();
    let eventNumber = row.insertCell(0);
    eventNumber.innerHTML = i;
    let events = row.insertCell(1);
    events.innerHTML = item.events.join(", ");
    let squirrel = row.insertCell(2);
    squirrel.innerHTML = item.squirrel;
    if (item.squirrel) row.classList.add("table-danger");
    i++;
  });
}

function calculateMCC(items) {
  const ht = new Map();
  let totSquirrel = 0;
  total = 0;
  items.forEach((item) => {
    if (item.squirrel) totSquirrel += 1;
    item.events.forEach((event) => {
      if (ht.get(event) == null) ht.set(event, [0, 0, 0, 0, 0]); //TN, FN, FP, TP, MCC
      let matrix = ht.get(event);
      if (item.squirrel) matrix[3] += 1;
      else matrix[1] += 1;
    });
    total += 1;
  });
  for (let key of ht.keys()) {
    let matrix = ht.get(key);
    matrix[0] = total - totSquirrel - matrix[1]; //TN
    matrix[2] = totSquirrel - matrix[3]; //FP
    matrix[4] =
      (matrix[3] * matrix[0] - matrix[2] * matrix[1]) /
      Math.sqrt(
        (matrix[3] + matrix[2]) *
          (matrix[3] + matrix[1]) *
          (matrix[0] + matrix[2]) *
          (matrix[0] + matrix[1])
      );
    ht.set(key, matrix[4]);
  }
  return ht;
}

function generateCorrelationTable(map) {
  mapSorted = new Map([...map.entries()].sort((a, b) => b[1] - a[1]));
  entries = map.entries();
  const table = document.getElementById("correlationTableBody");
  i = 1;
  for (let [key, value] of mapSorted) {
    let row = table.insertRow();
    let eventNumber = row.insertCell(0);
    eventNumber.innerHTML = i;
    let event = row.insertCell(1);
    event.innerHTML = key;
    let correlation = row.insertCell(2);
    correlation.innerHTML = value;
    i++;
  }
}
